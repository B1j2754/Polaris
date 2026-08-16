import { shotAt } from "@/lib/exif";

import { useCallback, useState } from "react";

import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export type Capture = {
    id: string;
    file: string;
    targetID: string | null;
    siteId: string | null;
    takenAt: number;
    note: string | null;
};

const dir = new Directory(Paths.document, "captures");

export const captureUri = (file: string) => new File(dir, file).uri;

const SQL_COLUMNS = "id, file, target_id AS targetID, site_id AS siteId, taken_at AS takenAt, note";

export function useCaptures() {
    const db = useSQLiteContext();
    const [captures, setCaptures] = useState<Capture[]>([]);

    const reload = useCallback(
        () => db.getAllAsync<Capture>(`SELECT ${SQL_COLUMNS} FROM captures ORDER BY taken_at DESC`).then(setCaptures),
        [db],
    );

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [reload]),
    );

    const add = async (from: "camera" | "library", siteId: string | null) => {
        const options = { mediaTypes: "images" as const, exif: true };
        let permission;
        let result;

        if (from === "camera") {
            permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) return;
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) return;
            result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (result.canceled) return;

        const asset = result.assets[0];
        const id = String(Date.now());
        const file = `${id}.${asset.uri.split(".").pop() ?? "jpg"}`;

        if (!dir.exists) dir.create();

        new File(asset.uri).copy(new File(dir, file));

        await db.runAsync(
            "INSERT INTO captures (id, file, target_id, site_id, taken_at, note) VALUES (?, ?, NULL, ?, ?, NULL)",
            id,
            file,
            siteId,
            shotAt(asset.exif),
        );
        await reload();
    };

    const remove = async (capture: Capture) => {
        const file = new File(dir, capture.file);
        if (file.exists) file.delete();
        await db.runAsync("DELETE FROM captures WHERE id = ?", capture.id);
        await reload();
    };

    const update = async (id: string, column: "target_id" | "note", value: string | null) => {
        await db.runAsync(`UPDATE captures SET ${column} = ? WHERE id = ?`, value, id);
        await reload();
    };

    return { captures, add, remove, update };
}
