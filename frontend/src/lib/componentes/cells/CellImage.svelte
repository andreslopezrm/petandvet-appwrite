<script>
export let cellValue;
</script>
<td>
    {#if cellValue}
        <img width="65" src={cellValue} alt="" />
    {/if}
</td>
  