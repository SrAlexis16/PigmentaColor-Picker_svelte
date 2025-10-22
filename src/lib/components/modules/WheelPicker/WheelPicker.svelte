<script lang="ts">
    import chroma from 'chroma-js';
    import type { Writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';

    // Props
    export let colorStore: Writable<chroma.Color>;
    export let value: number = 1; // brightness/value (0-1) - external control only
    export let size: string | number = '100%';

    // Internal state
    let container: HTMLDivElement;
    let isDragging = false;
    let hue = 0; // Internal hue (0-360)
    let saturation = 1; // Internal saturation (0-1)
    let cursorX = 50; // CSS percentage for cursor positioning
    let cursorY = 50;
    let rafId: number;
    let initialized = false;

    // Keyboard step sizes
    const ANGLE_STEP = 5;
    const ANGLE_STEP_LARGE = 15;
    const RADIUS_STEP = 5;
    const RADIUS_STEP_LARGE = 15;

    // Convert hue and saturation to cursor coordinates
    function updateCursorPosition() {
        const angleRad = (hue * Math.PI) / 180;
        const radiusPercent = saturation * 50; // 0-50% from center
        cursorX = 50 + Math.cos(angleRad) * radiusPercent;
        cursorY = 50 + Math.sin(angleRad) * radiusPercent;
    }

    // Update color store from current hue, saturation, and value
    function updateColor() {
        colorStore.set(chroma.hsv(hue, saturation, value));
        updateCursorPosition();
    }

    // Calculate polar coordinates from pointer event
    function updateFromEvent(e: PointerEvent) {
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        
        const r = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = Math.min(rect.width, rect.height) / 2;
        
        // Calculate saturation from radius (0 at center, 1 at edge)
        saturation = Math.max(0, Math.min(1, r / maxRadius));
        
        // Calculate hue from angle
        const angleRad = Math.atan2(dy, dx);
        hue = ((angleRad * 180 / Math.PI) + 360) % 360;
        
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => updateColor());
    }

    // Pointer event handlers
    function handlePointerDown(e: PointerEvent) {
        isDragging = true;
        container.setPointerCapture(e.pointerId);
        updateFromEvent(e);
    }

    function handlePointerMove(e: PointerEvent) {
        if (!isDragging) return;
        updateFromEvent(e);
    }

    function handlePointerUp(e: PointerEvent) {
        isDragging = false;
        container.releasePointerCapture(e.pointerId);
    }

    // Keyboard navigation
    function handleKeyDown(e: KeyboardEvent) {
        const isShift = e.shiftKey;
        let handled = false;

        switch(e.key) {
            case 'ArrowLeft':
                hue = (hue - (isShift ? ANGLE_STEP_LARGE : ANGLE_STEP) + 360) % 360;
                handled = true;
                break;
            case 'ArrowRight':
                hue = (hue + (isShift ? ANGLE_STEP_LARGE : ANGLE_STEP)) % 360;
                handled = true;
                break;
            case 'ArrowUp':
                saturation = Math.min(1, saturation + (isShift ? RADIUS_STEP_LARGE : RADIUS_STEP) / 100);
                handled = true;
                break;
            case 'ArrowDown':
                saturation = Math.max(0, saturation - (isShift ? RADIUS_STEP_LARGE : RADIUS_STEP) / 100);
                handled = true;
                break;
        }

        if (handled) {
            e.preventDefault();
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => updateColor());
        }
    }

    // Initialize from color store
    function syncFromColorStore() {
        if (!initialized || isDragging) return;
        
        const color = $colorStore;
        const [h, s, v] = color.hsv();
        
        // Only update if values have changed significantly
        const hueDiff = Math.abs(hue - (h || 0));
        const satDiff = Math.abs(saturation - (s || 0));
        
        if (hueDiff > 1 && hueDiff < 359) {
            hue = h || 0;
        }
        if (satDiff > 0.01) {
            saturation = s || 0;
        }
        
        updateCursorPosition();
    }

    // Initialize on mount
    onMount(() => {
        const [h, s] = $colorStore.hsv();
        hue = h || 0;
        saturation = s || 1;
        updateCursorPosition();
        initialized = true;
    });

    onDestroy(() => {
        cancelAnimationFrame(rafId);
    });

    // React to external color changes
    $: if ($colorStore && initialized) {
        syncFromColorStore();
    }

    // React to external value changes (from BrightnessSlider)
    $: if (initialized && !isDragging) {
        updateColor();
    }

    // Reactive sizing
    $: containerSize = typeof size === 'number' ? `${size}px` : size;
    $: brightnessOverlay = 1 - value;
</script>

<div
    bind:this={container}
    class="wheel-picker"
    role="slider"
    style="width: {containerSize}; height: {containerSize}"
    aria-label="Color selector (hue and saturation)"
    aria-valuemin="0"
    aria-valuemax="360"
    aria-valuenow={Math.round(hue)}
    tabindex="0"
    on:pointerdown={handlePointerDown}
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
    on:pointercancel={handlePointerUp}
    on:keydown={handleKeyDown}
>
    <div class="wheel-gradient"></div>
    <div class="saturation-overlay"></div>
    <div class="brightness-overlay" style="background: rgba(0, 0, 0, {brightnessOverlay})"></div>
    <div
        class="cursor"
        style="left: {cursorX}%; top: {cursorY}%; background-color: {$colorStore.css()}"
        class:dragging={isDragging}
    ></div>
</div>

<style>
    .wheel-picker {
        position: relative;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        cursor: crosshair;
        touch-action: none;
        user-select: none;
        outline: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .wheel-gradient {
        position: absolute;
        inset: 0;
        background: conic-gradient(
            from 90deg,
            hsl(0, 100%, 50%) 0deg,
            hsl(30, 100%, 50%) 30deg,
            hsl(60, 100%, 50%) 60deg,
            hsl(90, 100%, 50%) 90deg,
            hsl(120, 100%, 50%) 120deg,
            hsl(150, 100%, 50%) 150deg,
            hsl(180, 100%, 50%) 180deg,
            hsl(210, 100%, 50%) 210deg,
            hsl(240, 100%, 50%) 240deg,
            hsl(270, 100%, 50%) 270deg,
            hsl(300, 100%, 50%) 300deg,
            hsl(330, 100%, 50%) 330deg,
            hsl(360, 100%, 50%) 360deg
        );
    }

        .saturation-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(
                circle,
                white 0%,
                transparent 100%
                );
                pointer-events: none;
            }
            
            .brightness-overlay {
                position: absolute;
                inset: 0;
                pointer-events: none;
                transition: background 0.15s ease;
    }
    
    .cursor {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 3px solid white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 
        0 0 0 1.5px rgba(0, 0, 0, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.3);
            transition: transform 0.1s ease;
            z-index: 10;
        }
        
        .cursor.dragging {
            transform: translate(-50%, -50%) scale(1.25);
        }

    /* Focus styles for accessibility 
    .wheel-picker:focus-visible {
        box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.15),
            0 0 0 3px rgba(59, 130, 246, 0.5);
    }
    */
</style>