import React, { useEffect, useState } from 'react';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Key, 
  Mail, 
  User, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Lock,
  UserCheck,
  UserX,
  Power
} from 'lucide-react';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { confirmDelete, showToast, showErrorAlert, showWarningAlert } from '../../utils/alerts';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', desc: 'Akses penuh ke seluruh konfigurasi & manajemen akun', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'admin', label: 'Administrator', desc: 'Akses penuh kelola konten, berita, galeri, dan dokumen', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'staff', label: 'Staf Program', desc: 'Pengelola operasional kegiatan dan data lapangan', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'editor', label: 'Editor Konten', desc: 'Editor publikasi, dokumen, dan konten informasi', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'reporter', label: 'Reporter / Redaksi', desc: 'Penulis berita dan dokumentasi kegiatan publik', color: 'bg-rose-100 text-rose-800 border-rose-200' },
];

export default function Users() {
  const currentUser = authService.getUserData();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    is_active: true,
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(items);
    } catch (error) {
      showErrorAlert('Gagal Memuat Pengguna', error.response?.data?.message || 'Tidak dapat mengambil daftar pengguna.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      is_active: true,
      password: '',
      password_confirmation: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'admin',
      is_active: user.is_active !== false,
      password: '',
      password_confirmation: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Nama lengkap dan alamat email wajib diisi.');
      return;
    }

    if (modalMode === 'create' && !formData.password) {
      setFormError('Password wajib diisi untuk pengguna baru.');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setFormError('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      setFormError('Konfirmasi password tidak cocok.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        is_active: formData.is_active,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (modalMode === 'create') {
        await userService.createUser(payload);
        showToast('Pengguna baru berhasil ditambahkan.', 'success');
      } else {
        await userService.updateUser(selectedUser.id, payload);
        showToast('Data pengguna berhasil diperbarui.', 'success');
      }

      handleCloseModal();
      await fetchUsers();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Gagal menyimpan data pengguna.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser?.id) {
      showWarningAlert('Aksi Ditolak', 'Anda tidak dapat menonaktifkan akun yang sedang aktif digunakan saat ini.');
      return;
    }

    const actionText = user.is_active ? 'menonaktifkan' : 'mengaktifkan kembali';
    const confirmText = user.is_active
      ? `Pengguna "${user.name}" tidak akan dapat login ke CMS sampai akun diaktifkan kembali.`
      : `Pengguna "${user.name}" akan dapat login kembali menggunakan kredensial yang tersimpan.`;

    const isConfirmed = await confirmDelete({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Akun?`,
      text: confirmText,
      confirmButtonText: `Ya, ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      cancelButtonText: 'Batal',
    });

    if (isConfirmed) {
      try {
        await userService.toggleStatus(user.id);
        showToast(`Status akun ${user.name} berhasil diperbarui.`, 'success');
        await fetchUsers();
      } catch (error) {
        showErrorAlert('Gagal Mengubah Status', error.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      showErrorAlert('Aksi Ditolak', 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif login.');
      return;
    }

    const isConfirmed = await confirmDelete({
      title: `Hapus Akun "${user.name}"?`,
      text: `Akun dengan email ${user.email} akan dihapus secara permanen dari sistem dan tidak bisa login kembali.`,
      confirmButtonText: 'Ya, Hapus Akun',
    });

    if (isConfirmed) {
      try {
        await userService.deleteUser(user.id);
        showToast('Akun pengguna berhasil dihapus.', 'success');
        await fetchUsers();
      } catch (error) {
        showErrorAlert('Gagal Menghapus Akun', error.response?.data?.message || 'Terjadi kesalahan saat menghapus pengguna.');
      }
    }
  };

  const getRoleBadge = (role) => {
    const config = ROLES.find((r) => r.value === role) || {
      label: role,
      color: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold ${config.color}`}>
        <ShieldCheck className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && u.is_active !== false) ||
      (statusFilter === 'inactive' && u.is_active === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-purple-700" />
            <span>Kelola Akun & Hak Akses Pengurus</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen akun staf APM Jambi, pengaturan hak akses peran (RBAC), dan aktivasi kredensial login
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Akun</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Akun Aktif</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {users.filter((u) => u.is_active !== false).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Akun Nonaktif</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {users.filter((u) => u.is_active === false).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Super Admin / Admin</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {users.filter((u) => ['super_admin', 'admin'].includes(u.role)).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau email pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Peran:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="all">Semua Peran</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="all">Semua Status</option>
              <option value="active">Hanya Aktif</option>
              <option value="inactive">Hanya Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
            <p className="text-xs">Memuat data pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">Tidak ada pengguna yang cocok dengan kriteria pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pengguna</th>
                  <th className="py-3.5 px-4">Alamat Email</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4">Status Akun</th>
                  <th className="py-3.5 px-4">Terdaftar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  const isActive = user.is_active !== false;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs border shrink-0 ${
                            isActive 
                              ? 'bg-purple-100 text-purple-900 border-purple-200' 
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="inline-flex items-center text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">ID #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {/* Toggle active / inactive button */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Tidak dapat menonaktifkan akun sendiri' : (isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun')}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCurrent
                              ? 'text-slate-300 cursor-not-allowed'
                              : isActive
                                ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          title="Edit Akun"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Anda tidak dapat menghapus akun Anda sendiri' : 'Hapus Akun'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCurrent
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH / EDIT PENGGUNA */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {modalMode === 'create' ? 'Tambah Akun Pengurus Baru' : 'Edit Kredensial Pengguna'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalMode === 'create' ? 'Buat akun staf/pengurus APM dengan kredensial tersendiri' : `Perbarui data untuk ${selectedUser?.name}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nama Lengkap Pengurus / Staf *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Marsiyam, Siti Nurjanah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Alamat Email (Username Login) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@apmjambi.or.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Peran & Hak Akses (RBAC) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Status Akun</label>
                  <label className="flex items-center gap-2.5 h-[38px] px-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      disabled={selectedUser?.id === currentUser?.id}
                      className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {formData.is_active ? 'Akun Aktif (Dapat Login)' : 'Nonaktif (Diblokir)'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {modalMode === 'create' ? 'Password *' : 'Password Baru (Opsional)'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required={modalMode === 'create'}
                      placeholder={modalMode === 'create' ? 'Min. 6 karakter' : 'Kosongkan jika tetap'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Ulangi Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required={Boolean(formData.password)}
                      placeholder="Konfirmasi password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{modalMode === 'create' ? 'Buat Akun' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
