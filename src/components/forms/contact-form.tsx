import React, { useState } from 'react';
import { addMessage } from '../../services/messages.firebase';

interface ContactFormProps {
  propertyId: string;
  propertyTitle: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ propertyId, propertyTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addMessage({
        propertyId,
        propertyTitle,
        from: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500 text-green-500 rounded">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-10 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-dark-80 border border-dark-70 rounded focus:outline-none focus:border-btn-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark-10 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-dark-80 border border-dark-70 rounded focus:outline-none focus:border-btn-primary"
          placeholder="Your email"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-dark-10 mb-1">
          Phone (optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-dark-80 border border-dark-70 rounded focus:outline-none focus:border-btn-primary"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark-10 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 bg-dark-80 border border-dark-70 rounded focus:outline-none focus:border-btn-primary resize-none"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded bg-btn-primary text-white font-medium hover:bg-btn-primary-hover transition-colors ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
