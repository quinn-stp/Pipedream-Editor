<script context=module>
    export interface KeyModel {
        id:number;
        x:number;
        y:number;
        width:number;
        height:number;
        labels: {[key:number]:string}
        selected:boolean;
    }
</script>

<script>
    import EditableList from './Components/EditableList.svelte';
    import FormInput from './Components/FormInput.svelte';
    import LayoutViewer from './LayoutViewer.svelte';
    import type { ListItem } from './Components/EditableList.svelte';

    export let keys:KeyModel[] = [];
    $: selected = keys.filter(k => k.selected)[0];

    let layers:ListItem[] = [
        {
            id: 0,
            name: 'Main'
        }
    ];
    let selectedLayer:ListItem;

    let nextId = 99;

    function handleAdd() {
        let x = selected ? selected.x + selected.width : 0;
        let y = selected?.y ?? 0;

        let key:KeyModel = {
            id: nextId++,
            labels: {},
            x,
            y,
            width: 1,
            height: 1,
            selected: true
        };

        keys.forEach(k => k.selected = false);

        keys = [ ...keys, key ];
    }

    function handleRemove(key:KeyModel) {
        keys = keys.filter(k => k != key);
    }
</script>

<div class=column>
    <div class=layout-container>
        <LayoutViewer bind:keys={keys} layer={selectedLayer?.id}/>

        <div class="row layout-button-row">
            <div>
                <div class=row-group>
                    <button class=blue on:click={handleAdd}>
                        Add
                    </button>
                    <button class=blue>
                        <svg width=12 height=6>
                            <polygon points="0,0 12,0 6,6"/>
                        </svg>
                    </button>
                </div>
                <div class="dropdown">
                    <button class=dropdown-item>
                        ← Add Left
                    </button>
                    <button class=dropdown-item>
                        → Add Right
                    </button>
                    <button class=dropdown-item>
                        ↑ Add Up
                    </button>
                    <button class=dropdown-item>
                        ↓ Add Down
                    </button>
                </div>
            </div>
            <button class=red on:click={() => handleRemove(selected)} disabled={!selected}>
                Remove
            </button>
        </div>
    </div>

    <div class="row controls-container">
        <EditableList bind:items={layers} bind:selected={selectedLayer} title="Layers"/>
        <div class="column grow control-box">
            Key Settings
            {#if selected}
                <div class=row>
                    <FormInput type=number label="X" bind:value={selected.x}/>
                    <FormInput type=number label="Y" bind:value={selected.y}/>
                </div>
                <div class=row>
                    <FormInput type=number label="Width" bind:value={selected.width}/>
                    <FormInput type=number label="Height" bind:value={selected.height}/>
                </div>
            {/if}
        </div>
        <div class="column grow control-box">
            Layer Settings
            {#if selected}
                <FormInput label="Symbol" bind:value={selected.labels[selectedLayer.id]}/>
            {/if}
        </div>
    </div>
</div>

<style>
    @import (reference) './style.less';

    @radius: 5px;
    .dropdown:extend(.col-group all) {
        margin-top: 5px;
        position: absolute;
        top: 2em;
        left: 0;
        width: 8em;
        visibility: collapse;
    }

    .dropdown-item {
        background-color: var(--gray-2);
        &:hover {
            background-color: var(--gray-3);
        }
    }

    polygon {
        stroke: var(--gray-9);
        stroke-width: 1px;
        fill: var(--gray-9);
    }

    .layout-container {
        position: relative;
        border: 1px solid var(--gray-5);
        border-radius: @radius;
        flex-grow: 1;
        flex-direction: column;
    }

    .layout-button-row {
        flex-direction: row;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .control-box {
        background-color: var(--gray-1);
        color: var(--gray-9);
        padding: 10px;
        border-radius: @radius;
        align-items: stretch;
    }

    .controls-container {
        height: 15em;
    }
</style>