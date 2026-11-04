import React, { useEffect, useState } from 'react';
import { 
  UsersRound, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  UploadCloud, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { organizationMemberService } from '../../services/organizationMemberService';
import { resolveApiAssetUrl } from '../../services/api';
import { confirmDelete, showToast, showWarningAlert, showErrorAlert } from '../../utils/alerts';

const categories = [
  { value: 'oversight', label: 'Badan Pengawas', desc: 'Mandat pengawasan tata kelola, etika, dan kepatuhan AD/ART' },
  { value: 'management', label: 'Badan Pengurus', desc: 'Pimpinan harian dan perumus arah kebijakan strategis lembaga' },
  { value: 'implementation', label: 'Badan Pelaksana & Staf Lapang', desc: 'Direktur eksekutif, koordinator program, IT, keuangan, paralegal & pendamping' },
];

const emptyForm = {
  category: 'oversight',
  name: '',
  position: '',
  description: '',
  photo_url: '',
  display_order: 1,
  is_published: true,
};

export default function OrganizationStructure() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await organizationMemberService.getAdminMembers();
      setMembers(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      showErrorAlert('Gagal Memuat Struktur', requestError.response?.data?.message || 'Tidak dapat memuat struktur organisasi.');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const startCreate = (category = 'oversight') => {
    setEditingId(null);
    setForm({ ...emptyForm, category, display_order: members.length + 1 });
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setForm({ ...member, is_published: Boolean(member.is_published) });
    setPhotoFile(null);
    setPhotoPreview(member.photo_url || null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarningAlert('File Terlalu Besar', 'Ukuran foto maksimal 5MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.position.trim()) {
      setFormError('Nama lengkap dan posisi/jabatan wajib diisi.');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('category', form.category);
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('description', form.description || '');
    formData.append('display_order', form.display_order ?? 1);
    formData.append('is_published', form.is_published ? '1' : '0');
    if (form.photo_url) {
      formData.append('photo_url', form.photo_url);
    }
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      if (editingId) {
        await organizationMemberService.updateMember(editingId, formData);
        showToast('Data pengurus berhasil diperbarui.', 'success');
      } else {
        await organizationMemberService.createMember(formData);
        showToast('Pengurus baru berhasil ditambahkan.', 'success');
      }
      setIsFormOpen(false);
      await loadMembers();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Gagal menyimpan data pengurus.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    const isConfirmed = await confirmDelete({
      title: `Hapus ${member.name}?`,
      text: `Apakah Anda yakin ingin menghapus ${member.name} (${member.position}) dari struktur organisasi?`,
      confirmButtonText: 'Ya, Hapus Data',
    });

    if (isConfirmed) {
      try {
        await organizationMemberService.deleteMember(member.id);
        showToast('Data anggota organisasi berhasil dihapus.', 'success');
        await loadMembers();
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
            <UsersRound className="w-6 h-6 text-purple-700" />
            <span>Manajemen Struktur Organisasi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Susunan Dewan Pengawas, Dewan Pengurus, dan Dewan Pelaksana APM Jambi periode 2023–2028
          </p>
        </div>
        <button 
          onClick={() => startCreate('oversight')} 
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengurus Baru</span>
        </button>
      </div>

      {/* Main Hierarchy Groups */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
          <p className="text-xs">Memuat struktur pengurus...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryMembers = members.filter((member) => member.category === category.value);
            return (
              <section key={category.value} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>{category.label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {categoryMembers.length} Personel
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{category.desc}</p>
                  </div>
                  <button 
                    onClick={() => startCreate(category.value)} 
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah ke {category.label}</span>
                  </button>
                </div>

                {categoryMembers.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500 text-xs">
                    Belum ada data anggota pada {category.label}.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {categoryMembers.map((member) => (
                      <article key={member.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          {member.photo_url ? (
                            <img 
                              src={resolveApiAssetUrl(member.photo_url)} 
                              alt={member.name} 
                              className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm border border-purple-200 shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-purple-900 transition-colors">
                                {member.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold border ${
                                member.is_published 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {member.is_published ? 'Tayang' : 'Draft'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Urutan: {member.display_order}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-purple-700 mt-0.5">
                              {member.position}
                            </p>

                            {member.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {member.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button 
                            onClick={() => startEdit(member)} 
                            title="Edit Anggota"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(member)} 
                            title="Hapus Anggota"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Modal Form Tambah / Edit Anggota */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsFormOpen(false)}
        >
          <div 
            className="my-6 w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Anggota Organisasi' : 'Tambah Personel Baru'}
                  </h2>
                  <p className="text-xs text-slate-500">Sesuaikan profil struktural kelembagaan</p>
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
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Tingkat Struktur / Kelompok *</label>
                <select 
                  required 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nama Lengkap *</label>
                  <input 
                    required 
                    maxLength="255" 
                    placeholder="Contoh: Marsiyam, Sualjimah" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Jabatan / Amanah *</label>
                  <input 
                    required 
                    maxLength="255" 
                    placeholder="Contoh: Direktur Eksekutif" 
                    value={form.position} 
                    onChange={(e) => setForm({ ...form, position: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Keterangan Peran / Profil Singkat</label>
                <textarea 
                  rows="3" 
                  maxLength="2000" 
                  placeholder="Deskripsi tugas dan tanggung jawab kelembagaan..." 
                  value={form.description || ''} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed" 
                />
              </div>

              {/* Unggah Foto File */}
              <div className="space-y-2 border border-slate-200 p-4 rounded-2xl bg-slate-50">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Foto Profil Personel
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <img 
                      src={resolveApiAssetUrl(photoPreview)} 
                      alt="Preview Foto" 
                      className="h-16 w-16 rounded-2xl object-cover border border-purple-300 shrink-0" 
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-1">
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

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 h-[38px] px-3.5 w-full rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={Boolean(form.is_published)} 
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })} 
                      className="w-4 h-4 accent-purple-700 rounded cursor-pointer" 
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Tampilkan di bagan publik
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UsersRound className="w-4 h-4" />}
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
