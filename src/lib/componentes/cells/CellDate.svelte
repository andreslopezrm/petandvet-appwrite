<script>
import dayjs from "dayjs";

export let cellValue;
let date = dayjs(cellValue).format('DD MMMM YYYY HH:mm');
</script>
<td>
    <span>{date}</span>
</td>
  