<script lang="ts">
  import { currentColor } from './developerStore';
  import { SquarePicker, HueSlider, SaturationSlider, BrightnessSlider } from '$lib/components/modules/index';
  
  let currentHue: number = 0;
  let currentSaturation: number = 1;
  let currentValue: number = 1;
  
  $: if ($currentColor) {
    const hsvArray = $currentColor.hsv();
    currentSaturation = hsvArray[1] || 1;
    const hueValue = hsvArray[0] || 0; 
    currentValue = hsvArray[2] || 1;
    if (!isNaN(hueValue)) {
      currentHue = hueValue;
    }
  }
</script>

<div class="h-full flex flex-col">
  <h1 class="font-outfit font-semibold text-3xl mb-4 text-center">SquarePicker</h1>
  <div class="flex flex-col justify-center items-center flex-1 space-y-4 lg:m-3">
    <div class="flex h-60 md:h-90 sm:w-60 md:w-90 lg:w-full p-3 justify-center items-center">
      <SquarePicker colorStore={currentColor} hue={currentHue} />
    </div>
    
    <div class="flex flex-col items-center space-y-3 w-full max-w-md font-rubik">
      <label class="w-full space-y-1">
        <span class="block text-sm font-medium text-gray-700">Hue</span>
        <span class="block text-xs text-gray-500">Ajusta el matiz del color</span>
        <HueSlider colorStore={currentColor}/>
      </label>

      <label class="w-full space-y-1">
        <span class="block text-sm font-medium text-gray-700">Saturation</span>
        <span class="block text-xs text-gray-500">Controla la intensidad del color</span>
        <SaturationSlider colorStore={currentColor} hue={currentHue} value={currentValue}/>
      </label>

      <label class="w-full space-y-1">
        <span class="block text-sm font-medium text-gray-700">Brightness</span>
        <span class="block text-xs text-gray-500">Ajusta la luminosidad general</span>
        <BrightnessSlider colorStore={currentColor} hue={currentHue} saturation={currentSaturation}/>
      </label>
    </div>
  </div>
</div>