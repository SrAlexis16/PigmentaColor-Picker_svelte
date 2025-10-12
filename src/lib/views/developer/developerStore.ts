import chroma from "chroma-js";
import { writable, derived } from 'svelte/store';

const defaultColor = chroma("#408080");
export const currentColor = writable(defaultColor);

export const colorOutputs = derived(
    currentColor,
    $colorValue => {
        // @ts-ignore
        const toFixed = (value, decimals) => parseFloat(value.toFixed(decimals));
        
        const [r, g, b, a] = $colorValue.rgba();
        const [h, s, l] = $colorValue.hsl();
        const [okl, okc, okh] = $colorValue.oklch();
        const [c, m, y, k] = $colorValue.cmyk();

        return {
            rgba: `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${toFixed(a, 2)})`,
            
            hsl: `hsl(${Math.round(h)}, ${toFixed(s * 100, 1)}%, ${toFixed(l * 100, 1)}%)`,
            
            oklch: `oklch(${toFixed(okl, 3)} ${toFixed(okc, 3)} ${toFixed(okh, 2)})`,
            
            cmyk: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`
        };
    }
);

// Estado adicional específico de developer view (futuras features)
export const developerState = writable({ /*Hola :D*/ });