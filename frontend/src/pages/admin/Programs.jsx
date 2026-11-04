import React, { useEffect, useState } from 'react';
import { 
  ListChecks, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertCircle,
  Check
} from 'lucide-react';
import { programService } from '../../services/programService';
import { resolveApiAssetUrl } from '../../services/api';
import { confirmDelete, showToast, showWarningAlert, showErrorAlert } from '../../utils/alerts';

const emptyForm = {
  badge: '',
  title: '',
  category: '',
  description: '',
  highlightsText: '',
  image: '',
  color: 'purple',
  display_order: 1,
  is_published: true,
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const response = await programService.getAdminPrograms();
      setPrograms(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      showErrorAlert('Gagal Memuat Program', requestError.response?.data?.message || 'Tidak dapat memuat daftar program.');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, display_order: programs.length + 1 });
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const startEdit = (program) => {
    setEditingId(program.id);
    setForm({
      ...program,
      highlightsText: (program.highlights || []).join('\n'),
      is_published: Boolean(program.is_published),
    });
    setImageFile(null);
    setImagePreview(program.image || null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarningAlert('File Terlalu Besar', 'Ukuran foto program maksimal 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
      setFormError('Judul, kategori, dan deskripsi program wajib diisi.');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    if (form.badge) formData.append('badge', form.badge);
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('color', form.color || 'purple');
    formData.append('display_order', form.display_order ?? 1);
    formData.append('is_published', form.is_published ? '1' : '0');

    const highlights = (form.highlightsText || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    highlights.forEach((item, index) => {
      formData.append(`highlights[${index}]`, item);
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingId) {
        await programService.update(editingId, formData);
        showToast('Program kerja berhasil diperbarui.', 'success');
      } else {
        await programService.create(formData);
        showToast('Program baru berhasil ditambahkan.', 'success');
      }
      setIsFormOpen(false);
      await loadPrograms();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Gagal menyimpan program.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (program) => {
    const isConfirmed = await confirmDelete({
      title: 'Hapus Program Kerja?',
      text: `Apakah Anda yakin ingin menghapus "${program.title}"?`,
      confirmButtonText: 'Ya, Hapus Program',
    });

    if (isConfirmed) {
      try {
        await programService.remove(program.id);
        showToast('Program berhasil dihapus.', 'success');
        await loadPrograms();
      } catch (requestError) {
        showErrorAlert('Gagal Menghapus', requestError.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-purple-700" />
            <span>Manajemen 9 Program & Layanan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur pilar program kerja, output aktivitas, dan deskripsi layanan publik APM Jambi
          </p>
        </div>
        <button 
          onClick={startCreate} 
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* Program Cards Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
          <p className="text-xs">Memuat daftar program...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-2 shadow-xs">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-semibold">Belum ada data program yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {programs.map((program) => (
            <article 
              key={program.id} 
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-purple-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 flex-1">
                {program.image ? (
                  <img 
                    src={resolveApiAssetUrl(program.image)} 
                    alt={program.title} 
                    className="h-24 w-36 rounded-2xl object-cover border border-slate-200 shrink-0" 
                  />
                ) : (
                  <div className="h-24 w-36 rounded-2xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-100">
                    <ListChecks className="w-8 h-8" />
                  </div>
                )}

                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {program.badge && (
                      <span className="rounded-lg bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold">
                        {program.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      {program.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      program.is_published 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {program.is_published ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{program.is_published ? 'Tayang' : 'Draft'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Urutan: {program.display_order}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-purple-900 transition-colors">
                    {program.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {program.description}
                  </p>

                  {program.highlights && program.highlights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {program.highlights.slice(0, 3).map((hl, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                          <Check className="w-3 h-3 text-purple-600" />
                          <span className="truncate max-w-[200px]">{hl}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <button 
                  onClick={() => startEdit(program)} 
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-purple-800 hover:bg-purple-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(program)} 
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Program"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Program */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsFormOpen(false)}
        >
          <div 
            className="my-6 max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ListChecks className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
                  </h2>
                  <p className="text-xs text-slate-500">Sesuaikan informasi layanan dan fokus aktivitas</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Judul Program *</label>
                  <input 
                    required 
                    maxLength="255" 
                    placeholder="Contoh: Pendampingan Kasus HKSR & KBG" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Kategori Bidang *</label>
                  <input 
                    required 
                    placeholder="Contoh: Perlindungan Hukum & Gender" 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Label / Badge</label>
                  <input 
                    placeholder="Contoh: Layanan 01, Pilar Advokasi" 
                    value={form.badge || ''} 
                    onChange={(e) => setForm({ ...form, badge: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Urutan Tampil</label>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    value={form.display_order} 
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Deskripsi Lengkap Program *</label>
                <textarea 
                  required 
                  rows="3" 
                  placeholder="Penjelasan mengenai tujuan dan lingkup kegiatan..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Fokus Aktivitas / Output Unggulan (Satu per baris)
                </label>
                <textarea 
                  rows="3" 
                  placeholder="Konseling psikososial peka korban&#10;Pendampingan rujukan medis dan visum&#10;Bantuan hukum paralegal desa" 
                  value={form.highlightsText} 
                  onChange={(e) => setForm({ ...form, highlightsText: e.target.value })} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed" 
                />
              </div>

              {/* Upload Gambar Program */}
              <div className="space-y-2 border border-slate-200 p-4 rounded-2xl bg-slate-50">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Foto / Gambar Ilustrasi Program
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview Program" 
                      className="h-20 w-32 rounded-xl object-cover border border-purple-300 shrink-0" 
                    />
                  ) : (
                    <div className="h-20 w-32 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nuansa Aksen Warna</label>
                  <select 
                    value={form.color} 
                    onChange={(e) => setForm({ ...form, color: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="purple">Ungu (Brand APM)</option>
                    <option value="blue">Biru (Hukum & Regulasi)</option>
                    <option value="rose">Merah Muda (Perlindungan Korban)</option>
                    <option value="emerald">Hijau (Advokasi Anggaran)</option>
                    <option value="amber">Kuning Emas (Kewirausahaan)</option>
                    <option value="teal">Toska (Kemitraan)</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 h-[38px] px-3.5 w-full rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={Boolean(form.is_published)} 
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })} 
                      className="w-4 h-4 accent-purple-700 rounded cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Tampilkan di website publik
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)} 
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={saving} 
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
                  <span>{editingId ? 'Simpan Perubahan' : 'Buat Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
