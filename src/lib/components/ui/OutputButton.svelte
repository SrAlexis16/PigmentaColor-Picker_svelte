<script lang="ts">
  export let value: string;
  import { Check, Copy } from "@lucide/svelte"
  
  let copied = false;
  let timeoutId: number;

  function copy() {
    navigator.clipboard.writeText(value);
    copied = true;
    
    if (timeoutId) clearTimeout(timeoutId);
    
    // Timeout
    timeoutId = setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<button 
  class="relative bg-white rounded-2xl shadow-md border border-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-200 active:scale-[0.98] transition-all duration-150 text-sm max-w-55"
  class:copied
  on:click={copy}
>
  <span class="flex items-center justify-between gap-2">
    {value}
    
    {#if copied}
      <Check size={14} color="#3e9c1c"/>
    {:else}
      <Copy size={14} strokeWidth={1.5}/>
    {/if}
  </span>
</button>