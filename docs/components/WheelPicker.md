# WheelPicker - Documentación Técnica

## Basic Usage

El componente `WheelPicker` es un selector de color **circular** que permite controlar simultáneamente el **Matiz (Hue)** y la **Saturación (Saturation)**. Es ideal para la selección primaria de color. El **Brillo/Valor (Value)** se maneja externamente mediante un *prop*.

```svelte
<script>
  import { currentColor } from '$lib/store/mainColorStore'; 
  import { WheelPicker } from '$lib/components/modules/index';

  let currentValue = 1;

  // Extraer el valor (brightness) desde el store reactivo
  $: if ($currentColor) {
    const hsvArray = $currentColor.hsv();
    currentValue = hsvArray[2] || 1;
  }
</script>

<div class="p-4">
  <WheelPicker 
    colorStore={currentColor}
    value={currentValue}
  />
</div>

````

-----

## Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |
| `value` | `number` | No | `1` | El valor del brillo/luminosidad (0-1). Es un control **externo** que afecta el color final y el oscurecimiento visual del selector. |
| `size` | `string \| number` | No | `'100%'` | El tamaño del componente (e.g., `'200px'` o `200`). Debe ser cuadrado. |

-----

## API y Comportamiento

### 1\. Sistema de Coordenadas Polares

| Característica | Detalle |
| :--- | :--- |
| **Control Angular** | El **Matiz (Hue)** se mapea al ángulo $\theta$ (0-360°), comenzando en la derecha y creciendo antihorario. |
| **Control Radial** | La **Saturación (Saturation)** se mapea al radio $r$ (0-1). Centro = desaturado (0), Borde = saturado (1). |
| **Valor/Brillo (V)** | Es un *prop* externo (`value`) que solo afecta el color final y se usa para aplicar una capa de oscurecimiento al gradiente. |
| **Cursor Position** | La posición del cursor se calcula a partir de `hue` y `saturation` usando funciones trigonométricas (seno y coseno) para coordenadas cartesianas (`cursorX`, `cursorY`). |
| **Actualización Directa** | Actualiza el *Store* con `colorStore.set(chroma.hsv(hue, saturation, value))`. |

### 2\. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Inicialización** | Al montarse (`onMount`), sincroniza `hue` y `saturation` del `$colorStore`. |
| **Sincronización Externa** | El bloque reactivo `$: if ($colorStore && initialized)` actualiza la posición del cursor si el color cambia externamente (e.g., por otro slider), pero **solo si no se está arrastrando**. |
| **Sincronización de Brillo** | El bloque `$: if (initialized && !isDragging)` asegura que, si el prop `value` (brillo) cambia, el color se actualice en el *Store* y el gradiente de oscurecimiento se ajuste. |
| **RequestAnimationFrame** | Optimiza el rendimiento durante el arrastre (`pointermove`) cancelando y solicitando frames para una actualización fluida del color. |

### 3\. Interacción y Navegación

| Interacción | Detalle |
| :--- | :--- |
| **Pointer Events** | Soporta `pointerdown`, `pointermove`, y `pointerup` con captura de puntero (`setPointerCapture`) para un seguimiento preciso. |
| **Arrastre Continuo** | Los eventos de puntero calculan la posición polar (`r`, $\theta$) basada en el centro del componente para obtener `saturation` y `hue`. |
| **Teclado (Accesibilidad)** | Soporte completo de teclado: |
| | - **$\leftarrow$ / $\rightarrow$**: Controlan el **Hue** (Ángulo). |
| | - **$\uparrow$ / $\downarrow$**: Controlan la **Saturación** (Radio). |
| | - **Shift**: Incrementa el paso de cambio (e.g., `ANGLE_STEP_LARGE` = 15°). |
| **Feedback Visual** | El cursor se agranda ligeramente (`scale(1.25)`) cuando `isDragging` es `true`. |

### 4\. Gradiente Visual

| Capa | CSS | Propósito |
| :--- | :--- | :--- |
| **Capa Base** | `.wheel-gradient` (Conic Gradient) | Genera el espectro de color completo (0-360°) con saturación al 100%. Usa `from 90deg` para corregir la orientación. |
| **Capa de Saturación** | `.saturation-overlay` (Radial Gradient) | Superposición de **blanco a transparente** desde el centro. Esto hace que el centro sea blanco (Saturación 0) y el borde el color base (Saturación 1). |
| **Capa de Brillo** | `.brightness-overlay` | Una superposición de color negro con opacidad variable (`rgba(0, 0, 0, {1 - value})`). Controla la oscuridad general, reflejando el prop `value` externo. |

-----

## Uso Integrado con Sliders HSV

El `WheelPicker` funciona en conjunto con un slider externo (típicamente `BrightnessSlider`) que maneja el componente `value` (Brillo) del color HSV.

### Flujo de Datos

| Paso | Fuente de Cambio | Acción |
| :--- | :--- | :--- |
| **1. Usuario Arrastra en WheelPicker** | `pointermove` | Se calculan `hue` y `saturation` a partir del ángulo/radio. Se actualiza el store con `chroma.hsv(hue, saturation, value)`. |
| **2. Usuario Arrastra en BrightnessSlider** | Externo | El prop `value` cambia. El bloque reactivo en `WheelPicker` detecta el cambio de `value` y llama a `updateColor()`. |
| **3. Actualización de Brillo** | `updateColor()` | El `WheelPicker` regenera el color completo en el store con el nuevo `value` *y* actualiza la capa `.brightness-overlay` para reflejar visualmente la oscuridad. |
| **4. Cambio Externo Completo** | Otro componente | Si el `$colorStore` cambia por una fuente externa, `syncFromColorStore()` actualiza `hue` y `saturation` internos y reposiciona el cursor, siempre y cuando el usuario no esté arrastrando activamente. |

-----

## ⚠️ Dependencias Clave

Para que este componente funcione en su proyecto, debe tener instaladas las siguientes librerías:

  * `svelte`
  * `svelte/store` (Para el tipo `Writable`)
  * `chroma-js` (Para el tipo `Color` y las funciones HSV)

-----

## 🎨 Personalización de Estilos

El componente utiliza estilos internos y no expone variables CSS para la personalización de la rueda, pero el tamaño es controlable a través del prop `size`.

```css
.wheel-picker {
	/* ... */
	border-radius: 50%; /* Es esencialmente un círculo */
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Sombra predeterminada */
}

.cursor {
	width: 20px;
	height: 20px;
	border: 3px solid white;
}
```

-----

# Nota Técnica: Rotación en la rueda de color

El componente `WheelPicker` utiliza un sistema de coordenadas polares que requiere alinear el ángulo calculado en JavaScript (`Math.atan2`) con el ángulo de visualización del gradiente cónico en CSS (`conic-gradient`).

-----

## Cálculo angular en JavaScript

```ts
angleDeg = ((angleRad * 180 / Math.PI) + 360) % 360;
```

  - `Math.atan2(dy, dx)` devuelve un ángulo en radianes donde:
      - `0 rad` apunta hacia el eje **X positivo** (la derecha, “3 en punto”).
      - El ángulo crece en sentido **antihorario**.
  - La conversión a grados normaliza el valor a `[0, 360)`.

Resultado: **Hue 0° = derecha (este)**, aumentando en sentido antihorario.

-----

## Orientación angular en CSS `conic-gradient`

```css
background: conic-gradient(
  from 0deg,
  hsl(0, 100%, 50%),
  /* ... */
);
```

  - En CSS, `0deg` en un `conic-gradient` apunta hacia **arriba (12 en punto)**.
  - Los ángulos crecen en sentido **horario**.

Resultado: **Hue 0° = arriba (norte)**, aumentando en sentido horario.

-----

## El desajuste

  - **JS (atan2)**: 0° = derecha, antihorario.  
  - **CSS (conic-gradient)**: 0° = arriba, horario.  

Esto genera una **rotación de 90° y un cambio de sentido** entre el ángulo calculado y el ángulo visual.

-----

## Corrección

Para alinear ambos sistemas (logrando que el `cursorX` y el ángulo visual coincidan), se aplica un offset al CSS:

```css
background: conic-gradient(
  from 90deg, /* corrige la rotación */
  hsl(0, 100%, 50%) 0deg,
	/* ... resto del gradiente ... */
  hsl(360, 100%, 50%) 360deg
);
```

  - `from 90deg` rota el gradiente para que el rojo (0°) quede alineado con el eje X positivo (la derecha).
  - Ahora el ángulo calculado en JS y el ángulo visual en CSS coinciden.