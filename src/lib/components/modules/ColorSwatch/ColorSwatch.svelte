<script lang="ts">
    import type { Readable } from 'svelte/store';
    import type { Color } from 'chroma-js';
    import { onDestroy } from 'svelte';

    export let colorStore: Readable<Color>;
    export let className: string = 'h-16 w-16'; 

    let colorName = '';
    let loading = false;
    let error = false;
    let showTooltip = false;
    let buttonElement: HTMLButtonElement;
    let tooltipElement: HTMLDivElement;


    const cache = new Map<string, string>();

    async function handleClick(event: MouseEvent) {
        event.stopPropagation();
        
        const hex = $colorStore.hex();
        
        if (showTooltip) {
            showTooltip = false;
            return;
        }

        // Cache verification
        if (cache.has(hex)) {
            colorName = cache.get(hex)!;
            showTooltip = true;
            return;
        }
        
        loading = true;
        error = false;
        showTooltip = true;
        
        try {
            const hexClean = hex.replace('#', '');
            const response = await fetch(
                `https://api.color.pizza/v1/${hexClean}`,
                { signal: AbortSignal.timeout(5000) } // Timeout
            );
            
            if (!response.ok) throw new Error('API error');
            const data = await response.json() as { colors: Array<{ name: string }> };
            colorName = data.colors[0].name;
            
            cache.set(hex, colorName);
        } catch (err) {
            error = true;
            colorName = hex; // Fallback
        } finally {
            loading = false;
        }
    }

    function handleClickOutside(event: MouseEvent) {
        if (!showTooltip) return;

        const clickedElement = event.target as Node;

        if (showTooltip &&
        !tooltipElement.contains(clickedElement) && 
        !buttonElement.contains(clickedElement)) {
            showTooltip = false;
        }
    }

    $: if (showTooltip) {
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup de seguridad
    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="relative inline-block" bind:this={tooltipElement}>
    <button 
        bind:this={buttonElement}
        on:click={handleClick}
            style="background-color: {$colorStore.hex()}"
            class="{className} rounded-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
            aria-label="Ver nombre del color">
    </button>

    {#if showTooltip}
        <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
            role="tooltip"
        >
            {#if loading}
                <span class="flex items-center gap-2">
                    <span class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </span>
            {:else if error}
                <span class="text-red-300">
                    {colorName}
                </span>
            {:else}
                {colorName}
            {/if}
            
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
    {/if}
</div>

<style>
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>