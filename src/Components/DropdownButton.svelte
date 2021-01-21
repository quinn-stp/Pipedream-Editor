<script context=module>
    export interface DropdownItem {
        onClick:()=>void;
        buttonText:string;
        menuText:string;
    }
</script>

<script>
    import { clickOutside } from '../Actions/ClickOutside';

    export let disabled:boolean = false;
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
        <button class=blue on:click={selected?.onClick} {disabled}>
            {selected?.buttonText}
        </button>
        <button class=blue on:click={toggleOpen} {disabled}>
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
    .container {
        position: relative;
    }

    polygon {
        stroke-width: 1px;
        fill: var(--gray-9);

        button:disabled & {
            fill: var(--gray-6);
        }
    }
</style>