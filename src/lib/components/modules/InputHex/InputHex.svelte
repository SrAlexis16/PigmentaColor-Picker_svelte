<script lang="ts">
    import chroma from 'chroma-js';
    import type { Writable } from 'svelte/store';

    export let colorStore: Writable<chroma.Color>;

    // Ajustar estas lineas si es necesario
    export const borderValid: string = 'border-gray-300';  
    export const borderInvalid: string = 'border-red-300'; 

    export let weight: string = 'w-[200px]'

    let inputHexValue: string = '';
    let isInvalid = false;
    let isUserEditing = false;

    // Store -> Input
    $: if ($colorStore && !isUserEditing) {
        inputHexValue = $colorStore.hex();
    }

    // Input -> Store
    function handleInput() {
        isUserEditing = true;
        
        const sanitizedValue = inputHexValue.replace(/^#/, '').trim();
        
        // Validar
        const isValid = sanitizedValue.length > 0 && chroma.valid(`#${sanitizedValue}`);
        isInvalid = sanitizedValue.length > 0 && !isValid;
        
        // Actualizar
        if (isValid) {
            colorStore.set(chroma(`#${sanitizedValue}`));
        }
    }

    // Detectar edición
    function handleBlur() {
        isUserEditing = false;
        
        if (isInvalid || inputHexValue.trim() === '') {
            inputHexValue = $colorStore.hex();
            isInvalid = false;
        }
    }
</script>

<input 
    type="text" 
    placeholder="#HEX"
    bind:value={inputHexValue}
    on:input={handleInput}
    on:blur={handleBlur}
    class={`
        ${weight} bg-gray-50 px-2 py-1 rounded-lg border-2 outline-none
        ${isInvalid ? borderInvalid : borderValid}
    `}
/>