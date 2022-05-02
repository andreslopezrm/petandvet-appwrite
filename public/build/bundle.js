
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
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
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
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

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse$1(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1, Object: Object_1$1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$h(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse$1(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse: parse$1,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/Footer.svelte generated by Svelte v3.47.0 */

    const file$u = "src/lib/componentes/Footer.svelte";

    function create_fragment$y(ctx) {
    	let footer;
    	let p;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			p = element("p");
    			p.textContent = "Project for Hackaton AppWrite 2022";
    			add_location(p, file$u, 1, 4, 13);
    			attr_dev(footer, "class", "svelte-1m9y8aa");
    			add_location(footer, file$u, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    const createState = () => {

        const { subscribe, set, update } = writable({
            account: null,
        });

        return {
            subscribe,
            init: async (account = null) => {
                return set({ account });
            },
            update: async (account) => {
                update((currentState) => {
                    currentState.account = account;
                    return currentState;
                });
            },
            destroy: async () => {
                update((currentState) => {
                    currentState.account = null;
                    return currentState;
                });
            }
        };
    };

    const state = createState();

    /* src/lib/componentes/Header.svelte generated by Svelte v3.47.0 */
    const file$t = "src/lib/componentes/Header.svelte";

    // (29:12) {#if isShowMenu}
    function create_if_block$g(ctx) {
    	let div;
    	let t;
    	let div_transition;
    	let current;
    	let if_block0 = /*account*/ ctx[1] && create_if_block_2$3(ctx);
    	let if_block1 = !/*account*/ ctx[1] && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(div, file$t, 29, 16, 554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*account*/ ctx[1]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*account*/ ctx[1]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$6(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(29:12) {#if isShowMenu}",
    		ctx
    	});

    	return block;
    }

    // (31:20) {#if account}
    function create_if_block_2$3(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "ℹ️ My Profile";
    			attr_dev(a, "href", "/profile");
    			attr_dev(a, "class", "svelte-tjx43h");
    			add_location(a, file$t, 31, 24, 657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(31:20) {#if account}",
    		ctx
    	});

    	return block;
    }

    // (35:20) {#if !account}
    function create_if_block_1$6(ctx) {
    	let a0;
    	let t1;
    	let span;
    	let t3;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a0 = element("a");
    			a0.textContent = "Register";
    			t1 = space();
    			span = element("span");
    			span.textContent = "|";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Login";
    			attr_dev(a0, "href", "/register");
    			attr_dev(a0, "class", "svelte-tjx43h");
    			add_location(a0, file$t, 35, 20, 786);
    			attr_dev(span, "class", "text-white");
    			add_location(span, file$t, 36, 20, 851);
    			attr_dev(a1, "href", "/login");
    			attr_dev(a1, "class", "svelte-tjx43h");
    			add_location(a1, file$t, 37, 20, 907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, a1, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(a1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(35:20) {#if !account}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let nav;
    	let div;
    	let h1;
    	let a;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isShowMenu*/ ctx[0] && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			h1 = element("h1");
    			a = element("a");
    			a.textContent = "🐾 🧑‍⚕️ Pet And Vet";
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-tjx43h");
    			add_location(a, file$t, 26, 12, 448);
    			attr_dev(h1, "class", "svelte-tjx43h");
    			add_location(h1, file$t, 25, 8, 431);
    			attr_dev(div, "class", "container header svelte-tjx43h");
    			add_location(div, file$t, 24, 4, 392);
    			attr_dev(nav, "class", "svelte-tjx43h");
    			add_location(nav, file$t, 23, 0, 382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, h1);
    			append_dev(h1, a);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isShowMenu*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isShowMenu*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let isShowMenu = false;
    	let account = null;

    	function visibleMenu() {
    		$$invalidate(0, isShowMenu = true);
    	}

    	onMount(() => {
    		setTimeout(visibleMenu, 600);
    	});

    	state.subscribe(data => {
    		$$invalidate(1, account = data?.account);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		fade,
    		state,
    		isShowMenu,
    		account,
    		visibleMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('isShowMenu' in $$props) $$invalidate(0, isShowMenu = $$props.isShowMenu);
    		if ('account' in $$props) $$invalidate(1, account = $$props.account);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isShowMenu, account];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules/agnostic-svelte/components/Alert/Alert.svelte generated by Svelte v3.47.0 */

    const file$s = "node_modules/agnostic-svelte/components/Alert/Alert.svelte";
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    function create_fragment$w(ctx) {
    	let div;
    	let t;
    	let div_aria_live_value;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[15].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[14], get_icon_slot_context);
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "" + (null_to_empty(/*classes*/ ctx[2]) + " svelte-1bkxfyu"));
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "aria-atomic", /*ariaAtomicValue*/ ctx[1]);
    			attr_dev(div, "aria-live", div_aria_live_value = /*ariaLiveValue*/ ctx[0]());
    			add_location(div, file$s, 303, 0, 6803);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[14], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*ariaLiveValue*/ 1 && div_aria_live_value !== (div_aria_live_value = /*ariaLiveValue*/ ctx[0]())) {
    				attr_dev(div, "aria-live", div_aria_live_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot) icon_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let ariaLiveValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, ['icon','default']);
    	let { isAnimationFadeIn = true } = $$props;
    	let { isAnimationSlideUp = false } = $$props;
    	let { isToast = false } = $$props;
    	let { isRounded = false } = $$props;
    	let { isBorderAll = false } = $$props;
    	let { isBorderLeft = false } = $$props;
    	let { isBorderRight = false } = $$props;
    	let { isBorderTop = false } = $$props;
    	let { isBorderBottom = false } = $$props;
    	let { isBlockEnd = false } = $$props;
    	let { type = "" } = $$props;
    	let typeClass;

    	switch (type) {
    		case "warning":
    			typeClass = "alert-warning";
    			break;
    		case "dark":
    			typeClass = "alert-dark";
    			break;
    		case "error":
    			typeClass = "alert-error";
    			break;
    		case "info":
    			typeClass = "alert-info";
    			break;
    		case "success":
    			typeClass = "alert-success";
    			break;
    		default:
    			typeClass = "";
    	}

    	const ariaAtomicValue = isToast ? true : undefined;

    	const classes = [
    		"alert",
    		typeClass,
    		isRounded ? "alert-rounded" : "",
    		isBorderAll ? "alert-border-all" : "",
    		isBorderLeft ? "alert-border-left" : "",
    		isBorderRight ? "alert-border-right" : "",
    		isBorderTop ? "alert-border-top" : "",
    		isBorderBottom ? "alert-border-bottom" : "",
    		isBlockEnd ? "alert-end" : "",
    		isAnimationFadeIn && !isAnimationSlideUp
    		? "fade-in"
    		: "",
    		!isAnimationFadeIn && isAnimationSlideUp
    		? "slide-up"
    		: "",
    		isAnimationFadeIn && isAnimationSlideUp
    		? "slide-up-fade-in"
    		: ""
    	].filter(klass => klass.length).join(" ");

    	const writable_props = [
    		'isAnimationFadeIn',
    		'isAnimationSlideUp',
    		'isToast',
    		'isRounded',
    		'isBorderAll',
    		'isBorderLeft',
    		'isBorderRight',
    		'isBorderTop',
    		'isBorderBottom',
    		'isBlockEnd',
    		'type'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alert> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isAnimationFadeIn' in $$props) $$invalidate(3, isAnimationFadeIn = $$props.isAnimationFadeIn);
    		if ('isAnimationSlideUp' in $$props) $$invalidate(4, isAnimationSlideUp = $$props.isAnimationSlideUp);
    		if ('isToast' in $$props) $$invalidate(5, isToast = $$props.isToast);
    		if ('isRounded' in $$props) $$invalidate(6, isRounded = $$props.isRounded);
    		if ('isBorderAll' in $$props) $$invalidate(7, isBorderAll = $$props.isBorderAll);
    		if ('isBorderLeft' in $$props) $$invalidate(8, isBorderLeft = $$props.isBorderLeft);
    		if ('isBorderRight' in $$props) $$invalidate(9, isBorderRight = $$props.isBorderRight);
    		if ('isBorderTop' in $$props) $$invalidate(10, isBorderTop = $$props.isBorderTop);
    		if ('isBorderBottom' in $$props) $$invalidate(11, isBorderBottom = $$props.isBorderBottom);
    		if ('isBlockEnd' in $$props) $$invalidate(12, isBlockEnd = $$props.isBlockEnd);
    		if ('type' in $$props) $$invalidate(13, type = $$props.type);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		isAnimationFadeIn,
    		isAnimationSlideUp,
    		isToast,
    		isRounded,
    		isBorderAll,
    		isBorderLeft,
    		isBorderRight,
    		isBorderTop,
    		isBorderBottom,
    		isBlockEnd,
    		type,
    		typeClass,
    		ariaAtomicValue,
    		classes,
    		ariaLiveValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('isAnimationFadeIn' in $$props) $$invalidate(3, isAnimationFadeIn = $$props.isAnimationFadeIn);
    		if ('isAnimationSlideUp' in $$props) $$invalidate(4, isAnimationSlideUp = $$props.isAnimationSlideUp);
    		if ('isToast' in $$props) $$invalidate(5, isToast = $$props.isToast);
    		if ('isRounded' in $$props) $$invalidate(6, isRounded = $$props.isRounded);
    		if ('isBorderAll' in $$props) $$invalidate(7, isBorderAll = $$props.isBorderAll);
    		if ('isBorderLeft' in $$props) $$invalidate(8, isBorderLeft = $$props.isBorderLeft);
    		if ('isBorderRight' in $$props) $$invalidate(9, isBorderRight = $$props.isBorderRight);
    		if ('isBorderTop' in $$props) $$invalidate(10, isBorderTop = $$props.isBorderTop);
    		if ('isBorderBottom' in $$props) $$invalidate(11, isBorderBottom = $$props.isBorderBottom);
    		if ('isBlockEnd' in $$props) $$invalidate(12, isBlockEnd = $$props.isBlockEnd);
    		if ('type' in $$props) $$invalidate(13, type = $$props.type);
    		if ('typeClass' in $$props) typeClass = $$props.typeClass;
    		if ('ariaLiveValue' in $$props) $$invalidate(0, ariaLiveValue = $$props.ariaLiveValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isToast, type*/ 8224) {
    			$$invalidate(0, ariaLiveValue = () => {
    				let liveValue;

    				if (isToast && type === "error") {
    					liveValue = "assertive";
    				} else if (isToast) {
    					liveValue = "polite";
    				} else {
    					liveValue = undefined;
    				}

    				return liveValue;
    			});
    		}
    	};

    	return [
    		ariaLiveValue,
    		ariaAtomicValue,
    		classes,
    		isAnimationFadeIn,
    		isAnimationSlideUp,
    		isToast,
    		isRounded,
    		isBorderAll,
    		isBorderLeft,
    		isBorderRight,
    		isBorderTop,
    		isBorderBottom,
    		isBlockEnd,
    		type,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			isAnimationFadeIn: 3,
    			isAnimationSlideUp: 4,
    			isToast: 5,
    			isRounded: 6,
    			isBorderAll: 7,
    			isBorderLeft: 8,
    			isBorderRight: 9,
    			isBorderTop: 10,
    			isBorderBottom: 11,
    			isBlockEnd: 12,
    			type: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get isAnimationFadeIn() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAnimationFadeIn(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isAnimationSlideUp() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAnimationSlideUp(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isToast() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isToast(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRounded() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRounded(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderAll() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderAll(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderLeft() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderLeft(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderRight() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderRight(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderTop() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderTop(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderBottom() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderBottom(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBlockEnd() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBlockEnd(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Button/Button.svelte generated by Svelte v3.47.0 */

    const file$r = "node_modules/agnostic-svelte/components/Button/Button.svelte";

    // (353:0) {:else}
    function create_else_block$8(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let button_levels = [
    		{ type: /*type*/ ctx[3] },
    		{ class: /*klasses*/ ctx[4] },
    		{ role: /*role*/ ctx[1] },
    		{ "aria-selected": /*aSelected*/ ctx[6] },
    		{ "aria-controls": /*ariaControls*/ ctx[2] },
    		{ "tab-index": /*tIndex*/ ctx[5] },
    		{ disabled: /*isDisabled*/ ctx[0] },
    		/*$$restProps*/ ctx[7]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "svelte-jwfndu", true);
    			add_location(button, file$r, 353, 2, 10259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[24], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[25], false, false, false),
    					listen_dev(button, "focus", /*focus_handler*/ ctx[26], false, false, false),
    					listen_dev(button, "blur", /*blur_handler*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*type*/ 8) && { type: /*type*/ ctx[3] },
    				(!current || dirty & /*klasses*/ 16) && { class: /*klasses*/ ctx[4] },
    				(!current || dirty & /*role*/ 2) && { role: /*role*/ ctx[1] },
    				(!current || dirty & /*aSelected*/ 64) && { "aria-selected": /*aSelected*/ ctx[6] },
    				(!current || dirty & /*ariaControls*/ 4) && { "aria-controls": /*ariaControls*/ ctx[2] },
    				(!current || dirty & /*tIndex*/ 32) && { "tab-index": /*tIndex*/ ctx[5] },
    				(!current || dirty & /*isDisabled*/ 1) && { disabled: /*isDisabled*/ ctx[0] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(button, "svelte-jwfndu", true);
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
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(353:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (349:0) {#if type === "faux"}
    function create_if_block$f(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*klasses*/ ctx[4]) + " svelte-jwfndu"));
    			add_location(div, file$r, 349, 2, 10205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klasses*/ 16 && div_class_value !== (div_class_value = "" + (null_to_empty(/*klasses*/ ctx[4]) + " svelte-jwfndu"))) {
    				attr_dev(div, "class", div_class_value);
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
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(349:0) {#if type === \\\"faux\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$f, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[3] === "faux") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let aSelected;
    	let tIndex;
    	let klasses;

    	const omit_props_names = [
    		"mode","size","isBordered","isCapsule","isGrouped","isBlock","isLink","isBlank","isDisabled","role","isCircle","isRounded","isSkinned","ariaSelected","ariaControls","tabIndex","css","type"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { mode = "" } = $$props;
    	let { size = "" } = $$props;
    	let { isBordered = false } = $$props;
    	let { isCapsule = false } = $$props;
    	let { isGrouped = false } = $$props;
    	let { isBlock = false } = $$props;
    	let { isLink = false } = $$props;
    	let { isBlank = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { role = undefined } = $$props;
    	let { isCircle = false } = $$props;
    	let { isRounded = false } = $$props;
    	let { isSkinned = true } = $$props;
    	let { ariaSelected = undefined } = $$props;
    	let { ariaControls = undefined } = $$props;
    	let { tabIndex = undefined } = $$props;
    	let { css = "" } = $$props;
    	let { type = "button" } = $$props;

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('mode' in $$new_props) $$invalidate(8, mode = $$new_props.mode);
    		if ('size' in $$new_props) $$invalidate(9, size = $$new_props.size);
    		if ('isBordered' in $$new_props) $$invalidate(10, isBordered = $$new_props.isBordered);
    		if ('isCapsule' in $$new_props) $$invalidate(11, isCapsule = $$new_props.isCapsule);
    		if ('isGrouped' in $$new_props) $$invalidate(12, isGrouped = $$new_props.isGrouped);
    		if ('isBlock' in $$new_props) $$invalidate(13, isBlock = $$new_props.isBlock);
    		if ('isLink' in $$new_props) $$invalidate(14, isLink = $$new_props.isLink);
    		if ('isBlank' in $$new_props) $$invalidate(15, isBlank = $$new_props.isBlank);
    		if ('isDisabled' in $$new_props) $$invalidate(0, isDisabled = $$new_props.isDisabled);
    		if ('role' in $$new_props) $$invalidate(1, role = $$new_props.role);
    		if ('isCircle' in $$new_props) $$invalidate(16, isCircle = $$new_props.isCircle);
    		if ('isRounded' in $$new_props) $$invalidate(17, isRounded = $$new_props.isRounded);
    		if ('isSkinned' in $$new_props) $$invalidate(18, isSkinned = $$new_props.isSkinned);
    		if ('ariaSelected' in $$new_props) $$invalidate(19, ariaSelected = $$new_props.ariaSelected);
    		if ('ariaControls' in $$new_props) $$invalidate(2, ariaControls = $$new_props.ariaControls);
    		if ('tabIndex' in $$new_props) $$invalidate(20, tabIndex = $$new_props.tabIndex);
    		if ('css' in $$new_props) $$invalidate(21, css = $$new_props.css);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		mode,
    		size,
    		isBordered,
    		isCapsule,
    		isGrouped,
    		isBlock,
    		isLink,
    		isBlank,
    		isDisabled,
    		role,
    		isCircle,
    		isRounded,
    		isSkinned,
    		ariaSelected,
    		ariaControls,
    		tabIndex,
    		css,
    		type,
    		klasses,
    		tIndex,
    		aSelected
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('mode' in $$props) $$invalidate(8, mode = $$new_props.mode);
    		if ('size' in $$props) $$invalidate(9, size = $$new_props.size);
    		if ('isBordered' in $$props) $$invalidate(10, isBordered = $$new_props.isBordered);
    		if ('isCapsule' in $$props) $$invalidate(11, isCapsule = $$new_props.isCapsule);
    		if ('isGrouped' in $$props) $$invalidate(12, isGrouped = $$new_props.isGrouped);
    		if ('isBlock' in $$props) $$invalidate(13, isBlock = $$new_props.isBlock);
    		if ('isLink' in $$props) $$invalidate(14, isLink = $$new_props.isLink);
    		if ('isBlank' in $$props) $$invalidate(15, isBlank = $$new_props.isBlank);
    		if ('isDisabled' in $$props) $$invalidate(0, isDisabled = $$new_props.isDisabled);
    		if ('role' in $$props) $$invalidate(1, role = $$new_props.role);
    		if ('isCircle' in $$props) $$invalidate(16, isCircle = $$new_props.isCircle);
    		if ('isRounded' in $$props) $$invalidate(17, isRounded = $$new_props.isRounded);
    		if ('isSkinned' in $$props) $$invalidate(18, isSkinned = $$new_props.isSkinned);
    		if ('ariaSelected' in $$props) $$invalidate(19, ariaSelected = $$new_props.ariaSelected);
    		if ('ariaControls' in $$props) $$invalidate(2, ariaControls = $$new_props.ariaControls);
    		if ('tabIndex' in $$props) $$invalidate(20, tabIndex = $$new_props.tabIndex);
    		if ('css' in $$props) $$invalidate(21, css = $$new_props.css);
    		if ('type' in $$props) $$invalidate(3, type = $$new_props.type);
    		if ('klasses' in $$props) $$invalidate(4, klasses = $$new_props.klasses);
    		if ('tIndex' in $$props) $$invalidate(5, tIndex = $$new_props.tIndex);
    		if ('aSelected' in $$props) $$invalidate(6, aSelected = $$new_props.aSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ariaSelected*/ 524288) {
    			$$invalidate(6, aSelected = ariaSelected || null);
    		}

    		if ($$self.$$.dirty & /*tabIndex*/ 1048576) {
    			$$invalidate(5, tIndex = tabIndex || null);
    		}

    		if ($$self.$$.dirty & /*isSkinned, mode, size, isBordered, isCapsule, isGrouped, isBlock, isCircle, isRounded, isDisabled, isBlank, isLink, css*/ 2621185) {
    			// ******************** HEY! ************************
    			// You will need to also add these to the buttonslot:
    			// agnostic-svelte/src/stories/ButtonSlot.svelte
    			$$invalidate(4, klasses = [
    				isSkinned ? "btn" : "btn-base",
    				mode ? `btn-${mode}` : "",
    				size ? `btn-${size}` : "",
    				isBordered ? "btn-bordered" : "",
    				isCapsule ? "btn-capsule " : "",
    				isGrouped ? "btn-grouped" : "",
    				isBlock ? "btn-block" : "",
    				isCircle ? "btn-circle" : "",
    				isRounded ? "btn-rounded" : "",
    				isDisabled ? "disabled" : "",
    				isBlank ? "btn-blank" : "",
    				isLink ? "btn-link" : "",
    				css ? `${css}` : ""
    			].filter(c => c).join(" "));
    		}
    	};

    	return [
    		isDisabled,
    		role,
    		ariaControls,
    		type,
    		klasses,
    		tIndex,
    		aSelected,
    		$$restProps,
    		mode,
    		size,
    		isBordered,
    		isCapsule,
    		isGrouped,
    		isBlock,
    		isLink,
    		isBlank,
    		isCircle,
    		isRounded,
    		isSkinned,
    		ariaSelected,
    		tabIndex,
    		css,
    		$$scope,
    		slots,
    		keydown_handler,
    		click_handler,
    		focus_handler,
    		blur_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			mode: 8,
    			size: 9,
    			isBordered: 10,
    			isCapsule: 11,
    			isGrouped: 12,
    			isBlock: 13,
    			isLink: 14,
    			isBlank: 15,
    			isDisabled: 0,
    			role: 1,
    			isCircle: 16,
    			isRounded: 17,
    			isSkinned: 18,
    			ariaSelected: 19,
    			ariaControls: 2,
    			tabIndex: 20,
    			css: 21,
    			type: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get mode() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBordered() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBordered(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCapsule() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCapsule(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isGrouped() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isGrouped(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBlock() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBlock(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLink() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLink(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBlank() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBlank(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCircle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCircle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRounded() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRounded(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaControls() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaControls(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabIndex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabIndex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Card/Card.svelte generated by Svelte v3.47.0 */

    const file$q = "node_modules/agnostic-svelte/components/Card/Card.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "" + (null_to_empty(/*klasses*/ ctx[0]) + " svelte-10sz0ec"));
    			add_location(div, file$q, 134, 0, 3456);
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
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(div, "focus", /*focus_handler*/ ctx[12], false, false, false),
    					listen_dev(div, "blur", /*blur_handler*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { isAnimated = false } = $$props;
    	let { isSkinned = true } = $$props;
    	let { isStacked = false } = $$props;
    	let { isShadow = false } = $$props;
    	let { isBorder = false } = $$props;
    	let { isRounded = false } = $$props;
    	let { type = "" } = $$props;
    	let { css = "" } = $$props;

    	let klasses = [
    		isSkinned ? "card" : "card-base",
    		isAnimated ? "card-animated" : "",
    		isStacked ? "card-stacked" : "",
    		isShadow ? "card-shadow" : "",
    		isRounded ? "card-rounded" : "",
    		isBorder ? "card-border" : "",
    		type ? `card-${type}` : "",
    		css ? `${css}` : ""
    	].filter(klass => klass.length).join(" ");

    	const writable_props = [
    		'isAnimated',
    		'isSkinned',
    		'isStacked',
    		'isShadow',
    		'isBorder',
    		'isRounded',
    		'type',
    		'css'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isAnimated' in $$props) $$invalidate(1, isAnimated = $$props.isAnimated);
    		if ('isSkinned' in $$props) $$invalidate(2, isSkinned = $$props.isSkinned);
    		if ('isStacked' in $$props) $$invalidate(3, isStacked = $$props.isStacked);
    		if ('isShadow' in $$props) $$invalidate(4, isShadow = $$props.isShadow);
    		if ('isBorder' in $$props) $$invalidate(5, isBorder = $$props.isBorder);
    		if ('isRounded' in $$props) $$invalidate(6, isRounded = $$props.isRounded);
    		if ('type' in $$props) $$invalidate(7, type = $$props.type);
    		if ('css' in $$props) $$invalidate(8, css = $$props.css);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		isAnimated,
    		isSkinned,
    		isStacked,
    		isShadow,
    		isBorder,
    		isRounded,
    		type,
    		css,
    		klasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('isAnimated' in $$props) $$invalidate(1, isAnimated = $$props.isAnimated);
    		if ('isSkinned' in $$props) $$invalidate(2, isSkinned = $$props.isSkinned);
    		if ('isStacked' in $$props) $$invalidate(3, isStacked = $$props.isStacked);
    		if ('isShadow' in $$props) $$invalidate(4, isShadow = $$props.isShadow);
    		if ('isBorder' in $$props) $$invalidate(5, isBorder = $$props.isBorder);
    		if ('isRounded' in $$props) $$invalidate(6, isRounded = $$props.isRounded);
    		if ('type' in $$props) $$invalidate(7, type = $$props.type);
    		if ('css' in $$props) $$invalidate(8, css = $$props.css);
    		if ('klasses' in $$props) $$invalidate(0, klasses = $$props.klasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klasses,
    		isAnimated,
    		isSkinned,
    		isStacked,
    		isShadow,
    		isBorder,
    		isRounded,
    		type,
    		css,
    		$$scope,
    		slots,
    		click_handler,
    		focus_handler,
    		blur_handler
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			isAnimated: 1,
    			isSkinned: 2,
    			isStacked: 3,
    			isShadow: 4,
    			isBorder: 5,
    			isRounded: 6,
    			type: 7,
    			css: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get isAnimated() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAnimated(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStacked() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStacked(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isShadow() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isShadow(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorder() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorder(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRounded() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRounded(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Close/Close.svelte generated by Svelte v3.47.0 */

    const file$p = "node_modules/agnostic-svelte/components/Close/Close.svelte";

    // (109:0) {:else}
    function create_else_block$7(ctx) {
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M.439 21.44a1.5 1.5 0 0 0 2.122 2.121l9.262-9.261a.25.25 0 0 1 .354 0l9.262 9.263a1.5 1.5 0 1 0 2.122-2.121L14.3 12.177a.25.25 0 0 1 0-.354l9.263-9.262A1.5 1.5 0 0 0 21.439.44L12.177 9.7a.25.25 0 0 1-.354 0L2.561.44A1.5 1.5 0 0 0 .439 2.561L9.7 11.823a.25.25 0 0 1 0 .354Z");
    			add_location(path, file$p, 116, 6, 2523);
    			attr_dev(svg, "class", "close svelte-kk9uos");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			set_style(svg, "color", /*color*/ ctx[1], false);
    			add_location(svg, file$p, 110, 4, 2409);
    			attr_dev(button, "class", "" + (null_to_empty(/*closeButtonClasses*/ ctx[2]) + " svelte-kk9uos"));
    			attr_dev(button, "aria-label", "Close");
    			add_location(button, file$p, 109, 2, 2341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*color*/ 2) {
    				set_style(svg, "color", /*color*/ ctx[1], false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(109:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:0) {#if isFaux}
    function create_if_block$e(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M.439 21.44a1.5 1.5 0 0 0 2.122 2.121l9.262-9.261a.25.25 0 0 1 .354 0l9.262 9.263a1.5 1.5 0 1 0 2.122-2.121L14.3 12.177a.25.25 0 0 1 0-.354l9.263-9.262A1.5 1.5 0 0 0 21.439.44L12.177 9.7a.25.25 0 0 1-.354 0L2.561.44A1.5 1.5 0 0 0 .439 2.561L9.7 11.823a.25.25 0 0 1 0 .354Z");
    			add_location(path, file$p, 102, 6, 1977);
    			attr_dev(svg, "class", "close svelte-kk9uos");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$p, 101, 4, 1912);
    			attr_dev(div, "class", "" + (null_to_empty(/*closeButtonClasses*/ ctx[2]) + " svelte-kk9uos"));
    			add_location(div, file$p, 100, 2, 1875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(100:0) {#if isFaux}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isFaux*/ ctx[0]) return create_if_block$e;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = "" } = $$props;
    	let { isFaux = false } = $$props;
    	let { color = "inherit" } = $$props;
    	const closeButtonClasses = ["close-button", size ? `close-button-${size}` : ""].filter(c => c).join(" ");
    	const writable_props = ['size', 'isFaux', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('isFaux' in $$props) $$invalidate(0, isFaux = $$props.isFaux);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, isFaux, color, closeButtonClasses });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('isFaux' in $$props) $$invalidate(0, isFaux = $$props.isFaux);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFaux, color, closeButtonClasses, size, click_handler];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { size: 3, isFaux: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFaux() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFaux(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var focusableSelectors = [
      'a[href]:not([tabindex^="-"])',
      'area[href]:not([tabindex^="-"])',
      'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
      'input[type="radio"]:not([disabled]):not([tabindex^="-"])',
      'select:not([disabled]):not([tabindex^="-"])',
      'textarea:not([disabled]):not([tabindex^="-"])',
      'button:not([disabled]):not([tabindex^="-"])',
      'iframe:not([tabindex^="-"])',
      'audio[controls]:not([tabindex^="-"])',
      'video[controls]:not([tabindex^="-"])',
      '[contenteditable]:not([tabindex^="-"])',
      '[tabindex]:not([tabindex^="-"])',
    ];

    var TAB_KEY = 9;
    var ESCAPE_KEY = 27;

    /**
     * Define the constructor to instantiate a dialog
     *
     * @constructor
     * @param {Element} element
     */
    function A11yDialog(element) {
      // Prebind the functions that will be bound in addEventListener and
      // removeEventListener to avoid losing references
      this._show = this.show.bind(this);
      this._hide = this.hide.bind(this);
      this._maintainFocus = this._maintainFocus.bind(this);
      this._bindKeypress = this._bindKeypress.bind(this);

      this.$el = element;
      this.shown = false;
      this._id = this.$el.getAttribute('data-a11y-dialog') || this.$el.id;
      this._previouslyFocused = null;
      this._listeners = {};

      // Initialise everything needed for the dialog to work properly
      this.create();
    }

    /**
     * Set up everything necessary for the dialog to be functioning
     *
     * @param {(NodeList | Element | string)} targets
     * @return {this}
     */
    A11yDialog.prototype.create = function () {
      this.$el.setAttribute('aria-hidden', true);
      this.$el.setAttribute('aria-modal', true);
      this.$el.setAttribute('tabindex', -1);

      if (!this.$el.hasAttribute('role')) {
        this.$el.setAttribute('role', 'dialog');
      }

      // Keep a collection of dialog openers, each of which will be bound a click
      // event listener to open the dialog
      this._openers = $$('[data-a11y-dialog-show="' + this._id + '"]');
      this._openers.forEach(
        function (opener) {
          opener.addEventListener('click', this._show);
        }.bind(this)
      );

      // Keep a collection of dialog closers, each of which will be bound a click
      // event listener to close the dialog
      this._closers = $$('[data-a11y-dialog-hide]', this.$el).concat(
        $$('[data-a11y-dialog-hide="' + this._id + '"]')
      );
      this._closers.forEach(
        function (closer) {
          closer.addEventListener('click', this._hide);
        }.bind(this)
      );

      // Execute all callbacks registered for the `create` event
      this._fire('create');

      return this
    };

    /**
     * Show the dialog element, disable all the targets (siblings), trap the
     * current focus within it, listen for some specific key presses and fire all
     * registered callbacks for `show` event
     *
     * @param {CustomEvent} event
     * @return {this}
     */
    A11yDialog.prototype.show = function (event) {
      // If the dialog is already open, abort
      if (this.shown) {
        return this
      }

      // Keep a reference to the currently focused element to be able to restore
      // it later
      this._previouslyFocused = document.activeElement;
      this.$el.removeAttribute('aria-hidden');
      this.shown = true;

      // Set the focus to the dialog element
      moveFocusToDialog(this.$el);

      // Bind a focus event listener to the body element to make sure the focus
      // stays trapped inside the dialog while open, and start listening for some
      // specific key presses (TAB and ESC)
      document.body.addEventListener('focus', this._maintainFocus, true);
      document.addEventListener('keydown', this._bindKeypress);

      // Execute all callbacks registered for the `show` event
      this._fire('show', event);

      return this
    };

    /**
     * Hide the dialog element, enable all the targets (siblings), restore the
     * focus to the previously active element, stop listening for some specific
     * key presses and fire all registered callbacks for `hide` event
     *
     * @param {CustomEvent} event
     * @return {this}
     */
    A11yDialog.prototype.hide = function (event) {
      // If the dialog is already closed, abort
      if (!this.shown) {
        return this
      }

      this.shown = false;
      this.$el.setAttribute('aria-hidden', 'true');

      // If there was a focused element before the dialog was opened (and it has a
      // `focus` method), restore the focus back to it
      // See: https://github.com/KittyGiraudel/a11y-dialog/issues/108
      if (this._previouslyFocused && this._previouslyFocused.focus) {
        this._previouslyFocused.focus();
      }

      // Remove the focus event listener to the body element and stop listening
      // for specific key presses
      document.body.removeEventListener('focus', this._maintainFocus, true);
      document.removeEventListener('keydown', this._bindKeypress);

      // Execute all callbacks registered for the `hide` event
      this._fire('hide', event);

      return this
    };

    /**
     * Destroy the current instance (after making sure the dialog has been hidden)
     * and remove all associated listeners from dialog openers and closers
     *
     * @return {this}
     */
    A11yDialog.prototype.destroy = function () {
      // Hide the dialog to avoid destroying an open instance
      this.hide();

      // Remove the click event listener from all dialog openers
      this._openers.forEach(
        function (opener) {
          opener.removeEventListener('click', this._show);
        }.bind(this)
      );

      // Remove the click event listener from all dialog closers
      this._closers.forEach(
        function (closer) {
          closer.removeEventListener('click', this._hide);
        }.bind(this)
      );

      // Execute all callbacks registered for the `destroy` event
      this._fire('destroy');

      // Keep an object of listener types mapped to callback functions
      this._listeners = {};

      return this
    };

    /**
     * Register a new callback for the given event type
     *
     * @param {string} type
     * @param {Function} handler
     */
    A11yDialog.prototype.on = function (type, handler) {
      if (typeof this._listeners[type] === 'undefined') {
        this._listeners[type] = [];
      }

      this._listeners[type].push(handler);

      return this
    };

    /**
     * Unregister an existing callback for the given event type
     *
     * @param {string} type
     * @param {Function} handler
     */
    A11yDialog.prototype.off = function (type, handler) {
      var index = (this._listeners[type] || []).indexOf(handler);

      if (index > -1) {
        this._listeners[type].splice(index, 1);
      }

      return this
    };

    /**
     * Iterate over all registered handlers for given type and call them all with
     * the dialog element as first argument, event as second argument (if any). Also
     * dispatch a custom event on the DOM element itself to make it possible to
     * react to the lifecycle of auto-instantiated dialogs.
     *
     * @access private
     * @param {string} type
     * @param {CustomEvent} event
     */
    A11yDialog.prototype._fire = function (type, event) {
      var listeners = this._listeners[type] || [];
      var domEvent = new CustomEvent(type, { detail: event });

      this.$el.dispatchEvent(domEvent);

      listeners.forEach(
        function (listener) {
          listener(this.$el, event);
        }.bind(this)
      );
    };

    /**
     * Private event handler used when listening to some specific key presses
     * (namely ESCAPE and TAB)
     *
     * @access private
     * @param {Event} event
     */
    A11yDialog.prototype._bindKeypress = function (event) {
      // This is an escape hatch in case there are nested dialogs, so the keypresses
      // are only reacted to for the most recent one
      if (!this.$el.contains(document.activeElement)) return

      // If the dialog is shown and the ESCAPE key is being pressed, prevent any
      // further effects from the ESCAPE key and hide the dialog, unless its role
      // is 'alertdialog', which should be modal
      if (
        this.shown &&
        event.which === ESCAPE_KEY &&
        this.$el.getAttribute('role') !== 'alertdialog'
      ) {
        event.preventDefault();
        this.hide(event);
      }

      // If the dialog is shown and the TAB key is being pressed, make sure the
      // focus stays trapped within the dialog element
      if (this.shown && event.which === TAB_KEY) {
        trapTabKey(this.$el, event);
      }
    };

    /**
     * Private event handler used when making sure the focus stays within the
     * currently open dialog
     *
     * @access private
     * @param {Event} event
     */
    A11yDialog.prototype._maintainFocus = function (event) {
      // If the dialog is shown and the focus is not within a dialog element (either
      // this one or another one in case of nested dialogs) or within an element
      // with the `data-a11y-dialog-focus-trap-ignore` attribute, move it back to
      // its first focusable child.
      // See: https://github.com/KittyGiraudel/a11y-dialog/issues/177
      if (
        this.shown &&
        !event.target.closest('[aria-modal="true"]') &&
        !event.target.closest('[data-a11y-dialog-ignore-focus-trap]')
      ) {
        moveFocusToDialog(this.$el);
      }
    };

    /**
     * Convert a NodeList into an array
     *
     * @param {NodeList} collection
     * @return {Array<Element>}
     */
    function toArray(collection) {
      return Array.prototype.slice.call(collection)
    }

    /**
     * Query the DOM for nodes matching the given selector, scoped to context (or
     * the whole document)
     *
     * @param {String} selector
     * @param {Element} [context = document]
     * @return {Array<Element>}
     */
    function $$(selector, context) {
      return toArray((context || document).querySelectorAll(selector))
    }

    /**
     * Set the focus to the first element with `autofocus` with the element or the
     * element itself
     *
     * @param {Element} node
     */
    function moveFocusToDialog(node) {
      var focused = node.querySelector('[autofocus]') || node;

      focused.focus();
    }

    /**
     * Get the focusable children of the given element
     *
     * @param {Element} node
     * @return {Array<Element>}
     */
    function getFocusableChildren(node) {
      return $$(focusableSelectors.join(','), node).filter(function (child) {
        return !!(
          child.offsetWidth ||
          child.offsetHeight ||
          child.getClientRects().length
        )
      })
    }

    /**
     * Trap the focus inside the given element
     *
     * @param {Element} node
     * @param {Event} event
     */
    function trapTabKey(node, event) {
      var focusableChildren = getFocusableChildren(node);
      var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the dialog element
      if (event.shiftKey && focusedItemIndex === 0) {
        focusableChildren[focusableChildren.length - 1].focus();
        event.preventDefault();
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the dialog element
      } else if (
        !event.shiftKey &&
        focusedItemIndex === focusableChildren.length - 1
      ) {
        focusableChildren[0].focus();
        event.preventDefault();
      }
    }

    function instantiateDialogs() {
      $$('[data-a11y-dialog]').forEach(function (node) {
        new A11yDialog(node);
      });
    }

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', instantiateDialogs);
      } else {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(instantiateDialogs);
        } else {
          window.setTimeout(instantiateDialogs, 16);
        }
      }
    }

    /* node_modules/svelte-a11y-dialog/SvelteA11yDialog.svelte generated by Svelte v3.47.0 */
    const file$o = "node_modules/svelte-a11y-dialog/SvelteA11yDialog.svelte";
    const get_closeButtonContent_slot_changes_1 = dirty => ({});
    const get_closeButtonContent_slot_context_1 = ctx => ({});
    const get_closeButtonContent_slot_changes$1 = dirty => ({});
    const get_closeButtonContent_slot_context$1 = ctx => ({});

    // (64:0) {#if mounted}
    function create_if_block$d(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*closeButtonPosition*/ ctx[4] === 'first' && create_if_block_2$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	let if_block1 = /*closeButtonPosition*/ ctx[4] === 'last' && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			p = element("p");
    			t2 = text(/*title*/ ctx[2]);
    			t3 = space();
    			if (default_slot) default_slot.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "data-a11y-dialog-hide", "");
    			attr_dev(div0, "tabindex", "-1");
    			attr_dev(div0, "class", /*classes*/ ctx[7].overlay);
    			add_location(div0, file$o, 73, 6, 2037);
    			attr_dev(p, "id", /*fullTitleId*/ ctx[8]);
    			attr_dev(p, "class", /*classes*/ ctx[7].title);
    			add_location(p, file$o, 93, 8, 2651);
    			attr_dev(div1, "role", "document");
    			attr_dev(div1, "class", /*classes*/ ctx[7].document);
    			add_location(div1, file$o, 79, 6, 2223);
    			attr_dev(div2, "id", /*id*/ ctx[0]);
    			attr_dev(div2, "class", /*classes*/ ctx[7].container);
    			attr_dev(div2, "role", /*roleAttribute*/ ctx[9]);
    			attr_dev(div2, "aria-hidden", "true");
    			attr_dev(div2, "aria-labelledby", /*fullTitleId*/ ctx[8]);
    			add_location(div2, file$o, 64, 2, 1853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t4);
    			if (if_block1) if_block1.m(div1, null);
    			/*div2_binding*/ ctx[17](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						prevent_default(function () {
    							if (is_function(/*role*/ ctx[1] === 'alertdialog'
    							? undefined
    							: /*close*/ ctx[11])) (/*role*/ ctx[1] === 'alertdialog'
    							? undefined
    							: /*close*/ ctx[11]).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					action_destroyer(/*teleport*/ ctx[10].call(null, div2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*closeButtonPosition*/ ctx[4] === 'first') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*closeButtonPosition*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*title*/ 4) set_data_dev(t2, /*title*/ ctx[2]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*closeButtonPosition*/ ctx[4] === 'last') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*closeButtonPosition*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(div2, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			/*div2_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(64:0) {#if mounted}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {#if closeButtonPosition === 'first'}
    function create_if_block_2$2(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const closeButtonContent_slot_template = /*#slots*/ ctx[16].closeButtonContent;
    	const closeButtonContent_slot = create_slot(closeButtonContent_slot_template, ctx, /*$$scope*/ ctx[15], get_closeButtonContent_slot_context$1);
    	const closeButtonContent_slot_or_fallback = closeButtonContent_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.c();
    			attr_dev(button, "data-a11y-dialog-hide", "");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*classes*/ ctx[7].closeButton);
    			attr_dev(button, "aria-label", /*closeButtonLabel*/ ctx[3]);
    			add_location(button, file$o, 81, 10, 2326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (closeButtonContent_slot_or_fallback) {
    				closeButtonContent_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (closeButtonContent_slot) {
    				if (closeButtonContent_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						closeButtonContent_slot,
    						closeButtonContent_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(closeButtonContent_slot_template, /*$$scope*/ ctx[15], dirty, get_closeButtonContent_slot_changes$1),
    						get_closeButtonContent_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty & /*closeButtonLabel*/ 8) {
    				attr_dev(button, "aria-label", /*closeButtonLabel*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closeButtonContent_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closeButtonContent_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(81:8) {#if closeButtonPosition === 'first'}",
    		ctx
    	});

    	return block;
    }

    // (89:44)                
    function fallback_block_1(ctx) {
    	let t_value = '\u00D7' + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(89:44)                ",
    		ctx
    	});

    	return block;
    }

    // (98:8) {#if closeButtonPosition === 'last'}
    function create_if_block_1$5(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const closeButtonContent_slot_template = /*#slots*/ ctx[16].closeButtonContent;
    	const closeButtonContent_slot = create_slot(closeButtonContent_slot_template, ctx, /*$$scope*/ ctx[15], get_closeButtonContent_slot_context_1);
    	const closeButtonContent_slot_or_fallback = closeButtonContent_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.c();
    			attr_dev(button, "data-a11y-dialog-hide", "");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*classes*/ ctx[7].closeButton);
    			attr_dev(button, "aria-label", /*closeButtonLabel*/ ctx[3]);
    			add_location(button, file$o, 98, 10, 2797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (closeButtonContent_slot_or_fallback) {
    				closeButtonContent_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (closeButtonContent_slot) {
    				if (closeButtonContent_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						closeButtonContent_slot,
    						closeButtonContent_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(closeButtonContent_slot_template, /*$$scope*/ ctx[15], dirty, get_closeButtonContent_slot_changes_1),
    						get_closeButtonContent_slot_context_1
    					);
    				}
    			}

    			if (!current || dirty & /*closeButtonLabel*/ 8) {
    				attr_dev(button, "aria-label", /*closeButtonLabel*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closeButtonContent_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closeButtonContent_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(98:8) {#if closeButtonPosition === 'last'}",
    		ctx
    	});

    	return block;
    }

    // (106:44)                
    function fallback_block$1(ctx) {
    	let t_value = '\u00D7' + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(106:44)                ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*mounted*/ ctx[6] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*mounted*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mounted*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteA11yDialog', slots, ['closeButtonContent','default']);
    	const dispatch = createEventDispatcher();
    	let { id } = $$props;
    	let { titleId = '' } = $$props;
    	let { role = 'dialog' } = $$props;
    	let { dialogRoot } = $$props;
    	let { title } = $$props;
    	let { closeButtonLabel = 'Close this dialog window' } = $$props;
    	let { closeButtonPosition = 'first' } = $$props;
    	let { classNames = {} } = $$props;

    	const defaultClassNames = {
    		container: 'dialog-container',
    		document: 'dialog-content',
    		overlay: 'dialog-overlay',
    		element: 'dialog-element',
    		title: 'dialog-title h4',
    		closeButton: 'dialog-close'
    	};

    	const classes = { ...defaultClassNames, ...classNames };

    	// The dialog instance
    	let dialog;

    	// Dialog element's binding
    	let rootElement;

    	const portalTarget = dialogRoot || "document.body";
    	const fullTitleId = titleId || `${id}-title`;

    	const roleAttribute = ['dialog', 'alertdialog'].includes(role)
    	? role
    	: 'dialog';

    	// In case of SSR we don't render element until hydration is complete
    	let mounted = false;

    	onMount(() => $$invalidate(6, mounted = true));

    	onDestroy(() => {
    		if (dialog) {
    			dialog.destroy();
    		}
    	});

    	const instantiateDialog = async () => {
    		await tick();
    		dialog = new A11yDialog(rootElement, portalTarget);
    		dispatch("instance", { "instance": dialog });
    	};

    	const teleportNode = async node => {
    		const destination = document.querySelector(portalTarget);
    		destination.appendChild(node);

    		// We don't render the template until mounted. So we need
    		// wait one more "tick" before instantiating the dialog
    		instantiateDialog();
    	};

    	/**
     * Svelte actions don't want to be async so this is a hack
     * to get around that by delegating to teleportNode
     */
    	const teleport = node => {
    		teleportNode(node);
    	};

    	const close = () => {
    		dialog.hide();
    	};

    	const writable_props = [
    		'id',
    		'titleId',
    		'role',
    		'dialogRoot',
    		'title',
    		'closeButtonLabel',
    		'closeButtonPosition',
    		'classNames'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteA11yDialog> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rootElement = $$value;
    			$$invalidate(5, rootElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('titleId' in $$props) $$invalidate(12, titleId = $$props.titleId);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('dialogRoot' in $$props) $$invalidate(13, dialogRoot = $$props.dialogRoot);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('closeButtonLabel' in $$props) $$invalidate(3, closeButtonLabel = $$props.closeButtonLabel);
    		if ('closeButtonPosition' in $$props) $$invalidate(4, closeButtonPosition = $$props.closeButtonPosition);
    		if ('classNames' in $$props) $$invalidate(14, classNames = $$props.classNames);
    		if ('$$scope' in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		onDestroy,
    		tick,
    		A11yDialog,
    		dispatch,
    		id,
    		titleId,
    		role,
    		dialogRoot,
    		title,
    		closeButtonLabel,
    		closeButtonPosition,
    		classNames,
    		defaultClassNames,
    		classes,
    		dialog,
    		rootElement,
    		portalTarget,
    		fullTitleId,
    		roleAttribute,
    		mounted,
    		instantiateDialog,
    		teleportNode,
    		teleport,
    		close
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('titleId' in $$props) $$invalidate(12, titleId = $$props.titleId);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('dialogRoot' in $$props) $$invalidate(13, dialogRoot = $$props.dialogRoot);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('closeButtonLabel' in $$props) $$invalidate(3, closeButtonLabel = $$props.closeButtonLabel);
    		if ('closeButtonPosition' in $$props) $$invalidate(4, closeButtonPosition = $$props.closeButtonPosition);
    		if ('classNames' in $$props) $$invalidate(14, classNames = $$props.classNames);
    		if ('dialog' in $$props) dialog = $$props.dialog;
    		if ('rootElement' in $$props) $$invalidate(5, rootElement = $$props.rootElement);
    		if ('mounted' in $$props) $$invalidate(6, mounted = $$props.mounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		role,
    		title,
    		closeButtonLabel,
    		closeButtonPosition,
    		rootElement,
    		mounted,
    		classes,
    		fullTitleId,
    		roleAttribute,
    		teleport,
    		close,
    		titleId,
    		dialogRoot,
    		classNames,
    		$$scope,
    		slots,
    		div2_binding
    	];
    }

    class SvelteA11yDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			id: 0,
    			titleId: 12,
    			role: 1,
    			dialogRoot: 13,
    			title: 2,
    			closeButtonLabel: 3,
    			closeButtonPosition: 4,
    			classNames: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteA11yDialog",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<SvelteA11yDialog> was created without expected prop 'id'");
    		}

    		if (/*dialogRoot*/ ctx[13] === undefined && !('dialogRoot' in props)) {
    			console.warn("<SvelteA11yDialog> was created without expected prop 'dialogRoot'");
    		}

    		if (/*title*/ ctx[2] === undefined && !('title' in props)) {
    			console.warn("<SvelteA11yDialog> was created without expected prop 'title'");
    		}
    	}

    	get id() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleId() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleId(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dialogRoot() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dialogRoot(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonLabel() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonLabel(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonPosition() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonPosition(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNames() {
    		throw new Error("<SvelteA11yDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNames(value) {
    		throw new Error("<SvelteA11yDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Dialog/Dialog.svelte generated by Svelte v3.47.0 */
    const get_closeButtonContent_slot_changes = dirty => ({});
    const get_closeButtonContent_slot_context = ctx => ({ slot: "closeButtonContent" });

    // (271:0) <SvelteA11yDialog   id={id}   dialogRoot={dialogRoot}   closeButtonLabel={closeButtonLabel}   closeButtonPosition={closeButtonPosition}   title={title}   titleId={titleId}   role={role}   classNames={getClassNames()}   on:instance={assignDialogInstance} >
    function create_default_slot$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(271:0) <SvelteA11yDialog   id={id}   dialogRoot={dialogRoot}   closeButtonLabel={closeButtonLabel}   closeButtonPosition={closeButtonPosition}   title={title}   titleId={titleId}   role={role}   classNames={getClassNames()}   on:instance={assignDialogInstance} >",
    		ctx
    	});

    	return block;
    }

    // (282:60)      
    function fallback_block(ctx) {
    	let close;
    	let current;

    	close = new Close({
    			props: { isFaux: true, size: "large" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(282:60)      ",
    		ctx
    	});

    	return block;
    }

    // (282:2) 
    function create_closeButtonContent_slot(ctx) {
    	let current;
    	const closeButtonContent_slot_template = /*#slots*/ ctx[13].closeButtonContent;
    	const closeButtonContent_slot = create_slot(closeButtonContent_slot_template, ctx, /*$$scope*/ ctx[14], get_closeButtonContent_slot_context);
    	const closeButtonContent_slot_or_fallback = closeButtonContent_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (closeButtonContent_slot_or_fallback) {
    				closeButtonContent_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (closeButtonContent_slot) {
    				if (closeButtonContent_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						closeButtonContent_slot,
    						closeButtonContent_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(closeButtonContent_slot_template, /*$$scope*/ ctx[14], dirty, get_closeButtonContent_slot_changes),
    						get_closeButtonContent_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closeButtonContent_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closeButtonContent_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (closeButtonContent_slot_or_fallback) closeButtonContent_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_closeButtonContent_slot.name,
    		type: "slot",
    		source: "(282:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let sveltea11ydialog;
    	let current;

    	sveltea11ydialog = new SvelteA11yDialog({
    			props: {
    				id: /*id*/ ctx[0],
    				dialogRoot: /*dialogRoot*/ ctx[2],
    				closeButtonLabel: /*closeButtonLabel*/ ctx[5],
    				closeButtonPosition: /*closeButtonPosition*/ ctx[6],
    				title: /*title*/ ctx[1],
    				titleId: /*titleId*/ ctx[4],
    				role: /*role*/ ctx[3],
    				classNames: /*getClassNames*/ ctx[7](),
    				$$slots: {
    					closeButtonContent: [create_closeButtonContent_slot],
    					default: [create_default_slot$b]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	sveltea11ydialog.$on("instance", /*assignDialogInstance*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(sveltea11ydialog.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sveltea11ydialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sveltea11ydialog_changes = {};
    			if (dirty & /*id*/ 1) sveltea11ydialog_changes.id = /*id*/ ctx[0];
    			if (dirty & /*dialogRoot*/ 4) sveltea11ydialog_changes.dialogRoot = /*dialogRoot*/ ctx[2];
    			if (dirty & /*closeButtonLabel*/ 32) sveltea11ydialog_changes.closeButtonLabel = /*closeButtonLabel*/ ctx[5];
    			if (dirty & /*closeButtonPosition*/ 64) sveltea11ydialog_changes.closeButtonPosition = /*closeButtonPosition*/ ctx[6];
    			if (dirty & /*title*/ 2) sveltea11ydialog_changes.title = /*title*/ ctx[1];
    			if (dirty & /*titleId*/ 16) sveltea11ydialog_changes.titleId = /*titleId*/ ctx[4];
    			if (dirty & /*role*/ 8) sveltea11ydialog_changes.role = /*role*/ ctx[3];
    			if (dirty & /*getClassNames*/ 128) sveltea11ydialog_changes.classNames = /*getClassNames*/ ctx[7]();

    			if (dirty & /*$$scope*/ 16384) {
    				sveltea11ydialog_changes.$$scope = { dirty, ctx };
    			}

    			sveltea11ydialog.$set(sveltea11ydialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sveltea11ydialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sveltea11ydialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sveltea11ydialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let getClassNames;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, ['closeButtonContent','default']);
    	const dispatch = createEventDispatcher();
    	let { id } = $$props;
    	let { title } = $$props;
    	let { dialogRoot } = $$props;
    	let { role = "dialog" } = $$props;
    	let { titleId = "" } = $$props;
    	let { closeButtonLabel = "Close button" } = $$props;
    	let { closeButtonPosition = "first" } = $$props;
    	let { drawerPlacement = "" } = $$props;
    	let { isAnimationFadeIn = false } = $$props;
    	let { isAnimationSlideUp = false } = $$props;

    	/**
     * Handles a11y-dialog instantiation and assigning of dialog instance
     */
    	let dialogInstance;

    	const assignDialogInstance = ev => {
    		dialogInstance = ev.detail.instance;
    		dispatch("instance", { instance: dialogInstance });
    	};

    	let { classNames = {} } = $$props;

    	const documentClasses = [
    		"dialog-content",
    		isAnimationFadeIn && isAnimationSlideUp
    		? "dialog-slide-up-fade-in"
    		: "",
    		!isAnimationFadeIn && isAnimationSlideUp
    		? "dialog-slide-up"
    		: "",
    		isAnimationFadeIn && !isAnimationSlideUp
    		? "dialog-fade-in"
    		: "",
    		drawerPlacement.length ? "drawer-content" : ""
    	].filter(c => c).join(" ");

    	const containerClasses = ["dialog", drawerPlacement ? `drawer-${drawerPlacement}` : ""].filter(c => c).join(" ");

    	const defaultClassNames = {
    		container: containerClasses,
    		document: documentClasses,
    		overlay: "dialog-overlay",
    		title: "h4 mbe16",
    		// Borrows .close-button (from close.css) as it gives us the transparent
    		// style plus the a11y focus ring we want applied to dialog's close button
    		closeButton: "dialog-close dialog-close-button"
    	};

    	const writable_props = [
    		'id',
    		'title',
    		'dialogRoot',
    		'role',
    		'titleId',
    		'closeButtonLabel',
    		'closeButtonPosition',
    		'drawerPlacement',
    		'isAnimationFadeIn',
    		'isAnimationSlideUp',
    		'classNames'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('dialogRoot' in $$props) $$invalidate(2, dialogRoot = $$props.dialogRoot);
    		if ('role' in $$props) $$invalidate(3, role = $$props.role);
    		if ('titleId' in $$props) $$invalidate(4, titleId = $$props.titleId);
    		if ('closeButtonLabel' in $$props) $$invalidate(5, closeButtonLabel = $$props.closeButtonLabel);
    		if ('closeButtonPosition' in $$props) $$invalidate(6, closeButtonPosition = $$props.closeButtonPosition);
    		if ('drawerPlacement' in $$props) $$invalidate(9, drawerPlacement = $$props.drawerPlacement);
    		if ('isAnimationFadeIn' in $$props) $$invalidate(10, isAnimationFadeIn = $$props.isAnimationFadeIn);
    		if ('isAnimationSlideUp' in $$props) $$invalidate(11, isAnimationSlideUp = $$props.isAnimationSlideUp);
    		if ('classNames' in $$props) $$invalidate(12, classNames = $$props.classNames);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		SvelteA11yDialog,
    		createEventDispatcher,
    		dispatch,
    		Close,
    		id,
    		title,
    		dialogRoot,
    		role,
    		titleId,
    		closeButtonLabel,
    		closeButtonPosition,
    		drawerPlacement,
    		isAnimationFadeIn,
    		isAnimationSlideUp,
    		dialogInstance,
    		assignDialogInstance,
    		classNames,
    		documentClasses,
    		containerClasses,
    		defaultClassNames,
    		getClassNames
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('dialogRoot' in $$props) $$invalidate(2, dialogRoot = $$props.dialogRoot);
    		if ('role' in $$props) $$invalidate(3, role = $$props.role);
    		if ('titleId' in $$props) $$invalidate(4, titleId = $$props.titleId);
    		if ('closeButtonLabel' in $$props) $$invalidate(5, closeButtonLabel = $$props.closeButtonLabel);
    		if ('closeButtonPosition' in $$props) $$invalidate(6, closeButtonPosition = $$props.closeButtonPosition);
    		if ('drawerPlacement' in $$props) $$invalidate(9, drawerPlacement = $$props.drawerPlacement);
    		if ('isAnimationFadeIn' in $$props) $$invalidate(10, isAnimationFadeIn = $$props.isAnimationFadeIn);
    		if ('isAnimationSlideUp' in $$props) $$invalidate(11, isAnimationSlideUp = $$props.isAnimationSlideUp);
    		if ('dialogInstance' in $$props) dialogInstance = $$props.dialogInstance;
    		if ('classNames' in $$props) $$invalidate(12, classNames = $$props.classNames);
    		if ('getClassNames' in $$props) $$invalidate(7, getClassNames = $$props.getClassNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*classNames*/ 4096) {
    			$$invalidate(7, getClassNames = () => {
    				return { ...defaultClassNames, ...classNames };
    			});
    		}
    	};

    	return [
    		id,
    		title,
    		dialogRoot,
    		role,
    		titleId,
    		closeButtonLabel,
    		closeButtonPosition,
    		getClassNames,
    		assignDialogInstance,
    		drawerPlacement,
    		isAnimationFadeIn,
    		isAnimationSlideUp,
    		classNames,
    		slots,
    		$$scope
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			id: 0,
    			title: 1,
    			dialogRoot: 2,
    			role: 3,
    			titleId: 4,
    			closeButtonLabel: 5,
    			closeButtonPosition: 6,
    			drawerPlacement: 9,
    			isAnimationFadeIn: 10,
    			isAnimationSlideUp: 11,
    			classNames: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Dialog> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Dialog> was created without expected prop 'title'");
    		}

    		if (/*dialogRoot*/ ctx[2] === undefined && !('dialogRoot' in props)) {
    			console.warn("<Dialog> was created without expected prop 'dialogRoot'");
    		}
    	}

    	get id() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dialogRoot() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dialogRoot(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleId() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleId(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonLabel() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonLabel(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonPosition() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonPosition(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get drawerPlacement() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set drawerPlacement(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isAnimationFadeIn() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAnimationFadeIn(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isAnimationSlideUp() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAnimationSlideUp(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNames() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNames(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Icon/Icon.svelte generated by Svelte v3.47.0 */
    const file$n = "node_modules/agnostic-svelte/components/Icon/Icon.svelte";

    function create_fragment$q(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "" + (null_to_empty(/*iconClasses*/ ctx[1]) + " svelte-6hrql0"));
    			add_location(span, file$n, 184, 0, 3204);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[7](span);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
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
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { type = 14 } = $$props;
    	let { size = 14 } = $$props;
    	let { isSkinned = true } = $$props;
    	let spanRef;

    	const iconClasses = [
    		"screenreader-only",
    		isSkinned ? "icon" : "icon-base",
    		type ? `icon-${type}` : "",
    		size ? `icon-${size}` : ""
    	].filter(cls => cls).join(" ");

    	onMount(() => {
    		const svg = spanRef.querySelector("svg");
    		svg.classList.add("icon-svg");

    		if (svg) {
    			if (size) svg.classList.add(`icon-svg-${size}`);
    			if (type) svg.classList.add(`icon-svg-${type}`);

    			// Now that we've setup our SVG classes we can visually unhide the icon
    			spanRef.classList.remove("screenreader-only");
    		}
    	});

    	const writable_props = ['type', 'size', 'isSkinned'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			spanRef = $$value;
    			$$invalidate(0, spanRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('isSkinned' in $$props) $$invalidate(4, isSkinned = $$props.isSkinned);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		type,
    		size,
    		isSkinned,
    		spanRef,
    		iconClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('isSkinned' in $$props) $$invalidate(4, isSkinned = $$props.isSkinned);
    		if ('spanRef' in $$props) $$invalidate(0, spanRef = $$props.spanRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spanRef, iconClasses, type, size, isSkinned, $$scope, slots, span_binding];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { type: 2, size: 3, isSkinned: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get type() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Input/Input.svelte generated by Svelte v3.47.0 */

    const file$m = "node_modules/agnostic-svelte/components/Input/Input.svelte";
    const get_addonRight_slot_changes = dirty => ({});
    const get_addonRight_slot_context = ctx => ({});
    const get_addonLeft_slot_changes = dirty => ({});
    const get_addonLeft_slot_context = ctx => ({});

    // (397:2) {:else}
    function create_else_block$6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ type: /*inputType*/ ctx[15] },
    		{ value: /*value*/ ctx[0] },
    		{ class: /*inputClasses*/ ctx[13] },
    		{ disabled: /*isDisabled*/ ctx[8] },
    		/*$$restProps*/ ctx[16]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-bhoud9", true);
    			add_location(input, file$m, 397, 4, 10684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[35], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[36], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[41], false, false, false),
    					listen_dev(input, "click", /*click_handler_2*/ ctx[37], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[38], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty[0] & /*inputType*/ 32768 && { type: /*inputType*/ ctx[15] },
    				dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0] && { value: /*value*/ ctx[0] },
    				dirty[0] & /*inputClasses*/ 8192 && { class: /*inputClasses*/ ctx[13] },
    				dirty[0] & /*isDisabled*/ 256 && { disabled: /*isDisabled*/ ctx[8] },
    				dirty[0] & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}

    			toggle_class(input, "svelte-bhoud9", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(397:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (379:42) 
    function create_if_block_3$1(ctx) {
    	let div;
    	let t0;
    	let input;
    	let t1;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const addonLeft_slot_template = /*#slots*/ ctx[26].addonLeft;
    	const addonLeft_slot = create_slot(addonLeft_slot_template, ctx, /*$$scope*/ ctx[25], get_addonLeft_slot_context);

    	let input_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ type: /*inputType*/ ctx[15] },
    		{ value: /*value*/ ctx[0] },
    		{ class: /*inputClasses*/ ctx[13] },
    		{ disabled: /*isDisabled*/ ctx[8] },
    		/*$$restProps*/ ctx[16]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const addonRight_slot_template = /*#slots*/ ctx[26].addonRight;
    	const addonRight_slot = create_slot(addonRight_slot_template, ctx, /*$$scope*/ ctx[25], get_addonRight_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (addonLeft_slot) addonLeft_slot.c();
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			if (addonRight_slot) addonRight_slot.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-bhoud9", true);
    			add_location(input, file$m, 381, 6, 10348);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*addonContainerClasses*/ ctx[10]()) + " svelte-bhoud9"));
    			add_location(div, file$m, 379, 4, 10272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (addonLeft_slot) {
    				addonLeft_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, input);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();
    			append_dev(div, t1);

    			if (addonRight_slot) {
    				addonRight_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[31], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[32], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[40], false, false, false),
    					listen_dev(input, "click", /*click_handler_1*/ ctx[33], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[34], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (addonLeft_slot) {
    				if (addonLeft_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						addonLeft_slot,
    						addonLeft_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(addonLeft_slot_template, /*$$scope*/ ctx[25], dirty, get_addonLeft_slot_changes),
    						get_addonLeft_slot_context
    					);
    				}
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*id*/ 4) && { id: /*id*/ ctx[2] },
    				(!current || dirty[0] & /*inputType*/ 32768) && { type: /*inputType*/ ctx[15] },
    				(!current || dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) && { value: /*value*/ ctx[0] },
    				(!current || dirty[0] & /*inputClasses*/ 8192) && { class: /*inputClasses*/ ctx[13] },
    				(!current || dirty[0] & /*isDisabled*/ 256) && { disabled: /*isDisabled*/ ctx[8] },
    				dirty[0] & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}

    			toggle_class(input, "svelte-bhoud9", true);

    			if (addonRight_slot) {
    				if (addonRight_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						addonRight_slot,
    						addonRight_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(addonRight_slot_template, /*$$scope*/ ctx[25], dirty, get_addonRight_slot_changes),
    						get_addonRight_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*addonContainerClasses*/ 1024 && div_class_value !== (div_class_value = "" + (null_to_empty(/*addonContainerClasses*/ ctx[10]()) + " svelte-bhoud9"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addonLeft_slot, local);
    			transition_in(addonRight_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addonLeft_slot, local);
    			transition_out(addonRight_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (addonLeft_slot) addonLeft_slot.d(detaching);
    			if (addonRight_slot) addonRight_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(379:42) ",
    		ctx
    	});

    	return block;
    }

    // (369:2) {#if type == "textarea"}
    function create_if_block_2$1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClasses*/ ctx[13] },
    		/*$$restProps*/ ctx[16]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			toggle_class(textarea, "svelte-bhoud9", true);
    			add_location(textarea, file$m, 369, 4, 10062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[27], false, false, false),
    					listen_dev(textarea, "change", /*change_handler*/ ctx[28], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[39]),
    					listen_dev(textarea, "click", /*click_handler*/ ctx[29], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[30], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty[0] & /*inputClasses*/ 8192 && { class: /*inputClasses*/ ctx[13] },
    				dirty[0] & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}

    			toggle_class(textarea, "svelte-bhoud9", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(369:2) {#if type == \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (416:21) 
    function create_if_block_1$4(ctx) {
    	let span;
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*helpText*/ ctx[3]);
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*helpClasses*/ ctx[11]()) + " svelte-bhoud9"));
    			add_location(span, file$m, 415, 21, 11086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helpText*/ 8) set_data_dev(t, /*helpText*/ ctx[3]);

    			if (dirty[0] & /*helpClasses*/ 2048 && span_class_value !== (span_class_value = "" + (null_to_empty(/*helpClasses*/ ctx[11]()) + " svelte-bhoud9"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(416:21) ",
    		ctx
    	});

    	return block;
    }

    // (412:2) {#if isInvalid}
    function create_if_block$c(ctx) {
    	let span;
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*invalidText*/ ctx[4]);
    			attr_dev(span, "role", "status");
    			attr_dev(span, "aria-live", "polite");
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*invalidClasses*/ ctx[12]()) + " svelte-bhoud9"));
    			add_location(span, file$m, 412, 4, 10968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 16) set_data_dev(t, /*invalidText*/ ctx[4]);

    			if (dirty[0] & /*invalidClasses*/ 4096 && span_class_value !== (span_class_value = "" + (null_to_empty(/*invalidClasses*/ ctx[12]()) + " svelte-bhoud9"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(412:2) {#if isInvalid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let label_1_class_value;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_if_block_3$1, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[9] == "textarea") return 0;
    		if (/*hasLeftAddon*/ ctx[5] || /*hasRightAddon*/ ctx[6]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*isInvalid*/ ctx[7]) return create_if_block$c;
    		if (/*helpText*/ ctx[3]) return create_if_block_1$4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label_1, "class", label_1_class_value = "" + (null_to_empty(/*labelClasses*/ ctx[14]) + " svelte-bhoud9"));
    			attr_dev(label_1, "for", /*id*/ ctx[2]);
    			add_location(label_1, file$m, 367, 2, 9978);
    			attr_dev(div, "class", "w-100");
    			add_location(div, file$m, 366, 0, 9956);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			append_dev(label_1, t0);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (!current || dirty[0] & /*labelClasses*/ 16384 && label_1_class_value !== (label_1_class_value = "" + (null_to_empty(/*labelClasses*/ ctx[14]) + " svelte-bhoud9"))) {
    				attr_dev(label_1, "class", label_1_class_value);
    			}

    			if (!current || dirty[0] & /*id*/ 4) {
    				attr_dev(label_1, "for", /*id*/ ctx[2]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t2);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();

    			if (if_block1) {
    				if_block1.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let inputType;
    	let labelClasses;
    	let inputClasses;
    	let invalidClasses;
    	let helpClasses;
    	let addonContainerClasses;

    	const omit_props_names = [
    		"label","id","labelCss","helpText","invalidText","hasLeftAddon","hasRightAddon","isInvalid","isInline","isRounded","isDisabled","css","isSkinned","isUnderlinedWithBackground","isUnderlined","size","value","type"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, ['addonLeft','addonRight']);
    	let { label = "" } = $$props;
    	let { id = "" } = $$props;
    	let { labelCss = "" } = $$props;
    	let { helpText = "" } = $$props;
    	let { invalidText = "" } = $$props;
    	let { hasLeftAddon = false } = $$props;
    	let { hasRightAddon = false } = $$props;
    	let { isInvalid = false } = $$props;
    	let { isInline = false } = $$props;
    	let { isRounded = false } = $$props;
    	let { isDisabled = undefined } = $$props;
    	let { css = "" } = $$props;
    	let { isSkinned = true } = $$props;
    	let { isUnderlinedWithBackground = false } = $$props;
    	let { isUnderlined = false } = $$props;
    	let { size = "" } = $$props;
    	let { value = "" } = $$props;
    	let { type = 'text' } = $$props;

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const input_handler = e => $$invalidate(0, value = e.target.value);
    	const input_handler_1 = e => $$invalidate(0, value = e.target.value);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
    		if ('id' in $$new_props) $$invalidate(2, id = $$new_props.id);
    		if ('labelCss' in $$new_props) $$invalidate(17, labelCss = $$new_props.labelCss);
    		if ('helpText' in $$new_props) $$invalidate(3, helpText = $$new_props.helpText);
    		if ('invalidText' in $$new_props) $$invalidate(4, invalidText = $$new_props.invalidText);
    		if ('hasLeftAddon' in $$new_props) $$invalidate(5, hasLeftAddon = $$new_props.hasLeftAddon);
    		if ('hasRightAddon' in $$new_props) $$invalidate(6, hasRightAddon = $$new_props.hasRightAddon);
    		if ('isInvalid' in $$new_props) $$invalidate(7, isInvalid = $$new_props.isInvalid);
    		if ('isInline' in $$new_props) $$invalidate(18, isInline = $$new_props.isInline);
    		if ('isRounded' in $$new_props) $$invalidate(19, isRounded = $$new_props.isRounded);
    		if ('isDisabled' in $$new_props) $$invalidate(8, isDisabled = $$new_props.isDisabled);
    		if ('css' in $$new_props) $$invalidate(20, css = $$new_props.css);
    		if ('isSkinned' in $$new_props) $$invalidate(21, isSkinned = $$new_props.isSkinned);
    		if ('isUnderlinedWithBackground' in $$new_props) $$invalidate(22, isUnderlinedWithBackground = $$new_props.isUnderlinedWithBackground);
    		if ('isUnderlined' in $$new_props) $$invalidate(23, isUnderlined = $$new_props.isUnderlined);
    		if ('size' in $$new_props) $$invalidate(24, size = $$new_props.size);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$new_props) $$invalidate(9, type = $$new_props.type);
    		if ('$$scope' in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		id,
    		labelCss,
    		helpText,
    		invalidText,
    		hasLeftAddon,
    		hasRightAddon,
    		isInvalid,
    		isInline,
    		isRounded,
    		isDisabled,
    		css,
    		isSkinned,
    		isUnderlinedWithBackground,
    		isUnderlined,
    		size,
    		value,
    		type,
    		addonContainerClasses,
    		helpClasses,
    		invalidClasses,
    		inputClasses,
    		labelClasses,
    		inputType
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('label' in $$props) $$invalidate(1, label = $$new_props.label);
    		if ('id' in $$props) $$invalidate(2, id = $$new_props.id);
    		if ('labelCss' in $$props) $$invalidate(17, labelCss = $$new_props.labelCss);
    		if ('helpText' in $$props) $$invalidate(3, helpText = $$new_props.helpText);
    		if ('invalidText' in $$props) $$invalidate(4, invalidText = $$new_props.invalidText);
    		if ('hasLeftAddon' in $$props) $$invalidate(5, hasLeftAddon = $$new_props.hasLeftAddon);
    		if ('hasRightAddon' in $$props) $$invalidate(6, hasRightAddon = $$new_props.hasRightAddon);
    		if ('isInvalid' in $$props) $$invalidate(7, isInvalid = $$new_props.isInvalid);
    		if ('isInline' in $$props) $$invalidate(18, isInline = $$new_props.isInline);
    		if ('isRounded' in $$props) $$invalidate(19, isRounded = $$new_props.isRounded);
    		if ('isDisabled' in $$props) $$invalidate(8, isDisabled = $$new_props.isDisabled);
    		if ('css' in $$props) $$invalidate(20, css = $$new_props.css);
    		if ('isSkinned' in $$props) $$invalidate(21, isSkinned = $$new_props.isSkinned);
    		if ('isUnderlinedWithBackground' in $$props) $$invalidate(22, isUnderlinedWithBackground = $$new_props.isUnderlinedWithBackground);
    		if ('isUnderlined' in $$props) $$invalidate(23, isUnderlined = $$new_props.isUnderlined);
    		if ('size' in $$props) $$invalidate(24, size = $$new_props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$props) $$invalidate(9, type = $$new_props.type);
    		if ('addonContainerClasses' in $$props) $$invalidate(10, addonContainerClasses = $$new_props.addonContainerClasses);
    		if ('helpClasses' in $$props) $$invalidate(11, helpClasses = $$new_props.helpClasses);
    		if ('invalidClasses' in $$props) $$invalidate(12, invalidClasses = $$new_props.invalidClasses);
    		if ('inputClasses' in $$props) $$invalidate(13, inputClasses = $$new_props.inputClasses);
    		if ('labelClasses' in $$props) $$invalidate(14, labelClasses = $$new_props.labelClasses);
    		if ('inputType' in $$props) $$invalidate(15, inputType = $$new_props.inputType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			if (!value) $$invalidate(0, value = "");
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 512) {
    			$$invalidate(15, inputType = type);
    		}

    		if ($$self.$$.dirty[0] & /*isInvalid, isInline, size, labelCss*/ 17170560) {
    			$$invalidate(14, labelClasses = [
    				"label",
    				isInvalid ? "label-error" : "",
    				isInline ? "label-inline" : "",
    				size ? `label-${size}` : "",
    				labelCss ? labelCss : ""
    			].filter(c => c).join(" "));
    		}

    		if ($$self.$$.dirty[0] & /*isSkinned, isRounded, isUnderlined, hasLeftAddon, hasRightAddon, isDisabled, isInvalid, isInline, isUnderlinedWithBackground, css, size*/ 33292768) {
    			$$invalidate(13, inputClasses = [
    				isSkinned ? "input" : "input-base",
    				isRounded ? "input-rounded" : "",
    				isUnderlined ? "input-underlined" : "",
    				hasLeftAddon ? "input-has-left-addon" : "",
    				hasRightAddon ? "input-has-right-addon" : "",
    				isDisabled ? "disabled" : "",
    				isInvalid ? "input-error" : "",
    				isInline ? "input-inline" : "",
    				isUnderlinedWithBackground ? "input-underlined-bg" : "",
    				css ? css : "",
    				size ? `input-${size}` : ""
    			].filter(c => c).join(" "));
    		}

    		if ($$self.$$.dirty[0] & /*size*/ 16777216) {
    			$$invalidate(12, invalidClasses = () => {
    				return size ? `field-error-${size}` : "field-error";
    			});
    		}

    		if ($$self.$$.dirty[0] & /*size*/ 16777216) {
    			$$invalidate(11, helpClasses = () => {
    				return size ? `field-help-${size}` : "field-help";
    			});
    		}
    	};

    	$$invalidate(10, addonContainerClasses = () => "input-addon-container");

    	return [
    		value,
    		label,
    		id,
    		helpText,
    		invalidText,
    		hasLeftAddon,
    		hasRightAddon,
    		isInvalid,
    		isDisabled,
    		type,
    		addonContainerClasses,
    		helpClasses,
    		invalidClasses,
    		inputClasses,
    		labelClasses,
    		inputType,
    		$$restProps,
    		labelCss,
    		isInline,
    		isRounded,
    		css,
    		isSkinned,
    		isUnderlinedWithBackground,
    		isUnderlined,
    		size,
    		$$scope,
    		slots,
    		blur_handler,
    		change_handler,
    		click_handler,
    		focus_handler,
    		blur_handler_1,
    		change_handler_1,
    		click_handler_1,
    		focus_handler_1,
    		blur_handler_2,
    		change_handler_2,
    		click_handler_2,
    		focus_handler_2,
    		textarea_input_handler,
    		input_handler,
    		input_handler_1
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$p,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				label: 1,
    				id: 2,
    				labelCss: 17,
    				helpText: 3,
    				invalidText: 4,
    				hasLeftAddon: 5,
    				hasRightAddon: 6,
    				isInvalid: 7,
    				isInline: 18,
    				isRounded: 19,
    				isDisabled: 8,
    				css: 20,
    				isSkinned: 21,
    				isUnderlinedWithBackground: 22,
    				isUnderlined: 23,
    				size: 24,
    				value: 0,
    				type: 9
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelCss() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelCss(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpText() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpText(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasLeftAddon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasLeftAddon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasRightAddon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasRightAddon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInvalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInvalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInline() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInline(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRounded() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRounded(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isUnderlinedWithBackground() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isUnderlinedWithBackground(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isUnderlined() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isUnderlined(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Loader/Loader.svelte generated by Svelte v3.47.0 */

    const file$l = "node_modules/agnostic-svelte/components/Loader/Loader.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let span;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[0]);
    			attr_dev(span, "class", "screenreader-only");
    			add_location(span, file$l, 115, 2, 2305);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*loaderClasses*/ ctx[1]) + " svelte-yq7y4m"));
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "aria-busy", "true");
    			add_location(div, file$l, 114, 0, 2225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ariaLabel*/ 1) set_data_dev(t, /*ariaLabel*/ ctx[0]);

    			if (dirty & /*loaderClasses*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*loaderClasses*/ ctx[1]) + " svelte-yq7y4m"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { ariaLabel = "Loading…" } = $$props;
    	let { size = "" } = $$props;
    	let { loaderClasses = ["loader", size ? `loader-${size}` : ""].filter(c => c).join(" ") } = $$props;
    	const writable_props = ['ariaLabel', 'size', 'loaderClasses'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$props.ariaLabel);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('loaderClasses' in $$props) $$invalidate(1, loaderClasses = $$props.loaderClasses);
    	};

    	$$self.$capture_state = () => ({ ariaLabel, size, loaderClasses });

    	$$self.$inject_state = $$props => {
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$props.ariaLabel);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('loaderClasses' in $$props) $$invalidate(1, loaderClasses = $$props.loaderClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ariaLabel, loaderClasses, size];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { ariaLabel: 0, size: 2, loaderClasses: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loaderClasses() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loaderClasses(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Select/Select.svelte generated by Svelte v3.47.0 */
    const file$k = "node_modules/agnostic-svelte/components/Select/Select.svelte";

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i].value;
    	child_ctx[20] = list[i].label;
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i].value;
    	child_ctx[20] = list[i].label;
    	return child_ctx;
    }

    // (141:0) {:else}
    function create_else_block$5(ctx) {
    	let select;
    	let option;
    	let t0;
    	let t1;
    	let select_class_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*options*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");
    			t0 = text(/*defaultOptionLabel*/ ctx[8]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = "select-option";
    			option.value = option.__value;
    			option.disabled = true;
    			option.selected = true;
    			add_location(option, file$k, 150, 4, 4052);
    			attr_dev(select, "id", /*uniqueId*/ ctx[2]);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*classes*/ ctx[9]) + " svelte-1fcrzmy"));
    			attr_dev(select, "name", /*name*/ ctx[3]);
    			select.disabled = /*disable*/ ctx[10];
    			attr_dev(select, "size", /*multipleSize*/ ctx[6]);
    			if (/*selected*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[17].call(select));
    			add_location(select, file$k, 141, 2, 3879);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);
    			append_dev(option, t0);
    			append_dev(option, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selected*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[17]),
    					listen_dev(select, "change", /*changeHandler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultOptionLabel*/ 256) set_data_dev(t0, /*defaultOptionLabel*/ ctx[8]);

    			if (dirty & /*options*/ 32) {
    				each_value_1 = /*options*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*uniqueId*/ 4) {
    				attr_dev(select, "id", /*uniqueId*/ ctx[2]);
    			}

    			if (dirty & /*classes*/ 512 && select_class_value !== (select_class_value = "" + (null_to_empty(/*classes*/ ctx[9]) + " svelte-1fcrzmy"))) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty & /*name*/ 8) {
    				attr_dev(select, "name", /*name*/ ctx[3]);
    			}

    			if (dirty & /*disable*/ 1024) {
    				prop_dev(select, "disabled", /*disable*/ ctx[10]);
    			}

    			if (dirty & /*multipleSize*/ 64) {
    				attr_dev(select, "size", /*multipleSize*/ ctx[6]);
    			}

    			if (dirty & /*selected, options*/ 33) {
    				select_option(select, /*selected*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(141:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (126:0) {#if isMultiple}
    function create_if_block$b(ctx) {
    	let select;
    	let select_class_value;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "id", /*uniqueId*/ ctx[2]);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*classes*/ ctx[9]) + " svelte-1fcrzmy"));
    			attr_dev(select, "name", /*name*/ ctx[3]);
    			select.disabled = /*disable*/ ctx[10];
    			select.multiple = true;
    			attr_dev(select, "size", /*multipleSize*/ ctx[6]);
    			if (/*multiSelected*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[16].call(select));
    			add_location(select, file$k, 126, 2, 3573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_options(select, /*multiSelected*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[16]),
    					listen_dev(select, "change", /*changeHandler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 32) {
    				each_value = /*options*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*uniqueId*/ 4) {
    				attr_dev(select, "id", /*uniqueId*/ ctx[2]);
    			}

    			if (dirty & /*classes*/ 512 && select_class_value !== (select_class_value = "" + (null_to_empty(/*classes*/ ctx[9]) + " svelte-1fcrzmy"))) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty & /*name*/ 8) {
    				attr_dev(select, "name", /*name*/ ctx[3]);
    			}

    			if (dirty & /*disable*/ 1024) {
    				prop_dev(select, "disabled", /*disable*/ ctx[10]);
    			}

    			if (dirty & /*multipleSize*/ 64) {
    				attr_dev(select, "size", /*multipleSize*/ ctx[6]);
    			}

    			if (dirty & /*multiSelected, options*/ 34) {
    				select_options(select, /*multiSelected*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(126:0) {#if isMultiple}",
    		ctx
    	});

    	return block;
    }

    // (154:4) {#each options as { value, label }}
    function create_each_block_1$3(ctx) {
    	let option;
    	let t_value = /*label*/ ctx[20] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*value*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file$k, 154, 6, 4188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 32 && t_value !== (t_value = /*label*/ ctx[20] + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 32 && option_value_value !== (option_value_value = /*value*/ ctx[19])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(154:4) {#each options as { value, label }}",
    		ctx
    	});

    	return block;
    }

    // (137:4) {#each options as { value, label }}
    function create_each_block$4(ctx) {
    	let option;
    	let t_value = /*label*/ ctx[20] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*value*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file$k, 137, 6, 3806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 32 && t_value !== (t_value = /*label*/ ctx[20] + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 32 && option_value_value !== (option_value_value = /*value*/ ctx[19])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(137:4) {#each options as { value, label }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isMultiple*/ ctx[7]) return create_if_block$b;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(/*labelCopy*/ ctx[4]);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label, "class", "screenreader-only");
    			attr_dev(label, "for", /*uniqueId*/ ctx[2]);
    			add_location(label, file$k, 124, 0, 3484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*labelCopy*/ 16) set_data_dev(t0, /*labelCopy*/ ctx[4]);

    			if (dirty & /*uniqueId*/ 4) {
    				attr_dev(label, "for", /*uniqueId*/ ctx[2]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let disable;
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	let { uniqueId = "" } = $$props;
    	let { name = "" } = $$props;
    	let { labelCopy = "" } = $$props;
    	let { options = [] } = $$props;
    	let { size = "" } = $$props;
    	let { multipleSize = 1 } = $$props;
    	let { isMultiple = false } = $$props;
    	let { defaultOptionLabel = "Please select an option" } = $$props;
    	let { isDisabled = false } = $$props;
    	let { isSkinned = true } = $$props;
    	let { css = "" } = $$props;
    	let { selected } = $$props;
    	let { multiSelected = [] } = $$props;
    	const dispatch = createEventDispatcher();

    	// This will emit an event object that has a event.detail prop
    	// This will contain the value of the selected option value. See
    	// https://svelte.dev/docs#createEventDispatcher
    	const changeHandler = () => {
    		dispatch("selected", isMultiple ? multiSelected : selected);
    	};

    	const writable_props = [
    		'uniqueId',
    		'name',
    		'labelCopy',
    		'options',
    		'size',
    		'multipleSize',
    		'isMultiple',
    		'defaultOptionLabel',
    		'isDisabled',
    		'isSkinned',
    		'css',
    		'selected',
    		'multiSelected'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		multiSelected = select_multiple_value(this);
    		$$invalidate(1, multiSelected);
    		$$invalidate(5, options);
    	}

    	function select_change_handler_1() {
    		selected = select_value(this);
    		$$invalidate(0, selected);
    		$$invalidate(5, options);
    	}

    	$$self.$$set = $$props => {
    		if ('uniqueId' in $$props) $$invalidate(2, uniqueId = $$props.uniqueId);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('labelCopy' in $$props) $$invalidate(4, labelCopy = $$props.labelCopy);
    		if ('options' in $$props) $$invalidate(5, options = $$props.options);
    		if ('size' in $$props) $$invalidate(12, size = $$props.size);
    		if ('multipleSize' in $$props) $$invalidate(6, multipleSize = $$props.multipleSize);
    		if ('isMultiple' in $$props) $$invalidate(7, isMultiple = $$props.isMultiple);
    		if ('defaultOptionLabel' in $$props) $$invalidate(8, defaultOptionLabel = $$props.defaultOptionLabel);
    		if ('isDisabled' in $$props) $$invalidate(13, isDisabled = $$props.isDisabled);
    		if ('isSkinned' in $$props) $$invalidate(14, isSkinned = $$props.isSkinned);
    		if ('css' in $$props) $$invalidate(15, css = $$props.css);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('multiSelected' in $$props) $$invalidate(1, multiSelected = $$props.multiSelected);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		uniqueId,
    		name,
    		labelCopy,
    		options,
    		size,
    		multipleSize,
    		isMultiple,
    		defaultOptionLabel,
    		isDisabled,
    		isSkinned,
    		css,
    		selected,
    		multiSelected,
    		dispatch,
    		changeHandler,
    		classes,
    		disable
    	});

    	$$self.$inject_state = $$props => {
    		if ('uniqueId' in $$props) $$invalidate(2, uniqueId = $$props.uniqueId);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('labelCopy' in $$props) $$invalidate(4, labelCopy = $$props.labelCopy);
    		if ('options' in $$props) $$invalidate(5, options = $$props.options);
    		if ('size' in $$props) $$invalidate(12, size = $$props.size);
    		if ('multipleSize' in $$props) $$invalidate(6, multipleSize = $$props.multipleSize);
    		if ('isMultiple' in $$props) $$invalidate(7, isMultiple = $$props.isMultiple);
    		if ('defaultOptionLabel' in $$props) $$invalidate(8, defaultOptionLabel = $$props.defaultOptionLabel);
    		if ('isDisabled' in $$props) $$invalidate(13, isDisabled = $$props.isDisabled);
    		if ('isSkinned' in $$props) $$invalidate(14, isSkinned = $$props.isSkinned);
    		if ('css' in $$props) $$invalidate(15, css = $$props.css);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('multiSelected' in $$props) $$invalidate(1, multiSelected = $$props.multiSelected);
    		if ('classes' in $$props) $$invalidate(9, classes = $$props.classes);
    		if ('disable' in $$props) $$invalidate(10, disable = $$props.disable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isDisabled*/ 8192) {
    			$$invalidate(10, disable = isDisabled);
    		}

    		if ($$self.$$.dirty & /*isSkinned, size, css*/ 53248) {
    			$$invalidate(9, classes = [
    				isSkinned ? "select" : "select-base",
    				size ? `select-${size}` : "",
    				css ? `${css}` : ""
    			].filter(cl => cl).join(" "));
    		}
    	};

    	return [
    		selected,
    		multiSelected,
    		uniqueId,
    		name,
    		labelCopy,
    		options,
    		multipleSize,
    		isMultiple,
    		defaultOptionLabel,
    		classes,
    		disable,
    		changeHandler,
    		size,
    		isDisabled,
    		isSkinned,
    		css,
    		select_change_handler,
    		select_change_handler_1
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			uniqueId: 2,
    			name: 3,
    			labelCopy: 4,
    			options: 5,
    			size: 12,
    			multipleSize: 6,
    			isMultiple: 7,
    			defaultOptionLabel: 8,
    			isDisabled: 13,
    			isSkinned: 14,
    			css: 15,
    			selected: 0,
    			multiSelected: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selected*/ ctx[0] === undefined && !('selected' in props)) {
    			console.warn("<Select> was created without expected prop 'selected'");
    		}
    	}

    	get uniqueId() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uniqueId(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelCopy() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelCopy(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multipleSize() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multipleSize(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMultiple() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMultiple(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultOptionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultOptionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiSelected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiSelected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Table/Table.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$j = "node_modules/agnostic-svelte/components/Table/Table.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	child_ctx[33] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    // (509:12) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*headerCol*/ ctx[34].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers*/ 1 && t_value !== (t_value = /*headerCol*/ ctx[34].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(509:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (492:12) {#if headerCol.sortable}
    function create_if_block_1$3(ctx) {
    	let div;
    	let span0;
    	let t0_value = /*headerCol*/ ctx[34].label + "";
    	let t0;
    	let t1;
    	let button;
    	let span1;
    	let t2_value = /*headerCol*/ ctx[34].label + "";
    	let t2;
    	let t3;
    	let span2;
    	let span2_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			span2 = element("span");
    			attr_dev(span0, "class", "table-sort-label svelte-yn36ut");
    			add_location(span0, file$j, 493, 16, 14014);
    			attr_dev(span1, "class", "screenreader-only");
    			add_location(span1, file$j, 499, 18, 14261);
    			attr_dev(span2, "class", span2_class_value = "" + (null_to_empty(/*getSortingClassesFor*/ ctx[6](/*headerCol*/ ctx[34].key, /*direction*/ ctx[2], /*sortingKey*/ ctx[3])) + " svelte-yn36ut"));
    			add_location(span2, file$j, 500, 18, 14336);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "table-sort svelte-yn36ut");
    			add_location(button, file$j, 494, 16, 14086);
    			attr_dev(div, "class", "table-header-container svelte-yn36ut");
    			add_location(div, file$j, 492, 14, 13961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(button, span1);
    			append_dev(span1, t2);
    			append_dev(button, t3);
    			append_dev(button, span2);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleSortClicked*/ ctx[5](/*headerCol*/ ctx[34].key))) /*handleSortClicked*/ ctx[5](/*headerCol*/ ctx[34].key).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*headers*/ 1 && t0_value !== (t0_value = /*headerCol*/ ctx[34].label + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*headers*/ 1 && t2_value !== (t2_value = /*headerCol*/ ctx[34].label + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*headers, direction, sortingKey*/ 13 && span2_class_value !== (span2_class_value = "" + (null_to_empty(/*getSortingClassesFor*/ ctx[6](/*headerCol*/ ctx[34].key, /*direction*/ ctx[2], /*sortingKey*/ ctx[3])) + " svelte-yn36ut"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(492:12) {#if headerCol.sortable}",
    		ctx
    	});

    	return block;
    }

    // (480:8) {#each headers as headerCol}
    function create_each_block_2$1(ctx) {
    	let th;
    	let t;
    	let th_aria_sort_value;
    	let th_style_value;

    	function select_block_type(ctx, dirty) {
    		if (/*headerCol*/ ctx[34].sortable) return create_if_block_1$3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if_block.c();
    			t = space();
    			attr_dev(th, "aria-sort", th_aria_sort_value = /*getSortDirectionFor*/ ctx[7](/*headerCol*/ ctx[34].key, /*direction*/ ctx[2], /*sortingKey*/ ctx[3]));
    			attr_dev(th, "scope", "col");

    			attr_dev(th, "style", th_style_value = /*headerCol*/ ctx[34].width
    			? `width: ${/*headerCol*/ ctx[34].width}`
    			: 'width: auto');

    			attr_dev(th, "class", "svelte-yn36ut");
    			add_location(th, file$j, 480, 10, 13622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if_block.m(th, null);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, t);
    				}
    			}

    			if (dirty[0] & /*headers, direction, sortingKey*/ 13 && th_aria_sort_value !== (th_aria_sort_value = /*getSortDirectionFor*/ ctx[7](/*headerCol*/ ctx[34].key, /*direction*/ ctx[2], /*sortingKey*/ ctx[3]))) {
    				attr_dev(th, "aria-sort", th_aria_sort_value);
    			}

    			if (dirty[0] & /*headers*/ 1 && th_style_value !== (th_style_value = /*headerCol*/ ctx[34].width
    			? `width: ${/*headerCol*/ ctx[34].width}`
    			: 'width: auto')) {
    				attr_dev(th, "style", th_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(480:8) {#each headers as headerCol}",
    		ctx
    	});

    	return block;
    }

    // (524:14) {:else}
    function create_else_block$4(ctx) {
    	let t_value = /*row*/ ctx[28][/*key*/ ctx[31]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*visibleItems*/ 16 && t_value !== (t_value = /*row*/ ctx[28][/*key*/ ctx[31]] + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(524:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (519:14) {#if headers[cIndex].renderComponent}
    function create_if_block$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			cellValue: /*row*/ ctx[28][/*key*/ ctx[31]]
    		}
    	];

    	var switch_value = /*headers*/ ctx[0][/*cIndex*/ ctx[33]].renderComponent();

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*visibleItems*/ 16)
    			? get_spread_update(switch_instance_spread_levels, [
    					{
    						cellValue: /*row*/ ctx[28][/*key*/ ctx[31]]
    					}
    				])
    			: {};

    			if (switch_value !== (switch_value = /*headers*/ ctx[0][/*cIndex*/ ctx[33]].renderComponent())) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(519:14) {#if headers[cIndex].renderComponent}",
    		ctx
    	});

    	return block;
    }

    // (517:10) {#each Object.keys(row) as key, cIndex}
    function create_each_block_1$2(ctx) {
    	let td;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*headers*/ ctx[0][/*cIndex*/ ctx[33]].renderComponent) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if_block.c();
    			attr_dev(td, "class", "svelte-yn36ut");
    			add_location(td, file$j, 517, 12, 14792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if_blocks[current_block_type_index].m(td, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(td, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(517:10) {#each Object.keys(row) as key, cIndex}",
    		ctx
    	});

    	return block;
    }

    // (515:6) {#each visibleItems as row}
    function create_each_block$3(ctx) {
    	let tr;
    	let t;
    	let current;
    	let each_value_1 = Object.keys(/*row*/ ctx[28]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "svelte-yn36ut");
    			add_location(tr, file$j, 515, 8, 14725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers, visibleItems*/ 17) {
    				each_value_1 = Object.keys(/*row*/ ctx[28]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
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
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(515:6) {#each visibleItems as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let table;
    	let caption_1;
    	let t0;
    	let t1;
    	let thead;
    	let tr;
    	let t2;
    	let tbody;
    	let current;
    	let each_value_2 = /*headers*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*visibleItems*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			caption_1 = element("caption");
    			t0 = text(/*caption*/ ctx[1]);
    			t1 = space();
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(caption_1, "class", "" + (null_to_empty(/*captionClasses*/ ctx[10]()) + " svelte-yn36ut"));
    			add_location(caption_1, file$j, 476, 4, 13498);
    			attr_dev(tr, "class", "svelte-yn36ut");
    			add_location(tr, file$j, 478, 6, 13570);
    			attr_dev(thead, "class", "svelte-yn36ut");
    			add_location(thead, file$j, 477, 4, 13556);
    			attr_dev(tbody, "class", "svelte-yn36ut");
    			add_location(tbody, file$j, 513, 4, 14675);
    			attr_dev(table, "class", "" + (null_to_empty(/*tableClasses*/ ctx[9]()) + " svelte-yn36ut"));
    			add_location(table, file$j, 475, 2, 13463);
    			attr_dev(div, "class", "" + (null_to_empty(/*tableResponsiveClasses*/ ctx[8]()) + " svelte-yn36ut"));
    			add_location(div, file$j, 474, 0, 13422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, caption_1);
    			append_dev(caption_1, t0);
    			append_dev(table, t1);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t2);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*caption*/ 2) set_data_dev(t0, /*caption*/ ctx[1]);

    			if (dirty[0] & /*getSortDirectionFor, headers, direction, sortingKey, handleSortClicked, getSortingClassesFor*/ 237) {
    				each_value_2 = /*headers*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*visibleItems, headers*/ 17) {
    				each_value = /*visibleItems*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
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
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let sortableItems;
    	let visibleItems;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { headers = [] } = $$props;
    	let { rows = [] } = $$props;
    	let { caption = "" } = $$props;
    	let { captionPosition = "hidden" } = $$props;
    	let { tableSize = "" } = $$props;
    	let { responsiveSize = "" } = $$props;
    	let { isUppercasedHeaders = false } = $$props;
    	let { isBordered = false } = $$props;
    	let { isBorderless = false } = $$props;
    	let { isStriped = false } = $$props;
    	let { isHoverable = false } = $$props;
    	let { isStacked = false } = $$props;
    	let { offset = 0 } = $$props;
    	let { limit = 0 } = $$props;

    	// State
    	let direction = "none";

    	let sortingKey = "";

    	// Trigger event on sort
    	const dispatch = createEventDispatcher();

    	/**
     * Plucks the columns from rows by key of the current sortingKey; sortingKey
     * reflects the currently being sorted column due to user interaction e.g. they
     * have clicked on that columns table header cell.
     *
     * Since we want to sort rows but by column comparisons, we need to "pluck out"
     * these columns from the two rows. If we cannot find the columns in rows by the
     * `sortingKey`, then we set these to `-Infinity` which places them at the bottom.
     *
     * @param rowLeft left row to compare
     * @param rowRight right row to compare
     * @returns Normalized columns from both rows in form of { a:a, b:b }
     */
    	const pluckColumnToSort = (rowLeft, rowRight) => {
    		const colLeft = rowLeft[sortingKey] === null || rowLeft[sortingKey] === undefined
    		? -Infinity
    		: rowLeft[sortingKey];

    		const colRight = rowRight[sortingKey] === null || rowRight[sortingKey] === undefined
    		? -Infinity
    		: rowRight[sortingKey];

    		return { colLeft, colRight };
    	};

    	/**
     * This function first checks if there is a corresponding custom sort function
     * that was supplied in a header cell with key" of `sortingKey` named `.sortFn`
     * per the API. If it finds, it will delegate to that for actual sort comparison.
     * Otherwise, the function supplies its own fallback default (naive) sorting logic.
     */
    	const internalSort = (rowLeft, rowRight) => {
    		let { colLeft, colRight } = pluckColumnToSort(rowLeft, rowRight);

    		/**
     * First check if the corresponding header cell has a custom sort
     * method. If so, we use that, else we proceed with our default one.
     */
    		const headerWithCustomSortFunction = headers.find(h => h.key === sortingKey && !!h.sortFn);

    		if (headerWithCustomSortFunction && headerWithCustomSortFunction.sortFn) {
    			return headerWithCustomSortFunction.sortFn(colLeft, colRight);
    		}

    		// No custom sort method for the header cell, so we continue with our own.
    		// Strings converted to lowercase; dollar currency etc. stripped (not yet i18n safe!)
    		colLeft = typeof colLeft === "string"
    		? colLeft.toLowerCase().replace(/(^\$|,)/g, "")
    		: colLeft;

    		colRight = typeof colRight === "string"
    		? colRight.toLowerCase().replace(/(^\$|,)/g, "")
    		: colRight;

    		// If raw value represents a number explicitly set to Number
    		colLeft = !Number.isNaN(Number(colLeft))
    		? Number(colLeft)
    		: colLeft;

    		colRight = !Number.isNaN(Number(colRight))
    		? Number(colRight)
    		: colRight;

    		if (colLeft > colRight) {
    			return 1;
    		}

    		if (colLeft < colRight) {
    			return -1;
    		}

    		return 0;
    	};

    	// Simply flips the sign of results of the ascending sort
    	const descendingSort = (row1, row2) => internalSort(row1, row2) * -1;

    	const handleSortClicked = headerKey => {
    		if (sortingKey !== headerKey) {
    			$$invalidate(2, direction = "none");
    			$$invalidate(3, sortingKey = headerKey);
    		}

    		switch (direction) {
    			case "ascending":
    				$$invalidate(2, direction = "descending");
    				break;
    			case "descending":
    				$$invalidate(2, direction = "none");
    				break;
    			case "none":
    				$$invalidate(2, direction = "ascending");
    				break;
    			default:
    				console.warn("Table sorting only supports directions: ascending | descending | none");
    		}
    	};

    	/**
     * Generates th header cell classes on sortable header cells used to
     * display the appropriate sorting icons.
     * @param headerKey the key of this header cell
     * @param direction In order for this function to get called at all, we have to add both
     * direction and sortingKey as arguments. The reason is that these are the only reactive
     * variables actually changing as a result of the click on parent button (the span we're
     * placing these sorting classes on is a child). See https://stackoverflow.com/a/60155598
     * @param sortingKey
     * @returns CSS classes appropriate for the `SortableHeaderCell`'s current sorting state
     */
    	const getSortingClassesFor = (headerKey, direction, sortingKey) => {
    		if (sortingKey === headerKey) {
    			return [
    				"icon-sort",
    				direction && direction !== "none"
    				? `icon-sort-${direction}`
    				: ""
    			].filter(klass => klass.length).join(" ");
    		}

    		return "icon-sort";
    	};

    	/**
     * Gets the correct sorting direction for when we click a new sortable th cell.
     * We need to use the direction and sortingKey arguments to ensure the element
     * attributes call this function reactively (see See https://stackoverflow.com/a/60155598)
     */
    	const getSortDirectionFor = (headerKey, direction, sortingKey) => {
    		if (sortingKey !== headerKey) {
    			return "none";
    		} else {
    			return direction;
    		}
    	};

    	const tableResponsiveClasses = () => {
    		return [
    			!responsiveSize ? "table-responsive" : "",
    			responsiveSize
    			? `table-responsive-${responsiveSize}`
    			: ""
    		].filter(klass => klass.length).join(" ");
    	};

    	const tableClasses = () => {
    		return [
    			"table",
    			tableSize ? `table-${tableSize}` : "",
    			isUppercasedHeaders ? "table-caps" : "",
    			isBordered ? "table-bordered" : "",
    			isBorderless ? "table-borderless" : "",
    			isStriped ? "table-striped" : "",
    			isHoverable ? "table-hoverable" : "",
    			isStacked ? "table-stacked" : ""
    		].filter(klass => klass.length).join(" ");
    	};

    	const captionClasses = () => {
    		return [
    			// .screenreader-only is expected to be globally available via common.min.css
    			captionPosition === "hidden" ? "screenreader-only" : "",
    			captionPosition !== "hidden"
    			? `caption-${captionPosition}`
    			: ""
    		].filter(klass => klass.length).join(" ");
    	};

    	const writable_props = [
    		'headers',
    		'rows',
    		'caption',
    		'captionPosition',
    		'tableSize',
    		'responsiveSize',
    		'isUppercasedHeaders',
    		'isBordered',
    		'isBorderless',
    		'isStriped',
    		'isHoverable',
    		'isStacked',
    		'offset',
    		'limit'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('headers' in $$props) $$invalidate(0, headers = $$props.headers);
    		if ('rows' in $$props) $$invalidate(11, rows = $$props.rows);
    		if ('caption' in $$props) $$invalidate(1, caption = $$props.caption);
    		if ('captionPosition' in $$props) $$invalidate(12, captionPosition = $$props.captionPosition);
    		if ('tableSize' in $$props) $$invalidate(13, tableSize = $$props.tableSize);
    		if ('responsiveSize' in $$props) $$invalidate(14, responsiveSize = $$props.responsiveSize);
    		if ('isUppercasedHeaders' in $$props) $$invalidate(15, isUppercasedHeaders = $$props.isUppercasedHeaders);
    		if ('isBordered' in $$props) $$invalidate(16, isBordered = $$props.isBordered);
    		if ('isBorderless' in $$props) $$invalidate(17, isBorderless = $$props.isBorderless);
    		if ('isStriped' in $$props) $$invalidate(18, isStriped = $$props.isStriped);
    		if ('isHoverable' in $$props) $$invalidate(19, isHoverable = $$props.isHoverable);
    		if ('isStacked' in $$props) $$invalidate(20, isStacked = $$props.isStacked);
    		if ('offset' in $$props) $$invalidate(21, offset = $$props.offset);
    		if ('limit' in $$props) $$invalidate(22, limit = $$props.limit);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		headers,
    		rows,
    		caption,
    		captionPosition,
    		tableSize,
    		responsiveSize,
    		isUppercasedHeaders,
    		isBordered,
    		isBorderless,
    		isStriped,
    		isHoverable,
    		isStacked,
    		offset,
    		limit,
    		direction,
    		sortingKey,
    		dispatch,
    		pluckColumnToSort,
    		internalSort,
    		descendingSort,
    		handleSortClicked,
    		getSortingClassesFor,
    		getSortDirectionFor,
    		tableResponsiveClasses,
    		tableClasses,
    		captionClasses,
    		sortableItems,
    		visibleItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('headers' in $$props) $$invalidate(0, headers = $$props.headers);
    		if ('rows' in $$props) $$invalidate(11, rows = $$props.rows);
    		if ('caption' in $$props) $$invalidate(1, caption = $$props.caption);
    		if ('captionPosition' in $$props) $$invalidate(12, captionPosition = $$props.captionPosition);
    		if ('tableSize' in $$props) $$invalidate(13, tableSize = $$props.tableSize);
    		if ('responsiveSize' in $$props) $$invalidate(14, responsiveSize = $$props.responsiveSize);
    		if ('isUppercasedHeaders' in $$props) $$invalidate(15, isUppercasedHeaders = $$props.isUppercasedHeaders);
    		if ('isBordered' in $$props) $$invalidate(16, isBordered = $$props.isBordered);
    		if ('isBorderless' in $$props) $$invalidate(17, isBorderless = $$props.isBorderless);
    		if ('isStriped' in $$props) $$invalidate(18, isStriped = $$props.isStriped);
    		if ('isHoverable' in $$props) $$invalidate(19, isHoverable = $$props.isHoverable);
    		if ('isStacked' in $$props) $$invalidate(20, isStacked = $$props.isStacked);
    		if ('offset' in $$props) $$invalidate(21, offset = $$props.offset);
    		if ('limit' in $$props) $$invalidate(22, limit = $$props.limit);
    		if ('direction' in $$props) $$invalidate(2, direction = $$props.direction);
    		if ('sortingKey' in $$props) $$invalidate(3, sortingKey = $$props.sortingKey);
    		if ('sortableItems' in $$props) $$invalidate(23, sortableItems = $$props.sortableItems);
    		if ('visibleItems' in $$props) $$invalidate(4, visibleItems = $$props.visibleItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*direction, sortingKey*/ 12) {
    			dispatch('sort', { direction, sortingKey });
    		}

    		if ($$self.$$.dirty[0] & /*direction, rows*/ 2052) {
    			// Reactive declaration: ...state needs to be computed from other parts; so
    			// direction is a dependency and when it changes, sortableItems gets recomputed
    			$$invalidate(23, sortableItems = direction === "ascending"
    			? rows.sort(internalSort)
    			: direction === "descending"
    				? rows.sort(descendingSort)
    				: $$invalidate(23, sortableItems = [...rows]));
    		}

    		if ($$self.$$.dirty[0] & /*sortableItems, offset, limit*/ 14680064) {
    			$$invalidate(4, visibleItems = sortableItems.slice(offset ? offset : 0, limit ? offset + limit : undefined));
    		}
    	};

    	return [
    		headers,
    		caption,
    		direction,
    		sortingKey,
    		visibleItems,
    		handleSortClicked,
    		getSortingClassesFor,
    		getSortDirectionFor,
    		tableResponsiveClasses,
    		tableClasses,
    		captionClasses,
    		rows,
    		captionPosition,
    		tableSize,
    		responsiveSize,
    		isUppercasedHeaders,
    		isBordered,
    		isBorderless,
    		isStriped,
    		isHoverable,
    		isStacked,
    		offset,
    		limit,
    		sortableItems
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$m,
    			create_fragment$m,
    			safe_not_equal,
    			{
    				headers: 0,
    				rows: 11,
    				caption: 1,
    				captionPosition: 12,
    				tableSize: 13,
    				responsiveSize: 14,
    				isUppercasedHeaders: 15,
    				isBordered: 16,
    				isBorderless: 17,
    				isStriped: 18,
    				isHoverable: 19,
    				isStacked: 20,
    				offset: 21,
    				limit: 22
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get headers() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get captionPosition() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set captionPosition(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableSize() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableSize(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsiveSize() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsiveSize(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isUppercasedHeaders() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isUppercasedHeaders(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStriped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStriped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHoverable() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHoverable(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStacked() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStacked(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Tabs/Tabs.svelte generated by Svelte v3.47.0 */

    const file$i = "node_modules/agnostic-svelte/components/Tabs/Tabs.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[26] = list;
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (371:6) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let t0_value = /*tab*/ ctx[25].title + "";
    	let t0;
    	let t1;
    	let button_disabled_value;
    	let button_class_value;
    	let button_aria_controls_value;
    	let button_tabindex_value;
    	let button_aria_selected_value;
    	let i = /*i*/ ctx[27];
    	let mounted;
    	let dispose;
    	const assign_button = () => /*button_binding*/ ctx[17](button, i);
    	const unassign_button = () => /*button_binding*/ ctx[17](null, i);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[18](/*i*/ ctx[27]);
    	}

    	function keydown_handler_1(...args) {
    		return /*keydown_handler_1*/ ctx[19](/*i*/ ctx[27], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			button.disabled = button_disabled_value = /*isDisabled*/ ctx[2] || /*disabledOptions*/ ctx[3].includes(/*tab*/ ctx[25].title) || undefined;
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*tabButtonClasses*/ ctx[6](/*tab*/ ctx[25])) + " svelte-k5ognh"));
    			attr_dev(button, "role", "tab");
    			attr_dev(button, "aria-controls", button_aria_controls_value = /*tab*/ ctx[25].ariaControls);
    			attr_dev(button, "tabindex", button_tabindex_value = /*tab*/ ctx[25].isActive ? '0' : '-1');
    			attr_dev(button, "aria-selected", button_aria_selected_value = /*tab*/ ctx[25].isActive);
    			add_location(button, file$i, 371, 8, 11055);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			assign_button();

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_1, false, false, false),
    					listen_dev(button, "keydown", keydown_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*tabs*/ 1 && t0_value !== (t0_value = /*tab*/ ctx[25].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*isDisabled, disabledOptions, tabs*/ 13 && button_disabled_value !== (button_disabled_value = /*isDisabled*/ ctx[2] || /*disabledOptions*/ ctx[3].includes(/*tab*/ ctx[25].title) || undefined)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*tabButtonClasses, tabs*/ 65 && button_class_value !== (button_class_value = "" + (null_to_empty(/*tabButtonClasses*/ ctx[6](/*tab*/ ctx[25])) + " svelte-k5ognh"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*tabs*/ 1 && button_aria_controls_value !== (button_aria_controls_value = /*tab*/ ctx[25].ariaControls)) {
    				attr_dev(button, "aria-controls", button_aria_controls_value);
    			}

    			if (dirty & /*tabs*/ 1 && button_tabindex_value !== (button_tabindex_value = /*tab*/ ctx[25].isActive ? '0' : '-1')) {
    				attr_dev(button, "tabindex", button_tabindex_value);
    			}

    			if (dirty & /*tabs*/ 1 && button_aria_selected_value !== (button_aria_selected_value = /*tab*/ ctx[25].isActive)) {
    				attr_dev(button, "aria-selected", button_aria_selected_value);
    			}

    			if (i !== /*i*/ ctx[27]) {
    				unassign_button();
    				i = /*i*/ ctx[27];
    				assign_button();
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			unassign_button();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(371:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (355:6) {#if tab.tabButtonComponent}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let i = /*i*/ ctx[27];
    	let switch_instance_anchor;
    	let current;
    	const assign_switch_instance = () => /*switch_instance_binding*/ ctx[14](switch_instance, i);
    	const unassign_switch_instance = () => /*switch_instance_binding*/ ctx[14](null, i);

    	function click_handler() {
    		return /*click_handler*/ ctx[15](/*i*/ ctx[27]);
    	}

    	function keydown_handler(...args) {
    		return /*keydown_handler*/ ctx[16](/*i*/ ctx[27], ...args);
    	}

    	var switch_value = /*tab*/ ctx[25].tabButtonComponent;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			disabled: /*isDisabled*/ ctx[2] || /*disabledOptions*/ ctx[3].includes(/*tab*/ ctx[25].title) || undefined,
    			classes: /*tabButtonClasses*/ ctx[6](/*tab*/ ctx[25]),
    			role: "tab",
    			ariaControls: /*tab*/ ctx[25].ariaControls,
    			isActive: /*tab*/ ctx[25].isActive,
    			$$slots: { default: [create_default_slot$a] },
    			$$scope: { ctx }
    		};

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		assign_switch_instance();
    		switch_instance.$on("click", click_handler);
    		switch_instance.$on("keydown", keydown_handler);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (i !== /*i*/ ctx[27]) {
    				unassign_switch_instance();
    				i = /*i*/ ctx[27];
    				assign_switch_instance();
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*isDisabled, disabledOptions, tabs*/ 13) switch_instance_changes.disabled = /*isDisabled*/ ctx[2] || /*disabledOptions*/ ctx[3].includes(/*tab*/ ctx[25].title) || undefined;
    			if (dirty & /*tabButtonClasses, tabs*/ 65) switch_instance_changes.classes = /*tabButtonClasses*/ ctx[6](/*tab*/ ctx[25]);
    			if (dirty & /*tabs*/ 1) switch_instance_changes.ariaControls = /*tab*/ ctx[25].ariaControls;
    			if (dirty & /*tabs*/ 1) switch_instance_changes.isActive = /*tab*/ ctx[25].isActive;

    			if (dirty & /*$$scope, tabs*/ 268435457) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*tab*/ ctx[25].tabButtonComponent)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					assign_switch_instance();
    					switch_instance.$on("click", click_handler);
    					switch_instance.$on("keydown", keydown_handler);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			unassign_switch_instance();
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(355:6) {#if tab.tabButtonComponent}",
    		ctx
    	});

    	return block;
    }

    // (356:8) <svelte:component           this={tab.tabButtonComponent}           bind:this={dynamicComponentRefs[i]}           on:click={() => selectTab(i)}           on:keydown={(e) => handleKeyDown(e, i)}           disabled={isDisabled ||             disabledOptions.includes(tab.title) ||             undefined}           classes={tabButtonClasses(tab)}           role="tab"           ariaControls={tab.ariaControls}           isActive={tab.isActive}         >
    function create_default_slot$a(ctx) {
    	let t0_value = /*tab*/ ctx[25].title + "";
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
    			if (dirty & /*tabs*/ 1 && t0_value !== (t0_value = /*tab*/ ctx[25].title + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(356:8) <svelte:component           this={tab.tabButtonComponent}           bind:this={dynamicComponentRefs[i]}           on:click={() => selectTab(i)}           on:keydown={(e) => handleKeyDown(e, i)}           disabled={isDisabled ||             disabledOptions.includes(tab.title) ||             undefined}           classes={tabButtonClasses(tab)}           role=\\\"tab\\\"           ariaControls={tab.ariaControls}           isActive={tab.isActive}         >",
    		ctx
    	});

    	return block;
    }

    // (354:4) {#each tabs as tab, i}
    function create_each_block_1$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tab*/ ctx[25].tabButtonComponent) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(354:4) {#each tabs as tab, i}",
    		ctx
    	});

    	return block;
    }

    // (391:4) {#if panel.isActive}
    function create_if_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*panel*/ ctx[22].tabPanelComponent;

    	function switch_props(ctx) {
    		return { props: { tabindex: "0" }, $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*panel*/ ctx[22].tabPanelComponent)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(391:4) {#if panel.isActive}",
    		ctx
    	});

    	return block;
    }

    // (390:2) {#each tabs as panel}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*panel*/ ctx[22].isActive && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*panel*/ ctx[22].isActive) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tabs*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(390:2) {#each tabs as panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_aria_orientation_value;
    	let t;
    	let current;
    	let each_value_1 = /*tabs*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*tabs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*tablistClasses*/ ctx[7]()) + " svelte-k5ognh"));
    			attr_dev(div0, "role", "tablist");

    			attr_dev(div0, "aria-orientation", div0_aria_orientation_value = /*isVerticalOrientation*/ ctx[1]
    			? 'vertical'
    			: 'horizontal');

    			add_location(div0, file$i, 348, 2, 10332);
    			attr_dev(div1, "class", "" + (null_to_empty(/*baseStyles*/ ctx[8]()) + " svelte-k5ognh"));
    			add_location(div1, file$i, 347, 0, 10303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tabs, isDisabled, disabledOptions, undefined, tabButtonClasses, dynamicComponentRefs, selectTab, handleKeyDown, tabButtonRefs*/ 1661) {
    				each_value_1 = /*tabs*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*tablistClasses*/ 128 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*tablistClasses*/ ctx[7]()) + " svelte-k5ognh"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*isVerticalOrientation*/ 2 && div0_aria_orientation_value !== (div0_aria_orientation_value = /*isVerticalOrientation*/ ctx[1]
    			? 'vertical'
    			: 'horizontal')) {
    				attr_dev(div0, "aria-orientation", div0_aria_orientation_value);
    			}

    			if (dirty & /*tabs*/ 1) {
    				each_value = /*tabs*/ ctx[0];
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
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let tablistClasses;
    	let tabButtonClasses;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	let { size = "" } = $$props;
    	let { tabs = [] } = $$props;
    	let { isBorderless = false } = $$props;
    	let { isVerticalOrientation = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { disabledOptions = [] } = $$props;
    	let { isSkinned = true } = $$props;

    	/**
     * Explanation: we have two ways that the tab buttons get created:
     * 1. The `tabs` input array has dynamic `tabButtonComponent` components.
     * 2. The `tabs` has no `tabButtonComponent` and so we generate the tab
     * button internally.
     *
     * As such, the `dynamicComponentRefs` below are refs for case 1. and
     * `tabButtonRefs` are refs for case 2.
     */
    	let dynamicComponentRefs = []; //https://svelte.dev/tutorial/component-this

    	let tabButtonRefs = [];

    	// tabButtonRefs.filter(el => el);
    	// $: console.log(tabButtonRefs);
    	// onMount(() => {
    	//   console.log(tabButtonRefs);
    	// });
    	const baseStyles = () => `tabs ${isVerticalOrientation ? "tabs-vertical" : ""}`;

    	const selectTab = index => {
    		$$invalidate(0, tabs = tabs.map((tab, i) => {
    			tab.isActive = index === i ? true : false;
    			return tab;
    		}));
    	};

    	let activeTabs = tabs.filter(tab => tab.isActive);

    	if (activeTabs.length === 0) {
    		selectTab(0);
    	}

    	const focusTab = (index, direction) => {
    		// console.log("tabButtonRefs: ", tabButtonRefs);
    		// console.log("dynamicComponentRefs: ", dynamicComponentRefs);
    		/**
     * direction is optional because we only need that when we're arrow navigating.
     * If they've hit ENTER|SPACE we're focusing the current item. If HOME focus(0).
     * If END focus(tabButtons.length - 1)...and so on.
     */
    		let i = index;

    		if (direction === "asc") {
    			i += 1;
    		} else if (direction === "desc") {
    			i -= 1;
    		}

    		// Circular navigation
    		//
    		// If we've went beyond "start" circle around to last
    		if (i < 0) {
    			i = tabs.length - 1;
    		} else if (i >= tabs.length) {
    			// We've went beyond "last" so circle around to first
    			i = 0;
    		}

    		/**
     * Figure out at run-time whether this was build with dynamicComponentRefs (consumer
     * used their own tabButtonComponent), or tabButtonRefs (we generated the buttons here)
     */
    		let nextTab;

    		if (tabButtonRefs.length) {
    			nextTab = tabButtonRefs[i];
    		} else if (dynamicComponentRefs.length) {
    			// Same logic as above, but we're using the binding to component instance
    			nextTab = dynamicComponentRefs[i];
    		}

    		// Edge case: We hit a tab button that's been disabled. If so, we recurse, but
    		// only if we've been supplied a `direction`. Otherwise, nothing left to do.
    		if (nextTab.isDisabled && nextTab.isDisabled() || nextTab.disabled && direction) {
    			// Retry with new `i` index going in same direction
    			focusTab(i, direction);
    		} else {
    			// Nominal case is to just focs next tab :)
    			nextTab.focus();
    		}
    	};

    	const handleKeyDown = (ev, index) => {
    		switch (ev.key) {
    			case "Up":
    			case "ArrowUp":
    				if (isVerticalOrientation) {
    					focusTab(index, "desc");
    				}
    				break;
    			case "Down":
    			case "ArrowDown":
    				if (isVerticalOrientation) {
    					focusTab(index, "asc");
    				}
    				break;
    			case "Left":
    			case "ArrowLeft":
    				if (!isVerticalOrientation) {
    					focusTab(index, "desc");
    				}
    				break;
    			case "Right":
    			case "ArrowRight":
    				if (!isVerticalOrientation) {
    					focusTab(index, "asc");
    				}
    				break;
    			case "Home":
    			case "ArrowHome":
    				focusTab(0);
    				break;
    			case "End":
    			case "ArrowEnd":
    				focusTab(tabs.length - 1);
    				break;
    			case "Enter":
    			case "Space":
    				focusTab(index);
    				selectTab(index);
    				break;
    			default:
    				return;
    		}

    		ev.preventDefault();
    	};

    	const writable_props = [
    		'size',
    		'tabs',
    		'isBorderless',
    		'isVerticalOrientation',
    		'isDisabled',
    		'disabledOptions',
    		'isSkinned'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	function switch_instance_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dynamicComponentRefs[i] = $$value;
    			$$invalidate(4, dynamicComponentRefs);
    		});
    	}

    	const click_handler = i => selectTab(i);
    	const keydown_handler = (i, e) => handleKeyDown(e, i);

    	function button_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabButtonRefs[i] = $$value;
    			$$invalidate(5, tabButtonRefs);
    		});
    	}

    	const click_handler_1 = i => selectTab(i);
    	const keydown_handler_1 = (i, e) => handleKeyDown(e, i);

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(11, size = $$props.size);
    		if ('tabs' in $$props) $$invalidate(0, tabs = $$props.tabs);
    		if ('isBorderless' in $$props) $$invalidate(12, isBorderless = $$props.isBorderless);
    		if ('isVerticalOrientation' in $$props) $$invalidate(1, isVerticalOrientation = $$props.isVerticalOrientation);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('disabledOptions' in $$props) $$invalidate(3, disabledOptions = $$props.disabledOptions);
    		if ('isSkinned' in $$props) $$invalidate(13, isSkinned = $$props.isSkinned);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		tabs,
    		isBorderless,
    		isVerticalOrientation,
    		isDisabled,
    		disabledOptions,
    		isSkinned,
    		dynamicComponentRefs,
    		tabButtonRefs,
    		baseStyles,
    		selectTab,
    		activeTabs,
    		focusTab,
    		handleKeyDown,
    		tabButtonClasses,
    		tablistClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(11, size = $$props.size);
    		if ('tabs' in $$props) $$invalidate(0, tabs = $$props.tabs);
    		if ('isBorderless' in $$props) $$invalidate(12, isBorderless = $$props.isBorderless);
    		if ('isVerticalOrientation' in $$props) $$invalidate(1, isVerticalOrientation = $$props.isVerticalOrientation);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('disabledOptions' in $$props) $$invalidate(3, disabledOptions = $$props.disabledOptions);
    		if ('isSkinned' in $$props) $$invalidate(13, isSkinned = $$props.isSkinned);
    		if ('dynamicComponentRefs' in $$props) $$invalidate(4, dynamicComponentRefs = $$props.dynamicComponentRefs);
    		if ('tabButtonRefs' in $$props) $$invalidate(5, tabButtonRefs = $$props.tabButtonRefs);
    		if ('activeTabs' in $$props) activeTabs = $$props.activeTabs;
    		if ('tabButtonClasses' in $$props) $$invalidate(6, tabButtonClasses = $$props.tabButtonClasses);
    		if ('tablistClasses' in $$props) $$invalidate(7, tablistClasses = $$props.tablistClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isSkinned, isBorderless*/ 12288) {
    			$$invalidate(7, tablistClasses = () => {
    				const tabListClass = isSkinned ? "tab-list" : "tab-list-base";
    				return [tabListClass, isBorderless ? `tab-borderless` : ""].filter(klass => klass.length).join(" ");
    			});
    		}

    		if ($$self.$$.dirty & /*size*/ 2048) {
    			$$invalidate(6, tabButtonClasses = tab => {
    				const klasses = [
    					`tab-item`,
    					`tab-button`,
    					tab.isActive ? "active" : "",
    					size === "large" ? "tab-button-large" : "",
    					size === "xlarge" ? "tab-button-xlarge" : ""
    				];

    				return klasses.filter(klass => klass.length).join(" ");
    			});
    		}
    	};

    	$$invalidate(4, dynamicComponentRefs = []);

    	// dynamicComponentRefs.filter(el => el);
    	// $: console.log(dynamicComponentRefs);
    	$$invalidate(5, tabButtonRefs = []);

    	return [
    		tabs,
    		isVerticalOrientation,
    		isDisabled,
    		disabledOptions,
    		dynamicComponentRefs,
    		tabButtonRefs,
    		tabButtonClasses,
    		tablistClasses,
    		baseStyles,
    		selectTab,
    		handleKeyDown,
    		size,
    		isBorderless,
    		isSkinned,
    		switch_instance_binding,
    		click_handler,
    		keydown_handler,
    		button_binding,
    		click_handler_1,
    		keydown_handler_1
    	];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			size: 11,
    			tabs: 0,
    			isBorderless: 12,
    			isVerticalOrientation: 1,
    			isDisabled: 2,
    			disabledOptions: 3,
    			isSkinned: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get size() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBorderless() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBorderless(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVerticalOrientation() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVerticalOrientation(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabledOptions() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabledOptions(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSkinned() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSkinned(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Toasts/Toast.svelte generated by Svelte v3.47.0 */

    // (6:0) {#if isOpen}
    function create_if_block$8(ctx) {
    	let alert;
    	let current;
    	const alert_spread_levels = [{ isToast: true }, /*$$restProps*/ ctx[1]];

    	let alert_props = {
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < alert_spread_levels.length; i += 1) {
    		alert_props = assign(alert_props, alert_spread_levels[i]);
    	}

    	alert = new Alert({ props: alert_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(alert.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = (dirty & /*$$restProps*/ 2)
    			? get_spread_update(alert_spread_levels, [alert_spread_levels[0], get_spread_object(/*$$restProps*/ ctx[1])])
    			: {};

    			if (dirty & /*$$scope*/ 8) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(6:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (7:2) <Alert isToast={true} {...$$restProps}>
    function create_default_slot$9(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(7:2) <Alert isToast={true} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["isOpen"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toast', slots, ['default']);
    	let { isOpen = true } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Alert, isOpen });

    	$$self.$inject_state = $$new_props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, $$restProps, slots, $$scope];
    }

    class Toast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { isOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toast",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/agnostic-svelte/components/Toasts/Toasts.svelte generated by Svelte v3.47.0 */
    const file$h = "node_modules/agnostic-svelte/components/Toasts/Toasts.svelte";

    // (53:0) {#if mounted}
    function create_if_block$7(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*toastClasses*/ ctx[1]) + " svelte-1q7ky45"));
    			add_location(div, file$h, 53, 2, 1256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*teleport*/ ctx[2].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*toastClasses*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*toastClasses*/ ctx[1]) + " svelte-1q7ky45"))) {
    				attr_dev(div, "class", div_class_value);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(53:0) {#if mounted}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*mounted*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*mounted*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mounted*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let toastClasses;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toasts', slots, ['default']);
    	let { portalRootSelector = "body" } = $$props;
    	let { horizontalPosition } = $$props;
    	let { verticalPosition } = $$props;
    	const portalTarget = portalRootSelector || "body";

    	// In case of SSR we don't render element until hydration is complete
    	let mounted = false;

    	onMount(() => $$invalidate(0, mounted = true));

    	const teleportNode = async node => {
    		const destination = document.querySelector(portalTarget);
    		destination.appendChild(node);
    	};

    	/**
     * Svelte actions don't want to be async so this is a hack
     * to get around that by delegating to teleportNode
     */
    	const teleport = node => {
    		teleportNode(node);
    	};

    	const writable_props = ['portalRootSelector', 'horizontalPosition', 'verticalPosition'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toasts> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('portalRootSelector' in $$props) $$invalidate(3, portalRootSelector = $$props.portalRootSelector);
    		if ('horizontalPosition' in $$props) $$invalidate(4, horizontalPosition = $$props.horizontalPosition);
    		if ('verticalPosition' in $$props) $$invalidate(5, verticalPosition = $$props.verticalPosition);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		portalRootSelector,
    		horizontalPosition,
    		verticalPosition,
    		portalTarget,
    		mounted,
    		teleportNode,
    		teleport,
    		toastClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('portalRootSelector' in $$props) $$invalidate(3, portalRootSelector = $$props.portalRootSelector);
    		if ('horizontalPosition' in $$props) $$invalidate(4, horizontalPosition = $$props.horizontalPosition);
    		if ('verticalPosition' in $$props) $$invalidate(5, verticalPosition = $$props.verticalPosition);
    		if ('mounted' in $$props) $$invalidate(0, mounted = $$props.mounted);
    		if ('toastClasses' in $$props) $$invalidate(1, toastClasses = $$props.toastClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*horizontalPosition, verticalPosition*/ 48) {
    			$$invalidate(1, toastClasses = ["alert-toast", horizontalPosition, verticalPosition].filter(c => c.length).join(" "));
    		}
    	};

    	return [
    		mounted,
    		toastClasses,
    		teleport,
    		portalRootSelector,
    		horizontalPosition,
    		verticalPosition,
    		$$scope,
    		slots
    	];
    }

    class Toasts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			portalRootSelector: 3,
    			horizontalPosition: 4,
    			verticalPosition: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toasts",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*horizontalPosition*/ ctx[4] === undefined && !('horizontalPosition' in props)) {
    			console.warn("<Toasts> was created without expected prop 'horizontalPosition'");
    		}

    		if (/*verticalPosition*/ ctx[5] === undefined && !('verticalPosition' in props)) {
    			console.warn("<Toasts> was created without expected prop 'verticalPosition'");
    		}
    	}

    	get portalRootSelector() {
    		throw new Error("<Toasts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set portalRootSelector(value) {
    		throw new Error("<Toasts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontalPosition() {
    		throw new Error("<Toasts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontalPosition(value) {
    		throw new Error("<Toasts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get verticalPosition() {
    		throw new Error("<Toasts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set verticalPosition(value) {
    		throw new Error("<Toasts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/LoaderFull.svelte generated by Svelte v3.47.0 */
    const file$g = "src/lib/componentes/LoaderFull.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loader.$$.fragment);
    			attr_dev(div, "class", "loader-full wrapper svelte-1fx16ks");
    			add_location(div, file$g, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loader, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoaderFull', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoaderFull> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Loader });
    	return [];
    }

    class LoaderFull extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoaderFull",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/lib/componentes/Aside.svelte generated by Svelte v3.47.0 */
    const file$f = "src/lib/componentes/Aside.svelte";

    // (7:4) <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
    function create_default_slot_2$6(ctx) {
    	let figure;
    	let a0;
    	let t1;
    	let h4;
    	let a1;
    	let t3;
    	let div;
    	let a2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			a0 = element("a");
    			a0.textContent = "🏥";
    			t1 = space();
    			h4 = element("h4");
    			a1 = element("a");
    			a1.textContent = "Find a Veterinary";
    			t3 = space();
    			div = element("div");
    			a2 = element("a");
    			a2.textContent = "We have a directory of veterinarians with whom you can contact by specialties";
    			attr_dev(a0, "class", "link-black main-icon");
    			attr_dev(a0, "href", "/veterianries");
    			add_location(a0, file$f, 8, 12, 234);
    			attr_dev(figure, "class", "m16");
    			add_location(figure, file$f, 7, 8, 201);
    			attr_dev(a1, "href", "/veterianries");
    			add_location(a1, file$f, 14, 12, 385);
    			add_location(h4, file$f, 13, 8, 368);
    			attr_dev(a2, "class", "link-black");
    			attr_dev(a2, "href", "/veterianries");
    			add_location(a2, file$f, 18, 12, 501);
    			attr_dev(div, "class", "m16");
    			add_location(div, file$f, 17, 8, 471);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, a2);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(7:4) <Card isBorder=\\\"{true}\\\" isStacked=\\\"{true}\\\" isRounded=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:8) <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
    function create_default_slot_1$7(ctx) {
    	let figure;
    	let a0;
    	let t1;
    	let h4;
    	let a1;
    	let t3;
    	let div;
    	let a2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			a0 = element("a");
    			a0.textContent = "📅";
    			t1 = space();
    			h4 = element("h4");
    			a1 = element("a");
    			a1.textContent = "Events";
    			t3 = space();
    			div = element("div");
    			a2 = element("a");
    			a2.textContent = "We have a directory of veterinarians with whom you can contact by specialties";
    			attr_dev(a0, "class", "link-black main-icon");
    			attr_dev(a0, "href", "/events");
    			add_location(a0, file$f, 27, 16, 844);
    			attr_dev(figure, "class", "m16");
    			add_location(figure, file$f, 26, 12, 807);
    			attr_dev(a1, "href", "/events");
    			add_location(a1, file$f, 33, 16, 1014);
    			add_location(h4, file$f, 32, 12, 993);
    			attr_dev(a2, "class", "link-black");
    			attr_dev(a2, "href", "/events");
    			add_location(a2, file$f, 37, 16, 1129);
    			attr_dev(div, "class", "m16");
    			add_location(div, file$f, 36, 12, 1095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, a2);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(26:8) <Card isBorder=\\\"{true}\\\" isStacked=\\\"{true}\\\" isRounded=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Card isBorder="{true}" isStacked="{true}" isRounded="{true}">
    function create_default_slot$8(ctx) {
    	let figure;
    	let a0;
    	let t1;
    	let h4;
    	let a1;
    	let t3;
    	let div;
    	let a2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			a0 = element("a");
    			a0.textContent = "💡";
    			t1 = space();
    			h4 = element("h4");
    			a1 = element("a");
    			a1.textContent = "Tips";
    			t3 = space();
    			div = element("div");
    			a2 = element("a");
    			a2.textContent = "Get to know the different tips and experiences of other people";
    			attr_dev(a0, "class", "link-black main-icon");
    			attr_dev(a0, "href", "/tips");
    			add_location(a0, file$f, 47, 16, 1497);
    			attr_dev(figure, "class", "m16");
    			add_location(figure, file$f, 46, 12, 1460);
    			attr_dev(a1, "href", "/tips");
    			add_location(a1, file$f, 53, 16, 1664);
    			add_location(h4, file$f, 52, 12, 1643);
    			attr_dev(a2, "class", "link-black");
    			attr_dev(a2, "href", "/tips");
    			add_location(a2, file$f, 57, 16, 1775);
    			attr_dev(div, "class", "m16");
    			add_location(div, file$f, 56, 12, 1741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, a2);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(46:8) <Card isBorder=\\\"{true}\\\" isStacked=\\\"{true}\\\" isRounded=\\\"{true}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let aside;
    	let card0;
    	let t0;
    	let div0;
    	let card1;
    	let t1;
    	let div1;
    	let card2;
    	let current;

    	card0 = new Card({
    			props: {
    				isBorder: true,
    				isStacked: true,
    				isRounded: true,
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				isBorder: true,
    				isStacked: true,
    				isRounded: true,
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				isBorder: true,
    				isStacked: true,
    				isRounded: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			create_component(card0.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(card1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(card2.$$.fragment);
    			attr_dev(div0, "class", "mt-1");
    			add_location(div0, file$f, 24, 8, 705);
    			attr_dev(div1, "class", "mt-1");
    			add_location(div1, file$f, 44, 8, 1358);
    			add_location(aside, file$f, 5, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			mount_component(card0, aside, null);
    			append_dev(aside, t0);
    			append_dev(aside, div0);
    			mount_component(card1, div0, null);
    			append_dev(aside, t1);
    			append_dev(aside, div1);
    			mount_component(card2, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Aside', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Aside> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card, Icon, link });
    	return [];
    }

    class Aside extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Aside",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/lib/pages/Home.svelte generated by Svelte v3.47.0 */
    const file$e = "src/lib/pages/Home.svelte";

    function create_fragment$g(ctx) {
    	let main;
    	let section;
    	let h2;
    	let t1;
    	let aside;
    	let current;
    	aside = new Aside({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Last photo pets";
    			t1 = space();
    			create_component(aside.$$.fragment);
    			attr_dev(h2, "class", "big-title");
    			add_location(h2, file$e, 6, 8, 121);
    			add_location(section, file$e, 5, 4, 103);
    			attr_dev(main, "class", "container mt-1");
    			add_location(main, file$e, 4, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, h2);
    			append_dev(main, t1);
    			mount_component(aside, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aside.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aside.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(aside);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Aside });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/lib/pages/Events.svelte generated by Svelte v3.47.0 */

    const file$d = "src/lib/pages/Events.svelte";

    function create_fragment$f(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Eventos";
    			add_location(h1, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Events', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var browserPonyfill = createCommonjsModule(function (module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = (function () {
    function F() {
    this.fetch = false;
    this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F();
    })();
    (function(self) {

    ((function (exports) {

      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

      return exports;

    }))({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class AppwriteException extends Error {
        constructor(message, code = 0, type = '', response = '') {
            super(message);
            this.name = 'AppwriteException';
            this.message = message;
            this.code = code;
            this.type = type;
            this.response = response;
        }
    }
    class Appwrite {
        constructor() {
            this.config = {
                endpoint: 'https://HOSTNAME/v1',
                endpointRealtime: '',
                project: '',
                jwt: '',
                locale: '',
            };
            this.headers = {
                'x-sdk-version': 'appwrite:web:7.0.0',
                'X-Appwrite-Response-Format': '0.13.0',
            };
            this.realtime = {
                socket: undefined,
                timeout: undefined,
                url: '',
                channels: new Set(),
                subscriptions: new Map(),
                subscriptionsCounter: 0,
                reconnect: true,
                reconnectAttempts: 0,
                lastMessage: undefined,
                connect: () => {
                    clearTimeout(this.realtime.timeout);
                    this.realtime.timeout = window === null || window === void 0 ? void 0 : window.setTimeout(() => {
                        this.realtime.createSocket();
                    }, 50);
                },
                getTimeout: () => {
                    switch (true) {
                        case this.realtime.reconnectAttempts < 5:
                            return 1000;
                        case this.realtime.reconnectAttempts < 15:
                            return 5000;
                        case this.realtime.reconnectAttempts < 100:
                            return 10000;
                        default:
                            return 60000;
                    }
                },
                createSocket: () => {
                    var _a, _b;
                    if (this.realtime.channels.size < 1)
                        return;
                    const channels = new URLSearchParams();
                    channels.set('project', this.config.project);
                    this.realtime.channels.forEach(channel => {
                        channels.append('channels[]', channel);
                    });
                    const url = this.config.endpointRealtime + '/realtime?' + channels.toString();
                    if (url !== this.realtime.url || // Check if URL is present
                        !this.realtime.socket || // Check if WebSocket has not been created
                        ((_a = this.realtime.socket) === null || _a === void 0 ? void 0 : _a.readyState) > WebSocket.OPEN // Check if WebSocket is CLOSING (3) or CLOSED (4)
                    ) {
                        if (this.realtime.socket &&
                            ((_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.readyState) < WebSocket.CLOSING // Close WebSocket if it is CONNECTING (0) or OPEN (1)
                        ) {
                            this.realtime.reconnect = false;
                            this.realtime.socket.close();
                        }
                        this.realtime.url = url;
                        this.realtime.socket = new WebSocket(url);
                        this.realtime.socket.addEventListener('message', this.realtime.onMessage);
                        this.realtime.socket.addEventListener('open', _event => {
                            this.realtime.reconnectAttempts = 0;
                        });
                        this.realtime.socket.addEventListener('close', event => {
                            var _a, _b, _c;
                            if (!this.realtime.reconnect ||
                                (((_b = (_a = this.realtime) === null || _a === void 0 ? void 0 : _a.lastMessage) === null || _b === void 0 ? void 0 : _b.type) === 'error' && // Check if last message was of type error
                                    ((_c = this.realtime) === null || _c === void 0 ? void 0 : _c.lastMessage.data).code === 1008 // Check for policy violation 1008
                                )) {
                                this.realtime.reconnect = true;
                                return;
                            }
                            const timeout = this.realtime.getTimeout();
                            console.error(`Realtime got disconnected. Reconnect will be attempted in ${timeout / 1000} seconds.`, event.reason);
                            setTimeout(() => {
                                this.realtime.reconnectAttempts++;
                                this.realtime.createSocket();
                            }, timeout);
                        });
                    }
                },
                onMessage: (event) => {
                    var _a, _b;
                    try {
                        const message = JSON.parse(event.data);
                        this.realtime.lastMessage = message;
                        switch (message.type) {
                            case 'connected':
                                const cookie = JSON.parse((_a = window.localStorage.getItem('cookieFallback')) !== null && _a !== void 0 ? _a : '{}');
                                const session = cookie === null || cookie === void 0 ? void 0 : cookie[`a_session_${this.config.project}`];
                                const messageData = message.data;
                                if (session && !messageData.user) {
                                    (_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                                        type: 'authentication',
                                        data: {
                                            session
                                        }
                                    }));
                                }
                                break;
                            case 'event':
                                let data = message.data;
                                if (data === null || data === void 0 ? void 0 : data.channels) {
                                    const isSubscribed = data.channels.some(channel => this.realtime.channels.has(channel));
                                    if (!isSubscribed)
                                        return;
                                    this.realtime.subscriptions.forEach(subscription => {
                                        if (data.channels.some(channel => subscription.channels.includes(channel))) {
                                            setTimeout(() => subscription.callback(data));
                                        }
                                    });
                                }
                                break;
                            case 'error':
                                throw message.data;
                            default:
                                break;
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                },
                cleanUp: channels => {
                    this.realtime.channels.forEach(channel => {
                        if (channels.includes(channel)) {
                            let found = Array.from(this.realtime.subscriptions).some(([_key, subscription]) => {
                                return subscription.channels.includes(channel);
                            });
                            if (!found) {
                                this.realtime.channels.delete(channel);
                            }
                        }
                    });
                }
            };
            this.account = {
                /**
                 * Get Account
                 *
                 * Get currently logged in user data as JSON object.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                get: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Account
                 *
                 * Use this endpoint to allow a new user to register a new account in your
                 * project. After the user registration completes successfully, you can use
                 * the [/account/verfication](/docs/client/account#accountCreateVerification)
                 * route to start verifying the user email address. To allow the new user to
                 * login to their new account, you need to create a new [account
                 * session](/docs/client/account#accountCreateSession).
                 *
                 * @param {string} userId
                 * @param {string} email
                 * @param {string} password
                 * @param {string} name
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                create: (userId, email, password, name) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    if (typeof password === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "password"');
                    }
                    let path = '/account';
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof password !== 'undefined') {
                        payload['password'] = password;
                    }
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete Account
                 *
                 * Delete a currently logged in user account. Behind the scene, the user
                 * record is not deleted but permanently blocked from any access. This is done
                 * to avoid deleted accounts being overtaken by new users with the same email
                 * address. Any user-related resources like documents or storage files should
                 * be deleted separately.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                delete: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Account Email
                 *
                 * Update currently logged in user account email address. After changing user
                 * address, the user confirmation status will get reset. A new confirmation
                 * email is not sent automatically however you can use the send confirmation
                 * email endpoint again to send the confirmation email. For security measures,
                 * user password is required to complete this request.
                 * This endpoint can also be used to convert an anonymous account to a normal
                 * one, by passing an email address and a new password.
                 *
                 *
                 * @param {string} email
                 * @param {string} password
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateEmail: (email, password) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    if (typeof password === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "password"');
                    }
                    let path = '/account/email';
                    let payload = {};
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof password !== 'undefined') {
                        payload['password'] = password;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Account JWT
                 *
                 * Use this endpoint to create a JSON Web Token. You can use the resulting JWT
                 * to authenticate on behalf of the current user when working with the
                 * Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes
                 * from its creation and will be invalid if the user will logout in that time
                 * frame.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createJWT: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/jwt';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Account Logs
                 *
                 * Get currently logged in user list of latest security activity logs. Each
                 * log returns user IP address, location and date and time of log.
                 *
                 * @param {number} limit
                 * @param {number} offset
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getLogs: (limit, offset) => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/logs';
                    let payload = {};
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Account Name
                 *
                 * Update currently logged in user account name.
                 *
                 * @param {string} name
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateName: (name) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof name === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "name"');
                    }
                    let path = '/account/name';
                    let payload = {};
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Account Password
                 *
                 * Update currently logged in user password. For validation, user is required
                 * to pass in the new password, and the old password. For users created with
                 * OAuth and Team Invites, oldPassword is optional.
                 *
                 * @param {string} password
                 * @param {string} oldPassword
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updatePassword: (password, oldPassword) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof password === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "password"');
                    }
                    let path = '/account/password';
                    let payload = {};
                    if (typeof password !== 'undefined') {
                        payload['password'] = password;
                    }
                    if (typeof oldPassword !== 'undefined') {
                        payload['oldPassword'] = oldPassword;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Account Preferences
                 *
                 * Get currently logged in user preferences as a key-value object.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getPrefs: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/prefs';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Account Preferences
                 *
                 * Update currently logged in user account preferences. The object you pass is
                 * stored as is, and replaces any previous value. The maximum allowed prefs
                 * size is 64kB and throws error if exceeded.
                 *
                 * @param {object} prefs
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updatePrefs: (prefs) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof prefs === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "prefs"');
                    }
                    let path = '/account/prefs';
                    let payload = {};
                    if (typeof prefs !== 'undefined') {
                        payload['prefs'] = prefs;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Password Recovery
                 *
                 * Sends the user an email with a temporary secret key for password reset.
                 * When the user clicks the confirmation link he is redirected back to your
                 * app password reset URL with the secret key and email address values
                 * attached to the URL query string. Use the query string params to submit a
                 * request to the [PUT
                 * /account/recovery](/docs/client/account#accountUpdateRecovery) endpoint to
                 * complete the process. The verification link sent to the user's email
                 * address is valid for 1 hour.
                 *
                 * @param {string} email
                 * @param {string} url
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createRecovery: (email, url) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    if (typeof url === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "url"');
                    }
                    let path = '/account/recovery';
                    let payload = {};
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Password Recovery (confirmation)
                 *
                 * Use this endpoint to complete the user account password reset. Both the
                 * **userId** and **secret** arguments will be passed as query parameters to
                 * the redirect URL you have provided when sending your request to the [POST
                 * /account/recovery](/docs/client/account#accountCreateRecovery) endpoint.
                 *
                 * Please note that in order to avoid a [Redirect
                 * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
                 * the only valid redirect URLs are the ones from domains you have set when
                 * adding your platforms in the console interface.
                 *
                 * @param {string} userId
                 * @param {string} secret
                 * @param {string} password
                 * @param {string} passwordAgain
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateRecovery: (userId, secret, password, passwordAgain) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof secret === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "secret"');
                    }
                    if (typeof password === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "password"');
                    }
                    if (typeof passwordAgain === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "passwordAgain"');
                    }
                    let path = '/account/recovery';
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof secret !== 'undefined') {
                        payload['secret'] = secret;
                    }
                    if (typeof password !== 'undefined') {
                        payload['password'] = password;
                    }
                    if (typeof passwordAgain !== 'undefined') {
                        payload['passwordAgain'] = passwordAgain;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('put', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Account Sessions
                 *
                 * Get currently logged in user list of active sessions across different
                 * devices.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getSessions: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/sessions';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Account Session
                 *
                 * Allow the user to login into their account by providing a valid email and
                 * password combination. This route will create a new session for the user.
                 *
                 * @param {string} email
                 * @param {string} password
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createSession: (email, password) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    if (typeof password === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "password"');
                    }
                    let path = '/account/sessions';
                    let payload = {};
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof password !== 'undefined') {
                        payload['password'] = password;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete All Account Sessions
                 *
                 * Delete all sessions from the user account and remove any sessions cookies
                 * from the end client.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                deleteSessions: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/sessions';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Anonymous Session
                 *
                 * Use this endpoint to allow a new user to register an anonymous account in
                 * your project. This route will also create a new session for the user. To
                 * allow the new user to convert an anonymous account to a normal account, you
                 * need to update its [email and
                 * password](/docs/client/account#accountUpdateEmail) or create an [OAuth2
                 * session](/docs/client/account#accountCreateOAuth2Session).
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createAnonymousSession: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/account/sessions/anonymous';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Magic URL session
                 *
                 * Sends the user an email with a secret key for creating a session. When the
                 * user clicks the link in the email, the user is redirected back to the URL
                 * you provided with the secret key and userId values attached to the URL
                 * query string. Use the query string parameters to submit a request to the
                 * [PUT
                 * /account/sessions/magic-url](/docs/client/account#accountUpdateMagicURLSession)
                 * endpoint to complete the login process. The link sent to the user's email
                 * address is valid for 1 hour. If you are on a mobile device you can leave
                 * the URL parameter empty, so that the login completion will be handled by
                 * your Appwrite instance by default.
                 *
                 * @param {string} userId
                 * @param {string} email
                 * @param {string} url
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createMagicURLSession: (userId, email, url) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    let path = '/account/sessions/magic-url';
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Magic URL session (confirmation)
                 *
                 * Use this endpoint to complete creating the session with the Magic URL. Both
                 * the **userId** and **secret** arguments will be passed as query parameters
                 * to the redirect URL you have provided when sending your request to the
                 * [POST
                 * /account/sessions/magic-url](/docs/client/account#accountCreateMagicURLSession)
                 * endpoint.
                 *
                 * Please note that in order to avoid a [Redirect
                 * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
                 * the only valid redirect URLs are the ones from domains you have set when
                 * adding your platforms in the console interface.
                 *
                 * @param {string} userId
                 * @param {string} secret
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateMagicURLSession: (userId, secret) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof secret === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "secret"');
                    }
                    let path = '/account/sessions/magic-url';
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof secret !== 'undefined') {
                        payload['secret'] = secret;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('put', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Account Session with OAuth2
                 *
                 * Allow the user to login to their account using the OAuth2 provider of their
                 * choice. Each OAuth2 provider should be enabled from the Appwrite console
                 * first. Use the success and failure arguments to provide a redirect URL's
                 * back to your app when login is completed.
                 *
                 * If there is already an active session, the new session will be attached to
                 * the logged-in account. If there are no active sessions, the server will
                 * attempt to look for a user with the same email address as the email
                 * received from the OAuth2 provider and attach the new session to the
                 * existing user. If no matching user is found - the server will create a new
                 * user..
                 *
                 *
                 * @param {string} provider
                 * @param {string} success
                 * @param {string} failure
                 * @param {string[]} scopes
                 * @throws {AppwriteException}
                 * @returns {void|string}
                 */
                createOAuth2Session: (provider, success, failure, scopes) => {
                    if (typeof provider === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "provider"');
                    }
                    let path = '/account/sessions/oauth2/{provider}'.replace('{provider}', provider);
                    let payload = {};
                    if (typeof success !== 'undefined') {
                        payload['success'] = success;
                    }
                    if (typeof failure !== 'undefined') {
                        payload['failure'] = failure;
                    }
                    if (typeof scopes !== 'undefined') {
                        payload['scopes'] = scopes;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    if (typeof window !== 'undefined' && (window === null || window === void 0 ? void 0 : window.location)) {
                        window.location.href = uri.toString();
                    }
                    else {
                        return uri;
                    }
                },
                /**
                 * Get Session By ID
                 *
                 * Use this endpoint to get a logged in user's session using a Session ID.
                 * Inputting 'current' will return the current session being used.
                 *
                 * @param {string} sessionId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getSession: (sessionId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof sessionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "sessionId"');
                    }
                    let path = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Session (Refresh Tokens)
                 *
                 *
                 * @param {string} sessionId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateSession: (sessionId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof sessionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "sessionId"');
                    }
                    let path = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete Account Session
                 *
                 * Use this endpoint to log out the currently logged in user from all their
                 * account sessions across all of their different devices. When using the
                 * Session ID argument, only the unique session ID provided is deleted.
                 *
                 *
                 * @param {string} sessionId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                deleteSession: (sessionId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof sessionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "sessionId"');
                    }
                    let path = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Email Verification
                 *
                 * Use this endpoint to send a verification message to your user email address
                 * to confirm they are the valid owners of that address. Both the **userId**
                 * and **secret** arguments will be passed as query parameters to the URL you
                 * have provided to be attached to the verification email. The provided URL
                 * should redirect the user back to your app and allow you to complete the
                 * verification process by verifying both the **userId** and **secret**
                 * parameters. Learn more about how to [complete the verification
                 * process](/docs/client/account#accountUpdateVerification). The verification
                 * link sent to the user's email address is valid for 7 days.
                 *
                 * Please note that in order to avoid a [Redirect
                 * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md),
                 * the only valid redirect URLs are the ones from domains you have set when
                 * adding your platforms in the console interface.
                 *
                 *
                 * @param {string} url
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createVerification: (url) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof url === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "url"');
                    }
                    let path = '/account/verification';
                    let payload = {};
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Email Verification (confirmation)
                 *
                 * Use this endpoint to complete the user email verification process. Use both
                 * the **userId** and **secret** parameters that were attached to your app URL
                 * to verify the user email ownership. If confirmed this route will return a
                 * 200 status code.
                 *
                 * @param {string} userId
                 * @param {string} secret
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateVerification: (userId, secret) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof secret === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "secret"');
                    }
                    let path = '/account/verification';
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof secret !== 'undefined') {
                        payload['secret'] = secret;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('put', uri, {
                        'content-type': 'application/json',
                    }, payload);
                })
            };
            this.avatars = {
                /**
                 * Get Browser Icon
                 *
                 * You can use this endpoint to show different browser icons to your users.
                 * The code argument receives the browser code as it appears in your user
                 * /account/sessions endpoint. Use width, height and quality arguments to
                 * change the output settings.
                 *
                 * @param {string} code
                 * @param {number} width
                 * @param {number} height
                 * @param {number} quality
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getBrowser: (code, width, height, quality) => {
                    if (typeof code === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "code"');
                    }
                    let path = '/avatars/browsers/{code}'.replace('{code}', code);
                    let payload = {};
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    if (typeof quality !== 'undefined') {
                        payload['quality'] = quality;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get Credit Card Icon
                 *
                 * The credit card endpoint will return you the icon of the credit card
                 * provider you need. Use width, height and quality arguments to change the
                 * output settings.
                 *
                 * @param {string} code
                 * @param {number} width
                 * @param {number} height
                 * @param {number} quality
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getCreditCard: (code, width, height, quality) => {
                    if (typeof code === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "code"');
                    }
                    let path = '/avatars/credit-cards/{code}'.replace('{code}', code);
                    let payload = {};
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    if (typeof quality !== 'undefined') {
                        payload['quality'] = quality;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get Favicon
                 *
                 * Use this endpoint to fetch the favorite icon (AKA favicon) of any remote
                 * website URL.
                 *
                 *
                 * @param {string} url
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getFavicon: (url) => {
                    if (typeof url === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "url"');
                    }
                    let path = '/avatars/favicon';
                    let payload = {};
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get Country Flag
                 *
                 * You can use this endpoint to show different country flags icons to your
                 * users. The code argument receives the 2 letter country code. Use width,
                 * height and quality arguments to change the output settings.
                 *
                 * @param {string} code
                 * @param {number} width
                 * @param {number} height
                 * @param {number} quality
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getFlag: (code, width, height, quality) => {
                    if (typeof code === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "code"');
                    }
                    let path = '/avatars/flags/{code}'.replace('{code}', code);
                    let payload = {};
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    if (typeof quality !== 'undefined') {
                        payload['quality'] = quality;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get Image from URL
                 *
                 * Use this endpoint to fetch a remote image URL and crop it to any image size
                 * you want. This endpoint is very useful if you need to crop and display
                 * remote images in your app or in case you want to make sure a 3rd party
                 * image is properly served using a TLS protocol.
                 *
                 * @param {string} url
                 * @param {number} width
                 * @param {number} height
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getImage: (url, width, height) => {
                    if (typeof url === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "url"');
                    }
                    let path = '/avatars/image';
                    let payload = {};
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get User Initials
                 *
                 * Use this endpoint to show your user initials avatar icon on your website or
                 * app. By default, this route will try to print your logged-in user name or
                 * email initials. You can also overwrite the user name if you pass the 'name'
                 * parameter. If no name is given and no user is logged, an empty avatar will
                 * be returned.
                 *
                 * You can use the color and background params to change the avatar colors. By
                 * default, a random theme will be selected. The random theme will persist for
                 * the user's initials when reloading the same theme will always return for
                 * the same initials.
                 *
                 * @param {string} name
                 * @param {number} width
                 * @param {number} height
                 * @param {string} color
                 * @param {string} background
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getInitials: (name, width, height, color, background) => {
                    let path = '/avatars/initials';
                    let payload = {};
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    if (typeof color !== 'undefined') {
                        payload['color'] = color;
                    }
                    if (typeof background !== 'undefined') {
                        payload['background'] = background;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get QR Code
                 *
                 * Converts a given plain text to a QR code image. You can use the query
                 * parameters to change the size and style of the resulting image.
                 *
                 * @param {string} text
                 * @param {number} size
                 * @param {number} margin
                 * @param {boolean} download
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getQR: (text, size, margin, download) => {
                    if (typeof text === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "text"');
                    }
                    let path = '/avatars/qr';
                    let payload = {};
                    if (typeof text !== 'undefined') {
                        payload['text'] = text;
                    }
                    if (typeof size !== 'undefined') {
                        payload['size'] = size;
                    }
                    if (typeof margin !== 'undefined') {
                        payload['margin'] = margin;
                    }
                    if (typeof download !== 'undefined') {
                        payload['download'] = download;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                }
            };
            this.database = {
                /**
                 * List Documents
                 *
                 * Get a list of all the user documents. You can use the query params to
                 * filter your results. On admin mode, this endpoint will return a list of all
                 * of the project's documents. [Learn more about different API
                 * modes](/docs/admin).
                 *
                 * @param {string} collectionId
                 * @param {string[]} queries
                 * @param {number} limit
                 * @param {number} offset
                 * @param {string} cursor
                 * @param {string} cursorDirection
                 * @param {string[]} orderAttributes
                 * @param {string[]} orderTypes
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                listDocuments: (collectionId, queries, limit, offset, cursor, cursorDirection, orderAttributes, orderTypes) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof collectionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "collectionId"');
                    }
                    let path = '/database/collections/{collectionId}/documents'.replace('{collectionId}', collectionId);
                    let payload = {};
                    if (typeof queries !== 'undefined') {
                        payload['queries'] = queries;
                    }
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    if (typeof cursor !== 'undefined') {
                        payload['cursor'] = cursor;
                    }
                    if (typeof cursorDirection !== 'undefined') {
                        payload['cursorDirection'] = cursorDirection;
                    }
                    if (typeof orderAttributes !== 'undefined') {
                        payload['orderAttributes'] = orderAttributes;
                    }
                    if (typeof orderTypes !== 'undefined') {
                        payload['orderTypes'] = orderTypes;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Document
                 *
                 * Create a new Document. Before using this route, you should create a new
                 * collection resource using either a [server
                 * integration](/docs/server/database#databaseCreateCollection) API or
                 * directly from your database console.
                 *
                 * @param {string} collectionId
                 * @param {string} documentId
                 * @param {object} data
                 * @param {string[]} read
                 * @param {string[]} write
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createDocument: (collectionId, documentId, data, read, write) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof collectionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "collectionId"');
                    }
                    if (typeof documentId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "documentId"');
                    }
                    if (typeof data === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "data"');
                    }
                    let path = '/database/collections/{collectionId}/documents'.replace('{collectionId}', collectionId);
                    let payload = {};
                    if (typeof documentId !== 'undefined') {
                        payload['documentId'] = documentId;
                    }
                    if (typeof data !== 'undefined') {
                        payload['data'] = data;
                    }
                    if (typeof read !== 'undefined') {
                        payload['read'] = read;
                    }
                    if (typeof write !== 'undefined') {
                        payload['write'] = write;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Document
                 *
                 * Get a document by its unique ID. This endpoint response returns a JSON
                 * object with the document data.
                 *
                 * @param {string} collectionId
                 * @param {string} documentId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getDocument: (collectionId, documentId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof collectionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "collectionId"');
                    }
                    if (typeof documentId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "documentId"');
                    }
                    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Document
                 *
                 * Update a document by its unique ID. Using the patch method you can pass
                 * only specific fields that will get updated.
                 *
                 * @param {string} collectionId
                 * @param {string} documentId
                 * @param {object} data
                 * @param {string[]} read
                 * @param {string[]} write
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateDocument: (collectionId, documentId, data, read, write) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof collectionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "collectionId"');
                    }
                    if (typeof documentId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "documentId"');
                    }
                    if (typeof data === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "data"');
                    }
                    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
                    let payload = {};
                    if (typeof data !== 'undefined') {
                        payload['data'] = data;
                    }
                    if (typeof read !== 'undefined') {
                        payload['read'] = read;
                    }
                    if (typeof write !== 'undefined') {
                        payload['write'] = write;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete Document
                 *
                 * Delete a document by its unique ID. This endpoint deletes only the parent
                 * documents, its attributes and relations to other documents. Child documents
                 * **will not** be deleted.
                 *
                 * @param {string} collectionId
                 * @param {string} documentId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                deleteDocument: (collectionId, documentId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof collectionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "collectionId"');
                    }
                    if (typeof documentId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "documentId"');
                    }
                    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                })
            };
            this.functions = {
                /**
                 * Retry Build
                 *
                 *
                 * @param {string} functionId
                 * @param {string} deploymentId
                 * @param {string} buildId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                retryBuild: (functionId, deploymentId, buildId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof functionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "functionId"');
                    }
                    if (typeof deploymentId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "deploymentId"');
                    }
                    if (typeof buildId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "buildId"');
                    }
                    let path = '/functions/{functionId}/deployments/{deploymentId}/builds/{buildId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId).replace('{buildId}', buildId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Executions
                 *
                 * Get a list of all the current user function execution logs. You can use the
                 * query params to filter your results. On admin mode, this endpoint will
                 * return a list of all of the project's executions. [Learn more about
                 * different API modes](/docs/admin).
                 *
                 * @param {string} functionId
                 * @param {number} limit
                 * @param {number} offset
                 * @param {string} search
                 * @param {string} cursor
                 * @param {string} cursorDirection
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                listExecutions: (functionId, limit, offset, search, cursor, cursorDirection) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof functionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "functionId"');
                    }
                    let path = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
                    let payload = {};
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    if (typeof search !== 'undefined') {
                        payload['search'] = search;
                    }
                    if (typeof cursor !== 'undefined') {
                        payload['cursor'] = cursor;
                    }
                    if (typeof cursorDirection !== 'undefined') {
                        payload['cursorDirection'] = cursorDirection;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Execution
                 *
                 * Trigger a function execution. The returned object will return you the
                 * current execution status. You can ping the `Get Execution` endpoint to get
                 * updates on the current execution status. Once this endpoint is called, your
                 * function execution process will start asynchronously.
                 *
                 * @param {string} functionId
                 * @param {string} data
                 * @param {boolean} async
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createExecution: (functionId, data, async) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof functionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "functionId"');
                    }
                    let path = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
                    let payload = {};
                    if (typeof data !== 'undefined') {
                        payload['data'] = data;
                    }
                    if (typeof async !== 'undefined') {
                        payload['async'] = async;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Execution
                 *
                 * Get a function execution log by its unique ID.
                 *
                 * @param {string} functionId
                 * @param {string} executionId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getExecution: (functionId, executionId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof functionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "functionId"');
                    }
                    if (typeof executionId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "executionId"');
                    }
                    let path = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                })
            };
            this.locale = {
                /**
                 * Get User Locale
                 *
                 * Get the current user location based on IP. Returns an object with user
                 * country code, country name, continent name, continent code, ip address and
                 * suggested currency. You can use the locale header to get the data in a
                 * supported language.
                 *
                 * ([IP Geolocation by DB-IP](https://db-ip.com))
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                get: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Continents
                 *
                 * List of all continents. You can use the locale header to get the data in a
                 * supported language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getContinents: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/continents';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Countries
                 *
                 * List of all countries. You can use the locale header to get the data in a
                 * supported language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getCountries: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/countries';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List EU Countries
                 *
                 * List of all countries that are currently members of the EU. You can use the
                 * locale header to get the data in a supported language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getCountriesEU: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/countries/eu';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Countries Phone Codes
                 *
                 * List of all countries phone codes. You can use the locale header to get the
                 * data in a supported language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getCountriesPhones: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/countries/phones';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Currencies
                 *
                 * List of all currencies, including currency symbol, name, plural, and
                 * decimal digits for all major and minor currencies. You can use the locale
                 * header to get the data in a supported language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getCurrencies: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/currencies';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * List Languages
                 *
                 * List of all languages classified by ISO 639-1 including 2-letter code, name
                 * in English, and name in the respective language.
                 *
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getLanguages: () => __awaiter(this, void 0, void 0, function* () {
                    let path = '/locale/languages';
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                })
            };
            this.storage = {
                /**
                 * List Files
                 *
                 * Get a list of all the user files. You can use the query params to filter
                 * your results. On admin mode, this endpoint will return a list of all of the
                 * project's files. [Learn more about different API modes](/docs/admin).
                 *
                 * @param {string} bucketId
                 * @param {string} search
                 * @param {number} limit
                 * @param {number} offset
                 * @param {string} cursor
                 * @param {string} cursorDirection
                 * @param {string} orderType
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                listFiles: (bucketId, search, limit, offset, cursor, cursorDirection, orderType) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
                    let payload = {};
                    if (typeof search !== 'undefined') {
                        payload['search'] = search;
                    }
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    if (typeof cursor !== 'undefined') {
                        payload['cursor'] = cursor;
                    }
                    if (typeof cursorDirection !== 'undefined') {
                        payload['cursorDirection'] = cursorDirection;
                    }
                    if (typeof orderType !== 'undefined') {
                        payload['orderType'] = orderType;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create File
                 *
                 * Create a new file. Before using this route, you should create a new bucket
                 * resource using either a [server
                 * integration](/docs/server/database#storageCreateBucket) API or directly
                 * from your Appwrite console.
                 *
                 * Larger files should be uploaded using multiple requests with the
                 * [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
                 * header to send a partial request with a maximum supported chunk of `5MB`.
                 * The `content-range` header values should always be in bytes.
                 *
                 * When the first request is sent, the server will return the **File** object,
                 * and the subsequent part request must include the file's **id** in
                 * `x-appwrite-id` header to allow the server to know that the partial upload
                 * is for the existing file and not for a new one.
                 *
                 * If you're creating a new file using one of the Appwrite SDKs, all the
                 * chunking logic will be managed by the SDK internally.
                 *
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @param {File} file
                 * @param {string[]} read
                 * @param {string[]} write
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createFile: (bucketId, fileId, file, read, write, onProgress = (progress) => { }) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    if (typeof file === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "file"');
                    }
                    let path = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
                    let payload = {};
                    if (typeof fileId !== 'undefined') {
                        payload['fileId'] = fileId;
                    }
                    if (typeof file !== 'undefined') {
                        payload['file'] = file;
                    }
                    if (typeof read !== 'undefined') {
                        payload['read'] = read;
                    }
                    if (typeof write !== 'undefined') {
                        payload['write'] = write;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    const size = file.size;
                    if (size <= Appwrite.CHUNK_SIZE) {
                        return yield this.call('post', uri, {
                            'content-type': 'multipart/form-data',
                        }, payload);
                    }
                    let id = undefined;
                    let response = undefined;
                    const headers = {
                        'content-type': 'multipart/form-data',
                    };
                    let counter = 0;
                    const totalCounters = Math.ceil(size / Appwrite.CHUNK_SIZE);
                    if (fileId != 'unique()') {
                        try {
                            response = yield this.call('GET', new URL(this.config.endpoint + path + '/' + fileId), headers);
                            counter = response.chunksUploaded;
                        }
                        catch (e) {
                        }
                    }
                    for (counter; counter < totalCounters; counter++) {
                        const start = (counter * Appwrite.CHUNK_SIZE);
                        const end = Math.min((((counter * Appwrite.CHUNK_SIZE) + Appwrite.CHUNK_SIZE) - 1), size);
                        headers['content-range'] = 'bytes ' + start + '-' + end + '/' + size;
                        if (id) {
                            headers['x-appwrite-id'] = id;
                        }
                        const stream = file.slice(start, end + 1);
                        payload['file'] = new File([stream], file.name);
                        response = yield this.call('post', uri, headers, payload);
                        if (!id) {
                            id = response['$id'];
                        }
                        if (onProgress) {
                            onProgress({
                                $id: response.$id,
                                progress: Math.min((counter + 1) * Appwrite.CHUNK_SIZE, size) / size * 100,
                                sizeUploaded: end + 1,
                                chunksTotal: response.chunksTotal,
                                chunksUploaded: response.chunksUploaded
                            });
                        }
                    }
                    return response;
                }),
                /**
                 * Get File
                 *
                 * Get a file by its unique ID. This endpoint response returns a JSON object
                 * with the file metadata.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getFile: (bucketId, fileId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update File
                 *
                 * Update a file by its unique ID. Only users with write permissions have
                 * access to update this resource.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @param {string[]} read
                 * @param {string[]} write
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateFile: (bucketId, fileId, read, write) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    if (typeof read !== 'undefined') {
                        payload['read'] = read;
                    }
                    if (typeof write !== 'undefined') {
                        payload['write'] = write;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('put', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete File
                 *
                 * Delete a file by its unique ID. Only users with write permissions have
                 * access to delete this resource.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                deleteFile: (bucketId, fileId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get File for Download
                 *
                 * Get a file content by its unique ID. The endpoint response return with a
                 * 'Content-Disposition: attachment' header that tells the browser to start
                 * downloading the file to user downloads directory.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getFileDownload: (bucketId, fileId) => {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get File Preview
                 *
                 * Get a file preview image. Currently, this method supports preview for image
                 * files (jpg, png, and gif), other supported formats, like pdf, docs, slides,
                 * and spreadsheets, will return the file icon image. You can also pass query
                 * string arguments for cutting and resizing your preview image. Preview is
                 * supported only for image files smaller than 10MB.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @param {number} width
                 * @param {number} height
                 * @param {string} gravity
                 * @param {number} quality
                 * @param {number} borderWidth
                 * @param {string} borderColor
                 * @param {number} borderRadius
                 * @param {number} opacity
                 * @param {number} rotation
                 * @param {string} background
                 * @param {string} output
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getFilePreview: (bucketId, fileId, width, height, gravity, quality, borderWidth, borderColor, borderRadius, opacity, rotation, background, output) => {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    if (typeof width !== 'undefined') {
                        payload['width'] = width;
                    }
                    if (typeof height !== 'undefined') {
                        payload['height'] = height;
                    }
                    if (typeof gravity !== 'undefined') {
                        payload['gravity'] = gravity;
                    }
                    if (typeof quality !== 'undefined') {
                        payload['quality'] = quality;
                    }
                    if (typeof borderWidth !== 'undefined') {
                        payload['borderWidth'] = borderWidth;
                    }
                    if (typeof borderColor !== 'undefined') {
                        payload['borderColor'] = borderColor;
                    }
                    if (typeof borderRadius !== 'undefined') {
                        payload['borderRadius'] = borderRadius;
                    }
                    if (typeof opacity !== 'undefined') {
                        payload['opacity'] = opacity;
                    }
                    if (typeof rotation !== 'undefined') {
                        payload['rotation'] = rotation;
                    }
                    if (typeof background !== 'undefined') {
                        payload['background'] = background;
                    }
                    if (typeof output !== 'undefined') {
                        payload['output'] = output;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                },
                /**
                 * Get File for View
                 *
                 * Get a file content by its unique ID. This endpoint is similar to the
                 * download method but returns with no  'Content-Disposition: attachment'
                 * header.
                 *
                 * @param {string} bucketId
                 * @param {string} fileId
                 * @throws {AppwriteException}
                 * @returns {URL}
                 */
                getFileView: (bucketId, fileId) => {
                    if (typeof bucketId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "bucketId"');
                    }
                    if (typeof fileId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "fileId"');
                    }
                    let path = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    payload['project'] = this.config.project;
                    for (const [key, value] of Object.entries(this.flatten(payload))) {
                        uri.searchParams.append(key, value);
                    }
                    return uri;
                }
            };
            this.teams = {
                /**
                 * List Teams
                 *
                 * Get a list of all the teams in which the current user is a member. You can
                 * use the parameters to filter your results.
                 *
                 * In admin mode, this endpoint returns a list of all the teams in the current
                 * project. [Learn more about different API modes](/docs/admin).
                 *
                 * @param {string} search
                 * @param {number} limit
                 * @param {number} offset
                 * @param {string} cursor
                 * @param {string} cursorDirection
                 * @param {string} orderType
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                list: (search, limit, offset, cursor, cursorDirection, orderType) => __awaiter(this, void 0, void 0, function* () {
                    let path = '/teams';
                    let payload = {};
                    if (typeof search !== 'undefined') {
                        payload['search'] = search;
                    }
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    if (typeof cursor !== 'undefined') {
                        payload['cursor'] = cursor;
                    }
                    if (typeof cursorDirection !== 'undefined') {
                        payload['cursorDirection'] = cursorDirection;
                    }
                    if (typeof orderType !== 'undefined') {
                        payload['orderType'] = orderType;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Team
                 *
                 * Create a new team. The user who creates the team will automatically be
                 * assigned as the owner of the team. Only the users with the owner role can
                 * invite new members, add new owners and delete or update the team.
                 *
                 * @param {string} teamId
                 * @param {string} name
                 * @param {string[]} roles
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                create: (teamId, name, roles) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof name === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "name"');
                    }
                    let path = '/teams';
                    let payload = {};
                    if (typeof teamId !== 'undefined') {
                        payload['teamId'] = teamId;
                    }
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    if (typeof roles !== 'undefined') {
                        payload['roles'] = roles;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Team
                 *
                 * Get a team by its ID. All team members have read access for this resource.
                 *
                 * @param {string} teamId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                get: (teamId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    let path = '/teams/{teamId}'.replace('{teamId}', teamId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Team
                 *
                 * Update a team using its ID. Only members with the owner role can update the
                 * team.
                 *
                 * @param {string} teamId
                 * @param {string} name
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                update: (teamId, name) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof name === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "name"');
                    }
                    let path = '/teams/{teamId}'.replace('{teamId}', teamId);
                    let payload = {};
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('put', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete Team
                 *
                 * Delete a team using its ID. Only team members with the owner role can
                 * delete the team.
                 *
                 * @param {string} teamId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                delete: (teamId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    let path = '/teams/{teamId}'.replace('{teamId}', teamId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Team Memberships
                 *
                 * Use this endpoint to list a team's members using the team's ID. All team
                 * members have read access to this endpoint.
                 *
                 * @param {string} teamId
                 * @param {string} search
                 * @param {number} limit
                 * @param {number} offset
                 * @param {string} cursor
                 * @param {string} cursorDirection
                 * @param {string} orderType
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getMemberships: (teamId, search, limit, offset, cursor, cursorDirection, orderType) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    let path = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
                    let payload = {};
                    if (typeof search !== 'undefined') {
                        payload['search'] = search;
                    }
                    if (typeof limit !== 'undefined') {
                        payload['limit'] = limit;
                    }
                    if (typeof offset !== 'undefined') {
                        payload['offset'] = offset;
                    }
                    if (typeof cursor !== 'undefined') {
                        payload['cursor'] = cursor;
                    }
                    if (typeof cursorDirection !== 'undefined') {
                        payload['cursorDirection'] = cursorDirection;
                    }
                    if (typeof orderType !== 'undefined') {
                        payload['orderType'] = orderType;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Create Team Membership
                 *
                 * Invite a new member to join your team. If initiated from the client SDK, an
                 * email with a link to join the team will be sent to the member's email
                 * address and an account will be created for them should they not be signed
                 * up already. If initiated from server-side SDKs, the new member will
                 * automatically be added to the team.
                 *
                 * Use the 'url' parameter to redirect the user from the invitation email back
                 * to your app. When the user is redirected, use the [Update Team Membership
                 * Status](/docs/client/teams#teamsUpdateMembershipStatus) endpoint to allow
                 * the user to accept the invitation to the team.
                 *
                 * Please note that to avoid a [Redirect
                 * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
                 * the only valid redirect URL's are the once from domains you have set when
                 * adding your platforms in the console interface.
                 *
                 * @param {string} teamId
                 * @param {string} email
                 * @param {string[]} roles
                 * @param {string} url
                 * @param {string} name
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                createMembership: (teamId, email, roles, url, name) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof email === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "email"');
                    }
                    if (typeof roles === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "roles"');
                    }
                    if (typeof url === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "url"');
                    }
                    let path = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
                    let payload = {};
                    if (typeof email !== 'undefined') {
                        payload['email'] = email;
                    }
                    if (typeof roles !== 'undefined') {
                        payload['roles'] = roles;
                    }
                    if (typeof url !== 'undefined') {
                        payload['url'] = url;
                    }
                    if (typeof name !== 'undefined') {
                        payload['name'] = name;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('post', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Get Team Membership
                 *
                 * Get a team member by the membership unique id. All team members have read
                 * access for this resource.
                 *
                 * @param {string} teamId
                 * @param {string} membershipId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                getMembership: (teamId, membershipId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof membershipId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "membershipId"');
                    }
                    let path = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('get', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Membership Roles
                 *
                 * Modify the roles of a team member. Only team members with the owner role
                 * have access to this endpoint. Learn more about [roles and
                 * permissions](/docs/permissions).
                 *
                 * @param {string} teamId
                 * @param {string} membershipId
                 * @param {string[]} roles
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateMembershipRoles: (teamId, membershipId, roles) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof membershipId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "membershipId"');
                    }
                    if (typeof roles === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "roles"');
                    }
                    let path = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
                    let payload = {};
                    if (typeof roles !== 'undefined') {
                        payload['roles'] = roles;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Delete Team Membership
                 *
                 * This endpoint allows a user to leave a team or for a team owner to delete
                 * the membership of any other team member. You can also use this endpoint to
                 * delete a user membership even if it is not accepted.
                 *
                 * @param {string} teamId
                 * @param {string} membershipId
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                deleteMembership: (teamId, membershipId) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof membershipId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "membershipId"');
                    }
                    let path = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
                    let payload = {};
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('delete', uri, {
                        'content-type': 'application/json',
                    }, payload);
                }),
                /**
                 * Update Team Membership Status
                 *
                 * Use this endpoint to allow a user to accept an invitation to join a team
                 * after being redirected back to your app from the invitation email received
                 * by the user.
                 *
                 * If the request is successful, a session for the user is automatically
                 * created.
                 *
                 *
                 * @param {string} teamId
                 * @param {string} membershipId
                 * @param {string} userId
                 * @param {string} secret
                 * @throws {AppwriteException}
                 * @returns {Promise}
                 */
                updateMembershipStatus: (teamId, membershipId, userId, secret) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof teamId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "teamId"');
                    }
                    if (typeof membershipId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "membershipId"');
                    }
                    if (typeof userId === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "userId"');
                    }
                    if (typeof secret === 'undefined') {
                        throw new AppwriteException('Missing required parameter: "secret"');
                    }
                    let path = '/teams/{teamId}/memberships/{membershipId}/status'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
                    let payload = {};
                    if (typeof userId !== 'undefined') {
                        payload['userId'] = userId;
                    }
                    if (typeof secret !== 'undefined') {
                        payload['secret'] = secret;
                    }
                    const uri = new URL(this.config.endpoint + path);
                    return yield this.call('patch', uri, {
                        'content-type': 'application/json',
                    }, payload);
                })
            };
        }
        /**
         * Set Endpoint
         *
         * Your project endpoint
         *
         * @param {string} endpoint
         *
         * @returns {this}
         */
        setEndpoint(endpoint) {
            this.config.endpoint = endpoint;
            this.config.endpointRealtime = this.config.endpointRealtime || this.config.endpoint.replace('https://', 'wss://').replace('http://', 'ws://');
            return this;
        }
        /**
         * Set Realtime Endpoint
         *
         * @param {string} endpointRealtime
         *
         * @returns {this}
         */
        setEndpointRealtime(endpointRealtime) {
            this.config.endpointRealtime = endpointRealtime;
            return this;
        }
        /**
         * Set Project
         *
         * Your project ID
         *
         * @param value string
         *
         * @return {this}
         */
        setProject(value) {
            this.headers['X-Appwrite-Project'] = value;
            this.config.project = value;
            return this;
        }
        /**
         * Set JWT
         *
         * Your secret JSON Web Token
         *
         * @param value string
         *
         * @return {this}
         */
        setJWT(value) {
            this.headers['X-Appwrite-JWT'] = value;
            this.config.jwt = value;
            return this;
        }
        /**
         * Set Locale
         *
         * @param value string
         *
         * @return {this}
         */
        setLocale(value) {
            this.headers['X-Appwrite-Locale'] = value;
            this.config.locale = value;
            return this;
        }
        /**
         * Subscribes to Appwrite events and passes you the payload in realtime.
         *
         * @param {string|string[]} channels
         * Channel to subscribe - pass a single channel as a string or multiple with an array of strings.
         *
         * Possible channels are:
         * - account
         * - collections
         * - collections.[ID]
         * - collections.[ID].documents
         * - documents
         * - documents.[ID]
         * - files
         * - files.[ID]
         * - executions
         * - executions.[ID]
         * - functions.[ID]
         * - teams
         * - teams.[ID]
         * - memberships
         * - memberships.[ID]
         * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
         * @returns {() => void} Unsubscribes from events.
         */
        subscribe(channels, callback) {
            let channelArray = typeof channels === 'string' ? [channels] : channels;
            channelArray.forEach(channel => this.realtime.channels.add(channel));
            const counter = this.realtime.subscriptionsCounter++;
            this.realtime.subscriptions.set(counter, {
                channels: channelArray,
                callback
            });
            this.realtime.connect();
            return () => {
                this.realtime.subscriptions.delete(counter);
                this.realtime.cleanUp(channelArray);
                this.realtime.connect();
            };
        }
        call(method, url, headers = {}, params = {}) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                method = method.toUpperCase();
                headers = Object.assign({}, this.headers, headers);
                let options = {
                    method,
                    headers,
                    credentials: 'include'
                };
                if (typeof window !== 'undefined' && window.localStorage) {
                    headers['X-Fallback-Cookies'] = (_a = window.localStorage.getItem('cookieFallback')) !== null && _a !== void 0 ? _a : '';
                }
                if (method === 'GET') {
                    for (const [key, value] of Object.entries(this.flatten(params))) {
                        url.searchParams.append(key, value);
                    }
                }
                else {
                    switch (headers['content-type']) {
                        case 'application/json':
                            options.body = JSON.stringify(params);
                            break;
                        case 'multipart/form-data':
                            let formData = new FormData();
                            for (const key in params) {
                                if (Array.isArray(params[key])) {
                                    params[key].forEach((value) => {
                                        formData.append(key + '[]', value);
                                    });
                                }
                                else {
                                    formData.append(key, params[key]);
                                }
                            }
                            options.body = formData;
                            delete headers['content-type'];
                            break;
                    }
                }
                try {
                    let data = null;
                    const response = yield browserPonyfill.fetch(url.toString(), options);
                    if ((_b = response.headers.get('content-type')) === null || _b === void 0 ? void 0 : _b.includes('application/json')) {
                        data = yield response.json();
                    }
                    else {
                        data = {
                            message: yield response.text()
                        };
                    }
                    if (400 <= response.status) {
                        throw new AppwriteException(data === null || data === void 0 ? void 0 : data.message, response.status, data === null || data === void 0 ? void 0 : data.type, data);
                    }
                    const cookieFallback = response.headers.get('X-Fallback-Cookies');
                    if (typeof window !== 'undefined' && window.localStorage && cookieFallback) {
                        window.console.warn('Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.');
                        window.localStorage.setItem('cookieFallback', cookieFallback);
                    }
                    return data;
                }
                catch (e) {
                    if (e instanceof AppwriteException) {
                        throw e;
                    }
                    throw new AppwriteException(e.message);
                }
            });
        }
        flatten(data, prefix = '') {
            let output = {};
            for (const key in data) {
                let value = data[key];
                let finalKey = prefix ? `${prefix}[${key}]` : key;
                if (Array.isArray(value)) {
                    output = Object.assign(output, this.flatten(value, finalKey));
                }
                else {
                    output[finalKey] = value;
                }
            }
            return output;
        }
    }
    Appwrite.CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    class Query {
    }
    Query.equal = (attribute, value) => Query.addQuery(attribute, "equal", value);
    Query.notEqual = (attribute, value) => Query.addQuery(attribute, "notEqual", value);
    Query.lesser = (attribute, value) => Query.addQuery(attribute, "lesser", value);
    Query.lesserEqual = (attribute, value) => Query.addQuery(attribute, "lesserEqual", value);
    Query.greater = (attribute, value) => Query.addQuery(attribute, "greater", value);
    Query.greaterEqual = (attribute, value) => Query.addQuery(attribute, "greaterEqual", value);
    Query.search = (attribute, value) => Query.addQuery(attribute, "search", value);
    Query.addQuery = (attribute, oper, value) => value instanceof Array
        ? `${attribute}.${oper}(${value
        .map((v) => Query.parseValues(v))
        .join(",")})`
        : `${attribute}.${oper}(${Query.parseValues(value)})`;
    Query.parseValues = (value) => typeof value === "string" || value instanceof String
        ? `"${value}"`
        : `${value}`;

    const server = {
        endpoint: 'https://8080-appwrite-integrationforg-l4agqveejyf.ws-us43.gitpod.io/v1',
        project: 'hackaton-appwrite',
    };

    const sdk = new Appwrite();

    sdk.setEndpoint(server.endpoint).setProject(server.project);

    const SESSION_KEY = "petandvet_sessionid";

    function saveSessionId(id) {
        localStorage.setItem(SESSION_KEY, id);
    }

    function getSessionId() {
        return localStorage.getItem(SESSION_KEY);
    }

    async function createUser({ fullname, email, password, country, kind }) {
        const account = await sdk.account.create('unique()', email, password, fullname);
        const session = await sdk.account.createSession(email, password);
        saveSessionId(session.$id);
        const usermeta = await sdk.database.createDocument('usermeta', account.$id, {
            country,
            kind
        });
        const user = {...usermeta, ...account};
        state.update(user);
    }

    async function login({ email, password }) {
        const session = await sdk.account.createSession(email, password);
        saveSessionId(session.$id);

        const account = await sdk.account.get();
        const usermeta = await sdk.database.getDocument('usermeta', account.$id);
        const user = {...usermeta, ...account};
        state.update(user);
    }


    async function logout() {
        const sessionId = getSessionId();
        state.destroy();
        await sdk.account.deleteSession(sessionId);
    }


    async function loadUser() {
        try {
            const account = await sdk.account.get();
            const usermeta = await sdk.database.getDocument('usermeta', account.$id);
            const user = {...usermeta, ...account};
            state.init(user);
        } catch(err) {
            state.init(null);
        }
    }

    /* src/lib/pages/Login.svelte generated by Svelte v3.47.0 */
    const file$c = "src/lib/pages/Login.svelte";

    // (54:20) <Button mode="primary" size="large" type="submit">
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Acept");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(54:20) <Button mode=\\\"primary\\\" size=\\\"large\\\" type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:8) <Toast isOpen={isToastOpen} type="error">
    function create_default_slot_1$6(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let close;
    	let current;

    	close = new Close({
    			props: { color: "var(--agnostic-error-dark)" },
    			$$inline: true
    		});

    	close.$on("click", /*toastClose*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*errorMessage*/ ctx[1]);
    			t1 = space();
    			create_component(close.$$.fragment);
    			add_location(p, file$c, 63, 16, 1756);
    			attr_dev(div, "class", "toast-error-content svelte-jkle8h");
    			add_location(div, file$c, 62, 12, 1706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			mount_component(close, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*errorMessage*/ 2) set_data_dev(t0, /*errorMessage*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(close);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(62:8) <Toast isOpen={isToastOpen} type=\\\"error\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:4) <Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
    function create_default_slot$7(ctx) {
    	let toast;
    	let current;

    	toast = new Toast({
    			props: {
    				isOpen: /*isToastOpen*/ ctx[0],
    				type: "error",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toast_changes = {};
    			if (dirty & /*isToastOpen*/ 1) toast_changes.isOpen = /*isToastOpen*/ ctx[0];

    			if (dirty & /*$$scope, errorMessage*/ 514) {
    				toast_changes.$$scope = { dirty, ctx };
    			}

    			toast.$set(toast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(61:4) <Toasts portalRootSelector=\\\"body\\\" horizontalPosition=\\\"center\\\" verticalPosition=\\\"bottom\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let section;
    	let h2;
    	let t1;
    	let form;
    	let div0;
    	let input0;
    	let updating_value;
    	let t2;
    	let div1;
    	let input1;
    	let updating_value_1;
    	let t3;
    	let div2;
    	let button;
    	let t4;
    	let aside;
    	let t5;
    	let toasts;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[6](value);
    	}

    	let input0_props = {
    		label: "Email",
    		type: "email",
    		required: true
    	};

    	if (/*email*/ ctx[2] !== void 0) {
    		input0_props.value = /*email*/ ctx[2];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[7](value);
    	}

    	let input1_props = {
    		label: "Password",
    		type: "password",
    		required: true,
    		minlength: "8"
    	};

    	if (/*password*/ ctx[3] !== void 0) {
    		input1_props.value = /*password*/ ctx[3];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	button = new Button({
    			props: {
    				mode: "primary",
    				size: "large",
    				type: "submit",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	aside = new Aside({ $$inline: true });

    	toasts = new Toasts({
    			props: {
    				portalRootSelector: "body",
    				horizontalPosition: "center",
    				verticalPosition: "bottom",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Login";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			create_component(input0.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(input1.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t4 = space();
    			create_component(aside.$$.fragment);
    			t5 = space();
    			create_component(toasts.$$.fragment);
    			attr_dev(h2, "class", "big-title");
    			add_location(h2, file$c, 43, 12, 919);
    			attr_dev(div0, "class", "sepatator svelte-jkle8h");
    			add_location(div0, file$c, 45, 16, 1027);
    			attr_dev(div1, "class", "sepatator svelte-jkle8h");
    			add_location(div1, file$c, 48, 16, 1175);
    			attr_dev(div2, "class", "actions svelte-jkle8h");
    			add_location(div2, file$c, 52, 16, 1347);
    			add_location(form, file$c, 44, 12, 964);
    			add_location(section, file$c, 42, 8, 897);
    			attr_dev(main, "class", "container mt-1");
    			add_location(main, file$c, 41, 4, 859);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			append_dev(section, form);
    			append_dev(form, div0);
    			mount_component(input0, div0, null);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			mount_component(input1, div1, null);
    			append_dev(form, t3);
    			append_dev(form, div2);
    			mount_component(button, div2, null);
    			append_dev(main, t4);
    			mount_component(aside, main, null);
    			insert_dev(target, t5, anchor);
    			mount_component(toasts, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[5]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*email*/ 4) {
    				updating_value = true;
    				input0_changes.value = /*email*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*password*/ 8) {
    				updating_value_1 = true;
    				input1_changes.value = /*password*/ ctx[3];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const toasts_changes = {};

    			if (dirty & /*$$scope, isToastOpen, errorMessage*/ 515) {
    				toasts_changes.$$scope = { dirty, ctx };
    			}

    			toasts.$set(toasts_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(aside.$$.fragment, local);
    			transition_in(toasts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(aside.$$.fragment, local);
    			transition_out(toasts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(button);
    			destroy_component(aside);
    			if (detaching) detach_dev(t5);
    			destroy_component(toasts, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let isToastOpen = false;
    	let errorMessage = "";
    	let email = "";
    	let password = "";

    	function toastClose() {
    		$$invalidate(1, errorMessage = "");
    		$$invalidate(0, isToastOpen = false);
    	}

    	function toastOpen(message) {
    		$$invalidate(1, errorMessage = message);
    		$$invalidate(0, isToastOpen = true);
    	}

    	async function handleSubmit() {
    		$$invalidate(1, errorMessage = "");
    		$$invalidate(0, isToastOpen = false);

    		try {
    			await login({ email, password });
    			replace("/profile");
    		} catch(err) {
    			toastOpen(err.message);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		email = value;
    		$$invalidate(2, email);
    	}

    	function input1_value_binding(value) {
    		password = value;
    		$$invalidate(3, password);
    	}

    	$$self.$capture_state = () => ({
    		Input,
    		Button,
    		Close,
    		Toasts,
    		Toast,
    		replace,
    		Aside,
    		login,
    		isToastOpen,
    		errorMessage,
    		email,
    		password,
    		toastClose,
    		toastOpen,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('isToastOpen' in $$props) $$invalidate(0, isToastOpen = $$props.isToastOpen);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('password' in $$props) $$invalidate(3, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isToastOpen,
    		errorMessage,
    		email,
    		password,
    		toastClose,
    		handleSubmit,
    		input0_value_binding,
    		input1_value_binding
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    async function getAllCountries() {
        let { countries } = await sdk.locale.getCountries();
        return countries.map(({ name, code }) => ({ value: code, label: name })); 
    }

    /* src/lib/pages/Register.svelte generated by Svelte v3.47.0 */
    const file$b = "src/lib/pages/Register.svelte";

    // (1:0) <script> import { Input, Select, Button, Close, Toasts, Toast  }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script> import { Input, Select, Button, Close, Toasts, Toast  }",
    		ctx
    	});

    	return block;
    }

    // (69:16) {:then countriesOptions}
    function create_then_block$1(ctx) {
    	let label;
    	let span;
    	let t1;
    	let select;
    	let updating_selected;
    	let current;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[12](value);
    	}

    	let select_props = {
    		required: true,
    		uniqueId: "country",
    		options: /*countriesOptions*/ ctx[15],
    		defaultOptionLabel: " - Select -"
    	};

    	if (/*country*/ ctx[5] !== void 0) {
    		select_props.selected = /*country*/ ctx[5];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));

    	const block = {
    		c: function create() {
    			label = element("label");
    			span = element("span");
    			span.textContent = "Select a Country";
    			t1 = space();
    			create_component(select.$$.fragment);
    			add_location(span, file$b, 70, 24, 1855);
    			attr_dev(label, "for", "country");
    			attr_dev(label, "class", "select-label");
    			add_location(label, file$b, 69, 20, 1788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, span);
    			append_dev(label, t1);
    			mount_component(select, label, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};

    			if (!updating_selected && dirty & /*country*/ 32) {
    				updating_selected = true;
    				select_changes.selected = /*country*/ ctx[5];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			destroy_component(select);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(69:16) {:then countriesOptions}",
    		ctx
    	});

    	return block;
    }

    // (67:42)                      <p>Loading countries</p>                 {:then countriesOptions}
    function create_pending_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading countries";
    			add_location(p, file$b, 67, 20, 1701);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(67:42)                      <p>Loading countries</p>                 {:then countriesOptions}",
    		ctx
    	});

    	return block;
    }

    // (97:16) <Button mode="primary" size="large" type="submit">
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Acept");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(97:16) <Button mode=\\\"primary\\\" size=\\\"large\\\" type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (105:4) <Toast isOpen={isToastOpen} type="error">
    function create_default_slot_1$5(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let close;
    	let current;

    	close = new Close({
    			props: { color: "var(--agnostic-error-dark)" },
    			$$inline: true
    		});

    	close.$on("click", /*toastClose*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*errorMessage*/ ctx[1]);
    			t1 = space();
    			create_component(close.$$.fragment);
    			add_location(p, file$b, 106, 12, 3204);
    			attr_dev(div, "class", "toast-content");
    			add_location(div, file$b, 105, 8, 3164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			mount_component(close, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*errorMessage*/ 2) set_data_dev(t0, /*errorMessage*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(close);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(105:4) <Toast isOpen={isToastOpen} type=\\\"error\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:0) <Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
    function create_default_slot$6(ctx) {
    	let toast;
    	let current;

    	toast = new Toast({
    			props: {
    				isOpen: /*isToastOpen*/ ctx[0],
    				type: "error",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toast_changes = {};
    			if (dirty & /*isToastOpen*/ 1) toast_changes.isOpen = /*isToastOpen*/ ctx[0];

    			if (dirty & /*$$scope, errorMessage*/ 65538) {
    				toast_changes.$$scope = { dirty, ctx };
    			}

    			toast.$set(toast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(104:0) <Toasts portalRootSelector=\\\"body\\\" horizontalPosition=\\\"center\\\" verticalPosition=\\\"bottom\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let section;
    	let h2;
    	let t1;
    	let form;
    	let div0;
    	let input0;
    	let updating_value;
    	let t2;
    	let div1;
    	let input1;
    	let updating_value_1;
    	let t3;
    	let div2;
    	let input2;
    	let updating_value_2;
    	let t4;
    	let div3;
    	let t5;
    	let div4;
    	let label;
    	let span;
    	let t7;
    	let select;
    	let updating_selected;
    	let t8;
    	let div5;
    	let button;
    	let t9;
    	let aside;
    	let t10;
    	let toasts;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[9](value);
    	}

    	let input0_props = { label: "Full Name", required: true };

    	if (/*fullname*/ ctx[2] !== void 0) {
    		input0_props.value = /*fullname*/ ctx[2];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[10](value);
    	}

    	let input1_props = {
    		label: "Email",
    		type: "email",
    		required: true
    	};

    	if (/*email*/ ctx[3] !== void 0) {
    		input1_props.value = /*email*/ ctx[3];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[11](value);
    	}

    	let input2_props = {
    		label: "Password",
    		type: "password",
    		required: true,
    		minlength: "8"
    	};

    	if (/*password*/ ctx[4] !== void 0) {
    		input2_props.value = /*password*/ ctx[4];
    	}

    	input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, 'value', input2_value_binding));

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 15,
    		blocks: [,,,]
    	};

    	handle_promise(getAllCountries(), info);

    	function select_selected_binding_1(value) {
    		/*select_selected_binding_1*/ ctx[13](value);
    	}

    	let select_props = {
    		required: true,
    		uniqueId: "kind",
    		options: [
    			{ value: 'owner', label: 'Owner' },
    			{ value: 'veterinary', label: 'Veterinary' }
    		]
    	};

    	if (/*kind*/ ctx[6] !== void 0) {
    		select_props.selected = /*kind*/ ctx[6];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding_1));

    	button = new Button({
    			props: {
    				mode: "primary",
    				size: "large",
    				type: "submit",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	aside = new Aside({ $$inline: true });

    	toasts = new Toasts({
    			props: {
    				portalRootSelector: "body",
    				horizontalPosition: "center",
    				verticalPosition: "bottom",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Register";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			create_component(input0.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(input1.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			create_component(input2.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			info.block.c();
    			t5 = space();
    			div4 = element("div");
    			label = element("label");
    			span = element("span");
    			span.textContent = "Select a Kind";
    			t7 = space();
    			create_component(select.$$.fragment);
    			t8 = space();
    			div5 = element("div");
    			create_component(button.$$.fragment);
    			t9 = space();
    			create_component(aside.$$.fragment);
    			t10 = space();
    			create_component(toasts.$$.fragment);
    			attr_dev(h2, "class", "big-title");
    			add_location(h2, file$b, 54, 8, 1064);
    			attr_dev(div0, "class", "separator-field");
    			add_location(div0, file$b, 56, 12, 1167);
    			attr_dev(div1, "class", "separator-field");
    			add_location(div1, file$b, 59, 12, 1302);
    			attr_dev(div2, "class", "separator-field");
    			add_location(div2, file$b, 62, 12, 1444);
    			attr_dev(div3, "class", "select-wrapper");
    			add_location(div3, file$b, 65, 12, 1609);
    			add_location(span, file$b, 83, 20, 2391);
    			attr_dev(label, "for", "kind");
    			attr_dev(label, "class", "select-label");
    			add_location(label, file$b, 82, 16, 2331);
    			attr_dev(div4, "class", "select-wrapper");
    			add_location(div4, file$b, 81, 12, 2286);
    			attr_dev(div5, "class", "actions");
    			add_location(div5, file$b, 95, 12, 2845);
    			add_location(form, file$b, 55, 8, 1108);
    			add_location(section, file$b, 53, 4, 1046);
    			attr_dev(main, "class", "container mt-1");
    			add_location(main, file$b, 52, 0, 1012);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			append_dev(section, form);
    			append_dev(form, div0);
    			mount_component(input0, div0, null);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			mount_component(input1, div1, null);
    			append_dev(form, t3);
    			append_dev(form, div2);
    			mount_component(input2, div2, null);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			info.block.m(div3, info.anchor = null);
    			info.mount = () => div3;
    			info.anchor = null;
    			append_dev(form, t5);
    			append_dev(form, div4);
    			append_dev(div4, label);
    			append_dev(label, span);
    			append_dev(label, t7);
    			mount_component(select, label, null);
    			append_dev(form, t8);
    			append_dev(form, div5);
    			mount_component(button, div5, null);
    			append_dev(main, t9);
    			mount_component(aside, main, null);
    			insert_dev(target, t10, anchor);
    			mount_component(toasts, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (!updating_value && dirty & /*fullname*/ 4) {
    				updating_value = true;
    				input0_changes.value = /*fullname*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*email*/ 8) {
    				updating_value_1 = true;
    				input1_changes.value = /*email*/ ctx[3];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*password*/ 16) {
    				updating_value_2 = true;
    				input2_changes.value = /*password*/ ctx[4];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			update_await_block_branch(info, ctx, dirty);
    			const select_changes = {};

    			if (!updating_selected && dirty & /*kind*/ 64) {
    				updating_selected = true;
    				select_changes.selected = /*kind*/ ctx[6];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const toasts_changes = {};

    			if (dirty & /*$$scope, isToastOpen, errorMessage*/ 65539) {
    				toasts_changes.$$scope = { dirty, ctx };
    			}

    			toasts.$set(toasts_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(select.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(aside.$$.fragment, local);
    			transition_in(toasts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(select.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(aside.$$.fragment, local);
    			transition_out(toasts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(select);
    			destroy_component(button);
    			destroy_component(aside);
    			if (detaching) detach_dev(t10);
    			destroy_component(toasts, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	let isToastOpen = false;
    	let errorMessage = "";
    	let fullname = "";
    	let email = "";
    	let password = "";
    	let country = "";
    	let kind = "";

    	function toastClose() {
    		$$invalidate(1, errorMessage = "");
    		$$invalidate(0, isToastOpen = false);
    	}

    	function toastOpen(message) {
    		$$invalidate(1, errorMessage = message);
    		$$invalidate(0, isToastOpen = true);
    	}

    	async function handleSubmit() {
    		$$invalidate(1, errorMessage = "");
    		$$invalidate(0, isToastOpen = false);

    		if (!country) {
    			toastOpen("Select a country");
    			return;
    		}

    		if (!kind) {
    			toastOpen("Select a kind");
    			return;
    		}

    		try {
    			await createUser({ fullname, email, password, country, kind });
    			replace("/profile");
    		} catch(err) {
    			toastOpen(err.message);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		fullname = value;
    		$$invalidate(2, fullname);
    	}

    	function input1_value_binding(value) {
    		email = value;
    		$$invalidate(3, email);
    	}

    	function input2_value_binding(value) {
    		password = value;
    		$$invalidate(4, password);
    	}

    	function select_selected_binding(value) {
    		country = value;
    		$$invalidate(5, country);
    	}

    	function select_selected_binding_1(value) {
    		kind = value;
    		$$invalidate(6, kind);
    	}

    	$$self.$capture_state = () => ({
    		Input,
    		Select,
    		Button,
    		Close,
    		Toasts,
    		Toast,
    		replace,
    		Aside,
    		createUser,
    		getAllCountries,
    		isToastOpen,
    		errorMessage,
    		fullname,
    		email,
    		password,
    		country,
    		kind,
    		toastClose,
    		toastOpen,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('isToastOpen' in $$props) $$invalidate(0, isToastOpen = $$props.isToastOpen);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('fullname' in $$props) $$invalidate(2, fullname = $$props.fullname);
    		if ('email' in $$props) $$invalidate(3, email = $$props.email);
    		if ('password' in $$props) $$invalidate(4, password = $$props.password);
    		if ('country' in $$props) $$invalidate(5, country = $$props.country);
    		if ('kind' in $$props) $$invalidate(6, kind = $$props.kind);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isToastOpen,
    		errorMessage,
    		fullname,
    		email,
    		password,
    		country,
    		kind,
    		toastClose,
    		handleSubmit,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		select_selected_binding,
    		select_selected_binding_1
    	];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const COLLECTION_ID = 'pets';

    async function createPet({ userId, name, race, age, description, imageId, imageUrl, isPublic = false }) {
        return await sdk.database.createDocument(COLLECTION_ID, 'unique()', { userId, name, race, description, imageId, imageUrl, isPublic });
    }

    async function getPets(userId, offset = 0, limit = 25) {
        try {
            const reponse = await sdk.database.listDocuments(COLLECTION_ID, [ Query.equal('userId', userId) ], limit, offset);
            return reponse?.documents ?? [];
        } catch {
            return [];
        }
    }

    async function updatePet({ id, name, race, description, imageId, imageUrl, isPublic }) {
        return await sdk.database.updateDocument(COLLECTION_ID, id, { name, race, description, imageId, imageUrl, isPublic });
    }

    async function deletePet(id) {
        return await sdk.database.deleteDocument(COLLECTION_ID, id);
    }

    const BUCKET_ID = "625b7fa68a316d9abb36";

    async function getPetPhotoUrl(imageId) {
        const photo = await sdk.storage.getFilePreview(BUCKET_ID, imageId);
        return photo?.href;
     }
     
    async function uploadPetPhoto(image) {
        const photo = { imageId: null, imageUrl: null };
        if(!image) {
            return photo;
        }

        const bucketFile = await sdk.storage.createFile(BUCKET_ID, 'unique()', image);
        if(!bucketFile) {
            return photo;
        }

        const url = await getPetPhotoUrl(bucketFile.$id);
        photo.imageId = bucketFile.$id;
        photo.imageUrl = url;

        return photo;
    }

    async function deletePhoto(imageId) {
        await sdk.storage.deleteFile(BUCKET_ID, imageId);
    }

    /* src/lib/componentes/LoaderDots.svelte generated by Svelte v3.47.0 */
    const file$a = "src/lib/componentes/LoaderDots.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loader.$$.fragment);
    			attr_dev(div, "class", "loader-dots svelte-1v1udin");
    			add_location(div, file$a, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loader, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoaderDots', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoaderDots> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Loader });
    	return [];
    }

    class LoaderDots extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoaderDots",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/lib/componentes/ToastMultiple.svelte generated by Svelte v3.47.0 */
    const file$9 = "src/lib/componentes/ToastMultiple.svelte";

    // (22:4) <Toast isOpen={successMessage} type="success">
    function create_default_slot_2$3(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let close;
    	let current;

    	close = new Close({
    			props: { color: "var(--agnostic-primary-dark)" },
    			$$inline: true
    		});

    	close.$on("click", function () {
    		if (is_function(/*onCloseSuccessMessage*/ ctx[2])) /*onCloseSuccessMessage*/ ctx[2].apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*successMessage*/ ctx[0]);
    			t1 = space();
    			create_component(close.$$.fragment);
    			add_location(p, file$9, 23, 12, 563);
    			attr_dev(div, "class", "toast-content");
    			add_location(div, file$9, 22, 8, 523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			mount_component(close, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*successMessage*/ 1) set_data_dev(t0, /*successMessage*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(close);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(22:4) <Toast isOpen={successMessage} type=\\\"success\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Toast isOpen={errorMessage} type="error">
    function create_default_slot_1$4(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let close;
    	let current;

    	close = new Close({
    			props: { color: "var(--agnostic-primary-dark)" },
    			$$inline: true
    		});

    	close.$on("click", function () {
    		if (is_function(/*onCloseErrorMessage*/ ctx[3])) /*onCloseErrorMessage*/ ctx[3].apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*errorMessage*/ ctx[1]);
    			t1 = space();
    			create_component(close.$$.fragment);
    			add_location(p, file$9, 28, 8, 762);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(close, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*errorMessage*/ 2) set_data_dev(t0, /*errorMessage*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			destroy_component(close, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(28:4) <Toast isOpen={errorMessage} type=\\\"error\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:0) <Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
    function create_default_slot$5(ctx) {
    	let toast0;
    	let t;
    	let toast1;
    	let current;

    	toast0 = new Toast({
    			props: {
    				isOpen: /*successMessage*/ ctx[0],
    				type: "success",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	toast1 = new Toast({
    			props: {
    				isOpen: /*errorMessage*/ ctx[1],
    				type: "error",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toast0.$$.fragment);
    			t = space();
    			create_component(toast1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toast0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(toast1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toast0_changes = {};
    			if (dirty & /*successMessage*/ 1) toast0_changes.isOpen = /*successMessage*/ ctx[0];

    			if (dirty & /*$$scope, onCloseSuccessMessage, successMessage*/ 21) {
    				toast0_changes.$$scope = { dirty, ctx };
    			}

    			toast0.$set(toast0_changes);
    			const toast1_changes = {};
    			if (dirty & /*errorMessage*/ 2) toast1_changes.isOpen = /*errorMessage*/ ctx[1];

    			if (dirty & /*$$scope, onCloseErrorMessage, errorMessage*/ 26) {
    				toast1_changes.$$scope = { dirty, ctx };
    			}

    			toast1.$set(toast1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toast0.$$.fragment, local);
    			transition_in(toast1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toast0.$$.fragment, local);
    			transition_out(toast1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toast0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(toast1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(21:0) <Toasts portalRootSelector=\\\"body\\\" horizontalPosition=\\\"center\\\" verticalPosition=\\\"bottom\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let toasts;
    	let current;

    	toasts = new Toasts({
    			props: {
    				portalRootSelector: "body",
    				horizontalPosition: "center",
    				verticalPosition: "bottom",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toasts.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(toasts, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const toasts_changes = {};

    			if (dirty & /*$$scope, errorMessage, onCloseErrorMessage, successMessage, onCloseSuccessMessage*/ 31) {
    				toasts_changes.$$scope = { dirty, ctx };
    			}

    			toasts.$set(toasts_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toasts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toasts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toasts, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastMultiple', slots, []);
    	let { successMessage = null } = $$props;
    	let { errorMessage = null } = $$props;
    	let { onCloseSuccessMessage } = $$props;
    	let { onCloseErrorMessage } = $$props;

    	const writable_props = [
    		'successMessage',
    		'errorMessage',
    		'onCloseSuccessMessage',
    		'onCloseErrorMessage'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastMultiple> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('successMessage' in $$props) $$invalidate(0, successMessage = $$props.successMessage);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('onCloseSuccessMessage' in $$props) $$invalidate(2, onCloseSuccessMessage = $$props.onCloseSuccessMessage);
    		if ('onCloseErrorMessage' in $$props) $$invalidate(3, onCloseErrorMessage = $$props.onCloseErrorMessage);
    	};

    	$$self.$capture_state = () => ({
    		Close,
    		Toasts,
    		Toast,
    		successMessage,
    		errorMessage,
    		onCloseSuccessMessage,
    		onCloseErrorMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ('successMessage' in $$props) $$invalidate(0, successMessage = $$props.successMessage);
    		if ('errorMessage' in $$props) $$invalidate(1, errorMessage = $$props.errorMessage);
    		if ('onCloseSuccessMessage' in $$props) $$invalidate(2, onCloseSuccessMessage = $$props.onCloseSuccessMessage);
    		if ('onCloseErrorMessage' in $$props) $$invalidate(3, onCloseErrorMessage = $$props.onCloseErrorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*successMessage, onCloseSuccessMessage, errorMessage, onCloseErrorMessage*/ 15) {
    			{
    				if (successMessage) {
    					setTimeout(onCloseSuccessMessage, 2000);
    				}

    				if (errorMessage) {
    					setTimeout(onCloseErrorMessage, 2000);
    				}
    			}
    		}
    	};

    	return [successMessage, errorMessage, onCloseSuccessMessage, onCloseErrorMessage];
    }

    class ToastMultiple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			successMessage: 0,
    			errorMessage: 1,
    			onCloseSuccessMessage: 2,
    			onCloseErrorMessage: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastMultiple",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onCloseSuccessMessage*/ ctx[2] === undefined && !('onCloseSuccessMessage' in props)) {
    			console.warn("<ToastMultiple> was created without expected prop 'onCloseSuccessMessage'");
    		}

    		if (/*onCloseErrorMessage*/ ctx[3] === undefined && !('onCloseErrorMessage' in props)) {
    			console.warn("<ToastMultiple> was created without expected prop 'onCloseErrorMessage'");
    		}
    	}

    	get successMessage() {
    		throw new Error("<ToastMultiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set successMessage(value) {
    		throw new Error("<ToastMultiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorMessage() {
    		throw new Error("<ToastMultiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<ToastMultiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCloseSuccessMessage() {
    		throw new Error("<ToastMultiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCloseSuccessMessage(value) {
    		throw new Error("<ToastMultiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCloseErrorMessage() {
    		throw new Error("<ToastMultiple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCloseErrorMessage(value) {
    		throw new Error("<ToastMultiple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/cells/CellImage.svelte generated by Svelte v3.47.0 */

    const file$8 = "src/lib/componentes/cells/CellImage.svelte";

    // (5:4) {#if cellValue}
    function create_if_block$6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "width", "65");
    			if (!src_url_equal(img.src, img_src_value = /*cellValue*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$8, 5, 8, 74);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cellValue*/ 1 && !src_url_equal(img.src, img_src_value = /*cellValue*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(5:4) {#if cellValue}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let td;
    	let if_block = /*cellValue*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			add_location(td, file$8, 3, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*cellValue*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
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
    	validate_slots('CellImage', slots, []);
    	let { cellValue } = $$props;
    	const writable_props = ['cellValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CellImage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cellValue' in $$props) $$invalidate(0, cellValue = $$props.cellValue);
    	};

    	$$self.$capture_state = () => ({ cellValue });

    	$$self.$inject_state = $$props => {
    		if ('cellValue' in $$props) $$invalidate(0, cellValue = $$props.cellValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cellValue];
    }

    class CellImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { cellValue: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CellImage",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cellValue*/ ctx[0] === undefined && !('cellValue' in props)) {
    			console.warn("<CellImage> was created without expected prop 'cellValue'");
    		}
    	}

    	get cellValue() {
    		throw new Error("<CellImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cellValue(value) {
    		throw new Error("<CellImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/cells/CellActions.svelte generated by Svelte v3.47.0 */
    const file$7 = "src/lib/componentes/cells/CellActions.svelte";

    // (24:8) <Button              mode="primary"              --agnostic-btn-primary="var(--primary-color)"             --agnostic-focus-ring-outline-color="--primary-outline-color"             on:click={handleEdit}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Edit");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(24:8) <Button              mode=\\\"primary\\\"              --agnostic-btn-primary=\\\"var(--primary-color)\\\"             --agnostic-focus-ring-outline-color=\\\"--primary-outline-color\\\"             on:click={handleEdit}>",
    		ctx
    	});

    	return block;
    }

    // (31:8) <Button isLink on:click={handleDelete}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(31:8) <Button isLink on:click={handleDelete}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let td;
    	let div;
    	let button0;
    	let div_1;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				mode: "primary",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*handleEdit*/ ctx[0]);

    	button1 = new Button({
    			props: {
    				isLink: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*handleDelete*/ ctx[1]);

    	const block = {
    		c: function create() {
    			td = element("td");
    			div = element("div");
    			div_1 = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			set_style(div_1, "display", "contents");
    			set_style(div_1, "--agnostic-btn-primary", "var(--primary-color)");
    			set_style(div_1, "--agnostic-focus-ring-outline-color", "--primary-outline-color");
    			attr_dev(div, "class", "cell-actions svelte-1hzjea1");
    			add_location(div, file$7, 22, 4, 369);
    			add_location(td, file$7, 21, 0, 360);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div);
    			append_dev(div, div_1);
    			mount_component(button0, div_1, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_component(button0);
    			destroy_component(button1);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CellActions', slots, []);
    	let { cellValue } = $$props;
    	const onEdit = getContext('onEdit');
    	const onDelete = getContext('onDelete');

    	function handleEdit() {
    		if (onEdit) {
    			onEdit(cellValue);
    		}
    	}

    	function handleDelete() {
    		if (onDelete) {
    			onDelete(cellValue);
    		}
    	}

    	const writable_props = ['cellValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CellActions> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cellValue' in $$props) $$invalidate(2, cellValue = $$props.cellValue);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		getContext,
    		cellValue,
    		onEdit,
    		onDelete,
    		handleEdit,
    		handleDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('cellValue' in $$props) $$invalidate(2, cellValue = $$props.cellValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleEdit, handleDelete, cellValue];
    }

    class CellActions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { cellValue: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CellActions",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cellValue*/ ctx[2] === undefined && !('cellValue' in props)) {
    			console.warn("<CellActions> was created without expected prop 'cellValue'");
    		}
    	}

    	get cellValue() {
    		throw new Error("<CellActions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cellValue(value) {
    		throw new Error("<CellActions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/Confirm.svelte generated by Svelte v3.47.0 */
    const file$6 = "src/lib/componentes/Confirm.svelte";

    // (41:8) {#if submiting}
    function create_if_block$5(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(41:8) {#if submiting}",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Button type="button" mode="primary" on:click={handleOnAccept} isDisabled={submiting} size="large">
    function create_default_slot_2$2(ctx) {
    	let span;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*submiting*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Acept";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(span, file$6, 39, 8, 797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*submiting*/ ctx[1]) {
    				if (if_block) {
    					if (dirty & /*submiting*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(39:4) <Button type=\\\"button\\\" mode=\\\"primary\\\" on:click={handleOnAccept} isDisabled={submiting} size=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:4) <Button type="button" isLink on:click={handleOnClose} isDisabled={submiting} size="large">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(45:4) <Button type=\\\"button\\\" isLink on:click={handleOnClose} isDisabled={submiting} size=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Dialog closeButtonPosition="center" title="Confirm" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    function create_default_slot$3(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let button0;
    	let t2;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				type: "button",
    				mode: "primary",
    				isDisabled: /*submiting*/ ctx[1],
    				size: "large",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*handleOnAccept*/ ctx[3]);

    	button1 = new Button({
    			props: {
    				type: "button",
    				isLink: true,
    				isDisabled: /*submiting*/ ctx[1],
    				size: "large",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*handleOnClose*/ ctx[4]);

    	const block = {
    		c: function create() {
    			t0 = text(/*message*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "class", "confirm-action svelte-d6y90y");
    			add_location(div, file$6, 37, 3, 656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t2);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*message*/ 1) set_data_dev(t0, /*message*/ ctx[0]);
    			const button0_changes = {};
    			if (dirty & /*submiting*/ 2) button0_changes.isDisabled = /*submiting*/ ctx[1];

    			if (dirty & /*$$scope, submiting*/ 514) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*submiting*/ 2) button1_changes.isDisabled = /*submiting*/ ctx[1];

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(36:0) <Dialog closeButtonPosition=\\\"center\\\" title=\\\"Confirm\\\" dialogRoot=\\\"#dialog-root\\\" on:instance={assignDialogInstance}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog({
    			props: {
    				closeButtonPosition: "center",
    				title: "Confirm",
    				dialogRoot: "#dialog-root",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dialog.$on("instance", /*assignDialogInstance*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialog_changes = {};

    			if (dirty & /*$$scope, submiting, message*/ 515) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
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

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confirm', slots, []);
    	let { open = false } = $$props;
    	let { message = "" } = $$props;
    	let { onAccept } = $$props;
    	let { onClose } = $$props;
    	let { submiting } = $$props;
    	let dialogInstance;

    	function assignDialogInstance(ev) {
    		$$invalidate(8, dialogInstance = ev.detail.instance);
    	}

    	function handleOnAccept() {
    		if (onAccept) {
    			onAccept();
    		}
    	}

    	function handleOnClose() {
    		if (onClose) {
    			onClose();
    		}
    	}

    	const writable_props = ['open', 'message', 'onAccept', 'onClose', 'submiting'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Confirm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(5, open = $$props.open);
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('onAccept' in $$props) $$invalidate(6, onAccept = $$props.onAccept);
    		if ('onClose' in $$props) $$invalidate(7, onClose = $$props.onClose);
    		if ('submiting' in $$props) $$invalidate(1, submiting = $$props.submiting);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Dialog,
    		Loader,
    		open,
    		message,
    		onAccept,
    		onClose,
    		submiting,
    		dialogInstance,
    		assignDialogInstance,
    		handleOnAccept,
    		handleOnClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(5, open = $$props.open);
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('onAccept' in $$props) $$invalidate(6, onAccept = $$props.onAccept);
    		if ('onClose' in $$props) $$invalidate(7, onClose = $$props.onClose);
    		if ('submiting' in $$props) $$invalidate(1, submiting = $$props.submiting);
    		if ('dialogInstance' in $$props) $$invalidate(8, dialogInstance = $$props.dialogInstance);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open, dialogInstance*/ 288) {
    			if (open) {
    				dialogInstance?.show();
    			} else {
    				dialogInstance?.hide();
    			}
    		}
    	};

    	return [
    		message,
    		submiting,
    		assignDialogInstance,
    		handleOnAccept,
    		handleOnClose,
    		open,
    		onAccept,
    		onClose,
    		dialogInstance
    	];
    }

    class Confirm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			open: 5,
    			message: 0,
    			onAccept: 6,
    			onClose: 7,
    			submiting: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirm",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onAccept*/ ctx[6] === undefined && !('onAccept' in props)) {
    			console.warn("<Confirm> was created without expected prop 'onAccept'");
    		}

    		if (/*onClose*/ ctx[7] === undefined && !('onClose' in props)) {
    			console.warn("<Confirm> was created without expected prop 'onClose'");
    		}

    		if (/*submiting*/ ctx[1] === undefined && !('submiting' in props)) {
    			console.warn("<Confirm> was created without expected prop 'submiting'");
    		}
    	}

    	get open() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onAccept() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onAccept(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get submiting() {
    		throw new Error("<Confirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set submiting(value) {
    		throw new Error("<Confirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/profile/TabPets.svelte generated by Svelte v3.47.0 */
    const file_1$1 = "src/lib/componentes/profile/TabPets.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (153:8) {#if userId}
    function create_if_block_3(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				mode: "primary",
    				type: "button",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*openDialogForCreate*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(153:8) {#if userId}",
    		ctx
    	});

    	return block;
    }

    // (154:12) <Button mode="primary" type="button" on:click={openDialogForCreate}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(154:12) <Button mode=\\\"primary\\\" type=\\\"button\\\" on:click={openDialogForCreate}>",
    		ctx
    	});

    	return block;
    }

    // (194:12) {:else}
    function create_else_block$2(ctx) {
    	let p;
    	let t0;
    	let i;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("🐶 ");
    			i = element("i");
    			i.textContent = "No pets yet";
    			add_location(i, file_1$1, 194, 42, 5032);
    			attr_dev(p, "class", "empty-state");
    			add_location(p, file_1$1, 194, 16, 5006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, i);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(194:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (161:12) {#if rows.length}
    function create_if_block_2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				caption: "Yours pets",
    				rows: /*rows*/ ctx[4],
    				headers: [
    					{
    						label: "Image",
    						key: "imageUrl",
    						renderComponent: /*func*/ ctx[18]
    					},
    					{ label: "Name", key: "name" },
    					{ label: "Race", key: "race" },
    					{ label: "Description", key: "description" },
    					{ label: "Public", key: "isPublic" },
    					{
    						label: "Actions",
    						key: "index",
    						renderComponent: /*func_1*/ ctx[19]
    					}
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty[0] & /*rows*/ 16) table_changes.rows = /*rows*/ ctx[4];
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(161:12) {#if rows.length}",
    		ctx
    	});

    	return block;
    }

    // (158:7) {#if loading}
    function create_if_block_1$1(ctx) {
    	let loaderdots;
    	let current;
    	loaderdots = new LoaderDots({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loaderdots.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loaderdots, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loaderdots.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loaderdots.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loaderdots, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(158:7) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (207:12) {#each ["dog", "cat", "bird", "fish", "reptile", "other"] as type}
    function create_each_block$1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*type*/ ctx[36]);
    			t2 = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "race");
    			input.__value = /*type*/ ctx[36];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[22][0].push(input);
    			add_location(input, file_1$1, 208, 20, 5539);
    			add_location(span, file_1$1, 209, 20, 5621);
    			attr_dev(label, "class", "radio-field");
    			add_location(label, file_1$1, 207, 16, 5491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*race*/ ctx[1];
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*race*/ 2) {
    				input.checked = input.__value === /*race*/ ctx[1];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[22][0].splice(/*$$binding_groups*/ ctx[22][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(207:12) {#each [\\\"dog\\\", \\\"cat\\\", \\\"bird\\\", \\\"fish\\\", \\\"reptile\\\", \\\"other\\\"] as type}",
    		ctx
    	});

    	return block;
    }

    // (229:16) {#if submiting}
    function create_if_block$4(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(229:16) {#if submiting}",
    		ctx
    	});

    	return block;
    }

    // (227:12) <Button mode="primary" size="large" type="submit" isDisabled={submiting}>
    function create_default_slot_1$1(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = /*submiting*/ ctx[6] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			t = text("Acept \n                ");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*submiting*/ ctx[6]) {
    				if (if_block) {
    					if (dirty[0] & /*submiting*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(227:12) <Button mode=\\\"primary\\\" size=\\\"large\\\" type=\\\"submit\\\" isDisabled={submiting}>",
    		ctx
    	});

    	return block;
    }

    // (201:0) <Dialog title="Add Pet" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    function create_default_slot$2(ctx) {
    	let form;
    	let div0;
    	let input0;
    	let updating_value;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let input1;
    	let updating_value_1;
    	let t2;
    	let div3;
    	let input2;
    	let t3;
    	let div4;
    	let label;
    	let input3;
    	let t4;
    	let span;
    	let t6;
    	let div5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[20](value);
    	}

    	let input0_props = { label: "Name", required: true };

    	if (/*name*/ ctx[0] !== void 0) {
    		input0_props.value = /*name*/ ctx[0];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));
    	let each_value = ["dog", "cat", "bird", "fish", "reptile", "other"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 6; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[23](value);
    	}

    	let input1_props = {
    		type: "textarea",
    		label: "Description",
    		placeholder: "Color, age, weight, height, characteristics in general",
    		required: true
    	};

    	if (/*description*/ ctx[2] !== void 0) {
    		input1_props.value = /*description*/ ctx[2];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	input2 = new Input({
    			props: {
    				type: "file",
    				accept: "image/*",
    				label: "Image",
    				placeholder: "Image"
    			},
    			$$inline: true
    		});

    	input2.$on("change", /*asignFile*/ ctx[14]);

    	button = new Button({
    			props: {
    				mode: "primary",
    				size: "large",
    				type: "submit",
    				isDisabled: /*submiting*/ ctx[6],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			create_component(input0.$$.fragment);
    			t0 = space();
    			div1 = element("div");

    			for (let i = 0; i < 6; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			create_component(input1.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(input2.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			label = element("label");
    			input3 = element("input");
    			t4 = space();
    			span = element("span");
    			span.textContent = "is public?";
    			t6 = space();
    			div5 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "separator-field");
    			add_location(div0, file_1$1, 202, 8, 5252);
    			attr_dev(div1, "class", "separator-field");
    			add_location(div1, file_1$1, 205, 8, 5366);
    			attr_dev(div2, "class", "separator-field");
    			add_location(div2, file_1$1, 213, 8, 5709);
    			attr_dev(div3, "class", "separator-field");
    			add_location(div3, file_1$1, 216, 8, 5923);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "isPublic");
    			add_location(input3, file_1$1, 221, 16, 6171);
    			add_location(span, file_1$1, 222, 16, 6249);
    			attr_dev(label, "class", "radio-field");
    			add_location(label, file_1$1, 220, 12, 6127);
    			attr_dev(div4, "class", "separator-field");
    			add_location(div4, file_1$1, 219, 8, 6085);
    			attr_dev(div5, "class", "actions");
    			add_location(div5, file_1$1, 225, 8, 6317);
    			add_location(form, file_1$1, 201, 4, 5195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			mount_component(input0, div0, null);
    			append_dev(form, t0);
    			append_dev(form, div1);

    			for (let i = 0; i < 6; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(form, t1);
    			append_dev(form, div2);
    			mount_component(input1, div2, null);
    			append_dev(form, t2);
    			append_dev(form, div3);
    			mount_component(input2, div3, null);
    			append_dev(form, t3);
    			append_dev(form, div4);
    			append_dev(div4, label);
    			append_dev(label, input3);
    			input3.checked = /*isPublic*/ ctx[3];
    			append_dev(label, t4);
    			append_dev(label, span);
    			append_dev(form, t6);
    			append_dev(form, div5);
    			mount_component(button, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[24]),
    					listen_dev(form, "submit", prevent_default(/*createOrUpdate*/ ctx[15]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*name*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);

    			if (dirty[0] & /*race*/ 2) {
    				each_value = ["dog", "cat", "bird", "fish", "reptile", "other"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 6; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < 6; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*description*/ 4) {
    				updating_value_1 = true;
    				input1_changes.value = /*description*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);

    			if (dirty[0] & /*isPublic*/ 8) {
    				input3.checked = /*isPublic*/ ctx[3];
    			}

    			const button_changes = {};
    			if (dirty[0] & /*submiting*/ 64) button_changes.isDisabled = /*submiting*/ ctx[6];

    			if (dirty[0] & /*submiting*/ 64 | dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(input0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(201:0) <Dialog title=\\\"Add Pet\\\" dialogRoot=\\\"#dialog-root\\\" on:instance={assignDialogInstance}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let dialog;
    	let t2;
    	let toastmultiple;
    	let t3;
    	let confirm;
    	let current;
    	let if_block0 = /*userId*/ ctx[10] && create_if_block_3(ctx);
    	const if_block_creators = [create_if_block_1$1, create_if_block_2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[5]) return 0;
    		if (/*rows*/ ctx[4].length) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	dialog = new Dialog({
    			props: {
    				title: "Add Pet",
    				dialogRoot: "#dialog-root",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dialog.$on("instance", /*assignDialogInstance*/ ctx[11]);

    	toastmultiple = new ToastMultiple({
    			props: {
    				successMessage: /*successMessage*/ ctx[7],
    				errorMessage: /*errorMessage*/ ctx[8],
    				onCloseSuccessMessage: /*func_2*/ ctx[25],
    				onCloseErrorMessage: /*func_3*/ ctx[26]
    			},
    			$$inline: true
    		});

    	confirm = new Confirm({
    			props: {
    				message: "Delete sure?",
    				open: /*openConfirm*/ ctx[9],
    				onClose: /*closeConfirm*/ ctx[13],
    				onAccept: /*remove*/ ctx[16],
    				submiting: /*submiting*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if_block1.c();
    			t1 = space();
    			create_component(dialog.$$.fragment);
    			t2 = space();
    			create_component(toastmultiple.$$.fragment);
    			t3 = space();
    			create_component(confirm.$$.fragment);
    			attr_dev(div0, "class", "controls-right");
    			add_location(div0, file_1$1, 151, 4, 3560);
    			add_location(div1, file_1$1, 156, 4, 3732);
    			attr_dev(div2, "class", "p-1 container-white");
    			add_location(div2, file_1$1, 150, 0, 3522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			insert_dev(target, t1, anchor);
    			mount_component(dialog, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(toastmultiple, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(confirm, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*userId*/ ctx[10]) if_block0.p(ctx, dirty);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}

    			const dialog_changes = {};

    			if (dirty[0] & /*submiting, isPublic, description, race, name*/ 79 | dirty[1] & /*$$scope*/ 256) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    			const toastmultiple_changes = {};
    			if (dirty[0] & /*successMessage*/ 128) toastmultiple_changes.successMessage = /*successMessage*/ ctx[7];
    			if (dirty[0] & /*errorMessage*/ 256) toastmultiple_changes.errorMessage = /*errorMessage*/ ctx[8];
    			if (dirty[0] & /*successMessage*/ 128) toastmultiple_changes.onCloseSuccessMessage = /*func_2*/ ctx[25];
    			if (dirty[0] & /*errorMessage*/ 256) toastmultiple_changes.onCloseErrorMessage = /*func_3*/ ctx[26];
    			toastmultiple.$set(toastmultiple_changes);
    			const confirm_changes = {};
    			if (dirty[0] & /*openConfirm*/ 512) confirm_changes.open = /*openConfirm*/ ctx[9];
    			if (dirty[0] & /*submiting*/ 64) confirm_changes.submiting = /*submiting*/ ctx[6];
    			confirm.$set(confirm_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(dialog.$$.fragment, local);
    			transition_in(toastmultiple.$$.fragment, local);
    			transition_in(confirm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(dialog.$$.fragment, local);
    			transition_out(toastmultiple.$$.fragment, local);
    			transition_out(confirm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t1);
    			destroy_component(dialog, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(toastmultiple, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(confirm, detaching);
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
    	validate_slots('TabPets', slots, []);
    	let currentPet = null;
    	let name = "";
    	let race = "";
    	let file = null;
    	let description = "";
    	let isPublic = false;
    	let dialogInstance;
    	let pets = [];
    	let rows = [];
    	let userId = get_store_value(state)?.account?.$id;
    	let loading = true;
    	let submiting = false;
    	let successMessage;
    	let errorMessage;
    	let openConfirm;
    	onMount(loadPets);

    	async function loadPets() {
    		$$invalidate(5, loading = true);
    		$$invalidate(17, pets = await getPets(userId));
    		$$invalidate(5, loading = false);
    	}

    	function assignDialogInstance(ev) {
    		dialogInstance = ev.detail.instance;
    	}

    	function openDialogForCreate() {
    		resetValues();
    		dialogInstance?.show();
    	}

    	function openDialogForEdit(index) {
    		const pet = pets[index];
    		asignValues(pet);
    		dialogInstance?.show();
    	}

    	function closeDialog() {
    		dialogInstance?.hide();
    	}

    	function openConfirmForDelete(index) {
    		const pet = pets[index];
    		currentPet = pet;
    		$$invalidate(9, openConfirm = true);
    	}

    	function closeConfirm() {
    		$$invalidate(9, openConfirm = false);
    	}

    	function asignFile(ev) {
    		file = ev.target.files[0];
    	}

    	function resetValues() {
    		currentPet = null;
    		$$invalidate(0, name = "");
    		$$invalidate(1, race = "");
    		file = null;
    		$$invalidate(2, description = "");
    		$$invalidate(3, isPublic = false);
    	}

    	function asignValues(pet) {
    		currentPet = pet;
    		$$invalidate(0, name = pet.name);
    		$$invalidate(1, race = pet.race);
    		$$invalidate(2, description = pet.description);
    		$$invalidate(3, isPublic = pet.isPublic);
    	}

    	async function createOrUpdate() {
    		$$invalidate(6, submiting = true);
    		$$invalidate(7, successMessage = null);
    		$$invalidate(8, errorMessage = null);

    		try {
    			if (currentPet) {
    				let photo;

    				if (file) {
    					photo = await uploadPetPhoto(file);
    					await deletePhoto(currentPet.imageId);
    				}

    				const id = currentPet.$id;
    				const imageId = photo?.imageId ?? currentPet.imageId;
    				const imageUrl = photo?.imageUrl ?? currentPet.imageUrl;

    				await updatePet({
    					id,
    					name,
    					race,
    					description,
    					imageId,
    					imageUrl,
    					isPublic
    				});

    				$$invalidate(7, successMessage = "Pet update success");
    			} else {
    				const { imageId, imageUrl } = await uploadPetPhoto(file);

    				await createPet({
    					userId,
    					name,
    					race,
    					description,
    					imageId,
    					imageUrl,
    					isPublic
    				});

    				$$invalidate(7, successMessage = "Pet create success");
    			}

    			resetValues();
    			loadPets();
    		} catch(err) {
    			$$invalidate(8, errorMessage = err.message);
    		} finally {
    			$$invalidate(6, submiting = false);
    			closeDialog();
    		}
    	}

    	async function remove() {
    		$$invalidate(6, submiting = true);

    		try {
    			await deletePet(currentPet.$id);
    			currentPet = null;
    			$$invalidate(9, openConfirm = false);
    			await loadPets();
    			$$invalidate(7, successMessage = "Pet delete success");
    		} catch(err) {
    			$$invalidate(8, errorMessage = err.message);
    		} finally {
    			$$invalidate(6, submiting = false);
    		}
    	}

    	setContext('onEdit', openDialogForEdit);
    	setContext('onDelete', openConfirmForDelete);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPets> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];
    	const func = () => CellImage;
    	const func_1 = () => CellActions;

    	function input0_value_binding(value) {
    		name = value;
    		$$invalidate(0, name);
    	}

    	function input_change_handler() {
    		race = this.__value;
    		$$invalidate(1, race);
    	}

    	function input1_value_binding(value) {
    		description = value;
    		$$invalidate(2, description);
    	}

    	function input3_change_handler() {
    		isPublic = this.checked;
    		$$invalidate(3, isPublic);
    	}

    	const func_2 = _ => {
    		$$invalidate(7, successMessage = null);
    	};

    	const func_3 = _ => {
    		$$invalidate(8, errorMessage = null);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Dialog,
    		Input,
    		Loader,
    		Table,
    		onMount,
    		setContext,
    		get: get_store_value,
    		createPet,
    		deletePet,
    		getPets,
    		updatePet,
    		deletePhoto,
    		uploadPetPhoto,
    		state,
    		LoaderDots,
    		ToastMultiple,
    		CellImage,
    		CellActions,
    		Confirm,
    		currentPet,
    		name,
    		race,
    		file,
    		description,
    		isPublic,
    		dialogInstance,
    		pets,
    		rows,
    		userId,
    		loading,
    		submiting,
    		successMessage,
    		errorMessage,
    		openConfirm,
    		loadPets,
    		assignDialogInstance,
    		openDialogForCreate,
    		openDialogForEdit,
    		closeDialog,
    		openConfirmForDelete,
    		closeConfirm,
    		asignFile,
    		resetValues,
    		asignValues,
    		createOrUpdate,
    		remove
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPet' in $$props) currentPet = $$props.currentPet;
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('race' in $$props) $$invalidate(1, race = $$props.race);
    		if ('file' in $$props) file = $$props.file;
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('isPublic' in $$props) $$invalidate(3, isPublic = $$props.isPublic);
    		if ('dialogInstance' in $$props) dialogInstance = $$props.dialogInstance;
    		if ('pets' in $$props) $$invalidate(17, pets = $$props.pets);
    		if ('rows' in $$props) $$invalidate(4, rows = $$props.rows);
    		if ('userId' in $$props) $$invalidate(10, userId = $$props.userId);
    		if ('loading' in $$props) $$invalidate(5, loading = $$props.loading);
    		if ('submiting' in $$props) $$invalidate(6, submiting = $$props.submiting);
    		if ('successMessage' in $$props) $$invalidate(7, successMessage = $$props.successMessage);
    		if ('errorMessage' in $$props) $$invalidate(8, errorMessage = $$props.errorMessage);
    		if ('openConfirm' in $$props) $$invalidate(9, openConfirm = $$props.openConfirm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*pets*/ 131072) {
    			{
    				$$invalidate(4, rows = pets.map(({ imageUrl, name, race, description, isPublic }, index) => ({
    					imageUrl,
    					name,
    					race,
    					description,
    					isPublic,
    					index
    				})));
    			}
    		}
    	};

    	return [
    		name,
    		race,
    		description,
    		isPublic,
    		rows,
    		loading,
    		submiting,
    		successMessage,
    		errorMessage,
    		openConfirm,
    		userId,
    		assignDialogInstance,
    		openDialogForCreate,
    		closeConfirm,
    		asignFile,
    		createOrUpdate,
    		remove,
    		pets,
    		func,
    		func_1,
    		input0_value_binding,
    		input_change_handler,
    		$$binding_groups,
    		input1_value_binding,
    		input3_change_handler,
    		func_2,
    		func_3
    	];
    }

    class TabPets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPets",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }
    function getMonthLength(year, month) {
        const feb = isLeapYear(year) ? 29 : 28;
        const monthLenghts = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthLenghts[month];
    }
    function toText(date, formatTokens) {
        let text = '';
        if (date) {
            for (const token of formatTokens) {
                if (typeof token === 'string') {
                    text += token;
                }
                else {
                    text += token.toString(date);
                }
            }
        }
        return text;
    }
    function getMonthDays(year, month) {
        const monthLength = getMonthLength(year, month);
        const days = [];
        for (let i = 0; i < monthLength; i++) {
            days.push({
                year: year,
                month: month,
                number: i + 1,
            });
        }
        return days;
    }
    function getCalendarDays(value, weekStartsOn) {
        const year = value.getFullYear();
        const month = value.getMonth();
        const firstWeekday = new Date(year, month, 1).getDay();
        let days = [];
        // add last month
        const daysBefore = (firstWeekday - weekStartsOn + 7) % 7;
        if (daysBefore > 0) {
            let lastMonth = month - 1;
            let lastMonthYear = year;
            if (lastMonth === -1) {
                lastMonth = 11;
                lastMonthYear = year - 1;
            }
            days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore);
        }
        // add current month
        days = days.concat(getMonthDays(year, month));
        // add next month
        let nextMonth = month + 1;
        let nextMonthYear = year;
        if (nextMonth === 12) {
            nextMonth = 0;
            nextMonthYear = year + 1;
        }
        const daysAfter = 42 - days.length;
        days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter));
        return days;
    }

    function getLocaleDefaults() {
        return {
            weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
            weekStartsOn: 1,
        };
    }
    function getInnerLocale(locale = {}) {
        const innerLocale = getLocaleDefaults();
        if (typeof locale.weekStartsOn === 'number') {
            innerLocale.weekStartsOn = locale.weekStartsOn;
        }
        if (locale.months)
            innerLocale.months = locale.months;
        if (locale.weekdays)
            innerLocale.weekdays = locale.weekdays;
        return innerLocale;
    }

    /* node_modules/date-picker-svelte/DatePicker.svelte generated by Svelte v3.47.0 */
    const file$5 = "node_modules/date-picker-svelte/DatePicker.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    // (229:10) {#each iLocale.months as monthName, i}
    function create_each_block_6(ctx) {
    	let option;
    	let t_value = /*monthName*/ ctx[46] + "";
    	let t;
    	let option_disabled_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.disabled = option_disabled_value = new Date(/*year*/ ctx[2], /*i*/ ctx[40], getMonthLength(/*year*/ ctx[2], /*i*/ ctx[40]), 23, 59, 59, 999) < /*min*/ ctx[0] || new Date(/*year*/ ctx[2], /*i*/ ctx[40]) > /*max*/ ctx[1];
    			option.__value = /*i*/ ctx[40];
    			option.value = option.__value;
    			add_location(option, file$5, 229, 12, 6832);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iLocale*/ 16 && t_value !== (t_value = /*monthName*/ ctx[46] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*year, min, max, years*/ 39 && option_disabled_value !== (option_disabled_value = new Date(/*year*/ ctx[2], /*i*/ ctx[40], getMonthLength(/*year*/ ctx[2], /*i*/ ctx[40]), 23, 59, 59, 999) < /*min*/ ctx[0] || new Date(/*year*/ ctx[2], /*i*/ ctx[40]) > /*max*/ ctx[1])) {
    				prop_dev(option, "disabled", option_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(229:10) {#each iLocale.months as monthName, i}",
    		ctx
    	});

    	return block;
    }

    // (245:10) {#each iLocale.months as monthName, i}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*monthName*/ ctx[46] + "";
    	let t;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*i*/ ctx[40];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*i*/ ctx[40] === /*month*/ ctx[3];
    			add_location(option, file$5, 245, 12, 7666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iLocale*/ 16 && t_value !== (t_value = /*monthName*/ ctx[46] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*month*/ 8 && option_selected_value !== (option_selected_value = /*i*/ ctx[40] === /*month*/ ctx[3])) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(245:10) {#each iLocale.months as monthName, i}",
    		ctx
    	});

    	return block;
    }

    // (255:10) {#each years as v}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*v*/ ctx[41] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*v*/ ctx[41];
    			option.value = option.__value;
    			add_location(option, file$5, 255, 12, 8091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 32 && t_value !== (t_value = /*v*/ ctx[41] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 32 && option_value_value !== (option_value_value = /*v*/ ctx[41])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(255:10) {#each years as v}",
    		ctx
    	});

    	return block;
    }

    // (261:10) {#each years as v}
    function create_each_block_3(ctx) {
    	let option;
    	let t_value = /*v*/ ctx[41] + "";
    	let t;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*v*/ ctx[41];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*v*/ ctx[41] === /*year*/ ctx[2];
    			add_location(option, file$5, 261, 12, 8319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 32 && t_value !== (t_value = /*v*/ ctx[41] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 32 && option_value_value !== (option_value_value = /*v*/ ctx[41])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*years, year*/ 36 && option_selected_value !== (option_selected_value = /*v*/ ctx[41] === /*year*/ ctx[2])) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(261:10) {#each years as v}",
    		ctx
    	});

    	return block;
    }

    // (279:8) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t_value = /*iLocale*/ ctx[4].weekdays[/*iLocale*/ ctx[4].weekStartsOn + /*i*/ ctx[40] - 7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "header-cell svelte-w595t7");
    			add_location(div, file$5, 279, 10, 9094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iLocale*/ 16 && t_value !== (t_value = /*iLocale*/ ctx[4].weekdays[/*iLocale*/ ctx[4].weekStartsOn + /*i*/ ctx[40] - 7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(279:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (277:8) {#if i + iLocale.weekStartsOn < 7}
    function create_if_block$3(ctx) {
    	let div;
    	let t_value = /*iLocale*/ ctx[4].weekdays[/*iLocale*/ ctx[4].weekStartsOn + /*i*/ ctx[40]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "header-cell svelte-w595t7");
    			add_location(div, file$5, 277, 10, 8992);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iLocale*/ 16 && t_value !== (t_value = /*iLocale*/ ctx[4].weekdays[/*iLocale*/ ctx[4].weekStartsOn + /*i*/ ctx[40]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(277:8) {#if i + iLocale.weekStartsOn < 7}",
    		ctx
    	});

    	return block;
    }

    // (276:6) {#each Array(7) as _, i}
    function create_each_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[40] + /*iLocale*/ ctx[4].weekStartsOn < 7) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(276:6) {#each Array(7) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (286:8) {#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}
    function create_each_block_1(ctx) {
    	let div;
    	let span;
    	let t_value = /*calendarDay*/ ctx[36].number + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[21](/*calendarDay*/ ctx[36]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-w595t7");
    			add_location(span, file$5, 293, 12, 9695);
    			attr_dev(div, "class", "cell svelte-w595t7");
    			toggle_class(div, "disabled", !dayIsInRange(/*calendarDay*/ ctx[36], /*min*/ ctx[0], /*max*/ ctx[1]));
    			toggle_class(div, "selected", /*calendarDay*/ ctx[36].month === /*month*/ ctx[3] && /*calendarDay*/ ctx[36].number === /*dayOfMonth*/ ctx[6]);
    			toggle_class(div, "other-month", /*calendarDay*/ ctx[36].month !== /*month*/ ctx[3]);
    			add_location(div, file$5, 286, 10, 9369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*calendarDays*/ 128 && t_value !== (t_value = /*calendarDay*/ ctx[36].number + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*calendarDays, min, max*/ 131) {
    				toggle_class(div, "disabled", !dayIsInRange(/*calendarDay*/ ctx[36], /*min*/ ctx[0], /*max*/ ctx[1]));
    			}

    			if (dirty[0] & /*calendarDays, month, dayOfMonth*/ 200) {
    				toggle_class(div, "selected", /*calendarDay*/ ctx[36].month === /*month*/ ctx[3] && /*calendarDay*/ ctx[36].number === /*dayOfMonth*/ ctx[6]);
    			}

    			if (dirty[0] & /*calendarDays, month*/ 136) {
    				toggle_class(div, "other-month", /*calendarDay*/ ctx[36].month !== /*month*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(286:8) {#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay}",
    		ctx
    	});

    	return block;
    }

    // (284:4) {#each Array(6) as _, weekIndex}
    function create_each_block(ctx) {
    	let div;
    	let t;
    	let each_value_1 = /*calendarDays*/ ctx[7].slice(/*weekIndex*/ ctx[35] * 7, /*weekIndex*/ ctx[35] * 7 + 7);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "week svelte-w595t7");
    			add_location(div, file$5, 284, 6, 9256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*calendarDays, min, max, month, dayOfMonth, selectDay*/ 715) {
    				each_value_1 = /*calendarDays*/ ctx[7].slice(/*weekIndex*/ ctx[35] * 7, /*weekIndex*/ ctx[35] * 7 + 7);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(284:4) {#each Array(6) as _, weekIndex}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div7;
    	let div6;
    	let div4;
    	let div0;
    	let svg0;
    	let path0;
    	let t0;
    	let div1;
    	let select0;
    	let t1;
    	let select1;
    	let t2;
    	let svg1;
    	let path1;
    	let t3;
    	let div2;
    	let select2;
    	let t4;
    	let select3;
    	let t5;
    	let svg2;
    	let path2;
    	let t6;
    	let div3;
    	let svg3;
    	let path3;
    	let t7;
    	let div5;
    	let t8;
    	let mounted;
    	let dispose;
    	let each_value_6 = /*iLocale*/ ctx[4].months;
    	validate_each_argument(each_value_6);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_5[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	let each_value_5 = /*iLocale*/ ctx[4].months;
    	validate_each_argument(each_value_5);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_4[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*years*/ ctx[5];
    	validate_each_argument(each_value_4);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_3[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*years*/ ctx[5];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = Array(7);
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = Array(6);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div1 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			t1 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t2 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			select2 = element("select");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t4 = space();
    			select3 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t5 = space();
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t6 = space();
    			div3 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t7 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(path0, "d", "M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z");
    			attr_dev(path0, "transform", "rotate(180, 12, 12)");
    			add_location(path0, file$5, 220, 11, 6521);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "class", "svelte-w595t7");
    			add_location(svg0, file$5, 219, 8, 6427);
    			attr_dev(div0, "class", "page-button svelte-w595t7");
    			attr_dev(div0, "tabindex", "-1");
    			add_location(div0, file$5, 218, 6, 6342);
    			attr_dev(select0, "class", "svelte-w595t7");
    			if (/*month*/ ctx[3] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[18].call(select0));
    			add_location(select0, file$5, 227, 8, 6717);
    			attr_dev(select1, "class", "dummy-select svelte-w595t7");
    			attr_dev(select1, "tabindex", "-1");
    			add_location(select1, file$5, 243, 8, 7561);
    			attr_dev(path1, "d", "M6 0l12 12-12 12z");
    			attr_dev(path1, "transform", "rotate(90, 12, 12)");
    			add_location(path1, file$5, 249, 11, 7866);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "24");
    			attr_dev(svg1, "height", "24");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "class", "svelte-w595t7");
    			add_location(svg1, file$5, 248, 8, 7772);
    			attr_dev(div1, "class", "dropdown month svelte-w595t7");
    			add_location(div1, file$5, 226, 6, 6680);
    			attr_dev(select2, "class", "svelte-w595t7");
    			if (/*year*/ ctx[2] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[19].call(select2));
    			add_location(select2, file$5, 253, 8, 7998);
    			attr_dev(select3, "class", "dummy-select svelte-w595t7");
    			attr_dev(select3, "tabindex", "-1");
    			add_location(select3, file$5, 259, 8, 8234);
    			attr_dev(path2, "d", "M6 0l12 12-12 12z");
    			attr_dev(path2, "transform", "rotate(90, 12, 12)");
    			add_location(path2, file$5, 265, 11, 8510);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "24");
    			attr_dev(svg2, "height", "24");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "class", "svelte-w595t7");
    			add_location(svg2, file$5, 264, 8, 8416);
    			attr_dev(div2, "class", "dropdown year svelte-w595t7");
    			add_location(div2, file$5, 252, 6, 7962);
    			attr_dev(path3, "d", "M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z");
    			add_location(path3, file$5, 270, 11, 8785);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "width", "24");
    			attr_dev(svg3, "height", "24");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "class", "svelte-w595t7");
    			add_location(svg3, file$5, 269, 8, 8691);
    			attr_dev(div3, "class", "page-button svelte-w595t7");
    			attr_dev(div3, "tabindex", "-1");
    			add_location(div3, file$5, 268, 6, 8606);
    			attr_dev(div4, "class", "top svelte-w595t7");
    			add_location(div4, file$5, 217, 4, 6318);
    			attr_dev(div5, "class", "header svelte-w595t7");
    			add_location(div5, file$5, 274, 4, 8887);
    			attr_dev(div6, "class", "tab-container svelte-w595t7");
    			attr_dev(div6, "tabindex", "-1");
    			add_location(div6, file$5, 216, 2, 6272);
    			attr_dev(div7, "class", "date-time-picker svelte-w595t7");
    			attr_dev(div7, "tabindex", "0");
    			add_location(div7, file$5, 215, 0, 6193);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, select0);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].m(select0, null);
    			}

    			select_option(select0, /*month*/ ctx[3]);
    			append_dev(div1, t1);
    			append_dev(div1, select1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(select1, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, select2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(select2, null);
    			}

    			select_option(select2, /*year*/ ctx[2]);
    			append_dev(div2, t4);
    			append_dev(div2, select3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select3, null);
    			}

    			append_dev(div2, t5);
    			append_dev(div2, svg2);
    			append_dev(svg2, path2);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, svg3);
    			append_dev(svg3, path3);
    			append_dev(div6, t7);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div6, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[18]),
    					listen_dev(select0, "keydown", /*monthKeydown*/ ctx[11], false, false, false),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[19]),
    					listen_dev(select2, "keydown", /*yearKeydown*/ ctx[10], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[20], false, false, false),
    					listen_dev(div7, "focusout", /*focusout_handler*/ ctx[16], false, false, false),
    					listen_dev(div7, "keydown", /*keydown*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*year, min, max, iLocale*/ 23) {
    				each_value_6 = /*iLocale*/ ctx[4].months;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_6(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_6.length;
    			}

    			if (dirty[0] & /*month*/ 8) {
    				select_option(select0, /*month*/ ctx[3]);
    			}

    			if (dirty[0] & /*month, iLocale*/ 24) {
    				each_value_5 = /*iLocale*/ ctx[4].months;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_5(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_5.length;
    			}

    			if (dirty[0] & /*years*/ 32) {
    				each_value_4 = /*years*/ ctx[5];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_4(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_4.length;
    			}

    			if (dirty[0] & /*year, years*/ 36) {
    				select_option(select2, /*year*/ ctx[2]);
    			}

    			if (dirty[0] & /*years, year*/ 36) {
    				each_value_3 = /*years*/ ctx[5];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select3, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty[0] & /*iLocale*/ 16) {
    				each_value_2 = Array(7);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*calendarDays, min, max, month, dayOfMonth, selectDay*/ 715) {
    				each_value = Array(6);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function dayIsInRange(calendarDay, min, max) {
    	const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number);
    	const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    	const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate());
    	return date >= minDate && date <= maxDate;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let iLocale;
    	let calendarDays;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DatePicker', slots, []);
    	const dispatch = createEventDispatcher();
    	let { value = null } = $$props;

    	function setValue(d) {
    		if (d.getTime() !== (value === null || value === void 0
    		? void 0
    		: value.getTime())) {
    			$$invalidate(13, value = d);
    		}
    	}

    	function updateValue(updater) {
    		const newValue = updater(new Date(shownDate.getTime()));
    		setValue(newValue);
    	}

    	/** Default Date to use */
    	const defaultDate = new Date();

    	/** The date shown in the popup, for when `value` is null */
    	let shownDate = value !== null && value !== void 0 ? value : defaultDate;

    	/** Update the shownDate. The date is only selected if a date is already selected */
    	function updateShownDate(updater) {
    		$$invalidate(15, shownDate = updater(new Date(shownDate.getTime())));

    		if (value && shownDate.getTime() !== value.getTime()) {
    			setValue(shownDate);
    		}
    	}

    	let { min = new Date(defaultDate.getFullYear() - 20, 0, 1) } = $$props;
    	let { max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999) } = $$props;
    	let years = getYears(min, max);

    	function getYears(min, max) {
    		let years = [];

    		for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
    			years.push(i);
    		}

    		return years;
    	}

    	let { locale = {} } = $$props;
    	let year = shownDate.getFullYear();
    	const getYear = tmpPickerDate => $$invalidate(2, year = tmpPickerDate.getFullYear());

    	function setYear(year) {
    		updateShownDate(tmpPickerDate => {
    			tmpPickerDate.setFullYear(year);
    			return tmpPickerDate;
    		});
    	}

    	let month = shownDate.getMonth();
    	const getMonth = tmpPickerDate => $$invalidate(3, month = tmpPickerDate.getMonth());

    	function setMonth(month) {
    		let newYear = year;
    		let newMonth = month;

    		if (month === 12) {
    			newMonth = 0;
    			newYear++;
    		} else if (month === -1) {
    			newMonth = 11;
    			newYear--;
    		}

    		const maxDate = getMonthLength(newYear, newMonth);
    		const newDate = Math.min(shownDate.getDate(), maxDate);

    		updateShownDate(date => {
    			return new Date(newYear, newMonth, newDate, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    		});
    	}

    	let dayOfMonth = (value === null || value === void 0
    	? void 0
    	: value.getDate()) || null;

    	function setDay(calendarDay) {
    		if (dayIsInRange(calendarDay, min, max)) {
    			updateValue(value => {
    				value.setFullYear(0);
    				value.setMonth(0);
    				value.setDate(1);
    				value.setFullYear(calendarDay.year);
    				value.setMonth(calendarDay.month);
    				value.setDate(calendarDay.number);
    				return value;
    			});
    		}
    	}

    	function selectDay(calendarDay) {
    		setDay(calendarDay);
    		dispatch('select');
    	}

    	function shiftKeydown(e) {
    		if (e.shiftKey && e.key === 'ArrowUp') {
    			setYear(year - 1);
    		} else if (e.shiftKey && e.key === 'ArrowDown') {
    			setYear(year + 1);
    		} else if (e.shiftKey && e.key === 'ArrowLeft') {
    			setMonth(month - 1);
    		} else if (e.shiftKey && e.key === 'ArrowRight') {
    			setMonth(month + 1);
    		} else {
    			return false;
    		}

    		e.preventDefault();
    		return true;
    	}

    	function yearKeydown(e) {
    		let shift = e.shiftKey || e.altKey;

    		if (shift) {
    			shiftKeydown(e);
    			return;
    		} else if (e.key === 'ArrowUp') {
    			setYear(year - 1);
    		} else if (e.key === 'ArrowDown') {
    			setYear(year + 1);
    		} else if (e.key === 'ArrowLeft') {
    			setMonth(month - 1);
    		} else if (e.key === 'ArrowRight') {
    			setMonth(month + 1);
    		} else {
    			shiftKeydown(e);
    			return;
    		}

    		e.preventDefault();
    	}

    	function monthKeydown(e) {
    		let shift = e.shiftKey || e.altKey;

    		if (shift) {
    			shiftKeydown(e);
    			return;
    		} else if (e.key === 'ArrowUp') {
    			setMonth(month - 1);
    		} else if (e.key === 'ArrowDown') {
    			setMonth(month + 1);
    		} else if (e.key === 'ArrowLeft') {
    			setMonth(month - 1);
    		} else if (e.key === 'ArrowRight') {
    			setMonth(month + 1);
    		} else {
    			shiftKeydown(e);
    			return;
    		}

    		e.preventDefault();
    	}

    	function keydown(e) {
    		var _a;
    		let shift = e.shiftKey || e.altKey;

    		if (((_a = e.target) === null || _a === void 0
    		? void 0
    		: _a.tagName) === 'SELECT') {
    			return;
    		}

    		if (shift) {
    			shiftKeydown(e);
    			return;
    		} else if (e.key === 'ArrowUp') {
    			updateValue(value => {
    				value.setDate(value.getDate() - 7);
    				return value;
    			});
    		} else if (e.key === 'ArrowDown') {
    			updateValue(value => {
    				value.setDate(value.getDate() + 7);
    				return value;
    			});
    		} else if (e.key === 'ArrowLeft') {
    			updateValue(value => {
    				value.setDate(value.getDate() - 1);
    				return value;
    			});
    		} else if (e.key === 'ArrowRight') {
    			updateValue(value => {
    				value.setDate(value.getDate() + 1);
    				return value;
    			});
    		} else {
    			return;
    		}

    		e.preventDefault();
    	}

    	const writable_props = ['value', 'min', 'max', 'locale'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DatePicker> was created with unknown prop '${key}'`);
    	});

    	function focusout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => setMonth(month - 1);

    	function select0_change_handler() {
    		month = select_value(this);
    		$$invalidate(3, month);
    	}

    	function select2_change_handler() {
    		year = select_value(this);
    		$$invalidate(2, year);
    		(($$invalidate(5, years), $$invalidate(0, min)), $$invalidate(1, max));
    	}

    	const click_handler_1 = () => setMonth(month + 1);
    	const click_handler_2 = calendarDay => selectDay(calendarDay);

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(13, value = $$props.value);
    		if ('min' in $$props) $$invalidate(0, min = $$props.min);
    		if ('max' in $$props) $$invalidate(1, max = $$props.max);
    		if ('locale' in $$props) $$invalidate(14, locale = $$props.locale);
    	};

    	$$self.$capture_state = () => ({
    		getMonthLength,
    		getCalendarDays,
    		getInnerLocale,
    		createEventDispatcher,
    		dispatch,
    		value,
    		setValue,
    		updateValue,
    		defaultDate,
    		shownDate,
    		updateShownDate,
    		min,
    		max,
    		years,
    		getYears,
    		locale,
    		year,
    		getYear,
    		setYear,
    		month,
    		getMonth,
    		setMonth,
    		dayOfMonth,
    		setDay,
    		selectDay,
    		dayIsInRange,
    		shiftKeydown,
    		yearKeydown,
    		monthKeydown,
    		keydown,
    		iLocale,
    		calendarDays
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(13, value = $$props.value);
    		if ('shownDate' in $$props) $$invalidate(15, shownDate = $$props.shownDate);
    		if ('min' in $$props) $$invalidate(0, min = $$props.min);
    		if ('max' in $$props) $$invalidate(1, max = $$props.max);
    		if ('years' in $$props) $$invalidate(5, years = $$props.years);
    		if ('locale' in $$props) $$invalidate(14, locale = $$props.locale);
    		if ('year' in $$props) $$invalidate(2, year = $$props.year);
    		if ('month' in $$props) $$invalidate(3, month = $$props.month);
    		if ('dayOfMonth' in $$props) $$invalidate(6, dayOfMonth = $$props.dayOfMonth);
    		if ('iLocale' in $$props) $$invalidate(4, iLocale = $$props.iLocale);
    		if ('calendarDays' in $$props) $$invalidate(7, calendarDays = $$props.calendarDays);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 8192) {
    			if (value) $$invalidate(15, shownDate = value);
    		}

    		if ($$self.$$.dirty[0] & /*min, max*/ 3) {
    			$$invalidate(5, years = getYears(min, max));
    		}

    		if ($$self.$$.dirty[0] & /*shownDate, max, min*/ 32771) {
    			if (shownDate > max) {
    				updateShownDate(() => max);
    			} else if (shownDate < min) {
    				updateShownDate(() => min);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*locale*/ 16384) {
    			$$invalidate(4, iLocale = getInnerLocale(locale));
    		}

    		if ($$self.$$.dirty[0] & /*shownDate*/ 32768) {
    			getYear(shownDate);
    		}

    		if ($$self.$$.dirty[0] & /*year*/ 4) {
    			setYear(year);
    		}

    		if ($$self.$$.dirty[0] & /*shownDate*/ 32768) {
    			getMonth(shownDate);
    		}

    		if ($$self.$$.dirty[0] & /*month*/ 8) {
    			setMonth(month);
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 8192) {
    			$$invalidate(6, dayOfMonth = (value === null || value === void 0
    			? void 0
    			: value.getDate()) || null);
    		}

    		if ($$self.$$.dirty[0] & /*shownDate, iLocale*/ 32784) {
    			$$invalidate(7, calendarDays = getCalendarDays(shownDate, iLocale.weekStartsOn));
    		}
    	};

    	return [
    		min,
    		max,
    		year,
    		month,
    		iLocale,
    		years,
    		dayOfMonth,
    		calendarDays,
    		setMonth,
    		selectDay,
    		yearKeydown,
    		monthKeydown,
    		keydown,
    		value,
    		locale,
    		shownDate,
    		focusout_handler,
    		click_handler,
    		select0_change_handler,
    		select2_change_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DatePicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 13, min: 0, max: 1, locale: 14 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DatePicker",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get value() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<DatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<DatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /** Parse a string according to the supplied format tokens. Returns a date if successful, and the missing punctuation if there is any that should be after the string */
    function parse(str, tokens, baseDate) {
        let missingPunctuation = '';
        let valid = true;
        baseDate = baseDate || new Date(2020, 0, 1, 0, 0, 0, 0);
        let year = baseDate.getFullYear();
        let month = baseDate.getMonth();
        let day = baseDate.getDate();
        let hours = baseDate.getHours();
        let minutes = baseDate.getMinutes();
        let seconds = baseDate.getSeconds();
        const ms = baseDate.getMilliseconds();
        function parseString(token) {
            for (let i = 0; i < token.length; i++) {
                if (str.startsWith(token[i])) {
                    str = str.slice(1);
                }
                else {
                    valid = false;
                    if (str.length === 0)
                        missingPunctuation = token.slice(i);
                    return;
                }
            }
        }
        function parseUint(pattern, min, max) {
            const matches = str.match(pattern);
            if (matches === null || matches === void 0 ? void 0 : matches[0]) {
                str = str.slice(matches[0].length);
                const n = parseInt(matches[0]);
                if (n > max || n < min) {
                    valid = false;
                    return null;
                }
                else {
                    return n;
                }
            }
            else {
                valid = false;
                return null;
            }
        }
        function parseToken(token) {
            if (typeof token === 'string') {
                parseString(token);
            }
            else if (token.id === 'yyyy') {
                const value = parseUint(/^[0-9]{4}/, 0, 9999);
                if (value !== null)
                    year = value;
            }
            else if (token.id === 'MM') {
                const value = parseUint(/^[0-9]{2}/, 1, 12);
                if (value !== null)
                    month = value - 1;
            }
            else if (token.id === 'dd') {
                const value = parseUint(/^[0-9]{2}/, 1, 31);
                if (value !== null)
                    day = value;
            }
            else if (token.id === 'HH') {
                const value = parseUint(/^[0-9]{2}/, 0, 23);
                if (value !== null)
                    hours = value;
            }
            else if (token.id === 'mm') {
                const value = parseUint(/^[0-9]{2}/, 0, 59);
                if (value !== null)
                    minutes = value;
            }
            else if (token.id === 'ss') {
                const value = parseUint(/^[0-9]{2}/, 0, 59);
                if (value !== null)
                    seconds = value;
            }
        }
        for (const token of tokens) {
            parseToken(token);
            if (!valid)
                break;
        }
        const monthLength = getMonthLength(year, month);
        if (day > monthLength) {
            valid = false;
        }
        return {
            date: valid ? new Date(year, month, day, hours, minutes, seconds, ms) : null,
            missingPunctuation: missingPunctuation,
        };
    }
    function twoDigit(value) {
        return ('0' + value.toString()).slice(-2);
    }
    const ruleTokens = [
        {
            id: 'yyyy',
            toString: (d) => d.getFullYear().toString(),
        },
        {
            id: 'MM',
            toString: (d) => twoDigit(d.getMonth() + 1),
        },
        {
            id: 'dd',
            toString: (d) => twoDigit(d.getDate()),
        },
        {
            id: 'HH',
            toString: (d) => twoDigit(d.getHours()),
        },
        {
            id: 'mm',
            toString: (d) => twoDigit(d.getMinutes()),
        },
        {
            id: 'ss',
            toString: (d) => twoDigit(d.getSeconds()),
        },
    ];
    function parseRule(s) {
        for (const token of ruleTokens) {
            if (s.startsWith(token.id)) {
                return token;
            }
        }
    }
    function createFormat(s) {
        const tokens = [];
        while (s.length > 0) {
            const token = parseRule(s);
            if (token) {
                // parsed a token like "yyyy"
                tokens.push(token);
                s = s.slice(token.id.length);
            }
            else if (typeof tokens[tokens.length - 1] === 'string') {
                // last token is a string token, so append to it
                tokens[tokens.length - 1] += s[0];
                s = s.slice(1);
            }
            else {
                // add string token
                tokens.push(s[0]);
                s = s.slice(1);
            }
        }
        return tokens;
    }

    /* node_modules/date-picker-svelte/DateInput.svelte generated by Svelte v3.47.0 */
    const file$4 = "node_modules/date-picker-svelte/DateInput.svelte";

    // (134:2) {#if visible}
    function create_if_block$2(ctx) {
    	let div;
    	let datetimepicker;
    	let updating_value;
    	let div_transition;
    	let current;

    	function datetimepicker_value_binding(value) {
    		/*datetimepicker_value_binding*/ ctx[22](value);
    	}

    	let datetimepicker_props = {
    		min: /*min*/ ctx[3],
    		max: /*max*/ ctx[4],
    		locale: /*locale*/ ctx[6]
    	};

    	if (/*$store*/ ctx[7] !== void 0) {
    		datetimepicker_props.value = /*$store*/ ctx[7];
    	}

    	datetimepicker = new DatePicker({
    			props: datetimepicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(datetimepicker, 'value', datetimepicker_value_binding));
    	datetimepicker.$on("focusout", /*onFocusOut*/ ctx[11]);
    	datetimepicker.$on("select", /*onSelect*/ ctx[13]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(datetimepicker.$$.fragment);
    			attr_dev(div, "class", "picker svelte-h5dfp8");
    			toggle_class(div, "visible", /*visible*/ ctx[2]);
    			add_location(div, file$4, 134, 4, 4395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(datetimepicker, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const datetimepicker_changes = {};
    			if (dirty & /*min*/ 8) datetimepicker_changes.min = /*min*/ ctx[3];
    			if (dirty & /*max*/ 16) datetimepicker_changes.max = /*max*/ ctx[4];
    			if (dirty & /*locale*/ 64) datetimepicker_changes.locale = /*locale*/ ctx[6];

    			if (!updating_value && dirty & /*$store*/ 128) {
    				updating_value = true;
    				datetimepicker_changes.value = /*$store*/ ctx[7];
    				add_flush_callback(() => updating_value = false);
    			}

    			datetimepicker.$set(datetimepicker_changes);

    			if (dirty & /*visible*/ 4) {
    				toggle_class(div, "visible", /*visible*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datetimepicker.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { duration: 80, easing: cubicInOut, y: -5 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datetimepicker.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { duration: 80, easing: cubicInOut, y: -5 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(datetimepicker);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(134:2) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let input_1;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input_1 = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "placeholder", /*placeholder*/ ctx[5]);
    			attr_dev(input_1, "class", "svelte-h5dfp8");
    			toggle_class(input_1, "invalid", !/*valid*/ ctx[1]);
    			add_location(input_1, file$4, 124, 2, 4179);
    			attr_dev(div, "class", "date-time-field svelte-h5dfp8");
    			add_location(div, file$4, 123, 0, 4101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input_1);
    			set_input_value(input_1, /*text*/ ctx[0]);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[19]),
    					listen_dev(input_1, "focus", /*focus_handler*/ ctx[20], false, false, false),
    					listen_dev(input_1, "mousedown", /*mousedown_handler*/ ctx[21], false, false, false),
    					listen_dev(input_1, "input", /*input*/ ctx[10], false, false, false),
    					listen_dev(div, "focusout", /*onFocusOut*/ ctx[11], false, false, false),
    					listen_dev(div, "keydown", /*keydown*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*placeholder*/ 32) {
    				attr_dev(input_1, "placeholder", /*placeholder*/ ctx[5]);
    			}

    			if (dirty & /*text*/ 1 && input_1.value !== /*text*/ ctx[0]) {
    				set_input_value(input_1, /*text*/ ctx[0]);
    			}

    			if (dirty & /*valid*/ 2) {
    				toggle_class(input_1, "invalid", !/*valid*/ ctx[1]);
    			}

    			if (/*visible*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $store;
    	let $innerStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateInput', slots, []);
    	const dispatch = createEventDispatcher();

    	/** Default date to display in picker before value is assigned */
    	const defaultDate = new Date();

    	// inner date value store for preventing value updates (and also
    	// text updates as a result) when date is unchanged
    	const innerStore = writable(null);

    	validate_store(innerStore, 'innerStore');
    	component_subscribe($$self, innerStore, value => $$invalidate(23, $innerStore = value));

    	const store = (() => {
    		return {
    			subscribe: innerStore.subscribe,
    			set: d => {
    				if (d === null) {
    					innerStore.set(null);
    					$$invalidate(14, value = d);
    				} else if (d.getTime() !== ($innerStore === null || $innerStore === void 0
    				? void 0
    				: $innerStore.getTime())) {
    					innerStore.set(d);
    					$$invalidate(14, value = d);
    				}
    			}
    		};
    	})();

    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(7, $store = value));
    	let { value = null } = $$props;
    	let { min = new Date(defaultDate.getFullYear() - 20, 0, 1) } = $$props;
    	let { max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999) } = $$props;
    	let { placeholder = '2020-12-31 23:00:00' } = $$props;
    	let { valid = true } = $$props;
    	let { format = 'yyyy-MM-dd HH:mm:ss' } = $$props;
    	let formatTokens = createFormat(format);
    	let { locale = {} } = $$props;

    	function valueUpdate(value, formatTokens) {
    		$$invalidate(0, text = toText(value, formatTokens));
    	}

    	let { text = toText($store, formatTokens) } = $$props;
    	let textHistory = [text, text];

    	function textUpdate(text, formatTokens) {
    		if (text.length) {
    			const result = parse(text, formatTokens, $store);

    			if (result.date !== null) {
    				$$invalidate(1, valid = true);
    				store.set(result.date);
    			} else {
    				$$invalidate(1, valid = false);
    			}
    		} else {
    			$$invalidate(1, valid = true); // <-- empty string is always valid

    			// value resets to null if you clear the field
    			if (value) {
    				$$invalidate(14, value = null);
    				store.set(null);
    			}
    		}
    	}

    	function input(e) {
    		if (e instanceof InputEvent && e.inputType === 'insertText' && typeof e.data === 'string' && text === textHistory[0] + e.data) {
    			// check for missing punctuation, and add if there is any
    			let result = parse(textHistory[0], formatTokens, $store);

    			if (result.missingPunctuation !== '' && !result.missingPunctuation.startsWith(e.data)) {
    				$$invalidate(0, text = textHistory[0] + result.missingPunctuation + e.data);
    			}
    		}
    	}

    	let { visible = false } = $$props;
    	let { closeOnSelection = false } = $$props;

    	// handle on:focusout for parent element. If the parent element loses
    	// focus (e.g input element), visible is set to false
    	function onFocusOut(e) {
    		if ((e === null || e === void 0 ? void 0 : e.currentTarget) instanceof HTMLElement && e.relatedTarget && e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) {
    			return;
    		} else {
    			$$invalidate(2, visible = false);
    		}
    	}

    	function keydown(e) {
    		if (e.key === 'Escape' && visible) {
    			$$invalidate(2, visible = false);
    			e.preventDefault();

    			// When the date picker is open, we prevent 'Escape' from propagating,
    			// so for example a parent modal won't be closed
    			e.stopPropagation();
    		} else if (e.key === 'Enter') {
    			$$invalidate(2, visible = !visible);
    			e.preventDefault();
    		}
    	}

    	function onSelect(e) {
    		dispatch('select', e.detail);

    		if (closeOnSelection) {
    			$$invalidate(2, visible = false);
    		}
    	}

    	const writable_props = [
    		'value',
    		'min',
    		'max',
    		'placeholder',
    		'valid',
    		'format',
    		'locale',
    		'text',
    		'visible',
    		'closeOnSelection'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateInput> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	const focus_handler = () => $$invalidate(2, visible = true);
    	const mousedown_handler = () => $$invalidate(2, visible = true);

    	function datetimepicker_value_binding(value) {
    		$store = value;
    		store.set($store);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(14, value = $$props.value);
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('placeholder' in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ('valid' in $$props) $$invalidate(1, valid = $$props.valid);
    		if ('format' in $$props) $$invalidate(15, format = $$props.format);
    		if ('locale' in $$props) $$invalidate(6, locale = $$props.locale);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('closeOnSelection' in $$props) $$invalidate(16, closeOnSelection = $$props.closeOnSelection);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		cubicInOut,
    		toText,
    		parse,
    		createFormat,
    		DateTimePicker: DatePicker,
    		writable,
    		createEventDispatcher,
    		dispatch,
    		defaultDate,
    		innerStore,
    		store,
    		value,
    		min,
    		max,
    		placeholder,
    		valid,
    		format,
    		formatTokens,
    		locale,
    		valueUpdate,
    		text,
    		textHistory,
    		textUpdate,
    		input,
    		visible,
    		closeOnSelection,
    		onFocusOut,
    		keydown,
    		onSelect,
    		$store,
    		$innerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(14, value = $$props.value);
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('placeholder' in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ('valid' in $$props) $$invalidate(1, valid = $$props.valid);
    		if ('format' in $$props) $$invalidate(15, format = $$props.format);
    		if ('formatTokens' in $$props) $$invalidate(17, formatTokens = $$props.formatTokens);
    		if ('locale' in $$props) $$invalidate(6, locale = $$props.locale);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('textHistory' in $$props) $$invalidate(18, textHistory = $$props.textHistory);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('closeOnSelection' in $$props) $$invalidate(16, closeOnSelection = $$props.closeOnSelection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 16384) {
    			store.set(value);
    		}

    		if ($$self.$$.dirty & /*format*/ 32768) {
    			$$invalidate(17, formatTokens = createFormat(format));
    		}

    		if ($$self.$$.dirty & /*$store, formatTokens*/ 131200) {
    			valueUpdate($store, formatTokens);
    		}

    		if ($$self.$$.dirty & /*textHistory, text*/ 262145) {
    			$$invalidate(18, textHistory = [textHistory[1], text]);
    		}

    		if ($$self.$$.dirty & /*text, formatTokens*/ 131073) {
    			textUpdate(text, formatTokens);
    		}
    	};

    	return [
    		text,
    		valid,
    		visible,
    		min,
    		max,
    		placeholder,
    		locale,
    		$store,
    		innerStore,
    		store,
    		input,
    		onFocusOut,
    		keydown,
    		onSelect,
    		value,
    		format,
    		closeOnSelection,
    		formatTokens,
    		textHistory,
    		input_1_input_handler,
    		focus_handler,
    		mousedown_handler,
    		datetimepicker_value_binding
    	];
    }

    class DateInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			value: 14,
    			min: 3,
    			max: 4,
    			placeholder: 5,
    			valid: 1,
    			format: 15,
    			locale: 6,
    			text: 0,
    			visible: 2,
    			closeOnSelection: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateInput",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get value() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnSelection() {
    		throw new Error("<DateInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnSelection(value) {
    		throw new Error("<DateInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/componentes/profile/TabEvents.svelte generated by Svelte v3.47.0 */
    const file_1 = "src/lib/componentes/profile/TabEvents.svelte";

    // (50:8) {#if userId}
    function create_if_block_1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				mode: "primary",
    				type: "button",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*openDialogForCreate*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(50:8) {#if userId}",
    		ctx
    	});

    	return block;
    }

    // (51:12) <Button mode="primary" type="button" on:click={openDialogForCreate}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(51:12) <Button mode=\\\"primary\\\" type=\\\"button\\\" on:click={openDialogForCreate}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script> import { Button, Dialog, Input, Loader, Select, Table }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script> import { Button, Dialog, Input, Loader, Select, Table }",
    		ctx
    	});

    	return block;
    }

    // (75:16) {:then countriesOptions}
    function create_then_block(ctx) {
    	let label;
    	let span;
    	let t1;
    	let select;
    	let updating_selected;
    	let current;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[14](value);
    	}

    	let select_props = {
    		required: true,
    		uniqueId: "country",
    		options: /*countriesOptions*/ ctx[18],
    		defaultOptionLabel: " - Select -"
    	};

    	if (/*country*/ ctx[4] !== void 0) {
    		select_props.selected = /*country*/ ctx[4];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));

    	const block = {
    		c: function create() {
    			label = element("label");
    			span = element("span");
    			span.textContent = "Select a Country";
    			t1 = space();
    			create_component(select.$$.fragment);
    			add_location(span, file_1, 76, 24, 2138);
    			attr_dev(label, "for", "country");
    			attr_dev(label, "class", "select-label");
    			add_location(label, file_1, 75, 20, 2071);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, span);
    			append_dev(label, t1);
    			mount_component(select, label, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};

    			if (!updating_selected && dirty & /*country*/ 16) {
    				updating_selected = true;
    				select_changes.selected = /*country*/ ctx[4];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			destroy_component(select);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(75:16) {:then countriesOptions}",
    		ctx
    	});

    	return block;
    }

    // (73:34)                      <p>Loading countries</p>                 {:then countriesOptions}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading countries";
    			add_location(p, file_1, 73, 20, 1984);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(73:34)                      <p>Loading countries</p>                 {:then countriesOptions}",
    		ctx
    	});

    	return block;
    }

    // (93:16) {#if submiting}
    function create_if_block$1(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(93:16) {#if submiting}",
    		ctx
    	});

    	return block;
    }

    // (91:12) <Button mode="primary" size="large" type="submit" isDisabled={submiting}>
    function create_default_slot_1(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = /*submiting*/ ctx[5] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			t = text("Acept \n                ");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(91:12) <Button mode=\\\"primary\\\" size=\\\"large\\\" type=\\\"submit\\\" isDisabled={submiting}>",
    		ctx
    	});

    	return block;
    }

    // (56:0) <Dialog title="Add Event" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    function create_default_slot$1(ctx) {
    	let form;
    	let div0;
    	let input0;
    	let updating_value;
    	let t0;
    	let div1;
    	let input1;
    	let updating_value_1;
    	let t1;
    	let div2;
    	let label;
    	let span;
    	let t3;
    	let dateinput;
    	let updating_value_2;
    	let t4;
    	let div3;
    	let input2;
    	let updating_value_3;
    	let t5;
    	let t6;
    	let div4;
    	let input3;
    	let t7;
    	let div5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[10](value);
    	}

    	let input0_props = { label: "Title", required: true };

    	if (/*title*/ ctx[0] !== void 0) {
    		input0_props.value = /*title*/ ctx[0];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[11](value);
    	}

    	let input1_props = {
    		type: "textarea",
    		label: "Description",
    		placeholder: "",
    		required: true
    	};

    	if (/*description*/ ctx[1] !== void 0) {
    		input1_props.value = /*description*/ ctx[1];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	function dateinput_value_binding(value) {
    		/*dateinput_value_binding*/ ctx[12](value);
    	}

    	let dateinput_props = { id: "date" };

    	if (/*datetime*/ ctx[2] !== void 0) {
    		dateinput_props.value = /*datetime*/ ctx[2];
    	}

    	dateinput = new DateInput({ props: dateinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(dateinput, 'value', dateinput_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[13](value);
    	}

    	let input2_props = {
    		type: "textarea",
    		label: "Address",
    		placeholder: "",
    		required: true
    	};

    	if (/*address*/ ctx[3] !== void 0) {
    		input2_props.value = /*address*/ ctx[3];
    	}

    	input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, 'value', input2_value_binding));

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 18,
    		blocks: [,,,]
    	};

    	handle_promise(getAllCountries(), info);

    	input3 = new Input({
    			props: {
    				type: "file",
    				accept: "image/*",
    				label: "Image",
    				placeholder: "Image"
    			},
    			$$inline: true
    		});

    	input3.$on("change", /*asignFile*/ ctx[9]);

    	button = new Button({
    			props: {
    				mode: "primary",
    				size: "large",
    				type: "submit",
    				isDisabled: /*submiting*/ ctx[5],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			create_component(input0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(input1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			label = element("label");
    			span = element("span");
    			span.textContent = "Datetime";
    			t3 = space();
    			create_component(dateinput.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(input2.$$.fragment);
    			t5 = space();
    			info.block.c();
    			t6 = space();
    			div4 = element("div");
    			create_component(input3.$$.fragment);
    			t7 = space();
    			div5 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "separator-field");
    			add_location(div0, file_1, 57, 8, 1291);
    			attr_dev(div1, "class", "separator-field");
    			add_location(div1, file_1, 60, 8, 1407);
    			add_location(span, file_1, 65, 16, 1657);
    			attr_dev(label, "for", "date");
    			add_location(label, file_1, 64, 12, 1622);
    			attr_dev(div2, "class", "separator-field select-label");
    			add_location(div2, file_1, 63, 8, 1567);
    			attr_dev(div3, "class", "separator-field");
    			add_location(div3, file_1, 69, 8, 1785);
    			attr_dev(div4, "class", "separator-field");
    			add_location(div4, file_1, 86, 8, 2546);
    			attr_dev(div5, "class", "actions");
    			add_location(div5, file_1, 89, 8, 2708);
    			add_location(form, file_1, 56, 4, 1234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			mount_component(input0, div0, null);
    			append_dev(form, t0);
    			append_dev(form, div1);
    			mount_component(input1, div1, null);
    			append_dev(form, t1);
    			append_dev(form, div2);
    			append_dev(div2, label);
    			append_dev(label, span);
    			append_dev(label, t3);
    			mount_component(dateinput, label, null);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			mount_component(input2, div3, null);
    			append_dev(form, t5);
    			info.block.m(form, info.anchor = null);
    			info.mount = () => form;
    			info.anchor = t6;
    			append_dev(form, t6);
    			append_dev(form, div4);
    			mount_component(input3, div4, null);
    			append_dev(form, t7);
    			append_dev(form, div5);
    			mount_component(button, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(createOrUpdate), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const input0_changes = {};

    			if (!updating_value && dirty & /*title*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*title*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*description*/ 2) {
    				updating_value_1 = true;
    				input1_changes.value = /*description*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const dateinput_changes = {};

    			if (!updating_value_2 && dirty & /*datetime*/ 4) {
    				updating_value_2 = true;
    				dateinput_changes.value = /*datetime*/ ctx[2];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			dateinput.$set(dateinput_changes);
    			const input2_changes = {};

    			if (!updating_value_3 && dirty & /*address*/ 8) {
    				updating_value_3 = true;
    				input2_changes.value = /*address*/ ctx[3];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input2.$set(input2_changes);
    			update_await_block_branch(info, ctx, dirty);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(dateinput.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(input3.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(dateinput.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(input3.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(dateinput);
    			destroy_component(input2);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(input3);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(56:0) <Dialog title=\\\"Add Event\\\" dialogRoot=\\\"#dialog-root\\\" on:instance={assignDialogInstance}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let dialog;
    	let current;
    	let if_block = /*userId*/ ctx[6] && create_if_block_1(ctx);

    	dialog = new Dialog({
    			props: {
    				title: "Add Event",
    				dialogRoot: "#dialog-root",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dialog.$on("instance", /*assignDialogInstance*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(dialog.$$.fragment);
    			attr_dev(div0, "class", "controls-right");
    			add_location(div0, file_1, 48, 4, 966);
    			attr_dev(div1, "class", "p-1 container-white");
    			add_location(div1, file_1, 47, 0, 928);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			insert_dev(target, t, anchor);
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*userId*/ ctx[6]) if_block.p(ctx, dirty);
    			const dialog_changes = {};

    			if (dirty & /*$$scope, country, address, datetime, description, title*/ 524319) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t);
    			destroy_component(dialog, detaching);
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

    function resetValues() {
    	
    } // currentEvent = null;
    // race = "";

    // file = null;
    // description = "";
    // isPublic = false;
    function createOrUpdate() {
    	
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabEvents', slots, []);
    	let currentEvent;
    	let title = "";
    	let description = "";
    	let datetime = new Date();
    	let file = null;
    	let address = "";
    	let country = get_store_value(state)?.account?.country;
    	let submiting = false;
    	let userId = get_store_value(state)?.account?.$id;
    	let dialogInstance;

    	function assignDialogInstance(ev) {
    		dialogInstance = ev.detail.instance;
    	}

    	function openDialogForCreate() {
    		dialogInstance?.show();
    	}

    	function asignFile(ev) {
    		file = ev.target.files[0];
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabEvents> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		title = value;
    		$$invalidate(0, title);
    	}

    	function input1_value_binding(value) {
    		description = value;
    		$$invalidate(1, description);
    	}

    	function dateinput_value_binding(value) {
    		datetime = value;
    		$$invalidate(2, datetime);
    	}

    	function input2_value_binding(value) {
    		address = value;
    		$$invalidate(3, address);
    	}

    	function select_selected_binding(value) {
    		country = value;
    		$$invalidate(4, country);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		Dialog,
    		Input,
    		Loader,
    		Select,
    		Table,
    		DateInput,
    		get: get_store_value,
    		getAllCountries,
    		state,
    		currentEvent,
    		title,
    		description,
    		datetime,
    		file,
    		address,
    		country,
    		submiting,
    		userId,
    		dialogInstance,
    		assignDialogInstance,
    		openDialogForCreate,
    		asignFile,
    		resetValues,
    		createOrUpdate
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentEvent' in $$props) currentEvent = $$props.currentEvent;
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('datetime' in $$props) $$invalidate(2, datetime = $$props.datetime);
    		if ('file' in $$props) file = $$props.file;
    		if ('address' in $$props) $$invalidate(3, address = $$props.address);
    		if ('country' in $$props) $$invalidate(4, country = $$props.country);
    		if ('submiting' in $$props) $$invalidate(5, submiting = $$props.submiting);
    		if ('userId' in $$props) $$invalidate(6, userId = $$props.userId);
    		if ('dialogInstance' in $$props) dialogInstance = $$props.dialogInstance;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		description,
    		datetime,
    		address,
    		country,
    		submiting,
    		userId,
    		assignDialogInstance,
    		openDialogForCreate,
    		asignFile,
    		input0_value_binding,
    		input1_value_binding,
    		dateinput_value_binding,
    		input2_value_binding,
    		select_selected_binding
    	];
    }

    class TabEvents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabEvents",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/lib/componentes/profile/TabTips.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/lib/componentes/profile/TabTips.svelte";

    function create_fragment$3(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Tips";
    			add_location(h3, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabTips', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabTips> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class TabTips extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabTips",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/lib/componentes/profile/TabInfo.svelte generated by Svelte v3.47.0 */

    const file$2 = "src/lib/componentes/profile/TabInfo.svelte";

    function create_fragment$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Info";
    			add_location(h1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabInfo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabInfo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class TabInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabInfo",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/lib/pages/Profile.svelte generated by Svelte v3.47.0 */
    const file$1 = "src/lib/pages/Profile.svelte";

    // (22:12) <Button type="button" isLink on:click={closeSession}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Logout");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(22:12) <Button type=\\\"button\\\" isLink on:click={closeSession}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let section;
    	let div0;
    	let h2;
    	let t1;
    	let button;
    	let t2;
    	let div1;
    	let tabs;
    	let current;

    	button = new Button({
    			props: {
    				type: "button",
    				isLink: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*closeSession*/ ctx[0]);

    	tabs = new Tabs({
    			props: {
    				tabindex: 0,
    				size: "large",
    				tabs: [
    					{
    						title: "🗓 Events",
    						ariaControls: "panel-2",
    						tabPanelComponent: TabEvents,
    						tabindex: 1
    					},
    					{
    						title: "🐕 Pets",
    						ariaControls: "panel-1",
    						tabPanelComponent: TabPets,
    						tabindex: 0
    					},
    					{
    						title: "💡 Tips",
    						ariaControls: "panel-3",
    						tabPanelComponent: TabTips,
    						tabindex: 2
    					},
    					{
    						title: "👩‍🚀 Info",
    						ariaControls: "panel-4",
    						tabPanelComponent: TabInfo,
    						tabindex: 3
    					}
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Profile";
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(tabs.$$.fragment);
    			attr_dev(h2, "class", "big-title");
    			add_location(h2, file$1, 18, 12, 572);
    			attr_dev(div0, "class", "container-header svelte-gegxz2");
    			add_location(div0, file$1, 17, 8, 529);
    			attr_dev(div1, "class", "container-tabs svelte-gegxz2");
    			add_location(div1, file$1, 24, 8, 751);
    			add_location(section, file$1, 16, 4, 511);
    			attr_dev(main, "class", "container mt-1");
    			add_location(main, file$1, 15, 0, 477);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			mount_component(button, div0, null);
    			append_dev(section, t2);
    			append_dev(section, div1);
    			mount_component(tabs, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			destroy_component(tabs);
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
    	validate_slots('Profile', slots, []);

    	async function closeSession() {
    		await logout();
    		replace("/");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		Tabs,
    		replace,
    		TabPets,
    		TabEvents,
    		TabTips,
    		TabInfo,
    		logout,
    		closeSession
    	});

    	return [closeSession];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const routes = {
        "/": Home,
        "/events": Events,
        "/login": wrap$1({
            component: Login,
            conditions: [() => get_store_value(state)?.account === null]
        }),
        "/register": wrap$1({
            component: Register,
            conditions: [() => get_store_value(state)?.account === null]
        }),
        "/profile": wrap$1({
            component: Profile,
            conditions: [() => get_store_value(state)?.account !== null]
        }),
    };

    // export const routes = {
    //     "/": Home,
    //     "/events": Events,
    //     "/login": wrap({
    //         component: Login,
    //         conditions: [() => get(state)?.account === null]
    //     }),
    //     "/register": wrap({
    //         component: Register,
    //         conditions: [() => get(state)?.account === null]
    //     }),
    //     "/profile": Profile
    // }

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    // (23:1) {:else}
    function create_else_block(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });
    	router.$on("conditionsFailed", /*conditionsFailed_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(23:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:1) {#if loaded}
    function create_if_block(ctx) {
    	let loaderfull;
    	let current;
    	loaderfull = new LoaderFull({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loaderfull.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loaderfull, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loaderfull.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loaderfull.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loaderfull, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:1) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if_block.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "wrapper");
    			add_location(div, file, 19, 0, 500);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
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
    	validate_slots('App', slots, []);
    	let loaded = true;

    	onMount(async () => {
    		await loadUser();
    		$$invalidate(0, loaded = false);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const conditionsFailed_handler = () => push("/");

    	$$self.$capture_state = () => ({
    		onMount,
    		Router,
    		push,
    		Footer,
    		Header,
    		LoaderFull,
    		routes,
    		loadUser,
    		loaded
    	});

    	$$self.$inject_state = $$props => {
    		if ('loaded' in $$props) $$invalidate(0, loaded = $$props.loaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loaded, conditionsFailed_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
