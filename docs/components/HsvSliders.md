# HSV Sliders - Documentación Técnica

Esta documentación cubre tres componentes de sliders interactivos que trabajan en conjunto para controlar valores HSV (Hue, Saturation, Value) de un color.

---

## HueSlider

### Basic Usage

El componente `HueSlider` controla el **matiz (Hue)** del color en un rango de 0-360 grados.

```svelte
<script>
    import { currentColor } from '$lib/store/mainColorStore'; 
    import { HueSlider } from '$lib/components/modules/index';
</script>

<div class="p-4">
    <HueSlider colorStore={currentColor} />
</div>
```

### Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |

### API y Comportamiento

#### 1. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Sincronización Bidireccional** | El componente sincroniza automáticamente con el *Store* usando `$:` reactive statements y gestiona el estado `isDragging` para evitar conflictos. |
| **Prevención de Sobrescritura** | Usa la bandera `isInternalUpdate` con timeout de 50ms para distinguir entre actualizaciones internas y externas, previniendo ciclos infinitos. |
| **Preservación de Valores** | Al actualizar el Hue, **preserva automáticamente** los valores actuales de Saturación y Brillo del color, extrayéndolos con `$colorStore.hsv()`. |
| **Detección de Cambios Externos** | Solo sincroniza con cambios externos si: no está arrastrando (`!isDragging`), no es actualización interna (`!isInternalUpdate`), y la diferencia de Hue es mayor a 0.5 grados. |
| **RequestAnimationFrame** | Usa `requestAnimationFrame` para optimizar el rendimiento durante el arrastre, cancelando frames anteriores antes de procesar nuevos. |

#### 2. Interacción del Usuario

| Método | Descripción |
| :--- | :--- |
| **Pointer Events** | Soporta `pointerdown`, `pointermove`, y `pointerup` con captura de puntero para seguimiento preciso incluso fuera del elemento. |
| **Soporte de Teclado** | Las teclas **ArrowLeft** (↓ 1°) y **ArrowRight** (↑ 1°) ajustan el Hue con navegación circular (0° ↔ 360°). |
| **Accesibilidad** | Implementa `role="slider"`, `aria-label="Hue"`, `aria-valuemin/max/now` y `tabindex="0"` para navegación por teclado. |

#### 3. Feedback Visual

| Estado | Efecto Visual |
| :--- | :--- |
| **Gradiente del Slider** | Muestra el espectro completo de colores (`red → yellow → green → cyan → blue → magenta → red`). |
| **Handle Posicionado** | Se posiciona dinámicamente en base al Hue actual: `left: {(hue / 360) * 100}%`. |
| **Efecto de Arrastre** | El handle escala 15% (`scale(1.15)`) cuando `isDragging` es `true`, con transición suave de 0.1s. |

---

## SaturationSlider

### Basic Usage

El componente `SaturationSlider` controla la **saturación** del color en un rango de 0-1 (0% a 100%).

```svelte
<script>
    import { currentColor } from '$lib/store/mainColorStore'; 
    import { SaturationSlider } from '$lib/components/modules/index';
    
    let currentHue = 0;
    let currentValue = 1;
    
    // Actualizar valores desde el store
    $: if ($currentColor) {
        const hsvArray = $currentColor.hsv();
        currentHue = hsvArray[0] || 0;
        currentValue = hsvArray[2] || 1;
    }
</script>

<div class="p-4">
    <SaturationSlider 
        colorStore={currentColor}
        hue={currentHue}
        value={currentValue}
    />
</div>
```

### Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |
| `hue` | `number` | Sí | `0` | Valor del matiz actual (0-360°) necesario para generar el gradiente correcto. |
| `value` | `number` | Sí | `1` | Valor del brillo actual (0-1) necesario para generar el gradiente correcto. |

### API y Comportamiento

#### 1. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Sincronización Directa** | Actualiza inmediatamente el *Store* con `colorStore.set(chroma.hsv(hue, s, value))` al detectar cambios. |
| **Dependencia de Props** | Requiere que `hue` y `value` estén sincronizados externamente para generar gradientes precisos. |
| **Inicialización Reactiva** | Se reinicializa automáticamente cuando cambian las props `hue` o `value` usando `$: if (hue !== undefined && value !== undefined)`. |
| **RequestAnimationFrame** | Optimiza el rendimiento durante interacciones continuas cancelando frames anteriores. |

#### 2. Gradiente Dinámico

| Característica | Detalle |
| :--- | :--- |
| **Gradiente Reactivo** | Genera un gradiente de **desaturado a saturado** basado en el Hue y Value actuales. |
| **Color Izquierdo** | `chroma.hsv(hue, 0, value)` - Color con saturación 0 (grisáceo). |
| **Color Derecho** | `chroma.hsv(hue, 1, value)` - Color con saturación máxima (vibrante). |
| **Propiedad CSS** | Usa CSS custom property `--gradient` para inyectar el gradiente dinámicamente. |

#### 3. Interacción del Usuario

| Método | Descripción |
| :--- | :--- |
| **Pointer Events** | Soporta arrastre con captura de puntero para seguimiento preciso. |
| **Soporte de Teclado** | Las teclas **ArrowLeft** (↓ 1%) y **ArrowRight** (↑ 1%) ajustan la saturación con límites en 0-100%. |
| **Accesibilidad** | Implementa `role="slider"`, `aria-label="Saturation"`, y valores en porcentaje (0-100) para lectores de pantalla. |

---

## BrightnessSlider

### Basic Usage

El componente `BrightnessSlider` controla el **brillo/valor (Value)** del color en un rango de 0-1 (0% a 100%).

```svelte
<script>
    import { currentColor } from '$lib/store/mainColorStore'; 
    import { BrightnessSlider } from '$lib/components/modules/index';
    
    let currentHue = 0;
    let currentSaturation = 1;
    
    // Actualizar valores desde el store
    $: if ($currentColor) {
        const hsvArray = $currentColor.hsv();
        currentHue = hsvArray[0] || 0;
        currentSaturation = hsvArray[1] || 1;
    }
</script>

<div class="p-4">
    <BrightnessSlider 
        colorStore={currentColor}
        hue={currentHue}
        saturation={currentSaturation}
    />
</div>
```

### Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |
| `hue` | `number` | Sí | `0` | Valor del matiz actual (0-360°) necesario para generar el gradiente correcto. |
| `saturation` | `number` | Sí | `1` | Valor de la saturación actual (0-1) necesario para generar el gradiente correcto. |

### API y Comportamiento

#### 1. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Sincronización Bidireccional** | El componente usa reactive statements `$:` para sincronizar automáticamente con el prop `colorStore`. |
| **Prevención de Sobrescritura** | Usa `isInternalUpdate` con timeout de 50ms para evitar ciclos de actualización durante cambios internos. |
| **Detección de Cambios Externos** | Solo actualiza desde el *Store* si: no está arrastrando (`!isDragging`), no es actualización interna (`!isInternalUpdate`), y la diferencia es mayor a 0.001. |
| **Consistencia con Props** | Depende únicamente del prop `colorStore`, haciéndolo totalmente reutilizable. |
| **RequestAnimationFrame** | Optimiza el rendimiento cancelando frames anteriores durante el arrastre. |

#### 2. Gradiente Dinámico

| Característica | Detalle |
| :--- | :--- |
| **Gradiente Reactivo** | Genera un gradiente de **negro a color completo** basado en el Hue y Saturación actuales. |
| **Color Izquierdo** | `chroma.hsv(hue, saturation, 0)` - Negro total (valor 0). |
| **Color Derecho** | `chroma.hsv(hue, saturation, 1)` - Color con brillo máximo. |
| **Propiedad CSS** | Usa CSS custom property `--gradient` para inyectar el gradiente dinámicamente. |

#### 3. Interacción del Usuario

| Método | Descripción |
| :--- | :--- |
| **Pointer Events** | Soporta arrastre con captura de puntero para seguimiento preciso. |
| **Soporte de Teclado** | Las teclas **ArrowLeft** (↓ 1%) y **ArrowRight** (↑ 1%) ajustan el brillo con límites en 0-100%. |
| **Accesibilidad** | Implementa `role="slider"`, `aria-label="Brightness"`, y valores en porcentaje (0-100) para lectores de pantalla. |

---

## Uso Integrado de los Tres Sliders

### Ejemplo Completo

```svelte
<script lang="ts">
  import { currentColor } from "$lib/store/mainColorStore";
  import { HueSlider, SaturationSlider, BrightnessSlider } from "$lib/components/modules/index";

  // Variables para props compartidas
  let currentHue: number = 0;
  let currentSaturation: number = 1;
  let currentValue: number = 1;

  // Sincronizar valores desde el store
  $: if ($currentColor) {
    const hsvArray = $currentColor.hsv();
    const hueValue = hsvArray[0] || 0;
    currentSaturation = hsvArray[1] || 1;
    currentValue = hsvArray[2] || 1;
    
    if (!isNaN(hueValue)) {
      currentHue = hueValue;
    }
  }
</script>

<div class="slider-container">
  <HueSlider colorStore={currentColor} />
  
  <SaturationSlider 
    colorStore={currentColor}
    hue={currentHue}
    value={currentValue}
  />
  
  <BrightnessSlider 
    colorStore={currentColor}
    hue={currentHue}
    saturation={currentSaturation}
  />
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
</style>
```

### Flujo de Datos

| Paso | Descripción |
| :--- | :--- |
| **1. Cambio en Slider** | El usuario interactúa con cualquier slider (arrastra o usa teclado). |
| **2. Actualización del Store** | El slider actualiza `colorStore` con `chroma.hsv(h, s, v)`. |
| **3. Reactividad Svelte** | La declaración `$: if ($currentColor)` detecta el cambio y actualiza `currentHue`, `currentSaturation`, `currentValue`. |
| **4. Props Reactivas** | Los otros sliders reciben las nuevas props y regeneran sus gradientes. |
| **5. Sincronización Visual** | Todos los handles se reposicionan para reflejar el nuevo color. |

---

## ⚠️ Dependencias Clave

Para que estos componentes funcionen en su proyecto, debe tener instaladas las siguientes librerías:

  * `svelte`
  * `svelte/store` (Para el tipo `Writable`)
  * `chroma-js` (Para el tipo `Color` y las funciones HSV)

---

## 🎨 Personalización de Estilos

Todos los sliders comparten una estructura CSS similar que puede ser personalizada:

```css
/* Variables que puedes sobrescribir */
.hue-slider,
.saturation-slider,
.brightness-slider {
  --slider-height: 24px;
  --slider-radius: 12px;
  --handle-size: 20px;
  --handle-border: 3px;
}
```

**Nota**: Los estilos de `outline` en `:focus` están comentados por defecto. Descoméntalos para mejorar la accesibilidad visual.