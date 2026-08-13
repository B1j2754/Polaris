export type Telescope = {
  kind: 'telescope';
  label: string;
  apertureMm: number;
  focalLengthMm: number;
};

export type Camera = {
  kind: 'camera';
  label: string;
  pixelUm: number;
  pxX: number;
  pxY: number;
};

export type Equipment = Telescope | Camera;

type Preset<T> = T & { id: string; blurb: string };

export const TELESCOPE_PRESETS: Preset<Telescope>[] = [
  {
    id: 'dob-8',
    kind: 'telescope',
    label: '8" Dobsonian',
    blurb: 'Sky-Watcher / Orion XT8 / Apertura AD8 — all the same optics',
    apertureMm: 203,
    focalLengthMm: 1200,
  },
  {
    id: 'newt-130',
    kind: 'telescope',
    label: '130mm Newtonian',
    blurb: 'Heritage 130P, Virtuoso GTi 130P, AstroMaster 130EQ',
    apertureMm: 130,
    focalLengthMm: 650,
  },
  {
    id: 'sct-8',
    kind: 'telescope',
    label: '8" SCT',
    blurb: 'Celestron C8 / NexStar 8SE / EdgeHD 8',
    apertureMm: 203,
    focalLengthMm: 2032,
  },
  {
    id: 'mak-127',
    kind: 'telescope',
    label: '127mm Maksutov',
    blurb: 'Sky-Watcher Skymax 127 — planetary workhorse',
    apertureMm: 127,
    focalLengthMm: 1500,
  },
  {
    id: 'ed-72',
    kind: 'telescope',
    label: '72mm ED refractor',
    blurb: 'Evostar 72ED and friends — the beginner astrophoto scope',
    apertureMm: 72,
    focalLengthMm: 420,
  },
];

export const CAMERA_PRESETS: Preset<Camera>[] = [
  {
    id: 'imx533',
    kind: 'camera',
    label: 'IMX533',
    blurb: 'ASI533MC Pro, Saturn-C, QHY533C — square 1" sensor',
    pixelUm: 3.76,
    pxX: 3008,
    pxY: 3008,
  },
  {
    id: 'imx571',
    kind: 'camera',
    label: 'IMX571',
    blurb: 'ASI2600, QHY268, Poseidon-C — APS-C',
    pixelUm: 3.76,
    pxX: 6248,
    pxY: 4176,
  },
  {
    id: 'imx462',
    kind: 'camera',
    label: 'IMX462',
    blurb: 'ASI462MC, QHY5III462C, Seestar S50 — planetary / EAA',
    pixelUm: 2.9,
    pxX: 1920,
    pxY: 1080,
  },
  {
    id: 'dslr-apsc',
    kind: 'camera',
    label: 'DSLR / mirrorless — APS-C',
    blurb: 'Canon Rebel, Nikon D5xxx, Sony a6xxx (24MP)',
    pixelUm: 3.9,
    pxX: 6000,
    pxY: 4000,
  },
  {
    id: 'dslr-ff',
    kind: 'camera',
    label: 'DSLR / mirrorless — full frame',
    blurb: 'Canon 6D, Sony a7 III, Nikon Z6 (24MP)',
    pixelUm: 5.94,
    pxX: 6000,
    pxY: 4000,
  },
];

export type Kind = Equipment['kind'];

export const stripPreset = <T extends Equipment>({ id, blurb, ...rest }: Preset<T>): Equipment =>
  rest as unknown as Equipment;

export const FIELDS: Record<Kind, { key: string; label: string; unit: string }[]> = {
  telescope: [
    { key: 'apertureMm', label: 'Aperture', unit: 'mm' },
    { key: 'focalLengthMm', label: 'Focal length', unit: 'mm' },
  ],
  camera: [
    { key: 'pixelUm', label: 'Pixel size', unit: 'µm' },
    { key: 'pxX', label: 'Width', unit: 'px' },
    { key: 'pxY', label: 'Height', unit: 'px' },
  ],
};

/** null until every number is present and positive — the Add button hangs off this. */
export function customEquipment(kind: Kind, form: Record<string, string>): Equipment | null {
  const values = FIELDS[kind].map((f) => Number(form[f.key]));
  if (values.some((n) => !Number.isFinite(n) || n <= 0)) return null;

  const [a, b, c] = values;

  const label = form.label?.trim() || (kind === 'telescope' ? 'Custom telescope' : 'Custom camera');
  return kind === 'telescope'
    ? { kind, label, apertureMm: a, focalLengthMm: b }
    : { kind, label, pixelUm: a, pxX: b, pxY: c };
}

const focalRatio = (t: Telescope) => t.focalLengthMm / t.apertureMm;
const sensorWidthMm = (c: Camera) => (c.pxX * c.pixelUm) / 1000;
const sensorHeightMm = (c: Camera) => (c.pxY * c.pixelUm) / 1000;

export function specLine(e: Equipment): string {
  return e.kind === 'telescope'
    ? `${e.apertureMm}mm · ${e.focalLengthMm}mm · f/${focalRatio(e).toFixed(1)}`
    : `${e.pxX}×${e.pxY} · ${e.pixelUm}µm`;
}

/** What a scope + camera pairing actually frames — the reason we collect any of this. */
export function fieldOfView(t: Telescope, c: Camera): string {
  const arcsecPerPx = (206.265 * c.pixelUm) / t.focalLengthMm;
  const degrees = (mm: number) => (2 * Math.atan(mm / (2 * t.focalLengthMm)) * 180) / Math.PI;
  const wide = degrees(sensorWidthMm(c)) * 60;
  const tall = degrees(sensorHeightMm(c)) * 60;
  return `${arcsecPerPx.toFixed(2)}"/px · ${wide.toFixed(0)}' × ${tall.toFixed(0)}' field`;
}
