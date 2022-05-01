<script>
import { Button } from "agnostic-svelte";
import { getContext } from "svelte";

export let cellValue;
const onEdit = getContext('onEdit');
const onDelete = getContext('onDelete');

function handleEdit() {
    if(onEdit) {
        onEdit(cellValue);
    }
}

function handleDelete() {
    if(onDelete) {
        onDelete(cellValue);
    }
}

</script>
<td>
    <div class="cell-actions">
        <Button 
            mode="primary" 
            --agnostic-btn-primary="var(--primary-color)"
            --agnostic-focus-ring-outline-color="--primary-outline-color"
            on:click={handleEdit}>
            Edit
        </Button>
        <Button isLink>Delete</Button>
    </div>
</td>
<style>
    .cell-actions {
        display: flex;
        gap: 0.5rem;
    }
</style>