export function clickOutside(node, { enabled }:{enabled:boolean}) {

    function handleClick(event:MouseEvent) {
        if(node && !node.contains(event.target) && !event.defaultPrevented) {
            event.stopPropagation();
            node.dispatchEvent(new CustomEvent('clickOutside', event))
        }
    }   

    function update({enabled}:{enabled:boolean}) {
        if(enabled)
            document.addEventListener('click', handleClick, true);
        else
            document.removeEventListener('click', handleClick, true);
    }


    return {
        update,
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}