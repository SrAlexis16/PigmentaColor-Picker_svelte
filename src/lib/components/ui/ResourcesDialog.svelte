<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { ExternalLink, BookOpen } from "@lucide/svelte";

  type Resource = {
    title: string;
    description: string;
    url: string;
    category: string;
  };

  const resources: Resource[] = [
    {
      title: "Fundamentos de la Teoría del Color",
      description: "Aprende los conceptos básicos de la teoría del color, incluyendo colores primarios, secundarios y terciarios.",
      url: "https://www.colorsexplained.com/color-theory/",
      category: "Básicos" 
    },
    {
      title: "Psicología del Color",
      description: "Entiende cómo los colores afectan las emociones y percepciones en el diseño.",
      url: "https://www.verywellmind.com/color-psychology-2795824",
      category: "Psicología"
    },
    {
      title: "Accesibilidad y Contraste",
      description: "Crea combinaciones de colores accesibles con proporciones de contraste adecuadas.",
      url: "https://webaim.org/articles/contrast/",
      category: "Accesibilidad" 
    },
    {
      title: "El Color en el Diseño UI/UX",
      description: "Mejores prácticas para usar el color en el diseño de interfaces de usuario.",
      url: "https://www.nngroup.com/articles/color-enhance-design/",
      category: "Diseño"
    }
  ];

  let open = false;
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors group w-full text-left cursor-pointer">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Resources</span>
      <BookOpen size={18} class="text-gray-600"/>
    </div>
  </Dialog.Trigger>
  
  <Dialog.Content class="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title class="text-2xl font-bold">Recursos sobre Teoría del Color</Dialog.Title>
      <Dialog.Description class="text-gray-600">
        Explora artículos y guías seleccionadas para dominar la teoría del color y el diseño.
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
      {#each resources as resource}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          class="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-blue-600 bg-gray-50 px-2 py-1 rounded">
                  {resource.category}
                </span>
              </div>
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {resource.title}
              </h3>
              <p class="text-sm text-gray-600">
                {resource.description}
              </p>
            </div>
            <ExternalLink size={16} class="text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1" />
          </div>
        </a>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>