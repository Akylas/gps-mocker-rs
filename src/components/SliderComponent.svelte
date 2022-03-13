<script lang="ts">
    import { Slider } from 'carbon-components-svelte';
    export let title;
    export let value;
    export let min;
    export let max;
    export let step;
</script>

<Slider bind:value {min} {max} {step} labelText={title} maxLabel={Math.round(max / 1000) + 'km'} hideTextInput />
