# Pigmenta

[![Svelte](https://img.shields.io/badge/Svelte-5+-ff3e00.svg?logo=svelte)](https://svelte.dev/)
[![Vite](https://img.shields.io/badge/Vite-4+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn-svelte](https://img.shields.io/badge/shadcn-svelte-000000.svg)](https://www.shadcn-svelte.com/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/SrAlexis16/KuantumDashboard/releases)

> Herramienta de selección y gestión de color con múltiples formatos y paletas dinámicas

## Historia del Proyecto

Pigmenta comenzó como un experimento en **React + Vite** para crear un color picker simple. Sin embargo, a medida que crecía, los problemas de performance se hacían evidentes: conversiones de color en cada render, re-renders innecesarios y una gestión de estado cada vez más compleja con múltiples `useState` dispersos.

La decisión de **reescribir desde cero en Svelte** surgió de la necesidad de:

- Eliminar la complejidad de hooks y efectos secundarios
- Aprovechar la reactividad nativa para actualizaciones en tiempo real
- Reducir el código y mejorar la mantenibilidad
- Aprender un paradigma diferente y más eficiente

**Este proyecto representa un caso de estudio de migración React → Svelte** y cómo elegir el stack correcto mejora tanto el código como la experiencia del usuario.

## Propósito del Proyecto

Pigmenta es una herramienta profesional de color que combina múltiples métodos de selección con una arquitectura modular escalable. El proyecto sirve como:

- **Color Picker Avanzado** con controles precisos y múltiples formatos
- **Gestión de Paletas** para guardar y organizar combinaciones
- **Caso de estudio** de arquitectura moderna con Svelte 5
- **Herramienta de diseño** para diseñadores y desarrolladores

## V1.0.0 de Pigmenta

### Módulos de Color (Reutilizables para proximamente una libreria)
- **Square Picker**: Selector 2D para ajustes rápidos de saturación y brillo
- **Brightness Slider**: Control preciso de luminosidad
- **Saturation Slider**: Ajuste de intensidad del color
- **Hue Slider**: Selección del matiz en espectro completo
- **Color Swatch**: Paletas guardadas y gestión de favoritos
- **InputHex**: Entrada directa de valores hexadecimales con validación

## Principales Características

-  **Selección de color interactiva** con vista previa en tiempo real
-  **Paletas dinámicas** para explorar y guardar combinaciones (WIP)
-  **Formatos múltiples** (HEX, RGBA, HSL, CIELAB, CMYK, OKLCH) listos para copiar
-  **Rendimiento optimizado** gracias a la reactividad nativa de Svelte
-  **Arquitectura modular** con componentes desacoplados y reutilizables

### Arquitectura

```
src/
├── lib/
│   ├── components/
│   │   ├── modules/          # Módulos de funcionalidad completa
│   │   │   ├── BrightnessSlider/
│   │   │   ├── ColorSwatch/
│   │   │   ├── HueSlider/
│   │   │   ├── InputHex/
│   │   │   ├── SaturationSlider/
│   │   │   └── SquarePicker/
│   │   └── ui/               # Componentes UI base (shadcn-svelte)
│   ├── store/                # Estado global (stores de Svelte)
│   └── views/                # Vistas compuestas
│       └── developer/        # Herramientas de desarrollo
├── assets/                   # Recursos estáticos
└── main.ts                   # Punto de entrada
```

### Principios de Diseño

**Modularidad**: Cada componente es independiente y reutilizable

**Reactividad**: Aprovecha el sistema reactivo nativo de Svelte 5

**Type Safety**: TypeScript para todo el codebase

**Componentización**: Separación clara entre lógica, presentación y estado

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SrAlexis16/KuantumDashboard.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Aprendizajes Clave

Este proyecto explora:

- **React → Svelte Migration**: Lecciones aprendidas en el proceso de refactorización
- **Svelte 5 Runes**: Sistema reactivo de nueva generación vs hooks de React
- **Performance**: Comparación de renders y optimización entre frameworks
- **Arquitectura modular**: Componentes desacoplados y reutilizables
- **Gestión de estado**: Stores vs useState/useContext
- **Type Safety**: TypeScript en componentes Svelte
- **Design Systems**: Construcción de sistema de diseño coherente y documentacion redactada correctamente

## Roadmap

- [ ] Exportación de paletas (JSON, CSS, SCSS)
- [ ] Historial de colores seleccionados
- [ ] Generador de gradientes
- [ ] Accesibilidad: validador de contraste WCAG

## Recursos
- Boceto de la primera distribución:
![Captura de pantalla](./docs/assets/PrematureSketch.png)


- Decisión final de layout:
![Captura de pantalla](./docs/assets/FinalSketch.png)
> Decisión final: se eligió este layout por limitaciones técnicas en breakpoints y para priorizar un diseño responsive más coherente.

-----
**Pigmenta V1.0.0** - Primera versión estable | Migrado exitosamente de React a Svelte

**/README.md v2.0.0**