import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  X, 
  Loader2, 
  AlertCircle,
  Navigation
} from 'lucide-react';
import { communityCenterService } from '../../services/communityCenterService';
import { confirmDelete, showToast, showErrorAlert } from '../../utils/alerts';

const blankCenter = { 
  name: '', 
  village: '', 
  district: '', 
  regency: 'Merangin', 
  display_order: 1, 
  is_published: true 
};

const REGENCIES = ['Semua Kabupaten', 'Merangin', 'Bungo', 'Sarolangun'];

export default function CommunityCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('Semua Kabupaten');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [form, setForm] = useState(blankCenter);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    setLoading(true);
    try {
      const response = await communityCenterService.getAdminCenters();
      const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCenters(items);
    } catch (error) {
      showErrorAlert('Gagal Memuat', error.response?.data?.message || 'Tidak dapat memuat daftar Community Center.');
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setForm({ ...blankCenter, display_order: centers.length + 1 });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (center) => {
    setModalMode('edit');
    setEditingId(center.id);
    setForm({ 
      name: center.name || '',
      village: center.village || '',
      district: center.district || '',
      regency: center.regency || 'Merangin',
      display_order: center.display_order ?? 1,
      is_published: Boolean(center.is_published)
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.village.trim() || !form.district.trim()) {
      setFormError('Nama kelompok, desa, dan kecamatan wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await communityCenterService.update(editingId, form);
        showToast('Data Community Center berhasil diperbarui.', 'success');
      } else {
        await communityCenterService.create(form);
        showToast('Community Center baru berhasil ditambahkan.', 'success');
      }
      handleCloseModal();
      await loadCenters();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (center) => {
    const isConfirmed = await confirmDelete({
      title: `Hapus Pos ${center.name}?`,
      text: `Apakah Anda yakin ingin menghapus pos Community Center di Desa ${center.village}, Kecamatan ${center.district}?`,
      confirmButtonText: 'Ya, Hapus Pos',
    });

    if (isConfirmed) {
      try {
        await communityCenterService.remove(center.id);
        showToast('Data Community Center berhasil dihapus.', 'success');
        await loadCenters();
      } catch (error) {
        showErrorAlert('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  const filteredCenters = centers.filter((c) => {
    const matchesSearch = 
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.village && c.village.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.district && c.district.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegency = 
      selectedRegency === 'Semua Kabupaten' || 
      (c.regency && c.regency.toLowerCase().includes(selectedRegency.toLowerCase()));
    return matchesSearch && matchesRegency;
  });

  const getRegencyBadge = (regency) => {
    const r = (regency || '').toLowerCase();
    if (r.includes('merangin')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    if (r.includes('bungo')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (r.includes('sarolangun')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-700" />
            <span>Manajemen 33 Community Center (CC)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data pos pelayanan, kelompok perempuan dampingan, dan sebaran wilayah di 3 kabupaten
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos Baru</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Pos CC</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{centers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Kab. Merangin</p>
          <p className="text-2xl font-black text-purple-900 mt-1">
            {centers.filter(c => (c.regency || '').toLowerCase().includes('merangin')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Kab. Bungo</p>
          <p className="text-2xl font-black text-blue-900 mt-1">
            {centers.filter(c => (c.regency || '').toLowerCase().includes('bungo')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Kab. Sarolangun</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {centers.filter(c => (c.regency || '').toLowerCase().includes('sarolangun')).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kelompok, desa, atau kecamatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {REGENCIES.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegency(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRegency === reg
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Community Centers */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
            <p className="text-xs">Memuat data Community Center...</p>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">Tidak ada kelompok Community Center yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Kelompok CC</th>
                  <th className="py-3.5 px-4">Desa / Kelurahan</th>
                  <th className="py-3.5 px-4">Kecamatan</th>
                  <th className="py-3.5 px-4">Kabupaten</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCenters.map((center, index) => (
                  <tr key={center.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {center.display_order || index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{center.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {center.village}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {center.district}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getRegencyBadge(center.regency)}`}>
                        {center.regency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {center.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tayang</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(center)}
                        title="Edit Community Center"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(center)}
                        title="Hapus Community Center"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit CC */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {modalMode === 'create' ? 'Tambah Community Center Baru' : 'Edit Community Center'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalMode === 'create' ? 'Daftarkan pos kelompok dampingan APM Jambi' : `Perbarui data untuk ${form.name}`}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nama Kelompok Community Center *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sehat Mandiri, Harapan Bunda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Desa / Kelurahan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pulau Tujuh, Rasau"
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Kecamatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pamenang Barat, Bangko"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Kabupaten *</label>
                  <select
                    value={form.regency}
                    onChange={(e) => setForm({ ...form, regency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Merangin">Merangin</option>
                    <option value="Bungo">Bungo</option>
                    <option value="Sarolangun">Sarolangun</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Urutan Tampil</label>
                  <input
                    type="number"
                    min="1"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Tampilkan kelompok ini di peta & direktori publik
                  </span>
                </label>
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  <span>{modalMode === 'create' ? 'Daftarkan Pos CC' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
