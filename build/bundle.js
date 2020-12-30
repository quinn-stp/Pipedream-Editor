
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ":root {\n  --gray-0: #181818;\n  --gray-1: #2d2d2d;\n  --gray-2: #434343;\n  --gray-3: #585858;\n  --gray-4: #6e6e6e;\n  --gray-5: #838383;\n  --gray-6: #989898;\n  --gray-7: #aeaeae;\n  --gray-8: #c3c3c3;\n  --gray-9: #eee;\n  --blue-0: #181818;\n  --blue-1: #25282f;\n  --blue-2: #313946;\n  --blue-3: #3e495d;\n  --blue-4: #4b5974;\n  --blue-5: #586a8b;\n  --blue-6: #647aa1;\n  --blue-7: #718ab8;\n  --blue-8: #7e9acf;\n  --blue-9: #97bbfd;\n  --red-0: #181818;\n  --red-1: #2f1d1d;\n  --red-2: #462121;\n  --red-3: #5d2626;\n  --red-4: #742a2a;\n  --red-5: #8c2f2f;\n  --red-6: #a33333;\n  --red-7: #ba3838;\n  --red-8: #d13c3c;\n  --red-9: #ff4545;\n}\nbody {\n  display: flex;\n  justify-content: stretch;\n  align-items: stretch;\n  align-content: stretch;\n  padding: 0;\n  background-color: var(--gray-0);\n}\ndiv {\n  display: flex;\n  user-select: none;\n}\ninput {\n  display: flex;\n}\n.grow {\n  flex-grow: 1;\n}\n.row {\n  flex-direction: row;\n}\n.row > * {\n  margin-right: 5px;\n  margin-left: 5px;\n}\n.row > *:first-child {\n  margin-left: 0;\n}\n.row > *:last-child {\n  margin-right: 0;\n}\n.column {\n  flex-direction: column;\n}\n.column > * {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n.column > *:first-child {\n  margin-top: 0;\n}\n.column > *:last-child {\n  margin-bottom: 0;\n}\n";
    styleInject(css_248z);

    var css_248z$1 = "input[type=text].svelte-1sozhzk.svelte-1sozhzk{background-color:unset;margin:0px;border:none;color:inherit;flex-grow:1;padding:0;pointer-events:none;width:0}.list-item-selected.svelte-1sozhzk input[type=text].svelte-1sozhzk{pointer-events:unset}.list-item-selected.svelte-1sozhzk.svelte-1sozhzk{color:var(--gray-2);background-color:var(--gray-7) !important}.list-item.svelte-1sozhzk.svelte-1sozhzk:hover{background-color:var(--gray-2)}.list-item.svelte-1sozhzk:hover .remove-button.svelte-1sozhzk{visibility:visible}.list-item.svelte-1sozhzk.svelte-1sozhzk{border-radius:5px;margin-bottom:5px;align-self:stretch;align-items:center;padding:10px}.remove-button.svelte-1sozhzk.svelte-1sozhzk{stroke-width:2px;stroke:var(--red-8);stroke-linecap:round;visibility:collapse;cursor:pointer}.add-button.svelte-1sozhzk.svelte-1sozhzk{border-radius:1.125em;width:2.25em;height:2.25em;align-items:center;justify-content:center}.add-button.svelte-1sozhzk.svelte-1sozhzk:hover{background-color:var(--gray-2)}.title-container.svelte-1sozhzk.svelte-1sozhzk{width:100%;margin-bottom:10px;align-items:center}.list-container.svelte-1sozhzk.svelte-1sozhzk{background-color:var(--gray-1);padding:10px;border-radius:5px;color:var(--gray-9)}";
    styleInject(css_248z$1);

    /* src/Components/EditableList.svelte generated by Svelte v3.31.0 */

    const file = "src/Components/EditableList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[9] = list;
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (38:4) {#each items as item (item.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let input;
    	let t0;
    	let svg;
    	let line0;
    	let line1;
    	let t1;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[4].call(input, /*each_value*/ ctx[9], /*item_index*/ ctx[10]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*item*/ ctx[8]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*item*/ ctx[8]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			t1 = space();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1sozhzk");
    			add_location(input, file, 39, 8, 830);
    			attr_dev(line0, "x1", "0");
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "x2", "10");
    			attr_dev(line0, "y2", "10");
    			add_location(line0, file, 41, 12, 1018);
    			attr_dev(line1, "x1", "10");
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "x2", "0");
    			attr_dev(line1, "y2", "10");
    			add_location(line1, file, 42, 12, 1060);
    			attr_dev(svg, "width", "1em");
    			attr_dev(svg, "height", "1em");
    			attr_dev(svg, "viewBox", "-2 -2 14 14");
    			attr_dev(svg, "class", "remove-button svelte-1sozhzk");
    			add_location(svg, file, 40, 8, 881);
    			attr_dev(div, "class", "row list-item svelte-1sozhzk");
    			toggle_class(div, "list-item-selected", /*selected*/ ctx[0] == /*item*/ ctx[8]);
    			add_location(div, file, 38, 4, 717);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*item*/ ctx[8].name);
    			append_dev(div, t0);
    			append_dev(div, svg);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", input_input_handler),
    					listen_dev(svg, "click", click_handler, false, false, false),
    					listen_dev(div, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*items*/ 2 && input.value !== /*item*/ ctx[8].name) {
    				set_input_value(input, /*item*/ ctx[8].name);
    			}

    			if (dirty & /*selected, items*/ 3) {
    				toggle_class(div, "list-item-selected", /*selected*/ ctx[0] == /*item*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(38:4) {#each items as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[8].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "+";
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "column grow");
    			add_location(div0, file, 29, 8, 521);
    			attr_dev(div1, "class", "add-button svelte-1sozhzk");
    			add_location(div1, file, 32, 8, 590);
    			attr_dev(div2, "class", "row title-container svelte-1sozhzk");
    			add_location(div2, file, 28, 4, 479);
    			attr_dev(div3, "class", "column list-container grow svelte-1sozhzk");
    			add_location(div3, file, 27, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div3, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*handleAdd*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);

    			if (dirty & /*selected, items*/ 3) {
    				const each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditableList", slots, []);
    	let { title } = $$props;
    	let { selected } = $$props;
    	let { items = [{ id: 0, name: "Main" }, { id: 1, name: "Num" }] } = $$props;
    	let nextId = Math.max(...items.map(i => i.id)) + 1;

    	function handleAdd() {
    		let i = { id: nextId++, name: "" };
    		$$invalidate(1, items = [...items, i]);
    		$$invalidate(0, selected = i);
    	}

    	if (!selected) selected = items[0];
    	const writable_props = ["title", "selected", "items"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EditableList> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(each_value, item_index) {
    		each_value[item_index].name = this.value;
    		$$invalidate(1, items);
    	}

    	const click_handler = item => $$invalidate(1, items = items.filter(i => i != item));
    	const click_handler_1 = item => $$invalidate(0, selected = item);

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		selected,
    		items,
    		nextId,
    		handleAdd
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    		if ("nextId" in $$props) nextId = $$props.nextId;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		items,
    		title,
    		handleAdd,
    		input_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class EditableList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 2, selected: 0, items: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditableList",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[2] === undefined && !("title" in props)) {
    			console.warn("<EditableList> was created without expected prop 'title'");
    		}

    		if (/*selected*/ ctx[0] === undefined && !("selected" in props)) {
    			console.warn("<EditableList> was created without expected prop 'selected'");
    		}
    	}

    	get title() {
    		throw new Error("<EditableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EditableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<EditableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<EditableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<EditableList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<EditableList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$2 = ".input-container.svelte-1t169za{width:100%;position:relative;padding-top:0.5em}.input-label.svelte-1t169za{position:absolute;font-size:0.8em;left:10px;top:0;background-color:var(--gray-1);color:var(--gray-8);padding-left:0.25em;padding-right:0.25em}input[type=number].svelte-1t169za,input[type=text].svelte-1t169za{width:0;flex-grow:1;border-radius:5px;background-color:unset;border-width:2px;border-color:var(--gray-2);color:inherit}input[type=number].svelte-1t169za:focus,input[type=text].svelte-1t169za:focus{border-color:var(--gray-5)}";
    styleInject(css_248z$2);

    /* src/Components/FormInput.svelte generated by Svelte v3.31.0 */

    const file$1 = "src/Components/FormInput.svelte";

    // (12:31) 
    function create_if_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "step", "0.25");
    			attr_dev(input, "class", "svelte-1t169za");
    			add_location(input, file$1, 12, 8, 271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:31) ",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if type == 'text'}
    function create_if_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1t169za");
    			add_location(input, file$1, 10, 8, 201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(10:4) {#if type == 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[2] == "text") return create_if_block;
    		if (/*type*/ ctx[2] == "number") return create_if_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "input-label svelte-1t169za");
    			add_location(div0, file$1, 6, 4, 115);
    			attr_dev(div1, "class", "input-container svelte-1t169za");
    			add_location(div1, file$1, 5, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FormInput", slots, []);
    	let { label } = $$props;
    	let { value } = $$props;
    	let { type = "text" } = $$props;
    	const writable_props = ["label", "value", "type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FormInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler_1() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ label, value, type });

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, label, type, input_input_handler, input_input_handler_1];
    }

    class FormInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { label: 1, value: 0, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormInput",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[1] === undefined && !("label" in props)) {
    			console.warn("<FormInput> was created without expected prop 'label'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<FormInput> was created without expected prop 'value'");
    		}
    	}

    	get label() {
    		throw new Error("<FormInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<FormInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<FormInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FormInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<FormInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<FormInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function draggable(node) {
        let x;
        let y;
        function handleMouseDown(event) {
            x = event.clientX;
            y = event.clientY;
            node.dispatchEvent(new CustomEvent('dragstart', {
                detail: { x, y }
            }));
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        function handleMouseMove(event) {
            let dx = event.clientX - x;
            let dy = event.clientY - y;
            x = event.clientX;
            y = event.clientY;
            node.dispatchEvent(new CustomEvent('dragmove', {
                detail: { x, y, dx, dy }
            }));
        }
        function handleMouseUp(event) {
            x = event.clientX;
            y = event.clientY;
            node.dispatchEvent(new CustomEvent('dragend', {
                detail: { x, y }
            }));
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        node.addEventListener('mousedown', handleMouseDown);
        return {
            destroy() {
                window.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }

    var css_248z$3 = ".selected.svelte-14de8dm{background-color:var(--blue-3) !important;border-color:var(--blue-5) !important}.key-background.svelte-14de8dm{display:flex;position:absolute;align-items:center;justify-content:center;user-select:none;width:50px;height:50px;background-color:var(--gray-2);color:var(--gray-9);border:solid 2px var(--gray-4);border-radius:5px;top:1px;left:1px}";
    styleInject(css_248z$3);

    /* src/Key.svelte generated by Svelte v3.31.0 */
    const file$2 = "src/Key.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let t_value = (/*label*/ ctx[3] || "") + "";
    	let t;
    	let draggable_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "key-background svelte-14de8dm");
    			set_style(div, "width", /*width*/ ctx[0] * 55 - 5 + "px");
    			set_style(div, "height", /*height*/ ctx[1] * 55 - 5 + "px");
    			set_style(div, "transform", "translate(" + /*$coords*/ ctx[5].x + "px," + /*$coords*/ ctx[5].y + "px)");
    			toggle_class(div, "selected", /*selected*/ ctx[2]);
    			add_location(div, file$2, 40, 0, 887);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(draggable_action = draggable.call(null, div)),
    					listen_dev(div, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(div, "dragstart", /*handleDragStart*/ ctx[6], false, false, false),
    					listen_dev(div, "dragmove", /*handleDragMove*/ ctx[7], false, false, false),
    					listen_dev(div, "dragend", /*handleDragEnd*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 8 && t_value !== (t_value = (/*label*/ ctx[3] || "") + "")) set_data_dev(t, t_value);

    			if (dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0] * 55 - 5 + "px");
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1] * 55 - 5 + "px");
    			}

    			if (dirty & /*$coords*/ 32) {
    				set_style(div, "transform", "translate(" + /*$coords*/ ctx[5].x + "px," + /*$coords*/ ctx[5].y + "px)");
    			}

    			if (dirty & /*selected*/ 4) {
    				toggle_class(div, "selected", /*selected*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const UNIT = 55;

    function instance$2($$self, $$props, $$invalidate) {
    	let $coords;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Key", slots, []);
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { width = 1 } = $$props;
    	let { height = 1 } = $$props;
    	let { selected = false } = $$props;
    	let { label } = $$props;
    	let dragging = false;
    	const GRID = UNIT / 4;
    	const coords = spring({ x: x * UNIT, y: y * UNIT }, { stiffness: 0.8, damping: 0.8 });
    	validate_store(coords, "coords");
    	component_subscribe($$self, coords, value => $$invalidate(5, $coords = value));

    	coords.subscribe(c => {
    		if (dragging) {
    			$$invalidate(9, x = Math.round(c.x / GRID) / 4);
    			$$invalidate(10, y = Math.round(c.y / GRID) / 4);
    		}
    	});

    	function handleDragStart(e) {
    		$$invalidate(4, coords.damping = 1, coords);
    		$$invalidate(11, dragging = true);
    	}

    	function handleDragMove(e) {
    		coords.update($coords => ({
    			x: $coords.x + e.detail.dx,
    			y: $coords.y + e.detail.dy
    		}));
    	}

    	function handleDragEnd(e) {
    		$$invalidate(4, coords.damping = 0.8, coords);
    		$$invalidate(11, dragging = false);
    	}

    	const writable_props = ["x", "y", "width", "height", "selected", "label"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Key> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(9, x = $$props.x);
    		if ("y" in $$props) $$invalidate(10, y = $$props.y);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		spring,
    		draggable,
    		x,
    		y,
    		width,
    		height,
    		selected,
    		label,
    		dragging,
    		UNIT,
    		GRID,
    		coords,
    		handleDragStart,
    		handleDragMove,
    		handleDragEnd,
    		$coords
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(9, x = $$props.x);
    		if ("y" in $$props) $$invalidate(10, y = $$props.y);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("dragging" in $$props) $$invalidate(11, dragging = $$props.dragging);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dragging, coords, x, y*/ 3600) {
    			 if (!dragging) {
    				coords.set({ x: x * UNIT, y: y * UNIT });
    			}
    		}
    	};

    	return [
    		width,
    		height,
    		selected,
    		label,
    		coords,
    		$coords,
    		handleDragStart,
    		handleDragMove,
    		handleDragEnd,
    		x,
    		y,
    		dragging,
    		click_handler
    	];
    }

    class Key extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			x: 9,
    			y: 10,
    			width: 0,
    			height: 1,
    			selected: 2,
    			label: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Key",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[3] === undefined && !("label" in props)) {
    			console.warn("<Key> was created without expected prop 'label'");
    		}
    	}

    	get x() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Key>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Key>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$4 = ".grid-line-minor.svelte-h5vonp{stroke:var(--gray-1);stroke-width:1px}.grid-line.svelte-h5vonp{stroke:var(--gray-3);stroke-width:1px}.grid-svg.svelte-h5vonp{width:100%;height:100%}.key-container.svelte-h5vonp{flex-direction:row;flex-grow:1;position:relative}";
    styleInject(css_248z$4);

    /* src/LayoutViewer.svelte generated by Svelte v3.31.0 */
    const file$3 = "src/LayoutViewer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[8] = list;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (17:4) {#each keys as key (key.id)}
    function create_each_block$1(key_2, ctx) {
    	let first;
    	let key_1;
    	let updating_x;
    	let updating_y;
    	let current;

    	function key_1_x_binding(value) {
    		/*key_1_x_binding*/ ctx[4].call(null, value, /*key*/ ctx[7]);
    	}

    	function key_1_y_binding(value) {
    		/*key_1_y_binding*/ ctx[5].call(null, value, /*key*/ ctx[7]);
    	}

    	let key_1_props = {
    		width: /*key*/ ctx[7].width,
    		height: /*key*/ ctx[7].height,
    		selected: /*key*/ ctx[7] == /*selected*/ ctx[2],
    		label: /*key*/ ctx[7].labels[/*layer*/ ctx[1]]
    	};

    	if (/*key*/ ctx[7].x !== void 0) {
    		key_1_props.x = /*key*/ ctx[7].x;
    	}

    	if (/*key*/ ctx[7].y !== void 0) {
    		key_1_props.y = /*key*/ ctx[7].y;
    	}

    	key_1 = new Key({ props: key_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(key_1, "x", key_1_x_binding));
    	binding_callbacks.push(() => bind(key_1, "y", key_1_y_binding));

    	key_1.$on("click", function () {
    		if (is_function(/*handleKeyClick*/ ctx[3](/*key*/ ctx[7]))) /*handleKeyClick*/ ctx[3](/*key*/ ctx[7]).apply(this, arguments);
    	});

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(key_1.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(key_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const key_1_changes = {};
    			if (dirty & /*keys*/ 1) key_1_changes.width = /*key*/ ctx[7].width;
    			if (dirty & /*keys*/ 1) key_1_changes.height = /*key*/ ctx[7].height;
    			if (dirty & /*keys, selected*/ 5) key_1_changes.selected = /*key*/ ctx[7] == /*selected*/ ctx[2];
    			if (dirty & /*keys, layer*/ 3) key_1_changes.label = /*key*/ ctx[7].labels[/*layer*/ ctx[1]];

    			if (!updating_x && dirty & /*keys*/ 1) {
    				updating_x = true;
    				key_1_changes.x = /*key*/ ctx[7].x;
    				add_flush_callback(() => updating_x = false);
    			}

    			if (!updating_y && dirty & /*keys*/ 1) {
    				updating_y = true;
    				key_1_changes.y = /*key*/ ctx[7].y;
    				add_flush_callback(() => updating_y = false);
    			}

    			key_1.$set(key_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(key_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(17:4) {#each keys as key (key.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let svg;
    	let pattern0;
    	let line0;
    	let pattern1;
    	let line1;
    	let pattern2;
    	let line2;
    	let pattern2_height_value;
    	let pattern3;
    	let line3;
    	let pattern3_width_value;
    	let rect0;
    	let rect1;
    	let rect2;
    	let rect3;
    	let current;
    	let each_value = /*keys*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[7].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			svg = svg_element("svg");
    			pattern0 = svg_element("pattern");
    			line0 = svg_element("line");
    			pattern1 = svg_element("pattern");
    			line1 = svg_element("line");
    			pattern2 = svg_element("pattern");
    			line2 = svg_element("line");
    			pattern3 = svg_element("pattern");
    			line3 = svg_element("line");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			attr_dev(line0, "x1", "0");
    			attr_dev(line0, "y1", "0");
    			attr_dev(line0, "x2", "100%");
    			attr_dev(line0, "y2", "0");
    			attr_dev(line0, "class", "grid-line svelte-h5vonp");
    			add_location(line0, file$3, 29, 12, 776);
    			attr_dev(pattern0, "id", "grid-horizontal");
    			attr_dev(pattern0, "width", "100%");
    			attr_dev(pattern0, "height", "55");
    			attr_dev(pattern0, "patternUnits", "userSpaceOnUse");
    			add_location(pattern0, file$3, 28, 8, 682);
    			attr_dev(line1, "x1", "0");
    			attr_dev(line1, "y1", "0");
    			attr_dev(line1, "x2", "0");
    			attr_dev(line1, "y2", "100%");
    			attr_dev(line1, "class", "grid-line svelte-h5vonp");
    			add_location(line1, file$3, 32, 12, 944);
    			attr_dev(pattern1, "id", "grid-vertical");
    			attr_dev(pattern1, "width", "55");
    			attr_dev(pattern1, "height", "100%");
    			attr_dev(pattern1, "patternUnits", "userSpaceOnUse");
    			add_location(pattern1, file$3, 31, 8, 852);
    			attr_dev(line2, "x1", "0");
    			attr_dev(line2, "y1", "0");
    			attr_dev(line2, "x2", "100%");
    			attr_dev(line2, "y2", "0");
    			attr_dev(line2, "class", "grid-line-minor svelte-h5vonp");
    			add_location(line2, file$3, 36, 12, 1125);
    			attr_dev(pattern2, "id", "grid-minor-horizontal");
    			attr_dev(pattern2, "width", "100%");
    			attr_dev(pattern2, "height", pattern2_height_value = 55 / 4);
    			attr_dev(pattern2, "patternUnits", "userSpaceOnUse");
    			add_location(pattern2, file$3, 35, 8, 1021);
    			attr_dev(line3, "x1", "0");
    			attr_dev(line3, "y1", "0");
    			attr_dev(line3, "x2", "0");
    			attr_dev(line3, "y2", "100%");
    			attr_dev(line3, "class", "grid-line-minor svelte-h5vonp");
    			add_location(line3, file$3, 39, 12, 1309);
    			attr_dev(pattern3, "id", "grid-minor-vertical");
    			attr_dev(pattern3, "width", pattern3_width_value = 55 / 4);
    			attr_dev(pattern3, "height", "100%");
    			attr_dev(pattern3, "patternUnits", "userSpaceOnUse");
    			add_location(pattern3, file$3, 38, 8, 1207);
    			attr_dev(rect0, "x", "0");
    			attr_dev(rect0, "y", "0");
    			attr_dev(rect0, "width", "100%");
    			attr_dev(rect0, "height", "100%");
    			attr_dev(rect0, "fill", "url(#grid-horizontal)");
    			add_location(rect0, file$3, 43, 8, 1401);
    			attr_dev(rect1, "x", "0");
    			attr_dev(rect1, "y", "0");
    			attr_dev(rect1, "width", "100%");
    			attr_dev(rect1, "height", "100%");
    			attr_dev(rect1, "fill", "url(#grid-vertical)");
    			add_location(rect1, file$3, 44, 8, 1477);
    			attr_dev(rect2, "x", "0");
    			attr_dev(rect2, "y", "0");
    			attr_dev(rect2, "width", "100%");
    			attr_dev(rect2, "height", "100%");
    			attr_dev(rect2, "fill", "url(#grid-minor-horizontal)");
    			add_location(rect2, file$3, 45, 8, 1551);
    			attr_dev(rect3, "x", "0");
    			attr_dev(rect3, "y", "0");
    			attr_dev(rect3, "width", "100%");
    			attr_dev(rect3, "height", "100%");
    			attr_dev(rect3, "fill", "url(#grid-minor-vertical)");
    			add_location(rect3, file$3, 46, 8, 1633);
    			attr_dev(svg, "class", "grid-svg svelte-h5vonp");
    			add_location(svg, file$3, 27, 4, 651);
    			attr_dev(div, "class", "key-container svelte-h5vonp");
    			add_location(div, file$3, 15, 0, 314);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, svg);
    			append_dev(svg, pattern0);
    			append_dev(pattern0, line0);
    			append_dev(svg, pattern1);
    			append_dev(pattern1, line1);
    			append_dev(svg, pattern2);
    			append_dev(pattern2, line2);
    			append_dev(svg, pattern3);
    			append_dev(pattern3, line3);
    			append_dev(svg, rect0);
    			append_dev(svg, rect1);
    			append_dev(svg, rect2);
    			append_dev(svg, rect3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*keys, selected, layer, handleKeyClick*/ 15) {
    				const each_value = /*keys*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$1, t, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LayoutViewer", slots, []);
    	
    	let { keys } = $$props;
    	let { layer } = $$props;

    	function selectKey(key) {
    		keys.forEach(k => k.selected = false);
    		key.selected = true;
    		$$invalidate(0, keys);
    	}

    	function handleKeyClick(key) {
    		return () => selectKey(key);
    	}

    	const writable_props = ["keys", "layer"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LayoutViewer> was created with unknown prop '${key}'`);
    	});

    	function key_1_x_binding(value, key) {
    		key.x = value;
    		$$invalidate(0, keys);
    	}

    	function key_1_y_binding(value, key) {
    		key.y = value;
    		$$invalidate(0, keys);
    	}

    	$$self.$$set = $$props => {
    		if ("keys" in $$props) $$invalidate(0, keys = $$props.keys);
    		if ("layer" in $$props) $$invalidate(1, layer = $$props.layer);
    	};

    	$$self.$capture_state = () => ({
    		Key,
    		keys,
    		layer,
    		selectKey,
    		handleKeyClick,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ("keys" in $$props) $$invalidate(0, keys = $$props.keys);
    		if ("layer" in $$props) $$invalidate(1, layer = $$props.layer);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    	};

    	let selected;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*keys*/ 1) {
    			 $$invalidate(2, selected = keys.filter(k => k.selected)[0]);
    		}
    	};

    	return [keys, layer, selected, handleKeyClick, key_1_x_binding, key_1_y_binding];
    }

    class LayoutViewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { keys: 0, layer: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoutViewer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*keys*/ ctx[0] === undefined && !("keys" in props)) {
    			console.warn("<LayoutViewer> was created without expected prop 'keys'");
    		}

    		if (/*layer*/ ctx[1] === undefined && !("layer" in props)) {
    			console.warn("<LayoutViewer> was created without expected prop 'layer'");
    		}
    	}

    	get keys() {
    		throw new Error("<LayoutViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<LayoutViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layer() {
    		throw new Error("<LayoutViewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layer(value) {
    		throw new Error("<LayoutViewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$5 = ".dropdown.svelte-1duovs6.svelte-1duovs6{margin-top:5px;position:absolute;top:2em;left:0;width:8em;background-color:var(--gray-2);border-radius:5px;color:var(--gray-9);flex-direction:column;overflow:hidden;visibility:hidden}.dropdown-item.svelte-1duovs6.svelte-1duovs6{padding-left:10px;padding-right:10px;padding-top:5px;padding-bottom:5px}.dropdown-item.svelte-1duovs6.svelte-1duovs6:hover{background-color:var(--gray-3)}polygon.svelte-1duovs6.svelte-1duovs6{stroke:var(--gray-9);stroke-width:1px;fill:var(--gray-9)}.button.svelte-1duovs6.svelte-1duovs6{color:var(--gray-9);height:2em;padding-left:1em;padding-right:1em;align-items:center;justify-content:center;background-color:var(--blue-5);margin-left:5px;margin-right:5px;border-radius:5px}.button.svelte-1duovs6.svelte-1duovs6:disabled{background-color:var(--gray-5)}.button-group.svelte-1duovs6 .button.svelte-1duovs6{margin:0}.button.icon.svelte-1duovs6.svelte-1duovs6{padding:0;width:2em}.button.danger.svelte-1duovs6.svelte-1duovs6{background-color:var(--red-5)}.button.danger.svelte-1duovs6.svelte-1duovs6:hover{background-color:var(--red-6)}.button.svelte-1duovs6.svelte-1duovs6:hover{background-color:var(--blue-6)}.button.svelte-1duovs6.svelte-1duovs6:first-child{margin-left:0}.button.svelte-1duovs6.svelte-1duovs6:last-child{margin-right:0}.button-group.svelte-1duovs6 .button.svelte-1duovs6{border-radius:0}.button-group.svelte-1duovs6 .button.svelte-1duovs6:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.button-group.svelte-1duovs6 .button.svelte-1duovs6:last-child{border-top-right-radius:5px;border-bottom-right-radius:5px}.button-group.svelte-1duovs6.svelte-1duovs6{margin-left:5px;margin-right:5px}.button-group.svelte-1duovs6.svelte-1duovs6:first-child{margin-left:0}.button-group.svelte-1duovs6.svelte-1duovs6:last-child{margin-right:0}.layout-container.svelte-1duovs6.svelte-1duovs6{position:relative;border:1px solid var(--gray-5);border-radius:5px;flex-grow:1;flex-direction:column}.layout-button-row.svelte-1duovs6.svelte-1duovs6{flex-direction:row;position:absolute;bottom:10px;right:10px}.control-box.svelte-1duovs6.svelte-1duovs6{background-color:var(--gray-1);color:var(--gray-9);padding:10px;border-radius:5px;align-items:stretch}.controls-container.svelte-1duovs6.svelte-1duovs6{height:15em}";
    styleInject(css_248z$5);

    /* src/LayoutEditor.svelte generated by Svelte v3.31.0 */
    const file$4 = "src/LayoutEditor.svelte";

    // (78:16) {#if selected}
    function create_if_block_1$1(ctx) {
    	let div0;
    	let forminput0;
    	let updating_value;
    	let t0;
    	let forminput1;
    	let updating_value_1;
    	let t1;
    	let div1;
    	let forminput2;
    	let updating_value_2;
    	let t2;
    	let forminput3;
    	let updating_value_3;
    	let current;

    	function forminput0_value_binding(value) {
    		/*forminput0_value_binding*/ ctx[10].call(null, value);
    	}

    	let forminput0_props = { type: "number", label: "X" };

    	if (/*selected*/ ctx[3].x !== void 0) {
    		forminput0_props.value = /*selected*/ ctx[3].x;
    	}

    	forminput0 = new FormInput({ props: forminput0_props, $$inline: true });
    	binding_callbacks.push(() => bind(forminput0, "value", forminput0_value_binding));

    	function forminput1_value_binding(value) {
    		/*forminput1_value_binding*/ ctx[11].call(null, value);
    	}

    	let forminput1_props = { type: "number", label: "Y" };

    	if (/*selected*/ ctx[3].y !== void 0) {
    		forminput1_props.value = /*selected*/ ctx[3].y;
    	}

    	forminput1 = new FormInput({ props: forminput1_props, $$inline: true });
    	binding_callbacks.push(() => bind(forminput1, "value", forminput1_value_binding));

    	function forminput2_value_binding(value) {
    		/*forminput2_value_binding*/ ctx[12].call(null, value);
    	}

    	let forminput2_props = { type: "number", label: "Width" };

    	if (/*selected*/ ctx[3].width !== void 0) {
    		forminput2_props.value = /*selected*/ ctx[3].width;
    	}

    	forminput2 = new FormInput({ props: forminput2_props, $$inline: true });
    	binding_callbacks.push(() => bind(forminput2, "value", forminput2_value_binding));

    	function forminput3_value_binding(value) {
    		/*forminput3_value_binding*/ ctx[13].call(null, value);
    	}

    	let forminput3_props = { type: "number", label: "Height" };

    	if (/*selected*/ ctx[3].height !== void 0) {
    		forminput3_props.value = /*selected*/ ctx[3].height;
    	}

    	forminput3 = new FormInput({ props: forminput3_props, $$inline: true });
    	binding_callbacks.push(() => bind(forminput3, "value", forminput3_value_binding));

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(forminput0.$$.fragment);
    			t0 = space();
    			create_component(forminput1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(forminput2.$$.fragment);
    			t2 = space();
    			create_component(forminput3.$$.fragment);
    			attr_dev(div0, "class", "row");
    			add_location(div0, file$4, 78, 20, 2431);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$4, 82, 20, 2660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(forminput0, div0, null);
    			append_dev(div0, t0);
    			mount_component(forminput1, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(forminput2, div1, null);
    			append_dev(div1, t2);
    			mount_component(forminput3, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const forminput0_changes = {};

    			if (!updating_value && dirty & /*selected*/ 8) {
    				updating_value = true;
    				forminput0_changes.value = /*selected*/ ctx[3].x;
    				add_flush_callback(() => updating_value = false);
    			}

    			forminput0.$set(forminput0_changes);
    			const forminput1_changes = {};

    			if (!updating_value_1 && dirty & /*selected*/ 8) {
    				updating_value_1 = true;
    				forminput1_changes.value = /*selected*/ ctx[3].y;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			forminput1.$set(forminput1_changes);
    			const forminput2_changes = {};

    			if (!updating_value_2 && dirty & /*selected*/ 8) {
    				updating_value_2 = true;
    				forminput2_changes.value = /*selected*/ ctx[3].width;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			forminput2.$set(forminput2_changes);
    			const forminput3_changes = {};

    			if (!updating_value_3 && dirty & /*selected*/ 8) {
    				updating_value_3 = true;
    				forminput3_changes.value = /*selected*/ ctx[3].height;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			forminput3.$set(forminput3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forminput0.$$.fragment, local);
    			transition_in(forminput1.$$.fragment, local);
    			transition_in(forminput2.$$.fragment, local);
    			transition_in(forminput3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forminput0.$$.fragment, local);
    			transition_out(forminput1.$$.fragment, local);
    			transition_out(forminput2.$$.fragment, local);
    			transition_out(forminput3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(forminput0);
    			destroy_component(forminput1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(forminput2);
    			destroy_component(forminput3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(78:16) {#if selected}",
    		ctx
    	});

    	return block;
    }

    // (91:16) {#if selected}
    function create_if_block$1(ctx) {
    	let forminput;
    	let updating_value;
    	let current;

    	function forminput_value_binding(value) {
    		/*forminput_value_binding*/ ctx[14].call(null, value);
    	}

    	let forminput_props = { label: "Symbol" };

    	if (/*selected*/ ctx[3].labels[/*selectedLayer*/ ctx[2].id] !== void 0) {
    		forminput_props.value = /*selected*/ ctx[3].labels[/*selectedLayer*/ ctx[2].id];
    	}

    	forminput = new FormInput({ props: forminput_props, $$inline: true });
    	binding_callbacks.push(() => bind(forminput, "value", forminput_value_binding));

    	const block = {
    		c: function create() {
    			create_component(forminput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(forminput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const forminput_changes = {};

    			if (!updating_value && dirty & /*selected, selectedLayer*/ 12) {
    				updating_value = true;
    				forminput_changes.value = /*selected*/ ctx[3].labels[/*selectedLayer*/ ctx[2].id];
    				add_flush_callback(() => updating_value = false);
    			}

    			forminput.$set(forminput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forminput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forminput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(forminput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(91:16) {#if selected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div15;
    	let div14;
    	let div10;
    	let layoutviewer;
    	let updating_keys;
    	let t0;
    	let div9;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let svg;
    	let polygon;
    	let t3;
    	let div7;
    	let div3;
    	let t5;
    	let div4;
    	let t7;
    	let div5;
    	let t9;
    	let div6;
    	let t11;
    	let div8;
    	let t12;
    	let div8_disabled_value;
    	let t13;
    	let div13;
    	let editablelist;
    	let updating_items;
    	let updating_selected;
    	let t14;
    	let div11;
    	let t15;
    	let t16;
    	let div12;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;

    	function layoutviewer_keys_binding(value) {
    		/*layoutviewer_keys_binding*/ ctx[6].call(null, value);
    	}

    	let layoutviewer_props = { layer: /*selectedLayer*/ ctx[2]?.id };

    	if (/*keys*/ ctx[0] !== void 0) {
    		layoutviewer_props.keys = /*keys*/ ctx[0];
    	}

    	layoutviewer = new LayoutViewer({
    			props: layoutviewer_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(layoutviewer, "keys", layoutviewer_keys_binding));

    	function editablelist_items_binding(value) {
    		/*editablelist_items_binding*/ ctx[8].call(null, value);
    	}

    	function editablelist_selected_binding(value) {
    		/*editablelist_selected_binding*/ ctx[9].call(null, value);
    	}

    	let editablelist_props = { title: "Layers" };

    	if (/*layers*/ ctx[1] !== void 0) {
    		editablelist_props.items = /*layers*/ ctx[1];
    	}

    	if (/*selectedLayer*/ ctx[2] !== void 0) {
    		editablelist_props.selected = /*selectedLayer*/ ctx[2];
    	}

    	editablelist = new EditableList({
    			props: editablelist_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(editablelist, "items", editablelist_items_binding));
    	binding_callbacks.push(() => bind(editablelist, "selected", editablelist_selected_binding));
    	let if_block0 = /*selected*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block1 = /*selected*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div14 = element("div");
    			div10 = element("div");
    			create_component(layoutviewer.$$.fragment);
    			t0 = space();
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Add";
    			t2 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			polygon = svg_element("polygon");
    			t3 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div3.textContent = "← Add Left";
    			t5 = space();
    			div4 = element("div");
    			div4.textContent = "→ Add Right";
    			t7 = space();
    			div5 = element("div");
    			div5.textContent = "↑ Add Up";
    			t9 = space();
    			div6 = element("div");
    			div6.textContent = "↓ Add Down";
    			t11 = space();
    			div8 = element("div");
    			t12 = text("Remove");
    			t13 = space();
    			div13 = element("div");
    			create_component(editablelist.$$.fragment);
    			t14 = space();
    			div11 = element("div");
    			t15 = text("Key Settings\n                ");
    			if (if_block0) if_block0.c();
    			t16 = space();
    			div12 = element("div");
    			t17 = text("Layer Settings\n                ");
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "button svelte-1duovs6");
    			add_location(div0, file$4, 44, 20, 1149);
    			attr_dev(polygon, "points", "0,0 12,0 6,6");
    			attr_dev(polygon, "class", "svelte-1duovs6");
    			add_location(polygon, file$4, 49, 28, 1366);
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "6");
    			add_location(svg, file$4, 48, 24, 1314);
    			attr_dev(div1, "class", "button icon svelte-1duovs6");
    			add_location(div1, file$4, 47, 20, 1264);
    			attr_dev(div2, "class", "button-group svelte-1duovs6");
    			add_location(div2, file$4, 43, 16, 1104);
    			attr_dev(div3, "class", "dropdown-item svelte-1duovs6");
    			add_location(div3, file$4, 54, 20, 1539);
    			attr_dev(div4, "class", "dropdown-item svelte-1duovs6");
    			add_location(div4, file$4, 57, 20, 1647);
    			attr_dev(div5, "class", "dropdown-item svelte-1duovs6");
    			add_location(div5, file$4, 60, 20, 1756);
    			attr_dev(div6, "class", "dropdown-item svelte-1duovs6");
    			add_location(div6, file$4, 63, 20, 1862);
    			attr_dev(div7, "class", "dropdown svelte-1duovs6");
    			add_location(div7, file$4, 53, 16, 1496);
    			attr_dev(div8, "class", "button danger svelte-1duovs6");
    			attr_dev(div8, "disabled", div8_disabled_value = !/*selected*/ ctx[3]);
    			add_location(div8, file$4, 67, 16, 1989);
    			attr_dev(div9, "class", "layout-button-row svelte-1duovs6");
    			add_location(div9, file$4, 42, 12, 1058);
    			attr_dev(div10, "class", "layout-container svelte-1duovs6");
    			add_location(div10, file$4, 39, 8, 945);
    			attr_dev(div11, "class", "column grow control-box svelte-1duovs6");
    			add_location(div11, file$4, 75, 12, 2313);
    			attr_dev(div12, "class", "column grow control-box svelte-1duovs6");
    			add_location(div12, file$4, 88, 12, 2940);
    			attr_dev(div13, "class", "row controls-container svelte-1duovs6");
    			add_location(div13, file$4, 73, 8, 2171);
    			attr_dev(div14, "class", "column");
    			add_location(div14, file$4, 38, 4, 918);
    			attr_dev(div15, "class", "stretch-row");
    			add_location(div15, file$4, 37, 0, 890);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div14);
    			append_dev(div14, div10);
    			mount_component(layoutviewer, div10, null);
    			append_dev(div10, t0);
    			append_dev(div10, div9);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, polygon);
    			append_dev(div9, t3);
    			append_dev(div9, div7);
    			append_dev(div7, div3);
    			append_dev(div7, t5);
    			append_dev(div7, div4);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div9, t11);
    			append_dev(div9, div8);
    			append_dev(div8, t12);
    			append_dev(div14, t13);
    			append_dev(div14, div13);
    			mount_component(editablelist, div13, null);
    			append_dev(div13, t14);
    			append_dev(div13, div11);
    			append_dev(div11, t15);
    			if (if_block0) if_block0.m(div11, null);
    			append_dev(div13, t16);
    			append_dev(div13, div12);
    			append_dev(div12, t17);
    			if (if_block1) if_block1.m(div12, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*handleAdd*/ ctx[4], false, false, false),
    					listen_dev(div8, "click", /*click_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const layoutviewer_changes = {};
    			if (dirty & /*selectedLayer*/ 4) layoutviewer_changes.layer = /*selectedLayer*/ ctx[2]?.id;

    			if (!updating_keys && dirty & /*keys*/ 1) {
    				updating_keys = true;
    				layoutviewer_changes.keys = /*keys*/ ctx[0];
    				add_flush_callback(() => updating_keys = false);
    			}

    			layoutviewer.$set(layoutviewer_changes);

    			if (!current || dirty & /*selected*/ 8 && div8_disabled_value !== (div8_disabled_value = !/*selected*/ ctx[3])) {
    				attr_dev(div8, "disabled", div8_disabled_value);
    			}

    			const editablelist_changes = {};

    			if (!updating_items && dirty & /*layers*/ 2) {
    				updating_items = true;
    				editablelist_changes.items = /*layers*/ ctx[1];
    				add_flush_callback(() => updating_items = false);
    			}

    			if (!updating_selected && dirty & /*selectedLayer*/ 4) {
    				updating_selected = true;
    				editablelist_changes.selected = /*selectedLayer*/ ctx[2];
    				add_flush_callback(() => updating_selected = false);
    			}

    			editablelist.$set(editablelist_changes);

    			if (/*selected*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*selected*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div11, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selected*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*selected*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div12, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layoutviewer.$$.fragment, local);
    			transition_in(editablelist.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layoutviewer.$$.fragment, local);
    			transition_out(editablelist.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);
    			destroy_component(layoutviewer);
    			destroy_component(editablelist);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LayoutEditor", slots, []);
    	
    	let { keys = [] } = $$props;
    	let layers = [{ id: 0, name: "Main" }];
    	let selectedLayer;
    	let nextId = 99;

    	function handleAdd() {
    		var _a;
    		let x = selected ? selected.x + selected.width : 0;

    		let y = (_a = selected === null || selected === void 0
    		? void 0
    		: selected.y) !== null && _a !== void 0
    		? _a
    		: 0;

    		let key = {
    			id: nextId++,
    			labels: {},
    			x,
    			y,
    			width: 1,
    			height: 1,
    			selected: true
    		};

    		keys.forEach(k => k.selected = false);
    		$$invalidate(0, keys = [...keys, key]);
    	}

    	function handleRemove(key) {
    		$$invalidate(0, keys = keys.filter(k => k != key));
    	}

    	const writable_props = ["keys"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LayoutEditor> was created with unknown prop '${key}'`);
    	});

    	function layoutviewer_keys_binding(value) {
    		keys = value;
    		$$invalidate(0, keys);
    	}

    	const click_handler = () => handleRemove(selected);

    	function editablelist_items_binding(value) {
    		layers = value;
    		$$invalidate(1, layers);
    	}

    	function editablelist_selected_binding(value) {
    		selectedLayer = value;
    		$$invalidate(2, selectedLayer);
    	}

    	function forminput0_value_binding(value) {
    		selected.x = value;
    		($$invalidate(3, selected), $$invalidate(0, keys));
    	}

    	function forminput1_value_binding(value) {
    		selected.y = value;
    		($$invalidate(3, selected), $$invalidate(0, keys));
    	}

    	function forminput2_value_binding(value) {
    		selected.width = value;
    		($$invalidate(3, selected), $$invalidate(0, keys));
    	}

    	function forminput3_value_binding(value) {
    		selected.height = value;
    		($$invalidate(3, selected), $$invalidate(0, keys));
    	}

    	function forminput_value_binding(value) {
    		selected.labels[selectedLayer.id] = value;
    		($$invalidate(3, selected), $$invalidate(0, keys));
    	}

    	$$self.$$set = $$props => {
    		if ("keys" in $$props) $$invalidate(0, keys = $$props.keys);
    	};

    	$$self.$capture_state = () => ({
    		EditableList,
    		FormInput,
    		LayoutViewer,
    		keys,
    		layers,
    		selectedLayer,
    		nextId,
    		handleAdd,
    		handleRemove,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ("keys" in $$props) $$invalidate(0, keys = $$props.keys);
    		if ("layers" in $$props) $$invalidate(1, layers = $$props.layers);
    		if ("selectedLayer" in $$props) $$invalidate(2, selectedLayer = $$props.selectedLayer);
    		if ("nextId" in $$props) nextId = $$props.nextId;
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	let selected;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*keys*/ 1) {
    			 $$invalidate(3, selected = keys.filter(k => k.selected)[0]);
    		}
    	};

    	return [
    		keys,
    		layers,
    		selectedLayer,
    		selected,
    		handleAdd,
    		handleRemove,
    		layoutviewer_keys_binding,
    		click_handler,
    		editablelist_items_binding,
    		editablelist_selected_binding,
    		forminput0_value_binding,
    		forminput1_value_binding,
    		forminput2_value_binding,
    		forminput3_value_binding,
    		forminput_value_binding
    	];
    }

    class LayoutEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { keys: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoutEditor",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get keys() {
    		throw new Error("<LayoutEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<LayoutEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$6 = ".selected.svelte-n56933{background-color:#888 !important}.item.svelte-n56933{background-color:#ccc}";
    styleInject(css_248z$6);

    /* src/Components/ListItem.svelte generated by Svelte v3.31.0 */

    const file$5 = "src/Components/ListItem.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "item svelte-n56933");
    			toggle_class(div, "selected", /*selected*/ ctx[0]);
    			add_location(div, file$5, 3, 0, 40);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(div, "selected", /*selected*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ListItem", slots, ['default']);
    	let { selected } = $$props;
    	const writable_props = ["selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ selected });

    	$$self.$inject_state = $$props => {
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, $$scope, slots, click_handler];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { selected: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selected*/ ctx[0] === undefined && !("selected" in props)) {
    			console.warn("<ListItem> was created without expected prop 'selected'");
    		}
    	}

    	get selected() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/StringList.svelte generated by Svelte v3.31.0 */
    const file$6 = "src/Components/StringList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (10:8) <ListItem selected={item == selected} on:click={() => selected = item}>
    function create_default_slot(ctx) {
    	let t0_value = /*item*/ ctx[3] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[3] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:8) <ListItem selected={item == selected} on:click={() => selected = item}>",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each items as item}
    function create_each_block$2(ctx) {
    	let listitem;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*item*/ ctx[3]);
    	}

    	listitem = new ListItem({
    			props: {
    				selected: /*item*/ ctx[3] == /*selected*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listitem.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			create_component(listitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty & /*items, selected*/ 3) listitem_changes.selected = /*item*/ ctx[3] == /*selected*/ ctx[0];

    			if (dirty & /*$$scope, items*/ 66) {
    				listitem_changes.$$scope = { dirty, ctx };
    			}

    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:4) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "column");
    			add_location(div, file$6, 7, 0, 140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items, selected*/ 3) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StringList", slots, []);
    	let { items } = $$props;
    	let { selected } = $$props;
    	if (!selected) selected = items[0];
    	const writable_props = ["items", "selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StringList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => $$invalidate(0, selected = item);

    	$$self.$$set = $$props => {
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({ ListItem, items, selected });

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, items, click_handler];
    }

    class StringList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { items: 1, selected: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StringList",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[1] === undefined && !("items" in props)) {
    			console.warn("<StringList> was created without expected prop 'items'");
    		}

    		if (/*selected*/ ctx[0] === undefined && !("selected" in props)) {
    			console.warn("<StringList> was created without expected prop 'selected'");
    		}
    	}

    	get items() {
    		throw new Error("<StringList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<StringList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<StringList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<StringList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PipelineEditor.svelte generated by Svelte v3.31.0 */

    const { Object: Object_1 } = globals;
    const file$7 = "src/PipelineEditor.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (44:16) {#each StageTypes as stage}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*stage*/ ctx[7].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*stage*/ ctx[7].Name;
    			option.value = option.__value;
    			add_location(option, file$7, 44, 20, 1172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(44:16) {#each StageTypes as stage}",
    		ctx
    	});

    	return block;
    }

    // (52:8) {#each stages as stage}
    function create_each_block$3(ctx) {
    	let div;
    	let t0_value = /*stage*/ ctx[7] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "row");
    			add_location(div, file$7, 52, 12, 1435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stages*/ 2 && t0_value !== (t0_value = /*stage*/ ctx[7] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(52:8) {#each stages as stage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let b;
    	let t1;
    	let stringlist;
    	let t2;
    	let div1;
    	let t3;
    	let br0;
    	let t4;
    	let select0;
    	let option0;
    	let option1;
    	let t7;
    	let br1;
    	let t8;
    	let select1;
    	let option2;
    	let option3;
    	let t11;
    	let div5;
    	let div3;
    	let t13;
    	let div4;
    	let select2;
    	let option4;
    	let option4_value_value;
    	let t14;
    	let button;
    	let t15;
    	let button_disabled_value;
    	let t16;
    	let current;
    	let mounted;
    	let dispose;

    	stringlist = new StringList({
    			props: { items: /*symbols*/ ctx[2] },
    			$$inline: true
    		});

    	let each_value_1 = /*StageTypes*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*stages*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			b = element("b");
    			b.textContent = "Symbols";
    			t1 = space();
    			create_component(stringlist.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Press Action");
    			br0 = element("br");
    			t4 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Update HID";
    			option1 = element("option");
    			option1.textContent = "Set Layer";
    			t7 = text("\n            Release Action");
    			br1 = element("br");
    			t8 = space();
    			select1 = element("select");
    			option2 = element("option");
    			option2.textContent = "Update HID";
    			option3 = element("option");
    			option3.textContent = "Set Layer";
    			t11 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Pipeline";
    			t13 = space();
    			div4 = element("div");
    			select2 = element("select");
    			option4 = element("option");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t14 = space();
    			button = element("button");
    			t15 = text("+");
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(b, file$7, 20, 12, 464);
    			attr_dev(div0, "class", "column grow");
    			add_location(div0, file$7, 19, 8, 426);
    			add_location(br0, file$7, 24, 24, 594);
    			option0.__value = "Update HID";
    			option0.value = option0.__value;
    			add_location(option0, file$7, 26, 16, 637);
    			option1.__value = "Set Layer";
    			option1.value = option1.__value;
    			add_location(option1, file$7, 27, 16, 681);
    			add_location(select0, file$7, 25, 12, 612);
    			add_location(br1, file$7, 29, 26, 756);
    			option2.__value = "Update HID";
    			option2.value = option2.__value;
    			add_location(option2, file$7, 31, 16, 799);
    			option3.__value = "Set Layer";
    			option3.value = option3.__value;
    			add_location(option3, file$7, 32, 16, 843);
    			add_location(select1, file$7, 30, 12, 774);
    			attr_dev(div1, "class", "column grow");
    			add_location(div1, file$7, 23, 8, 544);
    			attr_dev(div2, "class", "row grow");
    			add_location(div2, file$7, 18, 4, 395);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$7, 37, 8, 949);
    			option4.__value = option4_value_value = null;
    			option4.value = option4.__value;
    			add_location(option4, file$7, 42, 16, 1085);
    			if (/*nextStage*/ ctx[0] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[6].call(select2));
    			add_location(select2, file$7, 41, 12, 1037);
    			button.disabled = button_disabled_value = !/*nextStage*/ ctx[0];
    			add_location(button, file$7, 47, 12, 1279);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$7, 40, 8, 1009);
    			attr_dev(div5, "class", "column");
    			add_location(div5, file$7, 36, 4, 922);
    			attr_dev(div6, "class", "row fill");
    			add_location(div6, file$7, 17, 0, 368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, b);
    			append_dev(div0, t1);
    			mount_component(stringlist, div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, br0);
    			append_dev(div1, t4);
    			append_dev(div1, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(div1, t7);
    			append_dev(div1, br1);
    			append_dev(div1, t8);
    			append_dev(div1, select1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div4, select2);
    			append_dev(select2, option4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select2, null);
    			}

    			select_option(select2, /*nextStage*/ ctx[0]);
    			append_dev(div4, t14);
    			append_dev(div4, button);
    			append_dev(button, t15);
    			append_dev(div5, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[6]),
    					listen_dev(button, "click", /*handleAddStage*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const stringlist_changes = {};
    			if (dirty & /*symbols*/ 4) stringlist_changes.items = /*symbols*/ ctx[2];
    			stringlist.$set(stringlist_changes);

    			if (dirty & /*StageTypes*/ 8) {
    				each_value_1 = /*StageTypes*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*nextStage, StageTypes*/ 9) {
    				select_option(select2, /*nextStage*/ ctx[0]);
    			}

    			if (!current || dirty & /*nextStage, StageTypes*/ 9 && button_disabled_value !== (button_disabled_value = !/*nextStage*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*stages*/ 2) {
    				each_value = /*stages*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stringlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stringlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(stringlist);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PipelineEditor", slots, []);
    	
    	const StageTypes = [{ Name: "Action Bindings" }];
    	let { keys } = $$props;
    	let nextStage;
    	let stages = [];

    	function handleAddStage() {
    		$$invalidate(1, stages = [...stages, nextStage]);
    		$$invalidate(0, nextStage = null);
    	}

    	const writable_props = ["keys"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PipelineEditor> was created with unknown prop '${key}'`);
    	});

    	function select2_change_handler() {
    		nextStage = select_value(this);
    		$$invalidate(0, nextStage);
    		$$invalidate(3, StageTypes);
    	}

    	$$self.$$set = $$props => {
    		if ("keys" in $$props) $$invalidate(5, keys = $$props.keys);
    	};

    	$$self.$capture_state = () => ({
    		StringList,
    		StageTypes,
    		keys,
    		nextStage,
    		stages,
    		handleAddStage,
    		symbols
    	});

    	$$self.$inject_state = $$props => {
    		if ("keys" in $$props) $$invalidate(5, keys = $$props.keys);
    		if ("nextStage" in $$props) $$invalidate(0, nextStage = $$props.nextStage);
    		if ("stages" in $$props) $$invalidate(1, stages = $$props.stages);
    		if ("symbols" in $$props) $$invalidate(2, symbols = $$props.symbols);
    	};

    	let symbols;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*keys*/ 32) {
    			 $$invalidate(2, symbols = keys.flatMap(k => Object.keys(k.labels).map(l => k.labels[l])).sort());
    		}
    	};

    	return [
    		nextStage,
    		stages,
    		symbols,
    		StageTypes,
    		handleAddStage,
    		keys,
    		select2_change_handler
    	];
    }

    class PipelineEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { keys: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PipelineEditor",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*keys*/ ctx[5] === undefined && !("keys" in props)) {
    			console.warn("<PipelineEditor> was created without expected prop 'keys'");
    		}
    	}

    	get keys() {
    		throw new Error("<PipelineEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<PipelineEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$7 = ".tab-icon-container.svelte-1n8cpoe.svelte-1n8cpoe{height:2.4em;width:2.4em;border-radius:1.2em;margin:0.3em;background-color:var(--gray-1);align-items:center;justify-content:center;align-content:center}.tab.svelte-1n8cpoe:hover>.tab-icon-container.svelte-1n8cpoe{background-color:var(--gray-2)}.tab-selected.svelte-1n8cpoe>.tab-icon-container.svelte-1n8cpoe{background-color:var(--blue-6) !important}.tab-control-container.svelte-1n8cpoe.svelte-1n8cpoe{border-radius:5px;margin:20px;overflow:hidden}.tab-selected.svelte-1n8cpoe.svelte-1n8cpoe{position:relative;background-color:var(--gray-1) !important;color:var(--gray-9) !important}.tab-selected.svelte-1n8cpoe path.svelte-1n8cpoe{stroke:var(--gray-9) !important;fill:var(--gray-9) !important}.tab.svelte-1n8cpoe.svelte-1n8cpoe:hover{background-color:var(--gray-1)}.tab.svelte-1n8cpoe path.svelte-1n8cpoe{stroke:var(--gray-5);fill:var(--gray-5)}.tab.svelte-1n8cpoe.svelte-1n8cpoe{height:3em;width:10em;justify-content:flex-start;align-items:center;color:var(--gray-5);border-radius:5px;user-select:none;cursor:pointer;margin-bottom:5px}";
    styleInject(css_248z$7);

    /* src/TabControl.svelte generated by Svelte v3.31.0 */
    const file$8 = "src/TabControl.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (20:8) {#each $tabs as tab}
    function create_each_block$4(ctx) {
    	let div1;
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*tab*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(path, "d", "M22,10h-9V6c0-0.55-0.45-1-1-1V2c0-0.55-0.45-1-1-1H5C4.45,1,4,1.45,4,2v3C3.45,5,3,5.45,3,6v7c0,3.86,3.14,7,7,7h9v6   c0,0.55,0.45,1,1,1v3c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1v-3c0.55,0,1-0.45,1-1v-9C29,13.14,25.86,10,22,10z M6,3h4v2H6V3z    M26,29h-4v-2h4V29z");
    			attr_dev(path, "class", "svelte-1n8cpoe");
    			add_location(path, file$8, 24, 24, 686);
    			attr_dev(svg, "viewBox", "-10 -10 53 53");
    			add_location(svg, file$8, 23, 20, 632);
    			attr_dev(div0, "class", "tab-icon-container svelte-1n8cpoe");
    			add_location(div0, file$8, 21, 16, 578);
    			attr_dev(div1, "class", "tab svelte-1n8cpoe");
    			toggle_class(div1, "tab-selected", /*tab*/ ctx[7] == /*$selectedTab*/ ctx[1]);
    			add_location(div1, file$8, 20, 12, 467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, t2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$tabs*/ 1 && t1_value !== (t1_value = /*tab*/ ctx[7] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$tabs, $selectedTab*/ 3) {
    				toggle_class(div1, "tab-selected", /*tab*/ ctx[7] == /*$selectedTab*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(20:8) {#each $tabs as tab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let each_value = /*$tabs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "column");
    			add_location(div0, file$8, 18, 4, 405);
    			attr_dev(div1, "class", "row tab-control-container svelte-1n8cpoe");
    			add_location(div1, file$8, 17, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$tabs, $selectedTab*/ 3) {
    				each_value = /*$tabs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const tabsKey = {};

    function instance$8($$self, $$props, $$invalidate) {
    	let $tabs;
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabControl", slots, ['default']);
    	const tabs = writable([]);
    	validate_store(tabs, "tabs");
    	component_subscribe($$self, tabs, value => $$invalidate(0, $tabs = value));
    	const selectedTab = writable(null);
    	validate_store(selectedTab, "selectedTab");
    	component_subscribe($$self, selectedTab, value => $$invalidate(1, $selectedTab = value));
    	setContext(tabsKey, { tabs, selectedTab });

    	onMount(() => {
    		if ($tabs.length > 0) set_store_value(selectedTab, $selectedTab = $tabs[0], $selectedTab);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TabControl> was created with unknown prop '${key}'`);
    	});

    	const click_handler = tab => set_store_value(selectedTab, $selectedTab = tab, $selectedTab);

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tabsKey,
    		setContext,
    		onMount,
    		writable,
    		tabs,
    		selectedTab,
    		$tabs,
    		$selectedTab
    	});

    	return [$tabs, $selectedTab, tabs, selectedTab, $$scope, slots, click_handler];
    }

    class TabControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabControl",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var css_248z$8 = ".hidden.svelte-17d6rj9{visibility:collapse}";
    styleInject(css_248z$8);

    /* src/Tab.svelte generated by Svelte v3.31.0 */
    const file$9 = "src/Tab.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "fill svelte-17d6rj9");
    			toggle_class(div, "hidden", /*$selectedTab*/ ctx[1] != /*tab*/ ctx[0]);
    			add_location(div, file$9, 11, 0, 278);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (dirty & /*$selectedTab, tab*/ 3) {
    				toggle_class(div, "hidden", /*$selectedTab*/ ctx[1] != /*tab*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $tabs;
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tab", slots, ['default']);
    	let { tab } = $$props;
    	let context = getContext(tabsKey);
    	let tabs = context.tabs;
    	validate_store(tabs, "tabs");
    	component_subscribe($$self, tabs, value => $$invalidate(6, $tabs = value));
    	let selectedTab = context.selectedTab;
    	validate_store(selectedTab, "selectedTab");
    	component_subscribe($$self, selectedTab, value => $$invalidate(1, $selectedTab = value));

    	onMount(() => {
    		tabs.set([...$tabs, tab]);
    	});

    	const writable_props = ["tab"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tabsKey,
    		getContext,
    		onMount,
    		tab,
    		context,
    		tabs,
    		selectedTab,
    		$tabs,
    		$selectedTab
    	});

    	$$self.$inject_state = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("context" in $$props) context = $$props.context;
    		if ("tabs" in $$props) $$invalidate(2, tabs = $$props.tabs);
    		if ("selectedTab" in $$props) $$invalidate(3, selectedTab = $$props.selectedTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tab, $selectedTab, tabs, selectedTab, $$scope, slots];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { tab: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tab*/ ctx[0] === undefined && !("tab" in props)) {
    			console.warn("<Tab> was created without expected prop 'tab'");
    		}
    	}

    	get tab() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */

    // (34:4) <Tab tab="Layout">
    function create_default_slot_2(ctx) {
    	let layouteditor;
    	let updating_keys;
    	let current;

    	function layouteditor_keys_binding(value) {
    		/*layouteditor_keys_binding*/ ctx[1].call(null, value);
    	}

    	let layouteditor_props = {};

    	if (/*layout*/ ctx[0] !== void 0) {
    		layouteditor_props.keys = /*layout*/ ctx[0];
    	}

    	layouteditor = new LayoutEditor({
    			props: layouteditor_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(layouteditor, "keys", layouteditor_keys_binding));

    	const block = {
    		c: function create() {
    			create_component(layouteditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layouteditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layouteditor_changes = {};

    			if (!updating_keys && dirty & /*layout*/ 1) {
    				updating_keys = true;
    				layouteditor_changes.keys = /*layout*/ ctx[0];
    				add_flush_callback(() => updating_keys = false);
    			}

    			layouteditor.$set(layouteditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layouteditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layouteditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layouteditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(34:4) <Tab tab=\\\"Layout\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:4) <Tab tab="Pipeline">
    function create_default_slot_1(ctx) {
    	let pipelineeditor;
    	let current;

    	pipelineeditor = new PipelineEditor({
    			props: { keys: /*layout*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pipelineeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pipelineeditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pipelineeditor_changes = {};
    			if (dirty & /*layout*/ 1) pipelineeditor_changes.keys = /*layout*/ ctx[0];
    			pipelineeditor.$set(pipelineeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pipelineeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pipelineeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pipelineeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(37:4) <Tab tab=\\\"Pipeline\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:0) <TabControl>
    function create_default_slot$1(ctx) {
    	let tab0;
    	let t;
    	let tab1;
    	let current;

    	tab0 = new Tab({
    			props: {
    				tab: "Layout",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				tab: "Pipeline",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t = space();
    			create_component(tab1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tab1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope, layout*/ 5) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope, layout*/ 5) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tab1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:0) <TabControl>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let tabcontrol;
    	let current;

    	tabcontrol = new TabControl({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabcontrol.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabcontrol, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabcontrol_changes = {};

    			if (dirty & /*$$scope, layout*/ 5) {
    				tabcontrol_changes.$$scope = { dirty, ctx };
    			}

    			tabcontrol.$set(tabcontrol_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabcontrol.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabcontrol.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabcontrol, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	

    	let layout = []; // {
    	//     id: 0,
    	//     labels: {

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function layouteditor_keys_binding(value) {
    		layout = value;
    		$$invalidate(0, layout);
    	}

    	$$self.$capture_state = () => ({
    		LayoutEditor,
    		PipelineEditor,
    		TabControl,
    		Tab,
    		layout
    	});

    	$$self.$inject_state = $$props => {
    		if ("layout" in $$props) $$invalidate(0, layout = $$props.layout);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [layout, layouteditor_keys_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
