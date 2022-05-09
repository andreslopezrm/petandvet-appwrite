<script>
import { getDateFormatLarge } from "../../services/date";

export let cellValue;
let date = getDateFormatLarge(cellValue);
</script>
<td>
    <span>{date}</span>
</td>
  