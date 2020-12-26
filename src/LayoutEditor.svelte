<script context=module>
    export interface KeyModel {
        id:number;
        x:number;
        y:number;
        width:number;
        height:number;
        labels: {[key:string]:string}
        selected:boolean;
    }
</script>

<script lang="ts">
    import EditableList from './Components/EditableList.svelte';
import FormInput from './Components/FormInput.svelte';
import LayoutViewer from './LayoutViewer.svelte';

    export let keys:KeyModel[] = [];
    $: selected = keys.filter(k => k.selected)[0];

    let layers:string[] = [];
    let selectedLayer:string;
    let newLayer:string;

    let nextId = 99;

    function handleAddLayer() {
        layers = [...layers, newLayer];
        newLayer = '';
    }

    function handleDeleteLayer(layer) {
        layers = layers.filter(l => l != layer);
    }

    function handleAdd() {
        let y = Math.max(...keys.map(k => k.y), 0);
        let x = Math.max(...keys.filter(k => Math.abs(k.y - y) < 1).map(k => k.x + 1), 0);

        let key:KeyModel = {
            id: nextId++,
            labels: {},
            x,
            y,
            width: 1,
            height: 1,
            selected: false
        };
        keys = [ ...keys, key ];
    }

    function handleRemove(key:KeyModel) {
        keys = keys.filter(k => k != key);
    }
</script>

<div class=stretch-row>
    <div class=column>
        <div class=row>
            <button on:click={handleAdd}>
                Add
            </button>
            <button on:click={() => handleRemove(selected)} disabled={!selected}>
                Remove
            </button>
        </div>

        <LayoutViewer bind:keys={keys} layer={selectedLayer}/>

        <div class="row controls-container">
            <EditableList title="Layers"/>
            <div class="column grow control-box">
                Key Settings
                {#if selected}
                <FormInput type=number label="X Position" bind:value={selected.x}/>
                <FormInput type=number label="Y Position" bind:value={selected.y}/>
                <FormInput type=number label="Width" bind:value={selected.width}/>
                <FormInput type=number label="Height" bind:value={selected.height}/>
                {/if}
            </div>
            <div class="column grow control-box">
                Layer Settings
                {#if selected}
                <FormInput label="Symbol" bind:value={selected.labels[selectedLayer]}/>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    @radius: 5px;

    .control-box {
        background-color: var(--gray-1);
        color: var(--gray-9);
        padding: 10px;
        border-radius: @radius;
        margin-right: 10px;
    }

    .controls-container {
        height: 15em;
        align-self: stretch;
        align-items: stretch;
    }
</style>