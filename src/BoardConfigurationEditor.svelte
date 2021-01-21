<script>
    import type { BoardConfiguration } from './BoardSelectionPage.svelte';
    import FormInput from './Components/FormInput.svelte';

    export let configuration:BoardConfiguration;
</script>

<div class=column>
    <FormInput label='Name' bind:value={configuration.Name}/>
    <div class=row>
        <FormInput type=number label='X' bind:value={configuration.X}/>
        <FormInput type=number label='Y' bind:value={configuration.Y}/>
    </div>
</div>
