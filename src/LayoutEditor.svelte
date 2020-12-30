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

<div class=stretch-row>
    <div class=column>
        <div class=layout-container>
            <LayoutViewer bind:keys={keys} layer={selectedLayer?.id}/>

            <div class=layout-button-row>
                <div class=button-group>
                    <div class=button on:click={handleAdd}>
                        Add
                    </div>
                    <div class="button icon">
                        <svg width=12 height=6>
                            <polygon points="0,0 12,0 6,6"/>
                        </svg>
                    </div>
                </div>
                <div class="dropdown">
                    <div class=dropdown-item>
                        ← Add Left
                    </div>
                    <div class=dropdown-item>
                        → Add Right
                    </div>
                    <div class=dropdown-item>
                        ↑ Add Up
                    </div>
                    <div class=dropdown-item>
                        ↓ Add Down
                    </div>
                </div>
                <div class="button danger" on:click={() => handleRemove(selected)} disabled={!selected}>
                    Remove
                </div>
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
</div>

<style>
    @radius: 5px;
    .dropdown {
        margin-top: 5px;
        position: absolute;
        top: 2em;
        left: 0;
        width: 8em;
        background-color: var(--gray-2);
        border-radius: @radius;
        color: var(--gray-9);
        flex-direction: column;
        overflow: hidden;
        visibility: hidden;
    }

    .dropdown-item {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;

        &:hover {
            background-color: var(--gray-3);
        }
    }

    polygon {
        stroke: var(--gray-9);
        stroke-width: 1px;
        fill: var(--gray-9);
    }

    .button {
        color: var(--gray-9);
        height: 2em;
        padding-left: 1em;
        padding-right: 1em;
        align-items: center;
        justify-content: center;
        background-color: var(--blue-5);
        margin-left: 5px;
        margin-right: 5px;
        border-radius: @radius;

        &:disabled {
            background-color: var(--gray-5);
        }

        .button-group & {
            margin: 0;
        }

        &.icon {
            padding: 0;
            width: 2em;
        }

        &.danger {
            background-color: var(--red-5);
        }

        &.danger:hover {
            background-color: var(--red-6);
        }

        &:hover {
            background-color: var(--blue-6);
        }

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }

        .button-group & {
            border-radius: 0;
        }

        .button-group &:first-child {
            border-top-left-radius: @radius;
            border-bottom-left-radius: @radius;
        }

        .button-group &:last-child {
            border-top-right-radius: @radius;
            border-bottom-right-radius: @radius;
        }
    }


    .button-group {
        margin-left: 5px;
        margin-right: 5px;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
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
        align-self: stretch;
        align-items: stretch;
    }
</style>