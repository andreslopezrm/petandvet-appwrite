<script>
import { Button, Dialog } from "agnostic-svelte";

let name = "";
let race = "";
let age = 0;
let description = "";

let dialogInstance;
  const assignDialogInstance = (ev) => {
    dialogInstance = ev.detail.instance;
  };

  const openDialog = () => {
    if (dialogInstance) {
      dialogInstance.show();
    }
};

</script>

<div class="mt-1">
    <div class="controls-right">
        <Button mode="primary" type="button" on:click={openDialog}>Add</Button>
    </div>
</div>
<Dialog title="Add Pet" dialogRoot="#dialog-root" on:instance={assignDialogInstance}>
    <p>Hola</p>
</Dialog>

