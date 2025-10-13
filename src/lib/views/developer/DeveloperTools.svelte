<script lang="ts">
  import { currentColor, colorOutputs } from './developerStore';
  import { ColorSwatch, InputHex } from '$lib/components/modules/index';
  import OutputButton from '$lib/components/ui/OutputButton.svelte';

  const outputFormats = [
    { key: 'rgba', label: 'RGBA' },
    { key: 'hsl', label: 'HSL' },
    { key: 'oklch', label: 'OKLCH' },
    { key: 'cmyk', label: 'CMYK' }
  ];
</script>

<div class="h-full flex flex-col justify-center items-center">
  <h1 class="font-outfit font-semibold text-3xl mb-4 text-center">Code Outputs</h1>
  
  <div class="mb-4 flex flex-col items-center">
    <ColorSwatch className="h-32 w-32 rounded" colorStore={currentColor} />
    <span class="mt-2 text-xs text-gray-500 font-rubik">Haz click para ver el nombre</span>
  </div>

  <div class="flex flex-col items-stretch space-y-3 font-rubik">
    <InputHex  colorStore={currentColor}/>
    {#each outputFormats as { key } (key)}
      <OutputButton value={$colorOutputs[key as keyof typeof $colorOutputs]} />
    {/each}
  </div>
</div>