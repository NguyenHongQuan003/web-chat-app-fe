import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Nhập tin nhắn...",
  className = "",
  maxRows = 4,
  ...props
}) => {
  const textareaRef = useRef(null);

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
        onSend(e);
      }
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-2 rounded-md bg-gray-100 focus:outline-none resize-none"
        rows={1}
        {...props}
      />
    </div>
  );
};

MessageInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  maxRows: PropTypes.number,
};

export default MessageInput;
