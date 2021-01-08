<script context=module>
    export interface DropdownItem {
        onClick:()=>void;
        buttonText:string;
        menuText:string;
    }
</script>

<script>
    import { clickOutside } from '../ClickOutside';

    export let options:DropdownItem[] = [];
    let selected:DropdownItem = options[0];
    let open = false;

    function toggleOpen() {
        open = !open;
    }

    function optionClick(option:DropdownItem) {
        selected = option;
        open = false;
    }

    function handleClickOutside(event:MouseEvent) {
        open = false;
    }
</script>

<div class=container>
    <div class=row-group>
        <button class=blue on:click={selected?.onClick}>
            {selected?.buttonText}
        </button>
        <button class=blue on:click={toggleOpen}>
            <svg width=12 height=6>
                <polygon points="0,0 12,0 6,6"/>
            </svg>
        </button>
    </div>
    <div class="dropdown" class:open use:clickOutside={{enabled: open}} on:clickOutside={handleClickOutside}>
        {#each options as o}
            <button class=dropdown-item on:click={() => optionClick(o)}>
                {o.menuText}
            </button>
        {/each}
    </div>
</div>

<style>
    @import (reference) '../style.less';

    .container {
        position: relative;
    }

    .dropdown:extend(.col-group all) {
        margin-top: 5px;
        position: absolute;
        top: 2em;
        left: 0;
        width: 8em;
        visibility: collapse;

        z-index: 999999;

        &.open {
            visibility: visible;
        }
    }

    .dropdown-item {
        background-color: var(--gray-2);
        justify-content: flex-start;
        &:hover {
            background-color: var(--gray-3);
        }
    }

    polygon {
        stroke: var(--gray-9);
        stroke-width: 1px;
        fill: var(--gray-9);
    }
</style>