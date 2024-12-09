import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiMail, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/reusables/page-transition';
import UserForm from '../../components/forms/user-form';
import { FirebaseUser, addUser, getUsers } from '../../services/users.firebase';
import Loading from '../../components/reusables/loading';

interface UserRowProps {
  user: FirebaseUser;
}

const UserRow: React.FC<UserRowProps> = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-dark-90 p-4 rounded-lg border border-dark-80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-btn-primary/10 flex items-center justify-center">
        {user.email.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <FiMail className="text-dark-10" />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (formData: { email: string; password: string }) => {
    try {
      setLoading(true);
      await addUser(formData.email, formData.password);
      await loadUsers();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error adding user:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-10" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-dark-90 border border-dark-80 rounded-lg focus:outline-none focus:border-btn-primary"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-btn-primary text-white px-4 py-2 rounded-lg hover:bg-btn-primary/90 flex items-center gap-2"
            >
              <FiPlus />
              Add User
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <UserRow
                key={user.id}
                user={user}
              />
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center text-dark-10 py-8">
                No users found
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <UserForm
          onSubmit={handleAddUser}
          onClose={() => setShowAddModal(false)}
          loading={loading}
        />
      )}
    </PageTransition>
  );
};

export default AdminUsers;
