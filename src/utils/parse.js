import { format, differenceInHours } from "date-fns";

export const parseTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const hoursDiff = differenceInHours(now, date);

  if (hoursDiff >= 24) {
    return format(date, "dd/MM/yyyy"); // Chỉ hiện ngày tháng
  } else {
    return format(date, "hh:mm a"); // Chỉ hiện giờ phút
  }
};
