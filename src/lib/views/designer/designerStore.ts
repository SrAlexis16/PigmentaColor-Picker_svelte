import chroma from "chroma-js";
import { writable, derived } from 'svelte/store';

const defaultColor = chroma("#408080");
export const currentColor = writable(defaultColor);

export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface ContrastResult {
  ratio: number;
  ratioText: string;
  wcagAA: boolean;
  wcagAALarge: boolean;
  wcagAAA: boolean;
  wcagAAALarge: boolean;
  quality: 'Excelente' | 'Bueno' | 'Suficiente' | 'Malo';
  backgroundColor: string;
  textColor: string;
}

export interface ColorBlindnessSimulation {
  type: ColorBlindnessType;
  label: string;
  color: string;
}

function calculateContrast(color1: chroma.Color, color2: chroma.Color): number {
  const lum1 = color1.luminance();
  const lum2 = color2.luminance();
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastQuality(ratio: number): 'Excelente' | 'Bueno' | 'Suficiente' | 'Malo' {
  if (ratio >= 7) return 'Excelente';
  if (ratio >= 4.5) return 'Bueno';
  if (ratio >= 3) return 'Suficiente';
  return 'Malo';
}

function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  const color = chroma(hex);
  const [r, g, b] = color.rgb();

  const matrices: Record<ColorBlindnessType, number[][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114]
    ]
  };

  const matrix = matrices[type];
  const newR = Math.round(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
  const newG = Math.round(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
  const newB = Math.round(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);

  return chroma(newR, newG, newB).hex();
}

export const accessibilityData = derived(
  currentColor,
  $color => {
    const hex = $color.hex();
    const white = chroma('#FFFFFF');
    const black = chroma('#000000');

    const contrastWhite = calculateContrast($color, white);
    const whiteResult: ContrastResult = {
      ratio: contrastWhite,
      ratioText: formatRatio(contrastWhite),
      wcagAA: contrastWhite >= 4.5,
      wcagAALarge: contrastWhite >= 3,
      wcagAAA: contrastWhite >= 7,
      wcagAAALarge: contrastWhite >= 4.5,
      quality: getContrastQuality(contrastWhite),
      backgroundColor: '#FFFFFF',
      textColor: hex
    };

    const contrastBlack = calculateContrast($color, black);
    const blackResult: ContrastResult = {
      ratio: contrastBlack,
      ratioText: formatRatio(contrastBlack),
      wcagAA: contrastBlack >= 4.5,
      wcagAALarge: contrastBlack >= 3,
      wcagAAA: contrastBlack >= 7,
      wcagAAALarge: contrastBlack >= 4.5,
      quality: getContrastQuality(contrastBlack),
      backgroundColor: '#000000',
      textColor: hex
    };

    const colorBlindness: ColorBlindnessSimulation[] = [
      {
        type: 'protanopia',
        label: 'Protanopia',
        color: simulateColorBlindness(hex, 'protanopia')
      },
      {
        type: 'deuteranopia',
        label: 'Deuteranopia',
        color: simulateColorBlindness(hex, 'deuteranopia')
      },
      {
        type: 'tritanopia',
        label: 'Tritanopia',
        color: simulateColorBlindness(hex, 'tritanopia')
      },
      {
        type: 'achromatopsia',
        label: 'Achromatopsia',
        color: simulateColorBlindness(hex, 'achromatopsia')
      }
    ];

    return {
      original: hex,
      contrastWhite: whiteResult,
      contrastBlack: blackResult,
      colorBlindness
    };
  }
);

/* La simulación de daltonismo (protanopia, deuteranopia, tritanopia, achromatopsia)
está implementada en estestore "accessibilityData".
Actualmente no se utiliza en la interfaz de usuario, pero se deja preparada
para futuras versiones donde se integrará como herramienta de accesibilidad
y validación visual. Esta funcion puede ser romovida del store actual a un lugar mas accesible para su implementación */
