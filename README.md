[![Svelte](https://img.shields.io/badge/Svelte-5+-ff3e00.svg?logo=svelte)](https://svelte.dev/)
[![Vite](https://img.shields.io/badge/Vite-4+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn-svelte](https://img.shields.io/badge/shadcn-svelte-000000.svg)](https://www.shadcn-svelte.com/)

## Historia del Proyecto 
Pigmenta comenzó como un experimento en React + Vite para crear un color picker simple. Sin embargo, a medida que crecía, los problemas de performance se hacían evidentes: conversiones de color en cada render, re-renders innecesarios y una gestión de estado cada vez más compleja con múltiples useState dispersos.
La decisión de reescribir desde cero en Svelte surgió de la necesidad de:

- Eliminar la complejidad de hooks y efectos secundarios
- Aprovechar la reactividad nativa para actualizaciones en tiempo real
- Reducir el código y mejorar la mantenibilidad
- Aprender un paradigma diferente y más eficiente

Este proyecto representa un caso de estudio de migración React → Svelte y cómo elegir el stack correcto mejora tanto el código como la experiencia del usuario.

## Principales características a considerar: 

-  **Selección de color interactiva** con vista previa en tiempo real  
-  **Paletas dinámicas** para explorar combinaciones  
-  **Formatos múltiples** (HEX, RGBA, HSL, CIELAB, CMYK, OKLCH) listos para copiar  
-  **Rendimiento optimizado** gracias a la arquitectura de islas de Astro y la reactividad de Svelte  


## Recursos
- Boceto de la primera distribución:
![Captura de pantalla](./docs/assets/PrematureSketch.png)

**/README.md v1.0.0**