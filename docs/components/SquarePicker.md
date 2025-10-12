# SquarePicker - Documentación Técnica

## Basic Usage

El componente `SquarePicker` es un selector de color bidimensional que permite controlar simultáneamente la **saturación (eje horizontal)** y el **brillo/valor (eje vertical)** de un color basado en un matiz específico.

```svelte
<script>
    import { currentColor } from '$lib/store/mainColorStore'; 
    import { SquarePicker } from '$lib/components/modules/index';
    
    let currentHue = 0;
    
    // Actualizar el hue desde el store
    $: if ($currentColor) {
        const hsvArray = $currentColor.hsv();
        currentHue = hsvArray[0] || 0;
    }
</script>

<div class="p-4">
    <SquarePicker 
        colorStore={currentColor}
        hue={currentHue}
    />
</div>
```

## Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |
| `hue` | `number` | Sí | `0` | Valor del matiz actual (0-360°) que define el color base del selector. |

## API y Comportamiento

### 1. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Control Bidimensional** | El componente controla **Saturación (S)** y **Valor/Brillo (V)** simultáneamente en un plano 2D. |
| **Eje Horizontal (X)** | Representa la **Saturación** (0-100%). Izquierda = desaturado (0%), Derecha = saturado (100%). |
| **Eje Vertical (Y)** | Representa el **Brillo/Valor** (0-100%). Arriba = brillante (100%), Abajo = oscuro (0%). |
| **Actualización Directa** | Actualiza inmediatamente el *Store* con `colorStore.set(chroma.hsv(hue, s, v))` al detectar cambios. |
| **Dependencia de Hue** | Requiere que el prop `hue` esté sincronizado externamente para generar el gradiente correcto del color base. |
| **Inicialización Reactiva** | Se reinicializa automáticamente cuando cambia el prop `hue` usando `$: if (hue !== undefined)`. |
| **RequestAnimationFrame** | Optimiza el rendimiento durante interacciones continuas cancelando frames anteriores. |

### 2. Sistema de Coordenadas

| Eje | Rango Visual | Rango Interno | Conversión a HSV |
| :--- | :--- | :--- | :--- |
| **X (Saturación)** | 0% (izquierda) → 100% (derecha) | `cursorX`: 0-100 | `s = cursorX / 100` (0-1) |
| **Y (Brillo)** | 0% (arriba) → 100% (abajo) | `cursorY`: 0-100 | `v = 1 - (cursorY / 100)` (invertido) |

**Nota importante**: El eje Y está **invertido** visualmente. Un `cursorY` de 0% (arriba) produce un `value` de 1 (brillo máximo), mientras que un `cursorY` de 100% (abajo) produce un `value` de 0 (negro).

### 3. Gradiente Dinámico

| Capa | Descripción |
| :--- | :--- |
| **Capa Base** | Gradiente horizontal de **blanco a color base**: `linear-gradient(to right, white, var(--base-hue))`. El color base se genera como `hsl(${hue}, 100%, 50%)`. |
| **Capa Superior** | Gradiente vertical de **transparente a negro**: `linear-gradient(to bottom, transparent, black)`. Se superpone a la capa base. |
| **Resultado Visual** | Esquina superior izquierda = blanco puro. Esquina superior derecha = color base vibrante. Esquina inferior izquierda = gris. Esquina inferior derecha = color base oscuro. Centro = color base con saturación y brillo medios. |

### 4. Interacción del Usuario

| Método | Descripción |
| :--- | :--- |
| **Pointer Events** | Soporta `pointerdown`, `pointermove`, y `pointerup` con captura de puntero para seguimiento preciso incluso fuera del elemento. |
| **Arrastre Continuo** | El cursor sigue el puntero del usuario en tiempo real durante el arrastre, actualizando el color instantáneamente. |
| **Límites Automáticos** | Los valores de `cursorX` y `cursorY` se limitan automáticamente al rango 0-100% usando `Math.max(0, Math.min(100, value))`. |
| **Cursor Personalizado** | El cursor muestra `cursor: crosshair` para indicar la funcionalidad de selección 2D. |
| **Accesibilidad** | Implementa `role="slider"`, `aria-label="Color selector"`, `aria-valuemin/max/now` y `tabindex="0"`. **Nota**: Actualmente solo reporta el valor X (saturación) en `aria-valuenow`. |

### 5. Feedback Visual

| Estado | Efecto Visual |
| :--- | :--- |
| **Cursor Posicionado** | El cursor circular se posiciona dinámicamente usando `left: {cursorX}%; top: {cursorY}%` con `transform: translate(-50%, -50%)` para centrarlo. |
| **Efecto de Arrastre** | El cursor escala 20% (`scale(1.2)`) cuando `isDragging` es `true`, con transición suave de 0.1s. |
| **Borde Doble** | El cursor tiene un borde blanco de 2px y una sombra negra semitransparente para visibilidad en todos los fondos. |
| **Tamaño del Selector** | Por defecto ocupa 100% del ancho del contenedor con `aspect-ratio: 1` (cuadrado) y altura del 100%. Altamente personalizable con CSS. |

## Uso Integrado con Sliders HSV

### Ejemplo Completo

```svelte
<script lang="ts">
  import { currentColor } from "$lib/store/mainColorStore";
  import { HueSlider, SquarePicker } from "$lib/components/modules/index";

  let currentHue: number = 0;

  // Sincronizar hue desde el store
  $: if ($currentColor) {
    const hsvArray = $currentColor.hsv();
    const hueValue = hsvArray[0] || 0;
    
    if (!isNaN(hueValue)) {
      currentHue = hueValue;
    }
  }
</script>

<div class="color-picker-container">
  <!-- Selector 2D para Saturación y Brillo -->
  <SquarePicker 
    colorStore={currentColor}
    hue={currentHue}
  />
  
  <!-- Slider para controlar el Hue -->
  <HueSlider colorStore={currentColor} />
</div>

<style>
  .color-picker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
  }
</style>
```

### Flujo de Datos

| Paso | Descripción |
| :--- | :--- |
| **1. Usuario Arrastra en SquarePicker** | El usuario hace clic y arrastra dentro del área del selector. |
| **2. Cálculo de Coordenadas** | Se calculan `cursorX` (saturación) y `cursorY` (brillo invertido) basados en la posición del puntero. |
| **3. Conversión a HSV** | Los valores de porcentaje se convierten: `s = cursorX/100`, `v = 1 - (cursorY/100)`. |
| **4. Actualización del Store** | Se actualiza el store con `chroma.hsv(hue, s, v)`. |
| **5. Cambio de Hue Externo** | Si el usuario cambia el Hue con `HueSlider`, el prop `hue` se actualiza. |
| **6. Regeneración de Gradiente** | El `SquarePicker` detecta el cambio de `hue` y regenera su gradiente de fondo con el nuevo color base. |
| **7. Preservación de Posición** | El cursor mantiene su posición (S y V) mientras solo cambia el color base del gradiente. |

## ⚠️ Dependencias Clave

Para que este componente funcione en su proyecto, debe tener instaladas las siguientes librerías:

  * `svelte`
  * `svelte/store` (Para el tipo `Writable`)
  * `chroma-js` (Para el tipo `Color` y las funciones HSV)

## 🎨 Personalización de Estilos

El componente expone una variable CSS personalizable:

```css
.color-selector {
  /* Variables que puedes sobrescribir */
  width: 100%;           /* Ancho relativo al contenedor */
  height: 100%;          /* Altura relativa al contenedor */
  aspect-ratio: 1;      /* Mantiene forma cuadrada */
  border-radius: 1rem;  /* Radio de bordes */
}

.cursor {
  --cursor-size: 16px;
  --cursor-border: 2px;
  --cursor-scale: 1.2;
}
```

**Nota**: Los estilos de `outline` en `:focus` están comentados por defecto. Descoméntalos para mejorar la accesibilidad visual.

## 💡 Limitaciones y Consideraciones

| Aspecto | Detalle |
| :--- | :--- |
| **Sin Soporte de Teclado** | A diferencia de los sliders HSV, el `SquarePicker` **no implementa navegación por teclado** (flechas). Solo funciona con puntero/touch. |
| **Accesibilidad Limitada** | El `aria-valuenow` solo reporta la saturación (X), no el brillo (Y). Para mejorar la accesibilidad, considera agregar controles de teclado. |
| **Inicialización Automática** | El componente reinicializa el color al montar o cuando cambia `hue`, lo que puede sobrescribir valores existentes. |

##### **Estas limitaciones pueden ser mejoradas en futuras versiones.**
