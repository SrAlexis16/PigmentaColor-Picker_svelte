<script lang="ts">
  import chroma from 'chroma-js';
  import type { Writable } from 'svelte/store';

  // Props
  export let colorStore: Writable<chroma.Color>;
  
  // Internal state
  let slider: HTMLDivElement;
  let isDragging = false;
  let hue = 0; // 0-360
  let rafId: number;
  let isInternalUpdate = false;

  // Update color in store
  function updateColor(h: number) {
    hue = h;
    isInternalUpdate = true;
    
    // Preserve current saturation and value
    const currentHsv = $colorStore.hsv();
    const s = currentHsv[1] || 1;
    const v = currentHsv[2] || 1;
    
    colorStore.set(chroma.hsv(h, s, v));
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
    const newHue = Math.max(0, Math.min(360, x * 360));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateColor(newHue));
  }

  // Keyboard support
  function handleKeyDown(e: KeyboardEvent) {
    let delta = 0;
    if (e.key === 'ArrowLeft') delta = -1;
    else if (e.key === 'ArrowRight') delta = 1;
    else return;
    
    e.preventDefault();
    let newHue = hue + delta;
    if (newHue < 0) newHue = 360;
    if (newHue > 360) newHue = 0;
    updateColor(newHue);
  }

  // Sync with external color changes (from other sliders/inputs)
  $: if ($colorStore && !isDragging && !isInternalUpdate) {
    const hsvArray = $colorStore.hsv();
    const externalHue = hsvArray[0];
    if (!isNaN(externalHue) && Math.abs(externalHue - hue) > 0.5) {
      hue = externalHue;
    }
  }
</script>

<div
  bind:this={slider}
  class="hue-slider"
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:keydown={handleKeyDown}
  role="slider"
  aria-label="Hue"
  aria-valuemin="0"
  aria-valuemax="360"
  aria-valuenow={Math.round(hue)}
  tabindex="0"
>
  <div
    class="handle"
    class:dragging={isDragging}
    style="left: {(hue / 360) * 100}%"
  ></div>
</div>

<style>
  .hue-slider {
    position: relative;
    width: 100%;
    height: 24px;
    border-radius: 12px;
    background: linear-gradient(
      to right, 
      red, 
      #ffff00,
      #00ff00,
      #00ffff,
      blue,
      #ff00ff,
      red
    );
    cursor: pointer;
    touch-action: none;
    user-select: none;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /*
  .hue-slider:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  } */

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