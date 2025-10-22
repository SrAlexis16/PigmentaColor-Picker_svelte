<script lang="ts">
  import './app.css';
  import { currentView, setView } from '$lib/store/viewStore';

  import DeveloperCanvas from '$lib/views/developer/DeveloperCanvas.svelte';
  import DeveloperTools from '$lib/views/developer/DeveloperTools.svelte';

  import DesignerCanvas from '$lib/views/designer/DesignerCanvas.svelte';
  import DesignerTools from '$lib/views/designer/DesignerTools.svelte';

  import ArtistTools from '$lib/views/artist/ArtistTools.svelte';
  import ArtistCanvas from '$lib/views/artist/ArtistCanvas.svelte';

  import ResourcesDialog from '$lib/components/ui/ResourcesDialog.svelte';

  import { Terminal, Palette, PenTool, Github, ExternalLink, Heart } from "@lucide/svelte";

  const icons = {
    developer: Terminal,
    designer: Palette,
    artist: PenTool
  } as const;

  type ViewMode = keyof typeof icons;
</script>

<main class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <h1 class="text-xl md:text-3xl font-bold font-outfit text-black">Pigmenta</h1>
      </div>
      
      <nav class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg" aria-label="View modes">
        {#each (['developer', 'designer', 'artist'] as ViewMode[]) as view}
          <button
            on:click={() => setView(view)}
            aria-label={`Switch to ${view} view`}
            aria-current={$currentView === view ? 'page' : undefined}
            class={`flex items-center gap-2 px-4 py-2 rounded-md text-md font-outfit font-medium transition-all duration-200
              ${$currentView === view 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-800'}
            `}
          >
            {#if icons[view]}
              {@const Icon = icons[view]}
              <Icon class="w-5 h-5 block" />
            {/if}

            <span class="hidden md:inline">
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </span>
          </button>
        {/each}
      </nav>
    </div>
  </header>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex-1">
    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-12 xl:gap-16 items-start">
      <article class="flex justify-center">
        <div class="w-full max-w-[700px] mx-auto">
          <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-8 md:p-10 lg:p-12">
            {#if $currentView === 'developer'}
              <DeveloperCanvas />
            {:else if $currentView === 'designer'}
                <DesignerCanvas />
            {:else}
                <ArtistCanvas />
            {/if}
          </div>
        </div>
      </article>

      <aside class="flex flex-col gap-6 lg:gap-10 self-start">
        <article class="bg-white rounded-2xl shadow-md border border-gray-200 p-8 md:p-10 lg:p-12">
          {#if $currentView === 'developer'}
            <DeveloperTools />
          {:else if $currentView === 'designer'}
              <DesignerTools />
          {:else}
              <ArtistTools />
          {/if}
        </article>

        <article class="flex flex-col gap-4 font-rubik">
          <ResourcesDialog />

          <a 
            rel="noopener noreferrer" 
            target="_blank" 
            href="https://github.com/SrAlexis16/PigmentaColor-Picker_svelte" 
            aria-label="GitHub Repository (opens in new tab)"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">GitHub Repo</span>
              <div class="flex items-center gap-1">
                <ExternalLink size={14} class="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Github size={18} class="text-gray-600" />
              </div>
            </div>
          </a>
        </article>
      </aside>
    </div>
  </section>

  <footer class="mt-auto border-t border-gray-200 bg-white font-rubik text-center justify-center">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <p class="text-sm text-gray-600 flex justify-center items-center gap-1">
        Made with <span class="text-red-500"><Heart/></span> by 
        <a href="https://github.com/SrAlexis16" class="underline hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
          Alexis
        </a>
      </p>
      <p class="text-xs text-gray-500 mt-1">V1.0.0</p>
    </div>
  </footer>
</main>