import React from 'react';
import { Message } from '../../services/messages.firebase';
import { FiStar, FiMail, FiClock, FiTrash2 } from 'react-icons/fi';

interface MessageCardProps {
  message: Message;
  onToggleStar: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onToggleStar,
  onToggleRead,
  onDelete,
}) => {
  return (
    <div 
      className={`p-4 rounded-lg border mb-4 ${
        message.isRead ? 'bg-dark-90 border-dark-80' : 'bg-dark-80 border-dark-70'
      } hover:border-btn-primary transition-all`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{message.propertyTitle}</h3>
            {!message.isRead && (
              <span className="px-2 py-0.5 rounded-full bg-btn-primary text-white text-xs">
                New
              </span>
            )}
          </div>
          <div className="text-dark-10 text-sm mb-2">
            From: {message.from} ({message.email})
            {message?.phone && ` • ${message.phone}`}
          </div>
          <p className="text-dark-10 text-sm line-clamp-2">{message.message}</p>
          <div className="text-dark-10 text-sm mt-2">
            <FiClock className="inline" />
            {new Date(message.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(message.id);
              }}
              className={`p-1 rounded hover:bg-dark-80 transition-colors ${
                message.isStarred ? 'text-yellow-500' : 'text-dark-10'
              }`}
              title={message.isStarred ? "Unstar message" : "Star message"}
            >
              <FiStar className={message.isStarred ? "fill-current" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(message.id);
              }}
              className="p-1 rounded hover:bg-dark-80 transition-colors text-red-500"
              title="Delete message"
            >
              <FiTrash2 />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(message.id);
              }}
              className={`p-1 rounded hover:bg-dark-80 transition-colors ${
                message.isRead ? 'text-dark-10' : 'text-btn-primary'
              }`}
              title={message.isRead ? "Mark as unread" : "Mark as read"}
            >
              <FiMail className={!message.isRead ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
