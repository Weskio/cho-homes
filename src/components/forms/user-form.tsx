import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface UserFormData {
  email: string;
  password: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-100 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-10 hover:text-white"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-90 border border-dark-80 rounded-lg focus:outline-none focus:border-btn-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-90 border border-dark-80 rounded-lg focus:outline-none focus:border-btn-primary"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-btn-primary text-white py-2 rounded-lg hover:bg-btn-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding User...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
