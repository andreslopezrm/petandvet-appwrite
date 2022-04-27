<script>
    import { sdk } from '../../appwrite'

    async function onLogin () {
        // const user = await sdk.account.create('unique()', 'uno@gmail.com', '12345!!SDS', 'Kent');
        // console.log(user)
        //const user = await sdk.account.get()
        //console.log(user)

        //const session = await sdk.account.createSession('uno@gmail.com', '12345!!SDS')
        //console.log(session)
    }
</script>

<main>
<button on:click={onLogin}>User sesion</button>
</main>