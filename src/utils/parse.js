import { format, differenceInHours, isValid } from "date-fns";

export const parseTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const hoursDiff = differenceInHours(now, date);

  // Kiểm tra timestamp có hợp lệ không
  if (!timestamp || !isValid(date)) {
    return ""; // hoặc 'Không rõ', 'N/A' tùy bạn muốn hiển thị gì
  }

  if (hoursDiff >= 24) {
    return format(date, "dd/MM/yyyy"); // Chỉ hiện ngày tháng
  } else {
    return format(date, "hh:mm a"); // Chỉ hiện giờ phút
  }
};

export const safeParseArray = (value) => {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [value];
  }
};
