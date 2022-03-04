<script lang="ts">
  import { Item, Meta } from '@smui/list';
  import Checkbox from '@smui/checkbox';
  import { Label } from '@smui/common';
  export let title;
  export let checked;
</script>

<Item>
  <Label>{title}</Label>
  <Meta>
    <Checkbox bind:checked />
  </Meta>
</Item>
