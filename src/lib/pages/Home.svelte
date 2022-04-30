<script>
    import {link} from 'svelte-spa-router'
    import { Button } from 'agnostic-svelte';
</script>

<main>
    <section>
        <Button mode="primary">Go</Button>
    </section>
    <aside>

    </aside>
</main>
<a href="/login" use:link>Login</a>