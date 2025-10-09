<script lang="ts">
    import { currentColor } from "$lib/store/mainColorStore";
</script>

<div style="background-color: {$currentColor.hex()}" class="h-7 w-7 p-4"></div>