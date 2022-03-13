<script lang="ts">
    import { Checkbox } from 'carbon-components-svelte';
    export let title;
    export let checked;
</script>

<Checkbox bind:checked labelText={title} />
