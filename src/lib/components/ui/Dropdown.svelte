<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy, setContext } from 'svelte';
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  // Props
  export let open = false;
  export let placement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  export let align: 'start' | 'center' | 'end' = 'start';
  export let offset = 8;
  export let closeOnSelect = true;
  export let closeOnClickOutside = true;

  const dispatch = createEventDispatcher<{
    openChange: boolean;
    select: string;
  }>();

  let triggerEl: HTMLElement;
  let contentEl: HTMLElement;
  let position = { top: 0, left: 0 };

  function calculatePosition() {
    if (!triggerEl || !contentEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = 0;
    let left = 0;

    // Calcular posición vertical
    switch (placement) {
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'top':
        top = triggerRect.top - contentRect.height - offset;
        break;
      case 'left':
      case 'right':
        top = triggerRect.top;
        break;
    }

    // Calcular posición horizontal
    switch (placement) {
      case 'bottom':
      case 'top':
        switch (align) {
          case 'start':
            left = triggerRect.left;
            break;
          case 'center':
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case 'end':
            left = triggerRect.right - contentRect.width;
            break;
        }
        break;
      case 'left':
        left = triggerRect.left - contentRect.width - offset;
        break;
      case 'right':
        left = triggerRect.right + offset;
        break;
    }

    // Ajustes para mantener dentro del viewport
    if (left + contentRect.width > viewport.width) {
      left = viewport.width - contentRect.width - 8;
    }
    if (left < 8) {
      left = 8;
    }
    if (top + contentRect.height > viewport.height) {
      top = triggerRect.top - contentRect.height - offset;
    }
    if (top < 8) {
      top = 8;
    }

    position = { top, left };
  }

  function toggle() {
    open = !open;
    dispatch('openChange', open);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!closeOnClickOutside || !open) return;
    
    const target = event.target as Node;
    if (
      triggerEl?.contains(target) ||
      contentEl?.contains(target)
    ) return;

    open = false;
    dispatch('openChange', false);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      open = false;
      dispatch('openChange', false);
      triggerEl?.focus();
    }
  }

  function handleItemSelect(value: string) {
    dispatch('select', value);
    if (closeOnSelect) {
      open = false;
      dispatch('openChange', false);
    }
  }

  // Proveer el handler a los children via contexto
  setContext('dropdown-select', handleItemSelect);

  $: if (open && triggerEl && contentEl) {
    calculatePosition();
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', calculatePosition);
    window.removeEventListener('scroll', calculatePosition, true);
  });
</script>

<div class="dropdown-container font-rubik">
  <!-- Trigger -->
  <div
    bind:this={triggerEl}
    on:click={toggle}
    on:keydown={(e) => e.key === 'Enter' && toggle()}
    role="button"
    tabindex="0"
    class="dropdown-trigger"
  >
    <slot name="trigger" />
  </div>

  {#if open}
    <div
      bind:this={contentEl}
      class="dropdown-content"
      style="top: {position.top}px; left: {position.left}px;"
      transition:scale={{ duration: 100, start: 0.95, easing: quintOut }}
      role="menu"
    >
      <slot />
    </div>
  {/if}
</div>

<style>
  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  .dropdown-trigger {
    cursor: pointer;
    outline: none;
  }

  .dropdown-content {
    position: fixed;
    z-index: 50;
    min-width: 8rem;
    background: white;
    border: 1px solid hsl(0 0% 89.8%);
    border-radius: 0.5rem;
    padding: 0.25rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  :global(.dark) .dropdown-content {
    background: hsl(222.2 84% 4.9%);
    border-color: hsl(217.2 32.6% 17.5%);
  }
</style>