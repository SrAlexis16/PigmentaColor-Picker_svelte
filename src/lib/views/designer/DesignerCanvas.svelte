<script lang="ts">
  import { currentColor } from './designerStore';
  import { WheelPicker, BrightnessSlider } from '$lib/components/modules/index';
  
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
  <h1 class="font-outfit font-semibold text-3xl mb-4 text-center">WheelPicker</h1>
  <div class="flex flex-col justify-center items-center flex-1 space-y-4 lg:m-3">
    <div class="flex h-60 md:h-90 sm:w-60 md:w-90 lg:w-full p-3 justify-center items-center">
      <WheelPicker colorStore={currentColor} value={currentValue} />
    </div>
    
    <div class="flex flex-col items-center space-y-3 w-full max-w-md font-rubik">
      <label class="w-full space-y-1">
        <span class="block text-sm font-medium text-gray-700">Brightness</span>
        <span class="block text-xs text-gray-500">Ajusta la luminosidad general</span>
        <BrightnessSlider colorStore={currentColor} hue={currentHue} saturation={currentSaturation}/>
      </label>
    </div>
  </div>
</div>