import { SECONDS_GROUP_IMAGES } from "../constants/app.constants";
const groupImageMessages = (messages) => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
  const result = [];
  let tempGroup = [];

  for (let i = 0; i < messages.length; i++) {
    const curr = messages[i];
    const prev = messages[i - 1];

    const isImage = imageTypes.includes(curr.messageType?.toLowerCase());
    const sameSender = prev && curr.senderID === prev.senderID;
    const closeTime =
      prev && Math.abs(curr.createdAt - prev.createdAt) < SECONDS_GROUP_IMAGES;

    if (
      isImage &&
      !curr.revoke &&
      !curr.senderDelete &&
      sameSender &&
      closeTime
    ) {
      if (tempGroup.length === 0) {
        tempGroup.push(prev);
      }
      tempGroup.push(curr);
    } else {
      if (tempGroup.length > 0) {
        result.push({ type: "image-group", items: tempGroup });
        tempGroup = [];
      }
      result.push(curr);
    }
  }

  if (tempGroup.length > 0) {
    result.push({ type: "image-group", items: tempGroup });
  }

  return result;
};

export default groupImageMessages;
