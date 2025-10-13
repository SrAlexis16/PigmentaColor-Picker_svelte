<script lang="ts">
  import chroma from 'chroma-js';
  import type { Writable } from 'svelte/store';

  // Props
  export let hue: number = 0;
  export let saturation: number = 1; // 0-1 range
  export let colorStore: Writable<chroma.Color>;
  
  // Internal state
  let slider: HTMLDivElement;
  let isDragging = false;
  let value = 1; // Brightness/Value (0-1)
  let rafId: number;
  let isInternalUpdate = false;

  // Update color in store
  function updateColor(v: number) {
    value = v;
    isInternalUpdate = true;
    colorStore.set(chroma.hsv(hue, saturation, v));
    // Reset flag after a short delay to allow external updates again
    setTimeout(() => { isInternalUpdate = false; }, 50);
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
    const newValue = Math.max(0, Math.min(1, x));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateColor(newValue));
  }

  // Keyboard support
  function handleKeyDown(e: KeyboardEvent) {
    let delta = 0;
    if (e.key === 'ArrowLeft') delta = -0.01;
    else if (e.key === 'ArrowRight') delta = 0.01;
    else return;
    
    e.preventDefault();
    const newValue = Math.max(0, Math.min(1, value + delta));
    updateColor(newValue);
  }

  // Sync with external color changes (from other sliders/inputs)
  // Only update if not currently dragging and not from our own update
  $: if ($colorStore && !isDragging && !isInternalUpdate) {
    const hsvArray = $colorStore.hsv();
    const externalValue = hsvArray[2];
    if (!isNaN(externalValue) && Math.abs(externalValue - value) > 0.001) {
      value = externalValue;
    }
  }

  // Generate gradient colors (from black to full brightness)
  $: leftColor = chroma.hsv(hue, saturation, 0).css();
  $: rightColor = chroma.hsv(hue, saturation, 1).css();
  $: gradientBg = `linear-gradient(to right, ${leftColor}, ${rightColor})`;
</script>

<div
  bind:this={slider}
  class="brightness-slider"
  style="--gradient: {gradientBg}"
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:keydown={handleKeyDown}
  role="slider"
  aria-label="Brightness"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={Math.round(value * 100)}
  tabindex="0"
>
  <div
    class="handle"
    class:dragging={isDragging}
    style="left: {value * 100}%"
  ></div>
</div>

<style>
  .brightness-slider {
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

  /*
  .brightness-slider:focus {
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