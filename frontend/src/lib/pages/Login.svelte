<script>
    import { Input, Button, Close, Toasts, Toast  } from "agnostic-svelte";
    import { replace } from "svelte-spa-router";
    import Aside from "../componentes/Aside.svelte";
    import { login } from "../services/user";
    
    

    let isToastOpen = false
    let errorMessage = "";
 
    let email = "";
    let password = "";
   
    
    function toastClose() {
        errorMessage = "";
        isToastOpen = false
    }
    
    function toastOpen(message) {
        errorMessage = message;
        isToastOpen = true;
    }
    
    
    async function handleSubmit() {
    
        errorMessage = "";
        isToastOpen = false;
    
        try {
            await login({ email, password });
            replace("/profile");
        } catch(err) {
            toastOpen(err.message);
        }
        
    }
    
    </script>
    <main class="container mt-1">
        <section>
            <h2 class="big-title">Login</h2>
            <form on:submit|preventDefault={handleSubmit}>
                <div class="sepatator">
                    <Input bind:value={email} label="Email" type="email" required />
                </div>
                <div class="sepatator">
                    <Input bind:value={password} label="Password" type="password" required minlength="8" />
                </div>

                <div class="actions">
                    <Button mode="primary" size="large" type="submit">Acept</Button>
                </div>
            </form>
        </section>
        <Aside />
    </main>
    
    <Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="bottom">
        <Toast isOpen={isToastOpen} type="error">
            <div class="toast-error-content">
                <p>{errorMessage}</p>
                <Close color="var(--agnostic-error-dark)" on:click={toastClose} />
            </div>
        </Toast>
    </Toasts>
    
    <style >
        .sepatator {
            margin-bottom: 1rem;
        }
        .actions {
            margin-top: 2rem;
        }
        .toast-error-content {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    </style>
    