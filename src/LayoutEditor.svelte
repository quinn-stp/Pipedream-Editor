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

    export interface DeviceModel {
        id:number;
        name:string;
        keys:KeyModel[];
    }
</script>

<script>
    import EditableList from './Components/EditableList.svelte';
    import FormInput from './Components/FormInput.svelte';
    import LayoutViewer from './LayoutViewer.svelte';
    import type { ListItem } from './Components/EditableList.svelte';
    import DropdownButton from './Components/DropdownButton.svelte';

    let nextId = 99;

    export let devices:DeviceModel[] = [
        {
            id: nextId++,
            keys: [],
            name: 'Device'
        }
    ];

    // export let keys:KeyModel[] = [];
    let selectedDevice = devices[0];

    $: selected = selectedDevice.keys.filter(k => k.selected)[0];

    let layers:ListItem[] = [
        {
            id: 0,
            name: 'Main'
        }
    ];
    let selectedLayer:ListItem;

    function handleDeviceAdd() {
        let device:DeviceModel = {
            id: nextId++,
            keys: [],
            name: 'New Device'
        };

        devices = [...devices, device];
    }

    function handleDeviceRemove(device:DeviceModel) {
        devices = devices.filter(d => d != device);
    }

    function handleAdd(x:number, y:number) {

        let key:KeyModel = {
            id: nextId++,
            labels: {},
            x,
            y,
            width: 1,
            height: 1,
            selected: true
        };

        selectedDevice.keys.forEach(k => k.selected = false);

        selectedDevice.keys = [ ...selectedDevice.keys, key ];
        devices = devices;
    }

    function handleRemove(key:KeyModel) {
        selectedDevice.keys = selectedDevice.keys.filter(k => k != key);
        devices = devices;
    }
</script>

<div class=column>
    <div class="row grow">
        {#each devices as device (device.id)}
            <div class=layout-container on:click={() => selectedDevice = device}>
                <div class="layout-header" class:selected={device == selectedDevice}>
                    {device.name}
                    <svg width=1em height=1em viewBox="-2 -2 14 14" class="remove-button" on:click={() => handleDeviceRemove(device)}>
                        <line x1=0 y1=0 x2=10 y2=10/>
                        <line x1=10 y1=0 x2=0 y2=10/>
                    </svg>
                </div>
                <LayoutViewer bind:keys={device.keys} layer={selectedLayer?.id}/>
            </div>
        {/each}
    </div>

    <div class="row">
        <div class=row-group>
            <button>
                ✂️ Cut
            </button>
            <button>
                <span style="font-size: .875em; margin-right: .125em; position: relative; top: -.25em; left: -.125em">
                    📄<span style="position: absolute; top: .25em; left: .25em">📄</span>
                </span>
                Copy
            </button>
            <button>
                &#x1f4cb; Paste
            </button>
        </div>

        <DropdownButton 
            options={[
                {
                    menuText: '↑ Add Up',
                    buttonText: '↑ Add',
                    onClick: () => {
                        handleAdd(
                            selected?.x ?? 0,
                            selected ? selected.y - 1 : 0
                        );
                    }
                },
                {
                    menuText: '↓ Add Down',
                    buttonText: '↓ Add',
                    onClick: () => {
                        handleAdd(
                            selected?.x ?? 0,
                            selected ? selected.y + selected.height : 0
                        );
                    }
                },
                {
                    menuText: '← Add Left',
                    buttonText: '← Add',
                    onClick: () => {
                        handleAdd(
                            selected ? selected.x - 1 : 0,
                            selected?.y ?? 0
                        );
                    }
                },
                {
                    menuText: '→ Add Right',
                    buttonText: '→ Add',
                    onClick: () => {
                        handleAdd(
                            selected ? selected.x + selected.width : 0,
                            selected?.y ?? 0
                        );
                    }
                },
            ]}/>
        <button class=red on:click={() => handleRemove(selected)} disabled={!selected}>
            Remove
        </button>

        <button class=blue on:click={handleDeviceAdd}>
            Add Device
        </button>
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
    @import './variables.less';

    .layout-header {
        position: relative;
        height: 2em;
        padding-left: 0.5em;
        background-color: var(--gray-1);
        border-bottom: 1px solid var(--gray-5);
        color: var(--gray-6);
        align-items: center;

        &.selected {
            background-color: var(--blue-3);
            color: var(--gray-9);
        }
    }

    .layout-container {
        border: 1px solid var(--gray-5);
        border-radius: @radius;
        flex-direction: column;
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

    .remove-button {
        position: absolute;
        right: 0.5em;
        stroke: var(--gray-7);
        stroke-width: 2;
        stroke-linecap: round;
        
        &:hover {
            stroke: var(--red-7);
        }
    }

</style>