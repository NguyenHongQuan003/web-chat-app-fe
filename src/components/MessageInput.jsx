import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IoAttach, IoSend } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";

const MessageInput = ({
  value,
  onChange,
  onSend,
  onFileSelect,
  placeholder = "Nhập tin nhắn...",
  className = "",
  maxRows = 4,
  onShowPicker,
  ...props
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, maxRows * 24);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, maxRows]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSend) {
        onSend(
          e,
          selectedFiles.map((f) => f.file)
        );
        setSelectedFiles([]);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        file,
        preview: isImage ? URL.createObjectURL(file) : null,
        name: file.name,
        type: file.type,
      };
    });

    setSelectedFiles((prev) => [...prev, ...fileData]);
    if (onFileSelect) onFileSelect(files);
    fileInputRef.current.value = null;
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  useEffect(() => {
    console.log("Selected files:", selectedFiles);
  }, [selectedFiles]);

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 border border-gray-300 rounded-md"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-xs text-center p-1">
                  {file.name}
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-[#000000]/50 text-white text-xs rounded-full px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-center gap-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-2 rounded-md bg-gray-100 focus:outline-none resize-none max-h-[200px]"
          rows={1}
          {...props}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-blue-500"
        >
          <IoAttach className="w-6 h-6 text-gray-500 cursor-pointer" />
        </button>
        <div>
          <FaRegSmile
            onClick={onShowPicker}
            className="w-6 h-6 text-gray-500 cursor-pointer"
          />
        </div>
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600"
          onClick={(e) => {
            if (onSend) {
              onSend(
                e,
                selectedFiles.map((f) => f.file)
              );
              setSelectedFiles([]);
            }
          }}
        >
          <IoSend className="w-6 h-6" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func,
  onFileSelect: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  maxRows: PropTypes.number,
  onShowPicker: PropTypes.func,
};

export default MessageInput;
