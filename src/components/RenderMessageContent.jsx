import { IoDocuments } from "react-icons/io5";
import { safeParseArray } from "../utils/parse";
import PropTypes from "prop-types";

const RenderMessageContent = ({ message }) => {
  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "tiff",
    "svg",
  ];
  const videoTypes = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];
  const audioTypes = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  const documentTypes = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
    "json",
  ];
  const archiveTypes = ["zip", "rar", "7z", "tar", "gz"];

  let urls = [];
  let types = [];
  let contents = [];

  try {
    urls = safeParseArray(message?.messageUrl);
    types = safeParseArray(message?.messageType);
    contents = safeParseArray(message?.messageContent);
  } catch (error) {
    console.error("Lỗi parse message fields:", error);
    return (
      <p className="whitespace-pre-wrap px-2 pt-4">{message.messageContent}</p>
    );
  }

  // Nếu là tin nhắn text đơn thuần
  if (
    !urls.length &&
    message?.messageContent &&
    message.messageType === "text"
  ) {
    return (
      <p className="whitespace-pre-wrap px-2 pt-4">{message.messageContent}</p>
    );
  }

  return (
    <div className="flex flex-wrap">
      {urls.map((url, index) => {
        const type = types[index]?.toLowerCase();
        const name = contents[index] || "File";

        if (imageTypes.includes(type)) {
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-0.5 pt-0.5"
            >
              <img
                src={url}
                alt={name}
                className="w-28 h-28 object-cover rounded-md"
              />
            </a>
          );
        }

        if (videoTypes.includes(type)) {
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-40 h-28 px-0.5 pt-0.5"
            >
              <video
                controls
                src={url}
                className="w-full h-full object-cover rounded-md"
              />
            </a>
          );
        }

        if (audioTypes.includes(type)) {
          return (
            <div key={index} className="w-full flex flex-col gap-1">
              <audio controls className="w-full">
                <source src={url} type={`audio/${type}`} />
                Trình duyệt không hỗ trợ audio.
              </audio>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Nghe ở tab mới
              </a>
            </div>
          );
        }

        if (documentTypes.includes(type) || archiveTypes.includes(type)) {
          return (
            <div key={index} className="block w-full">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 pt-4 font-[650] underline text-blue-500"
              >
                <IoDocuments size={48} color="#00aaff" /> {name}
              </a>
            </div>
          );
        }

        // Fallback
        return (
          <a
            key={index}
            href={url}
            download={name}
            className="text-blue-600 underline w-full"
          >
            {name}
          </a>
        );
      })}
    </div>
  );
};

RenderMessageContent.propTypes = {
  message: PropTypes.object.isRequired,
};

export default RenderMessageContent;
