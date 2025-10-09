<script lang="ts">
    import chroma from 'chroma-js';
    import type { Writable } from 'svelte/store';

    export let colorStore: Writable<chroma.Color>; 

    let inputHexValue: string; 

    // Actualizar el STORE (Input -> Store)
    $: if (inputHexValue && chroma.valid(inputHexValue)) {
        const newColor = chroma(inputHexValue);
        
        // 🚨 CAMBIO CLAVE: Usamos la prop 'colorStore' para actualizar el global
        colorStore.set(newColor); 
    }

    // Actualizar el INPUT (Store -> Input)
    $: if ($colorStore) {
        inputHexValue = $colorStore.hex();
    }
</script>

<input 
    type="text" 
    placeholder="#HEX"
    bind:value={inputHexValue}
    class="bg-white p-1 rounded-lg"
/>