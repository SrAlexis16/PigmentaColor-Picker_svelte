<script lang="ts">
    import chroma from 'chroma-js';
    import type { Writable } from 'svelte/store';

    // Props
    export let hue: number = 0;
    export let colorStore: Writable<chroma.Color>;
        
    // Internal state
    let container: HTMLDivElement;
    let isDragging = false;
    let cursorX = 100; // percentage (0-100)
    let cursorY = 0;   // percentage (0-100)

    function updateColor(x: number, y: number) {
        const s = x / 100;
        const v = 1 - (y / 100);
        
        colorStore.set(chroma.hsv(hue, s, v));
    }

    // Handle pointer events
    function handlePointerDown(e: PointerEvent) {
        isDragging = true;
        container.setPointerCapture(e.pointerId);
        updateCursorPosition(e);
    }

    function handlePointerMove(e: PointerEvent) {
        if (!isDragging) return;
        updateCursorPosition(e);
    }

    function handlePointerUp(e: PointerEvent) {
        isDragging = false;
        container.releasePointerCapture(e.pointerId);
    }

    let rafId: number;
    function updateCursorPosition(e: PointerEvent) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    cursorX = Math.max(0, Math.min(100, x));
    cursorY = Math.max(0, Math.min(100, y));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateColor(cursorX, cursorY));
    }

    // Update gradient when hue changes
    $: baseColor = `hsl(${hue}, 100%, 50%)`;
    
    // Initialize color on mount
    $: if (hue !== undefined) {
        updateColor(cursorX, cursorY);
    }
    </script>

    <div
        bind:this={container}
        class="color-selector"
        style="--base-hue: {baseColor}"
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}
        role="slider"
        aria-label="Color selector"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={cursorX}
        tabindex="0"
    >
        <div
            class="cursor"
            style="left: {cursorX}%; top: {cursorY}%"
            class:dragging={isDragging}
        >
        </div>
    </div>

<style>
    .color-selector {
        position: relative;
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        cursor: crosshair;
        touch-action: none;
        user-select: none;
        border-radius: 1rem;
        background:
            linear-gradient(to bottom, transparent, black),
            linear-gradient(to right, white, var(--base-hue));
    }

    .cursor {
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: transform 0.1s ease;
    }

    .cursor.dragging {
        transform: translate(-50%, -50%) scale(1.2);
    }

    /* Focus styles for accessibility 
    .color-selector:focus {
        outline: 2px solid rgba(59, 130, 246, 0.5);
        outline-offset: 2px;
    }
    */
</style>