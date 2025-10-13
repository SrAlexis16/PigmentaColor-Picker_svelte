## Basic Usage

El componente requiere que le pases un **Writable Store** que contenga el objeto de color global (`colorStore`).

```svelte
<script>
    // 1. Importa tu Store y el componente (ejemplo)
    import { currentColor } from '$lib/stores/mainColorStore'; 
    import PigmentaInputHex from '$lib/components/modules/InputHex/InputHex.svelte';
</script>

<div class="p-4">
    <PigmentaInputHex 
        colorStore={currentColor} 
    />
</div>
```

## Props

El componente acepta las siguientes propiedades:

| Propiedad | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `colorStore` | `Writable<Color>` | Sí | N/A | El **Store de Svelte** que contiene el objeto de color activo (`chroma-js`). El componente debe poder **escribir** en él. |


## API y Comportamiento

### 1. Sincronización Avanzada

| Característica | Detalle |
| :--- | :--- |
| **Sincronización Bidireccional** | El componente usa `on:input`, `on:blur` y el estado local `isUserEditing` para gestionar la sincronización. |
| **Prevención de Sobrescritura** | El *Store* solo se actualiza si el valor es válido (`on:input`). La sincronización inversa (*Store* > *Input*) se bloquea (`!isUserEditing`) para evitar que el *Store* sobrescriba la variable local (`inputHexValue`) mientras el usuario está escribiendo. |
| **Validación en Tiempo Real** | Usa `chroma.valid()` para validar cada entrada y actualizar el estado de error (`isInvalid`). |
| **Saneamiento** | Limpia automáticamente el valor de entrada (`.replace(/^#/, '').trim()`) para asegurar que `chroma-js` reciba un código limpio. |
| **Fallback en `on:blur`** | Si el usuario sale del campo con un valor inválido o vacío, el campo **retoma automáticamente** el último valor Hex válido del *Store* (`$colorStore.hex()`). |

### 2. Feedback Visual

| Variable de Control | Clase Condicional |
| :--- | :--- |
| `borderValid` (`focus:border-blue-400`) | Borde visible cuando el valor es válido. |
| `borderInvalid` (`focus:border-red-400`) | Borde rojo visible cuando el valor es inválido o incompleto. |

##### **Estas pueden ser actualizadas en cualquier momento.**
## ⚠️ Dependencias Clave

Para que este componente funcione en su proyecto, debe tener instaladas las siguientes librerías:

  * `svelte`
  * `svelte/store` (Para el tipo `Writable`)
  * `chroma-js` (Para el tipo `Color` y las funciones de validación).
