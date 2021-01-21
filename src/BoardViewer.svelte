<script context=module>
    export const PPM = 3;
</script>

<script>
    import type { BoardDefinition } from './BoardDefinition';

    export let board:BoardDefinition;
    export let name:string;
    export let selected:boolean = false;
</script>

<div class=window class:selected>
    <div class=header>
        {name}
    </div>
    <div class=container class:selected style="width: {board.Width * PPM}px; height: {board.Height * PPM}px;">
        {#each board.Devices as device}
            <div class=device style="left: {device.X * PPM}px; top: {device.Y * PPM}px;">
                <svelte:component this={device.GetViewer()} definition={device}/>
            </div>
        {/each}
    </div>
</div>

<style>
    @import './variables.less';

    .window {
        border: @line-width solid var(--gray-9);
        flex-direction: column;
        height: min-content;

        &.selected {
            box-shadow: 2px 4px var(--gray-9);
        }
    }

    .header {
        border-bottom: @line-width solid var(--gray-9);
        padding: 0.25em;

        .selected & {
            background-color: var(--blue-4);
        }
    }

    .container {
        position: relative;
    }

    .device {
        position: absolute;
    }
</style>