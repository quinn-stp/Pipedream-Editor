<script>
    import type { DeviceModel, KeyModel, LayerModel } from './LayoutEditor.svelte';
    import Key from './Key.svelte';

    export let device:DeviceModel;
    export let layers:readonly LayerModel[];
    export let currentLayer:LayerModel;
    export let selectedKey:KeyModel;

    function handleKeyClick(key:KeyModel) {
        selectedKey = key;
    }
</script>

<div class="key-container">
    {#each device.keys as key (key.id)}
        <Key
            on:click={() => handleKeyClick(key)}
            bind:x={key.x}
            bind:y={key.y}
            width={key.width}
            height={key.height}
            selected={key == selectedKey}
            label={currentLayer.bindings[device.id][key.id].symbol}
        />
    {/each}
    <svg class="grid-svg">
        <pattern id="grid" width=55 height=55 patternUnits=userSpaceOnUse>
            <line x1=0 y1=0 x2=55 y2=0 class=grid-line/>
            <line x1=0 y1=0 x2=0 y2=55 class=grid-line/>
            <line x1={55/4} y1=0 x2={55/4} y2=55 class=grid-line-minor/>
            <line x1={55/4*2} y1=0 x2={55/4*2} y2=55 class=grid-line-minor/>
            <line x1={55/4*3} y1=0 x2={55/4*3} y2=55 class=grid-line-minor/>
            <line x1=0 y1={55/4} x2=55 y2={55/4} class=grid-line-minor/>
            <line x1=0 y1={55/4*2} x2=55 y2={55/4*2} class=grid-line-minor/>
            <line x1=0 y1={55/4*3} x2=55 y2={55/4*3} class=grid-line-minor/>
        </pattern>

        <rect x=0 y=0 width=100% height=100% fill="url(#grid)"/>
    </svg>
</div>

<style>
    .grid-line-minor {
        stroke: var(--gray-1);
        stroke-width: 1px;
    }
    .grid-line {
        stroke: var(--gray-3);
        stroke-width: 1px;
    }

    .grid-svg {
        width: 100%;
        height: 100%;
    }

    .key-container {
        flex-direction: row;
        flex-grow: 1;
        position: relative;
    }
</style>