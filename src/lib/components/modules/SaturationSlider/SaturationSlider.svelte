<script lang="ts">
  import chroma from 'chroma-js';
  import type { Writable } from 'svelte/store';

  // Props
  export let hue: number = 0;
  export let value: number = 1; // Brightness/Value (0-1)
  export let colorStore: Writable<chroma.Color>;
  
  // Internal state
  let slider: HTMLDivElement;
  let isDragging = false;
  let saturation = 1; // 0-1 range
  let rafId: number;

  // Update color in store
  function updateColor(s: number) {
    saturation = s;
    colorStore.set(chroma.hsv(hue, s, value));
  }

  // Handle pointer events
  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    slider.setPointerCapture(e.pointerId);
    updatePosition(e);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    updatePosition(e);
  }

  function handlePointerUp(e: PointerEvent) {
    isDragging = false;
    slider.releasePointerCapture(e.pointerId);
  }

  function updatePosition(e: PointerEvent) {
    const rect = slider.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const newSat = Math.max(0, Math.min(1, x));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateColor(newSat));
  }

  // Keyboard support
  function handleKeyDown(e: KeyboardEvent) {
    let delta = 0;
    if (e.key === 'ArrowLeft') delta = -0.01;
    else if (e.key === 'ArrowRight') delta = 0.01;
    else return;
    
    e.preventDefault();
    const newSat = Math.max(0, Math.min(1, saturation + delta));
    updateColor(newSat);
  }

  // Generate gradient colors
  $: leftColor = chroma.hsv(hue, 0, value).css();
  $: rightColor = chroma.hsv(hue, 1, value).css();
  $: gradientBg = `linear-gradient(to right, ${leftColor}, ${rightColor})`;

  // Initialize color on mount or prop changes
  $: if (hue !== undefined && value !== undefined) {
    updateColor(saturation);
  }
</script>

<div
  bind:this={slider}
  class="saturation-slider"
  style="--gradient: {gradientBg}"
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:keydown={handleKeyDown}
  role="slider"
  aria-label="Saturation"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={Math.round(saturation * 100)}
  tabindex="0"
>
  <div
    class="handle"
    class:dragging={isDragging}
    style="left: {saturation * 100}%">
  </div>
</div>

<style>
  .saturation-slider {
    position: relative;
    width: 100%;
    height: 24px;
    border-radius: 12px;
    background: var(--gradient);
    cursor: pointer;
    touch-action: none;
    user-select: none;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /**
  .saturation-slider:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }
  */

  .handle {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s ease;
  }

  .handle.dragging {
    transform: translate(-50%, -50%) scale(1.15);
  }
</style>