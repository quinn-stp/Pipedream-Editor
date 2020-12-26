<script>
    import type { KeyModel } from './LayoutEditor.svelte';
    import Key from './Key.svelte';

    export let keys:KeyModel[];
    export let layer:string;

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
        <rect x=0 y=0 width=100% height=100% fill="url(#grid-horizontal)"/>
        <rect x=0 y=0 width=100% height=100% fill="url(#grid-vertical)"/>
    </svg>
</div>

<style>
    .grid-line {
        stroke: var(--gray-2);
        fill: var(--gray-2);
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