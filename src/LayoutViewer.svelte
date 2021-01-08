<script>
    import type { KeyModel } from './LayoutEditor.svelte';
    import Key from './Key.svelte';

    export let keys:KeyModel[];
    export let layer:number;

    $: selected = keys.filter(k => k.selected)[0];

    function selectKey(key:KeyModel) {
        keys.forEach(k => k.selected = false);
        key.selected = true;
        keys = keys;
    }

    function handleKeyClick(key:KeyModel) {
        return () => selectKey(key);
    }
</script>

<div class="key-container">
    {#each keys as key (key.id)}
        <Key
            on:click={handleKeyClick(key)}
            bind:x={key.x}
            bind:y={key.y}
            width={key.width}
            height={key.height}
            selected={key == selected}
            label={key.labels[layer]}
        />
    {/each}
    <svg class="grid-svg">
        <pattern id="grid-horizontal" width=100% height=55 patternUnits="userSpaceOnUse">
            <line x1=0 y1=0 x2=100% y2=0 class="grid-line"/>
        </pattern>
        <pattern id="grid-vertical" width=55 height=100% patternUnits="userSpaceOnUse">
            <line x1=0 y1=0 x2=0 y2=100% class="grid-line"/>
        </pattern>

        <pattern id="grid-minor-horizontal" width=100% height={55/4} patternUnits="userSpaceOnUse">
            <line x1=0 y1=0 x2=100% y2=0 class="grid-line-minor"/>
        </pattern>
        <pattern id="grid-minor-vertical" width={55/4} height=100% patternUnits="userSpaceOnUse">
            <line x1=0 y1=0 x2=0 y2=100% class="grid-line-minor"/>
        </pattern>

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
        <!-- <rect x=0 y=0 width=100% height=100% fill="url(#grid-horizontal)"/>
        <rect x=0 y=0 width=100% height=100% fill="url(#grid-vertical)"/>
        <rect x=0 y=0 width=100% height=100% fill="url(#grid-minor-horizontal)"/>
        <rect x=0 y=0 width=100% height=100% fill="url(#grid-minor-vertical)"/> -->
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