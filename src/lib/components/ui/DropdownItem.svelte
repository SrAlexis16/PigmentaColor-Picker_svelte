<script lang="ts">
  import { getContext } from 'svelte';
  
  export let value: string = '';
  export let disabled = false;

  // Obtener el handler del contexto del Dropdown padre
  const handleItemSelect = getContext<((value: string) => void) | undefined>('dropdown-select');

  function handleClick() {
    if (disabled) return;
    handleItemSelect?.(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemSelect?.(value);
    }
  }
</script>

<div
  class="dropdown-item {disabled ? 'disabled' : ''}"
  role="menuitem"
  tabindex={disabled ? -1 : 0}
  on:click={handleClick}
  on:keydown={handleKeydown}
>
  <slot />
</div>

<style>
  .dropdown-item {
    position: relative;
    display: flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    border-radius: 0.375rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: background-color 0.1s ease;
  }

  .dropdown-item:hover {
    background-color: hsl(240 4.8% 95.9%);
  }

  .dropdown-item:focus {
    background-color: hsl(240 4.8% 95.9%);
  }

  .dropdown-item.disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  :global(.dark) .dropdown-item:hover,
  :global(.dark) .dropdown-item:focus {
    background-color: hsl(217.2 32.6% 17.5%);
  }
</style>