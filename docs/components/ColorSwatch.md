# Basic Usage

El componente requiere que le pases el Store de color global como una Prop (`colorStore`).

```svelte
<script>
    // 1. Importa tu Store y el componente (ejemplo)
    import { currentColor } from '$lib/stores/mainColorStore'; 
    import PigmentaSwatch from '$lib/components/modules/ColorSwatch/ColorSwatch.svelte';
</script>

<div class="p-4 flex gap-4 items-center">
    <PigmentaSwatch colorStore={currentColor} /> 
    
    <PigmentaSwatch 
        colorStore={currentColor} 
        class="h-8 w-8 border-2 border-white shadow-xl" 
    />
</div>
```

## Props

El componente acepta las siguientes props:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Readable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente está diseñado para **solo leer** este valor. |
| `className` | `string` | No | `h-16 w-16` (tailwind classes) | Clases de utilidad de CSS/Tailwind para personalizar el tamaño, bordes o márgenes del botón Swatch. Svelte fusionará estas clases con el estilo predeterminado. |

## API y Comportamiento

### 1. Reactividad y Cierre de Tooltip

| Característica | Detalle |
|----------------|---------|
| **Lectura Reactiva** | El color de fondo se actualiza instantáneamente con el valor de `$colorStore.hex()`, sin necesidad de `onMount` |
| **Activación del Tooltip** | Al hacer clic en el swatch, se inicia el proceso de búsqueda del nombre. |
| **Cierre de Tooltip** | El tooltip se oculta automáticamente cuando el usuario hace clic fuera del componente (`<div bind:this={tooltipElement}>`) o hace clic de nuevo en el swatch (función toggle). |
| **Manejo de Clic Fuera** | Implementado con un listener global (`document.addEventListener`) gestionado por las funciones de ciclo de vida de Svelte (`onDestroy`) y una lógica reactiva (`$:`), previniendo fugas de memoria. |

### 2. Rendimiento y Data Fetching

El componente está optimizado para dispositivos de cualquier gama mediante las siguientes técnicas:

- **API bajo Demanda:** La llamada a la API (`api.color.pizza/v1`) solo se realiza cuando el usuario hace clic, evitando el trabajo en el render inicial.

- **Caching Local:** Utiliza un objeto `Map` como caché local. Si el mismo color Hex se consulta dos veces, se evita la llamada de red, mejorando la velocidad de respuesta.

- **Manejo de Estado:** Implementa un control de estados (loading, error) con fallbacks y un timeout (`AbortSignal`) para manejar fallos de red de forma elegante.

## ⚠️ Dependencias Clave

Para que este componente funcione en su proyecto, debe tener instaladas las siguientes librerías:

- `svelte`
- `svelte/store`
- `chroma-js` (Para manipulación del color)

No requiere librerías de terceros para tooltips, ya que usa la funcionalidad nativa de Svelte, HTML y CSS.