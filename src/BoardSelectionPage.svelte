<script context=module>
    export interface BoardConfiguration {
        Name:string;
        Definition:BoardDefinition;
        X:number;
        Y:number;
    }
</script>

<script>
    import BoardViewer, { PPM } from './BoardViewer.svelte';
    import { QuotientDefinition } from './BoardDefinition';
    import type { BoardDefinition } from './BoardDefinition';
    import BoardConfigurationEditor from './BoardConfigurationEditor.svelte';

    let boards:BoardConfiguration[] = [
        {
            Name: 'Left',
            Definition: QuotientDefinition,
            X: 0,
            Y: 0
        },
        {
            Name: 'Right',
            Definition: QuotientDefinition,
            X: 130,
            Y: 0
        }
    ];
        
    let selected:BoardConfiguration;
</script>

<div class=column>
    <div class="grow container">
        {#each boards as board}
            <div class=board-container on:click={() => selected = board} style="left: {board.X * PPM}px; top: {board.Y  * PPM}px;">
                <BoardViewer board={board.Definition} selected={board == selected} name={board.Name}/>
            </div>
        {/each}
    </div>
    <div class=row>
        {#if selected}
            <BoardConfigurationEditor bind:configuration={selected}/>
        {/if}
    </div>
</div>


<style>
    .container {
        position: relative;
    }
    .board-container {
        position: absolute;
        height: min-content;
    }
</style>