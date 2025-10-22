<script lang="ts">
  import { currentColor, accessibilityData } from './designerStore';
  import { ColorSwatch, InputHex } from '$lib/components/modules/index';

  function getWCAGLevel(contrast: typeof $accessibilityData.contrastWhite): string {
    if (contrast.wcagAAA) return 'AAA';
    if (contrast.wcagAAALarge) return 'AAA (Large)';
    if (contrast.wcagAA) return 'AA';
    if (contrast.wcagAALarge) return 'AA (Large)';
    return 'No cumple';
  }

  function getQualityColor(quality: string): string {
    switch(quality) {
      case 'Excelente': return 'text-green-600';
      case 'Bueno': return 'text-green-500';
      case 'Suficiente': return 'text-yellow-600';
      case 'Malo': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  function getWCAGColor(level: string): string {
    if (level.includes('AAA')) return 'text-green-600';
    if (level.includes('AA')) return 'text-green-500';
    return 'text-red-600';
  }
</script>

<div class="h-full max-w-4xl flex flex-col justify-center items-center px-4">
  <h1 class="font-outfit font-semibold text-3xl mb-4 text-center">Designer Tools</h1>

  <div class="mb-6 flex flex-col items-center">
    <ColorSwatch className="h-32 w-32 rounded" colorStore={currentColor} />
    <span class="mt-2 text-xs text-gray-500 font-rubik">Haz click para ver el nombre</span>
    <InputHex colorStore={currentColor} />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl font-rubik mb-0">
    <div class="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
      <div class="flex items-center justify-center mb-3 border border-gray-200 shadow-sm" style="background-color: {$accessibilityData.contrastWhite.backgroundColor}; height: 80px; border-radius: 8px;">
        <div class="text-2xl font-semibold" style="color: {$accessibilityData.contrastWhite.textColor}">Aa</div>
      </div>
      <h3 class="font-semibold text-sm mb-2">Contraste con Blanco</h3>
      <div class="text-xs space-y-1">
        <p><span class="font-medium">Ratio:</span> {$accessibilityData.contrastWhite.ratioText}</p>
        <p><span class="font-medium">Calidad:</span> <span class="{getQualityColor($accessibilityData.contrastWhite.quality)} font-semibold">{$accessibilityData.contrastWhite.quality}</span></p>
        <p><span class="font-medium">WCAG:</span></p>
        <span class="{getWCAGColor(getWCAGLevel($accessibilityData.contrastWhite))} font-semibold">{getWCAGLevel($accessibilityData.contrastWhite)}</span>
      </div>
    </div>

    <div class="border border-gray-300 rounded-lg p-3 bg-white shadow-sm min-h-60">
      <div class="flex items-center justify-center mb-3 border border-gray-200 shadow-sm" style="background-color: {$accessibilityData.contrastBlack.backgroundColor}; height: 80px; border-radius: 8px;">
        <div class="text-2xl font-semibold" style="color: {$accessibilityData.contrastBlack.textColor}">Aa</div>
      </div>
      <h3 class="font-semibold text-sm mb-2">Contraste con Negro</h3>
      <div class="text-xs space-y-1">
        <p><span class="font-medium">Ratio:</span> {$accessibilityData.contrastBlack.ratioText}</p>
        <p><span class="font-medium">Calidad:</span> <span class="{getQualityColor($accessibilityData.contrastBlack.quality)} font-semibold">{$accessibilityData.contrastBlack.quality}</span></p>
        <p><span class="font-medium">WCAG:</span> </p>
        <span class="{getWCAGColor(getWCAGLevel($accessibilityData.contrastBlack))} font-semibold">{getWCAGLevel($accessibilityData.contrastBlack)}</span>
      </div>
    </div>
  </div>
</div>