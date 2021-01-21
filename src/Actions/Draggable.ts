export function draggable(node) {
    let x:number;
    let y:number;

    function handleMouseDown(event:MouseEvent) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('dragstart', {
            detail: {x,y}
        }));

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event:MouseEvent) {
        let dx = event.clientX - x;
        let dy = event.clientY - y;
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('dragmove', {
            detail: {x, y, dx, dy}
        }));
    }

    function handleMouseUp(event:MouseEvent) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('dragend', {
            detail: {x,y}
        }));


        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    node.addEventListener('mousedown', handleMouseDown);

    return {
        destroy() {
            window.removeEventListener('mousedown', handleMouseDown);
        }
    }
}