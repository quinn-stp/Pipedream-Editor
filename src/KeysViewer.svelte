<script context=module>
    import { PPM } from './BoardViewer.svelte';

    export const UNIT = 18 * PPM;
    export const SPACING = 19 * PPM;
</script>

<script>
    import type { KeysDefinition } from './BoardDefinition';


    export let definition:KeysDefinition;
</script>

<div class=container>
    {#each definition.Keys as key}
        <div class=key style="width: {key.Width * UNIT}px; height: {key.Height * UNIT}px; left: {key.X * SPACING + 0.5 * PPM}px; top: {key.Y * SPACING + 0.5 * PPM}px">
        </div>
    {/each}
</div>

<style>
    @import './variables.less';

    .container {
        position: relative;
    }

    .key {
        box-sizing: border-box;
        position: absolute;
        background-color: var(--gray-0);
        border-radius: @radius;
        border: @line-width solid var(--gray-9);
    }
</style>