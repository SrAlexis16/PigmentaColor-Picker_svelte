<script lang="ts">
    import chroma from 'chroma-js';
    import type { Writable } from 'svelte/store';

    export let colorStore: Writable<chroma.Color>;

    export const borderValid: string = 'focus:border-blue-400';  
    export const borderInvalid: string = 'focus:border-red-400';

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
        w-full bg-white rounded-2xl shadow-md border border-gray-200 p-2 rounded-lg cursor-text transition-all duration-150 text-sm max-w-55 focus:outline
        ${isInvalid ? borderInvalid : borderValid}
    `}
/>