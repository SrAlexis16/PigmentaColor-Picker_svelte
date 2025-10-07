<script lang="ts">
  import './app.css';
</script>

<main class="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 mx-[2vh] md:mx-[8vh] lg:mx-[12vh] my-[1.5vh]">
  <!-- Canvas Section: Principal area for color work -->
  <section class="bg-blue-500 p-5 rounded-lg min-h-[75vh] order-2 lg:order-1">
    <div class="flex flex-col lg:flex-row gap-4 h-full">
      <div class="bg-red-500 w-full p-4 rounded">Canvas Principal</div>
      <div class="bg-red-500 w-full p-4 rounded">Outputs de colores</div>
    </div>
  </section>

  <!-- Sidebar Section: Controls and information -->
  <aside class="bg-green-500 p-5 rounded-lg order-1 lg:order-2 lg:min-h-[92vh]">
    <div class="flex flex-row lg:flex-col gap-4 h-full">
      
      <!-- Mobile-only controls -->
      <button class="bg-red-500 p-3 rounded md:hidden flex-1">
        Boton de despliegue
      </button>
      <button class="bg-red-500 p-3 rounded md:hidden flex-1">
        Boton de vistas
      </button>

      <!-- Desktop/Tablet action buttons -->
      <div class="hidden md:flex flex-row gap-4 bg-yellow-500 p-1 rounded justify-end">
        <button class="bg-pink-500 px-3 py-1 rounded">Boton 1</button>
        <button class="bg-pink-500 px-3 py-1 rounded">Boton 2</button>
        <button class="bg-pink-500 px-3 py-1 rounded">Boton 3</button>
      </div>

      <!-- Desktop-only text information -->
      <div class="hidden lg:flex lg:flex-col gap-4 bg-yellow-500 p-3 rounded flex-1">
        <div class="bg-red-500 p-2 rounded">Texto 1</div>
        <div class="bg-red-500 p-2 rounded">Texto 2</div>
        <div class="bg-red-500 p-2 rounded">Texto 3</div>
        <div class="bg-red-500 p-2 rounded">Texto 4</div>
      </div>
      
    </div>
  </aside>
</main>