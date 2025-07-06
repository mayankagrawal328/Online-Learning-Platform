import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser.firstName || !editingUser.lastName || !editingUser.email) {
      toast.warning('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          toast.success('User deleted');
          fetchUsers();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditing = (user) => setEditingUser({ ...user });
  const cancelEditing = () => setEditingUser(null);

  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = (num) => setCurrentPage(num);

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">User Management</h1>

      {/* Search and Filter */}
      <div className="bg-richblack-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-richblack-700 text-white border border-richblack-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A1E4] w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center gap-4">
            <label htmlFor="roleFilter" className="text-sm text-richblack-300">
              Filter by Role:
            </label>
            <select
              id="roleFilter"
              className="bg-richblack-700 text-white border border-richblack-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-richblack-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              {['firstName', 'lastName', 'email'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-richblack-300 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={editingUser[field]}
                    onChange={handleInputChange}
                    className="w-full bg-richblack-700 text-white border border-richblack-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-richblack-300 mb-1">Role</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleInputChange}
                  className="w-full bg-richblack-700 text-white border border-richblack-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                >
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-richblack-600 text-white rounded hover:bg-richblack-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#00A1E4] text-white rounded hover:bg-[#008BCC] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="bg-richblack-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">User List</h2>
          <span className="text-sm text-richblack-400">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
          </span>
        </div>
        {isLoading ? (
          <div className="text-center text-richblack-400 py-6">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-richblack-400 py-6">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-richblack-700 text-richblack-300 uppercase text-xs">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="border-b border-richblack-600 hover:bg-richblack-700">
                    <td className="p-3">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => startEditing(user)} className="text-[#00A1E4] hover:underline">Edit</button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:underline"
                        disabled={user.role === 'admin'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === number
                    ? 'bg-[#00A1E4] text-white'
                    : 'bg-richblack-600 text-white hover:bg-richblack-500'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManage;
