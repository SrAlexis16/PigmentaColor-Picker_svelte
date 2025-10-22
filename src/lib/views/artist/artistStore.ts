import chroma from "chroma-js";
import { writable, derived } from 'svelte/store';

const defaultColor = chroma("#408080");
export const currentColor = writable(defaultColor);

export type PaletteType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic'
  | 'shades'
  | 'tints';

export const artistState = writable({
  selectedPaletteType: 'complementary' as PaletteType,
  showPalettes: true
});

function generatePalettes($colorValue: chroma.Color) {
  const [h, s, l] = $colorValue.hsl();
  return {
    'complementary': [
      $colorValue,
      chroma.hsl((h + 180) % 360, s, l)
    ],
    'analogous': [
      chroma.hsl((h - 30 + 360) % 360, s, l),
      $colorValue,
      chroma.hsl((h + 30) % 360, s, l)
    ],
    'triadic': [
      $colorValue,
      chroma.hsl((h + 120) % 360, s, l),
      chroma.hsl((h + 240) % 360, s, l)
    ],
    'tetradic': [
      $colorValue,
      chroma.hsl((h + 90) % 360, s, l),
      chroma.hsl((h + 180) % 360, s, l),
      chroma.hsl((h + 270) % 360, s, l)
    ],
    'split-complementary': [
      $colorValue,
      chroma.hsl((h + 150) % 360, s, l),
      chroma.hsl((h + 210) % 360, s, l)
    ],
    'monochromatic': [
      chroma.hsl(h, Math.max(0, s - 0.3), l),
      chroma.hsl(h, Math.max(0, s - 0.15), l),
      $colorValue,
      chroma.hsl(h, Math.min(1, s + 0.15), l),
      chroma.hsl(h, Math.min(1, s + 0.3), l)
    ],
    'shades': [
      $colorValue,
      chroma.hsl(h, s, Math.max(0, l - 0.15)),
      chroma.hsl(h, s, Math.max(0, l - 0.30)),
      chroma.hsl(h, s, Math.max(0, l - 0.45)),
      chroma.hsl(h, s, Math.max(0, l - 0.60))
    ],
    'tints': [
      $colorValue,
      chroma.hsl(h, s, Math.min(1, l + 0.15)),
      chroma.hsl(h, s, Math.min(1, l + 0.30)),
      chroma.hsl(h, s, Math.min(1, l + 0.45)),
      chroma.hsl(h, s, Math.min(1, l + 0.60))
    ]
  } as Record<PaletteType, chroma.Color[]>;
}

export const colorPalettes = derived(currentColor, $color => generatePalettes($color));

export const selectedPalette = derived(
  [currentColor, artistState],
  ([$color, $artist]) => {
    const palettes = generatePalettes($color);
    const type = $artist.selectedPaletteType as PaletteType;
    const colors = palettes[type] ?? [];
    return colors.map((c, i) => {
      const hex = c.hex();
      return { id: `${hex}-${i}`, color: c, hex };
    });
  }
);
