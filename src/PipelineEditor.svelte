<script>
    import type { KeyModel } from './LayoutEditor.svelte';
    import StringList from './Components/StringList.svelte';

    const StageTypes = [
        {
            Name: 'Action Bindings'
        }
    ];

    export let keys:KeyModel[];

    $: symbols = keys.flatMap(k => Object.keys(k.labels).map(l => k.labels[l])).sort();

    let nextStage:string;

    let stages:string[] = [];

    function handleAddStage() {
        stages = [...stages, nextStage];
        nextStage = null;
    }
</script>

<div class="row fill">
    <div class="row grow">
        <div class="column grow">
            <b>Symbols</b>
            <StringList items={symbols}/>
        </div>
        <div class="column grow">
            Press Action<br/>
            <select>
                <option>Update HID</option>
                <option>Set Layer</option>
            </select>
            Release Action<br/>
            <select>
                <option>Update HID</option>
                <option>Set Layer</option>
            </select>
        </div>
    </div>
    <div class=column>
        <div class=row>
            Pipeline
        </div>
        <div class=row>
            <select bind:value={nextStage}>
                <option value={null}/>
                {#each StageTypes as stage}
                    <option value={stage.Name}>{stage.Name}</option>
                {/each}
            </select>
            <button on:click={handleAddStage} disabled={!nextStage}>
                +
            </button>
        </div>
        {#each stages as stage}
            <div class=row>
                {stage}
            </div>
        {/each}
    </div>
</div>