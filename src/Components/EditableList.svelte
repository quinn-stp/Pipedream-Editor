<script context=module>
    export interface ListItem {
        id:number;
        name:string;
    }
</script>

<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let title:string;
    export let items:readonly ListItem[] = [ ];
    export let selected:ListItem = items[0];

    let nextId = Math.max(...items.map(i => i.id)) + 1;

    function handleAdd() {
        dispatch('add');
        // let i = {
        //     id: nextId++,
        //     name: ''
        // };

        // items = [ ...items, i ];
        // selected = i;
    }

    if(!selected) selected = items[0];
</script>

<div class="column list-container grow">
    <div class="row title-container">
        <div class="column grow">
            {title}
        </div>
        <div class="add-button" on:click={handleAdd}>
            +
        </div>
    </div>

    {#each items as item (item.id)}
    <div class="row list-item" class:list-item-selected={selected == item} on:click={() => selected = item}>
        <input type=text bind:value={item.name} />
        <svg width=1em height=1em viewBox="-2 -2 14 14" class="remove-button" on:click={() => items = items.filter(i => i != item)}>
            <line x1=0 y1=0 x2=10 y2=10/>
            <line x1=10 y1=0 x2=0 y2=10/>
        </svg>
    </div>
    {/each}
</div>

<style>
    @radius: 5px;

    input[type=text] {
        background-color: unset;
        margin: 0px;
        border: none;
        color: inherit;
        flex-grow: 1;
        padding: 0;
        pointer-events: none;
        width: 0;
    }

    .list-item-selected input[type=text] {
        pointer-events: unset;
    }

    .list-item-selected {
        color: var(--gray-2);
        background-color: var(--gray-7) !important;
    }

    .list-item:hover {
        background-color: var(--gray-2);
    }

    .list-item:hover .remove-button {
        visibility: visible;
    }

    .list-item {
        border-radius: @radius;
        margin-bottom: 5px;
        align-self: stretch;
        align-items: center;
        padding: 10px;
    }

    .remove-button {
        stroke-width: 2px;
        stroke: var(--red-8);
        stroke-linecap: round;
        visibility: collapse;
        cursor: pointer;
    }

    .add-button {
        border-radius: 1.125em;
        width: $border-radius * 2;
        height: $border-radius * 2;
        align-items: center;
        justify-content: center;
    }

    .add-button:hover {
        background-color: var(--gray-2);
    }

    .title-container {
        width: 100%;
        margin-bottom: 10px;
        align-items: center;
    }

    .list-container {
        background-color: var(--gray-1);
        padding: 10px;
        border-radius: @radius;
        color: var(--gray-9);
    }
</style>