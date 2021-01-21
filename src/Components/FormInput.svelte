<script>
    export let label:string;
    export let value;
    export let type = 'text';
</script>

<div class="input-container">
    <div class="input-label">
        {label}
    </div>
    {#if type == 'text'}
        <input type=text bind:value/>
    {:else if type == 'number'}
        <input type=number step=0.25 bind:value/>
    {/if}
</div>

<style>
    @import '../variables.less';

    .input-container {
        width: 100%;
        position: relative;
        padding-top: 0.5em;
    }

    .input-label {
        position: absolute;
        font-size: 0.8em;
        left: @radius * 2;
        top: 0;
        background-color: var(--gray-0);
        color: var(--gray-9);
        padding-left: 0.25em;
        padding-right: 0.25em;
    }

    input {
        width: 5em;
        flex-grow: 1;
        background-color: unset;
        border-radius: 0;
        border: @line-width solid var(--gray-9);
        margin: 0;

        &:focus {
            box-shadow: 2px 4px var(--gray-9);
        }
    }
</style>