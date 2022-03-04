<script lang="ts">
  import { Label } from '@smui/common';
  import { Item, SecondaryText } from '@smui/list';
  import Slider from '@smui/slider';
  export let title;
  export let value;
  export let labelId;
  export let min;
  export let max;
  export let step;
</script>

<Item style="height:auto; display:flex; flex-direction: column;align-items: flex-start;">
  <Label>{title}</Label>
  <Slider bind:value {min} {max} {step} style="min-width: 100%; margin: 0px;" />
  <SecondaryText id={labelId} />
</Item>
