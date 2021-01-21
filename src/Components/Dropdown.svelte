<script context=module>
    export interface DropdownOption {
        label: string;
        onClick: () => void;
    }
</script>

<script>
    import { clickOutside } from '../Actions/ClickOutside';
    let open = false;

    export let options:DropdownOption[] = [];

    function optionClick(option:DropdownOption) {
        option.onClick();
        open = false;
    }
</script>

<div class=container>
    <div class=openButton on:click={() => open = true}>
        <div>
            ⋮
        </div>
    </div>
    <div class="dropdown rightAlign" class:open use:clickOutside={{enabled: open}} on:clickOutside={() => open = false}>
        {#each options as option}
            <button class=dropdown-item on:click={() => optionClick(option)}>
                {option.label}
            </button>
        {/each}
    </div>
</div>

<style>
    @import '../variables.less';
    
    .openButton {
        align-items: center;
        justify-content: center;
        height: @item-height;
        width: $height;
        color: var(--gray-7);

        &:hover {
            color: var(--gray-9);
            cursor: pointer;
        }
    }

    .container {
        position: relative;
    }

    .rightAlign {
        left: unset;
        right: @spacing;
    }
</style>