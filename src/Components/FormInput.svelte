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
    @radius: 5px;

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
        background-color: var(--gray-1);
        color: var(--gray-8);
        padding-left: 0.25em;
        padding-right: 0.25em;
    }

    input[type=number],
    input[type=text] {
        width: 0;
        flex-grow: 1;
        border-radius: @radius;
        background-color: unset;
        border-width: 2px;
        border-color: var(--gray-2);
        color: inherit;
    }

    input[type=number]:focus,
    input[type=text]:focus {
        border-color: var(--gray-5);
    }
</style>