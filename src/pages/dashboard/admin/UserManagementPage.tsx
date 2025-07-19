import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, CheckCircle, XCircle, Ban, UserCheck, Mail, Calendar, DollarSign } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'reader' | 'writer' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
  totalPurchases?: number;
  totalSpent?: number;
  lastLogin?: string;
}

const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'reader',
    status: 'active',
    joinDate: '2024-01-15',
    totalPurchases: 5,
    totalSpent: 49.95,
    lastLogin: '2024-03-15T10:30:00'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'writer',
    status: 'active',
    joinDate: '2024-02-20',
    totalPurchases: 0,
    totalSpent: 0,
    lastLogin: '2024-03-14T15:45:00'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'reader',
    status: 'inactive',
    joinDate: '2024-03-10',
    totalPurchases: 2,
    totalSpent: 19.98,
    lastLogin: '2024-03-10T09:20:00'
  }
];

const UserManagementPage: React.FC = () => {
  const [users] = useState<User[]>(DUMMY_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would make an API call
    console.log('Deleting user:', selectedUser?.id);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user: User) => {
    setUserToView(user);
    setIsUserDetailsOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">User Management</h1>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Utilisateurs</h3>
            <p className="text-2xl font-bold text-blue-900">{users.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Actifs</h3>
            <p className="text-2xl font-bold text-green-900">{users.filter(u => u.status === 'active').length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Auteurs</h3>
            <p className="text-2xl font-bold text-purple-900">{users.filter(u => u.role === 'writer').length}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-800">Revenus Total</h3>
            <p className="text-2xl font-bold text-amber-900">${users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <select
                className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="reader">Reader</option>
                <option value="writer">Writer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <select
                className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              className="flex items-center px-4 py-2 text-neutral-600 bg-neutral-100 rounded-md hover:bg-neutral-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="cursor-pointer hover:text-primary-600"
                      onClick={() => handleViewUser(user)}
                    >
                      <div className="font-medium text-neutral-900">{user.name}</div>
                      <div className="text-sm text-neutral-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'writer' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center ${
                      user.status === 'active' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {user.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div>
                      <div className="font-medium">{user.totalPurchases || 0} livres</div>
                      <div className="text-xs text-neutral-400">${(user.totalSpent || 0).toFixed(2)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleViewUser(user)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      onClick={() => console.log('Edit user:', user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-amber-600 hover:text-amber-900 mr-3"
                      onClick={() => console.log('Suspend user:', user.id)}
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Delete User</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      {/* User Details Modal */}
      {isUserDetailsOpen && userToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-neutral-900">Détails de l'utilisateur</h3>
              <button
                onClick={() => setIsUserDetailsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Nom complet</label>
                  <p className="mt-1 text-neutral-900 font-medium">{userToView.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Email</label>
                  <p className="mt-1 text-neutral-900">{userToView.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Rôle</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userToView.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    userToView.role === 'writer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {userToView.role}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Statut</label>
                  <span className={`inline-flex items-center ${
                    userToView.status === 'active' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {userToView.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {userToView.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Date d'inscription</label>
                  <p className="mt-1 text-neutral-900">{new Date(userToView.joinDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Dernière connexion</label>
                  <p className="mt-1 text-neutral-900">
                    {userToView.lastLogin ? new Date(userToView.lastLogin).toLocaleString() : 'Jamais connecté'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Achats</label>
                  <div className="mt-1">
                    <p className="text-neutral-900 font-medium">{userToView.totalPurchases || 0} livres achetés</p>
                    <p className="text-sm text-neutral-600">Total dépensé: ${(userToView.totalSpent || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                  onClick={() => {
                    console.log('Suspend user:', userToView.id);
                    setIsUserDetailsOpen(false);
                  }}
                >
                  Suspendre
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    console.log('Send email to:', userToView.email);
                    setIsUserDetailsOpen(false);
                  }}
                >
                  Envoyer Email
                </button>
                <button
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200"
                  onClick={() => setIsUserDetailsOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

  );
};

export default UserManagementPage;