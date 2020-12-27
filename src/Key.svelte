<script>
    import { spring } from 'svelte/motion';
    import { draggable } from './Draggable';

    export let x:number = 0;
    export let y:number = 0;
    export let width:number = 1;
    export let height:number = 1;
    export let selected:boolean = false;
    export let label:string;

    let dragging = false;

    const UNIT=55;
    const GRID=UNIT/4;

    const coords = spring({x: x*UNIT, y: y*UNIT}, {
        stiffness: 0.8,
        damping: 0.8
    });

    coords.subscribe((c) => {
        if(dragging) {
            x = Math.round(c.x / GRID) / 4;
            y = Math.round(c.y / GRID) / 4;
        }
    });

    $: if(!dragging) {
        coords.set({ x: x*UNIT, y: y*UNIT })
    }

    function handleDragStart(e) {
        coords.damping = 1;
        dragging = true;
    }

    function handleDragMove(e) {
        coords.update($coords => ({
            x: $coords.x + e.detail.dx,
            y: $coords.y + e.detail.dy
        }));
    }

    function handleDragEnd(e) {
        coords.damping = 0.8;
        dragging = false;
    }
</script>

<div
    use:draggable
    class="key-background"
    class:selected
    on:click
    on:dragstart={handleDragStart}
    on:dragmove={handleDragMove}
    on:dragend={handleDragEnd}
    style= "width:{width*55 - 5}px; height:{height * 55 - 5}px; transform: translate({$coords.x}px,{$coords.y}px)">

    {label || ''}
</div>

<style>
    .selected {
        background-color: var(--blue-3) !important;
        border-color: var(--blue-5) !important;
    }

    .key-background {
        display: flex;
        position: absolute;
        align-items: center;
        justify-content: center;
        user-select: none;
        width: 50px;
        height: 50px;
        background-color: var(--gray-2);
        color: var(--gray-9);
        border: solid 2px var(--gray-4);
        border-radius: 5px;
        top: 1px;
        left: 1px;
    }
</style>