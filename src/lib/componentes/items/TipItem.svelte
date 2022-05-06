<script>
import { Card } from "agnostic-svelte";
import QrButton from "../common/QrButton.svelte";
import ShareButton from "../common/ShareButton.svelte";
export let tip;
</script>

<Card>
    <div class="tip-item">
        <p>
            <i>{tip.description}</i>
        </p>
        <div class="tip-item-actions">
            <ShareButton isPrimary link={`${window.location.href}#/pet/${tip.description}`} />
            <QrButton text={tip.description} />
        </div>
    </div>
</Card>

<style>
    .tip-item {
        padding: 1rem;
    }

    .tip-item-actions {
        margin-top: 0.5rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
</style>