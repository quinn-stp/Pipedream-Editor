import type { SvelteComponent } from 'svelte';
import KeysViewer from './KeysViewer.svelte';

export abstract class DeviceDefinition {
    X:number;
    Y:number;

    abstract GetViewer(): typeof SvelteComponent;

    constructor(x:number, y:number) {
        this.X = x;
        this.Y = y;
    }
}

export class BoardDefinition {
    Devices:DeviceDefinition[];
    Width:number;
    Height:number;
}

export interface Key {
    X:number;
    Y:number;
    Width:number;
    Height:number;
}

export class KeysDefinition extends DeviceDefinition {
    Keys:Key[];

    constructor(x:number, y:number, keys:Key[]) {
        super(x, y);
        this.Keys = keys;
    }

    GetViewer(): typeof SvelteComponent {
        return KeysViewer;
    }
}

export const QuotientDefinition:BoardDefinition = {
    Width: 120,
    Height: 100,
    Devices: [
        new KeysDefinition(2.75, 21,
            [...Array(4).keys()].map(r => [...Array(6).keys()].map(c => ({ X: c, Y: r, Width: 1, Height: 1}))).reduce((p,c) => c.concat(p))
        )
    ]
}