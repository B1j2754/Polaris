import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

type TransitionEnd = { data?: { closing?: boolean } };

/**
 * Animation Override. Focus once the transition has actually finished.
 *
 * ### Remarks
 * `autoFocus` opens the keyboard while the push animation is still running.
 * This causes the incoming screen re-lays out mid-slide (ScrollView insets, KeyboardAvoidingView) and visibly jumps.
 */
export function useEntryFocus() {
  const ref = useRef<TextInput>(null);
  const fired = useRef(false);
  const [settled, setSettled] = useState(false);
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("transitionEnd" as never, (event: TransitionEnd) => {
        // also fires when a pushed screen pops back to this one; only the arrival should focus
        if (event.data?.closing || fired.current) return;
        fired.current = true;
        setSettled(true);
        ref.current?.focus();
      }),
    [navigation],
  );

  return { ref, autoFocus: settled };
}
