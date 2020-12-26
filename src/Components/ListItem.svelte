<script>
    export let selected:boolean;
</script>

<div class="item" class:selected on:click>
    <slot/>
</div>

<style>
    .selected {
        background-color: #888 !important;
    }
    .item {
        background-color: #ccc;
    }
</style>