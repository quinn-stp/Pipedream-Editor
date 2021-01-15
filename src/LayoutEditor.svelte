<script context=module>
    export interface KeyModel {
        id:number;
        x:number;
        y:number;
        width:number;
        height:number;
    }

    export interface BindingModel {
        transparent:boolean;
        symbol:string;
    }

    export interface LayerModel extends ListItem { 
        bindings:{[key:number]:{[key:number]:BindingModel}}
    }

    export interface DeviceModel {
        readonly id:number;
        name:string;
        keys:KeyModel[];
    }

    export class Configuration {
        private nextId:number;
        private devices:DeviceModel[];
        private layers:LayerModel[];

        constructor() {
            this.nextId = 0;
            this.devices = [];
            this.layers = [];
        }

        private getNewId():number {
            return this.nextId++;
        }

        get Devices():readonly DeviceModel[] {
            return this.devices;
        }

        get Layers():readonly LayerModel[] {
            return this.layers;
        }

        AddLayer(name:string) {
            let layer:LayerModel = {
                id: this.getNewId(),
                name,
                bindings: {}
            };

            this.devices.forEach(d => {
                let symbols:{[key: number]:BindingModel} = {};
                d.keys.forEach(k => {
                    symbols[k.id] = {
                        symbol: '',
                        transparent: false
                    };
                });

                layer.bindings[d.id] = symbols;
            });

            this.layers.push(layer);
            return layer;
        }

        AddDevice(name:string) {
            let device:DeviceModel = {
                id: this.getNewId(),
                name,
                keys: []
            };

            this.layers.forEach(l => {
                l.bindings[device.id] = {};
            });

            this.devices.push(device);
            return device;
        }

        DuplicateDevice(device:DeviceModel) {
            let clone:DeviceModel = {
                id: this.getNewId(),
                name: device.name,
                keys: []
            };

            this.layers.forEach(l => {
                l.bindings[clone.id] = {};
            });

            device.keys.forEach(k => {
                let kc = {
                    id: this.getNewId(),
                    width: k.width,
                    height: k.height,
                    x: k.x,
                    y: k.y
                };

                this.layers.forEach(l => {
                    l.bindings[clone.id][kc.id] = {
                        ...l.bindings[device.id][k.id]
                    };
                });

                clone.keys.push(kc);
            });

            this.devices.push(clone);

            return clone;
        }

        AddKey(device:DeviceModel, x:number, y:number) {
            let key:KeyModel = {
                id: this.getNewId(),
                x,
                y,
                height: 1,
                width: 1,
            };

            this.layers.forEach(l => {
                l.bindings[device.id][key.id] = {
                    symbol: '',
                    transparent: false
                };
            })

            device.keys.push(key);
            // device.keys = [...device.keys, key];
            // this.devices = this.devices;
            return key;
        }
    }
</script>

<script>
    import EditableList from './Components/EditableList.svelte';
    import FormInput from './Components/FormInput.svelte';
    import LayoutViewer from './LayoutViewer.svelte';
    import type { ListItem } from './Components/EditableList.svelte';
    import DropdownButton from './Components/DropdownButton.svelte';
    import Dropdown from './Components/Dropdown.svelte';

    let configuration = new Configuration();
    configuration.AddLayer('Main');
    configuration.AddDevice('Device');

    $: console.log(configuration);

    let selectedLayer:LayerModel = configuration.Layers[0];
    let selectedDevice:DeviceModel;
    let selectedKey:KeyModel;

    function handleAddLayer() {
        selectedLayer = configuration.AddLayer('New Layer');
    }

    function handleAddDevice() {
        selectedDevice = configuration.AddDevice('New Device');
    }

    function handleDuplicateDevice() {
        selectedKey = null;
        configuration.DuplicateDevice(selectedDevice);
    }

    function handleAddKey(x:number, y:number) {
        selectedKey = configuration.AddKey(selectedDevice, x, y);
    }

    function handleSelectDevice(device:DeviceModel) {
        if(selectedDevice != device) {
            selectedKey = null;
            selectedDevice = device;
        }
    }
</script>

<div class="column grow">
    <div class="row grow">
        {#each configuration.Devices as device (device.id)}
            <div class=layout-container on:click={() => handleSelectDevice(device)}>
                <div class="layout-header" class:selected={device == selectedDevice}>
                    {device.name}                        
                    <div class=menu-button>
                        <Dropdown options={[
                            {
                                label: 'Duplicate',
                                onClick: handleDuplicateDevice
                            },
                            {
                                label: 'Rename',
                                onClick: () => {}
                            },
                            {
                                label: 'Remove',
                                onClick: () => {
                                    // handleDeviceRemove(device);
                                }
                            },
                        ]}/>
                    </div>
                </div>
                <LayoutViewer bind:device={device} layers={configuration.Layers} currentLayer={selectedLayer} bind:selectedKey/>
            </div>
        {:else}
            <div class=empty-message>
                Add a device to begin
            </div>
        {/each}
    </div>

    <div class="row">
        <div class=row-group>
            <button>
                ✂️ Cut
            </button>
            <button>
                <span style="height: 1.25em; width: 1.5em; position: relative;">
                    <span style="position: absolute; filter: brightness(0.75)">📄</span>
                    <span style="position: absolute; top: 0.25em; right: 0">📄</span>
                </span>
                Copy
            </button>
            <button>
                &#x1f4cb; Paste
            </button>
        </div>

        <DropdownButton 
            disabled={!selectedDevice}
            options={[
                {
                    menuText: '→ Add Right',
                    buttonText: '→ Add',
                    onClick: () => {
                        handleAddKey(
                            selectedKey ? selectedKey.x + selectedKey.width : 0,
                            selectedKey?.y ?? 0
                        );
                    }
                },
                {
                    menuText: '← Add Left',
                    buttonText: '← Add',
                    onClick: () => {
                        handleAddKey(
                            selectedKey ? selectedKey.x - 1 : 0,
                            selectedKey?.y ?? 0
                        );
                    }
                },
                {
                    menuText: '↑ Add Up',
                    buttonText: '↑ Add',
                    onClick: () => {
                        handleAddKey(
                            selectedKey?.x ?? 0,
                            selectedKey ? selectedKey.y - 1 : 0
                        );
                    }
                },
                {
                    menuText: '↓ Add Down',
                    buttonText: '↓ Add',
                    onClick: () => {
                        handleAddKey(
                            selectedKey?.x ?? 0,
                            selectedKey ? selectedKey.y + selectedKey.height : 0
                        );
                    }
                },
            ]}/>
        <button class=red on:click={() => {}} disabled={!selectedKey}>
            Remove
        </button>

        <button class=blue on:click={handleAddDevice}>
            Add Device
        </button>
    </div>

    <div class="row controls-container">
        <EditableList
            on:add={handleAddLayer}
            items={configuration.Layers}
            bind:selected={selectedLayer}
            title="Layers"/>

        <div class="column grow control-box">
            Key Settings
            {#if selectedKey}
                <div class=row>
                    <FormInput type=number label="X" bind:value={selectedKey.x}/>
                    <FormInput type=number label="Y" bind:value={selectedKey.y}/>
                </div>
                <div class=row>
                    <FormInput type=number label="Width" bind:value={selectedKey.width}/>
                    <FormInput type=number label="Height" bind:value={selectedKey.height}/>
                </div>
            {/if}
        </div>
        <div class="column grow control-box">
            Layer Settings
            {#if selectedKey}
                <FormInput label="Symbol" bind:value={selectedLayer.bindings[selectedDevice.id][selectedKey.id].symbol}/>
            {/if}
        </div>
    </div>
</div>

<style>
    @import './variables.less';

    .empty-message {
        border: 1px solid var(--gray-4);
        border-radius: @radius;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        color: var(--gray-4);
    }

    .menu-button {
        position: absolute;
        right: 0;
    }

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
        flex-grow: 1;
        flex-basis: 0;
        width: 0;
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