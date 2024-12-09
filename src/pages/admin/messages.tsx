import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import PageTransition from '../../components/reusables/page-transition';
import { getMessages, Message, updateMessage, deleteMessage } from '../../services/messages.firebase';
import { motion } from 'framer-motion';
import MessageCard from '../../components/cards/message-card';
import { useDataCache } from '../../hooks/useDataCache';

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const cache = useDataCache();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const cachedMessages = cache.getMessages();
      
      if (cachedMessages.isValid) {
        setMessages(cachedMessages.data);
        setIsLoading(false);
        return;
      }

      const data = await getMessages();
      setMessages(data);
      cache.setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStar = async (id: string) => {
    try {
      const message = messages.find(m => m.id === id);
      if (!message) return;
      
      // Optimistic update
      const updatedMessages = messages.map(msg =>
        msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
      );
      setMessages(updatedMessages);
      cache.setMessages(updatedMessages);
      
      await updateMessage(id, { isStarred: !message.isStarred });
    } catch (error) {
      console.error('Error toggling star:', error);
      // Revert on error
      await loadMessages();
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const message = messages.find(m => m.id === id);
      if (!message) return;
      
      // Optimistic update
      const updatedMessages = messages.map(msg =>
        msg.id === id ? { ...msg, isRead: !msg.isRead } : msg
      );
      setMessages(updatedMessages);
      cache.setMessages(updatedMessages);
      
      await updateMessage(id, { isRead: !message.isRead });
    } catch (error) {
      console.error('Error toggling read status:', error);
      // Revert on error
      await loadMessages();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Optimistic update
      const updatedMessages = messages.filter(msg => msg.id !== id);
      setMessages(updatedMessages);
      cache.setMessages(updatedMessages);
      
      await deleteMessage(id);
    } catch (error) {
      console.error('Error deleting message:', error);
      // Revert on error
      await loadMessages();
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'unread') return !message.isRead && matchesSearch;
    if (filter === 'starred') return message.isStarred && matchesSearch;
    return matchesSearch;
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-dark-90 border border-dark-80 focus:border-btn-primary focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-10" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'starred')}
              className="px-4 py-2 rounded-lg bg-dark-90 border border-dark-80 focus:border-btn-primary focus:outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-dark-10 py-8">
              Loading messages...
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onToggleStar={handleToggleStar}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center text-dark-10 py-8">
              No messages found
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMessages;
