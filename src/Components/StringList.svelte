<script>
    import ListItem from './ListItem.svelte';

    export let items:string[];
    export let selected:string;

    if(!selected) selected = items[0];
</script>

<div class=column>
    {#each items as item}
        <ListItem selected={item == selected} on:click={() => selected = item}>
            {item}
        </ListItem>
    {/each}
</div>