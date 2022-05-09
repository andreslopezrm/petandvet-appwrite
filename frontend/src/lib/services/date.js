import dayjs from "dayjs";

export function getDateFormatLarge(dateInt) {
    return dayjs(dateInt).format('DD MMMM YYYY HH:mm');
}