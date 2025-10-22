<script lang="ts">
  import { selectedPalette, artistState } from "$lib/views/artist/artistStore";
  import { ColorSwatch } from '$lib/components/modules/index';
  import { readable, type Readable } from 'svelte/store';
  import type { Color } from 'chroma-js';
  import Dropdown from "$lib/components/ui/Dropdown.svelte";
  import DropdownItem from "$lib/components/ui/DropdownItem.svelte";
  import { ChevronDown } from "@lucide/svelte";
  import type { PaletteType } from "$lib/views/artist/artistStore";

  const swatchCache = new Map<string, Readable<Color>>();

  function getSwatchStore(hex: string, color: Color): Readable<Color> {
    if (swatchCache.has(hex)) {
      return swatchCache.get(hex)!;
    }
    const store = readable<Color>(color);
    swatchCache.set(hex, store);
    return store;
  }

  const paletteOptions = [
    { value: "complementary", label: "Complementary" },
    { value: "analogous", label: "Analogous" },
    { value: "triadic", label: "Triadic" },
    { value: "tetradic", label: "Tetradic" },
    { value: "split-complementary", label: "Split Complementary" },
    { value: "monochromatic", label: "Monochromatic" },
    { value: "shades", label: "Shades - Darker versions" },
    { value: "tints", label: "Tints - Lighter versions" }
  ] as const;

  function selectPalette(type: PaletteType) {
    artistState.update(state => ({ ...state, selectedPaletteType: type }));
  }

  let dropdownOpen = false;

  $: selectedLabel = paletteOptions.find(opt => opt.value === $artistState.selectedPaletteType)?.label ?? "Select palette type";
</script>

<div class="flex flex-col items-center justify-center w-full px-4 py-6 space-y-6">
  <div class="w-full max-w-md">
    <label for="palette-type-trigger" class="block text-sm font-medium text-gray-700 mb-2 font-rubik text-center">
      Palette Type
    </label>

    <Dropdown 
      bind:open={dropdownOpen}
      placement="bottom"
      align="start"
      on:select={(e) => selectPalette(e.detail as PaletteType)}
    >
      <button
        slot="trigger"
        id="palette-type-trigger"
        class="inline-flex items-center justify-between w-full md:w-[250px] px-4 py-2 text-sm font-outfit bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {selectedLabel}
        <ChevronDown class="ml-2 h-4 w-4 opacity-50" />
      </button>

      {#each paletteOptions as { value, label } (value)}
        <DropdownItem {value}>
          {label}
        </DropdownItem>
      {/each}
    </Dropdown>
  </div>

  <div class="w-full max-w-md">
    {#if $selectedPalette.length === 0}
      <p class="text-center text-sm text-gray-500 font-rubik py-8">
        No colors generated yet. Select a palette type.
      </p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {#each $selectedPalette as { id, hex, color } (id)}
          <div class="flex flex-col items-center justify-center space-y-2">
            <ColorSwatch
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              colorStore={getSwatchStore(hex, color)}
            />
            <span class="font-rubik text-xs sm:text-sm font-medium text-gray-700">
              {hex}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>