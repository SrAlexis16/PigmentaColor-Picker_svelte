<script lang="ts">
  import { currentColor } from './artistStore';
  import { ColorSwatch, InputHex } from '$lib/components/modules/index';
  import PalettesGrid from '$lib/components/ui/PalettesGrid.svelte';
</script>

<div class="h-full max-w-lg flex flex-col justify-center items-center px-4">
  <h1 class="font-outfit font-semibold text-3xl mb-4 text-center">Palette Outputs</h1>

  <div class="mb-6 flex flex-col items-center">
    <ColorSwatch className="h-32 w-32 rounded" colorStore={currentColor} />
    <span class="mt-2 text-xs text-gray-500 font-rubik">Haz click para ver el nombre</span>
    <InputHex colorStore={currentColor} />
  </div>
    <PalettesGrid />
</div>
