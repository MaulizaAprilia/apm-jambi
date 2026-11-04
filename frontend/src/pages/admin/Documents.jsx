import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  FileCheck, 
  UploadCloud, 
  Link as LinkIcon, 
  Pencil,
  X, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import { resolveApiAssetUrl } from '../../services/api';
import { confirmDelete, showToast } from '../../utils/alerts';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'

  const [formData, setFormData] = useState({
    title: '',
    category: 'AD/ART',
    description: '',
    file: null,
    file_url: '',
    is_public: true,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getAdminDocuments();
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat daftar dokumen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const openCreateModal = () => {
    setEditingDocument(null);
    setError('');
    setUploadType('file');
    setFormData({
      title: '',
      category: 'AD/ART',
      description: '',
      file: null,
      file_url: '',
      is_public: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (document) => {
    setEditingDocument(document);
    setError('');
    setUploadType(document.file_path?.startsWith('http') ? 'url' : 'file');
    setFormData({
      title: document.title || '',
      category: document.category || 'AD/ART',
      description: document.description || '',
      file: null,
      file_url: document.file_path && !document.file_path.startsWith('/storage/') ? document.file_path : '',
      is_public: Boolean(document.is_public),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'AD/ART',
      description: '',
      file: null,
      file_url: '',
      is_public: true,
    });
    setEditingDocument(null);
    setUploadType('file');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Judul dokumen wajib diisi.');
      return;
    }

    if (uploadType === 'file' && !editingDocument && !formData.file) {
      setError('Silakan pilih berkas dokumen (PDF/DOCX) untuk diunggah.');
      return;
    }

    if (uploadType === 'url' && !formData.file_url.trim()) {
      setError('Silakan masukkan URL tautan dokumen.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('description', formData.description);
      payload.append('is_public', formData.is_public ? 1 : 0);

      if (uploadType === 'file' && formData.file) {
        payload.append('file', formData.file);
      } else if (uploadType === 'url' && formData.file_url) {
        payload.append('file_url', formData.file_url);
      }

      const res = editingDocument
        ? await documentService.updateDocument(editingDocument.id, payload)
        : await documentService.createDocument(payload);

      if (res.success) {
        const msg = editingDocument ? 'Dokumen berhasil diperbarui!' : 'Dokumen berhasil ditambahkan!';
        setSuccess(msg);
        showToast(msg, 'success');
        setIsModalOpen(false);
        resetForm();
        await fetchDocuments();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyimpan dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const isConfirmed = await confirmDelete({
      title: 'Hapus Dokumen?',
      text: `Apakah Anda yakin ingin menghapus dokumen "${title}"?`,
      confirmButtonText: 'Ya, Hapus Dokumen',
    });

    if (isConfirmed) {
      try {
        const res = await documentService.deleteDocument(id);
        if (res.success) {
          showToast('Dokumen berhasil dihapus.', 'success');
          setSuccess('Dokumen berhasil dihapus.');
          fetchDocuments();
        }
      } catch (err) {
        console.error(err);
        setError('Gagal menghapus dokumen.');
      }
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-purple-700" />
            <span>Kelola Dokumen Organisasi & AD/ART</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Unggah dan kelola berkas legalitas, profil, AD/ART, dan laporan resmi APM Jambi.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-150 text-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Kategori:</span>
          {['ALL', 'AD/ART', 'Profil', 'Legalitas', 'Laporan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'Semua Dokumen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document List Table / Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mb-3" />
          <p className="text-slate-500 text-sm">Memuat daftar dokumen...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-slate-700 font-bold text-base">Belum ada dokumen</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {searchTerm || categoryFilter !== 'ALL'
              ? 'Tidak ada dokumen yang sesuai dengan pencarian atau filter Anda.'
              : 'Klik tombol "Tambah Dokumen Baru" untuk menambahkan berkas AD/ART, Profil, atau Legalitas.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Nama Dokumen & Deskripsi</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4">Ukuran & Format</th>
                  <th className="py-4 px-4">Tanggal Unggah</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded">
                        {doc.file_type || 'PDF'}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">{doc.file_size || '-'}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      {doc.file_path && doc.file_path !== '#' && (
                        <a
                          href={resolveApiAssetUrl(doc.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka</span>
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(doc)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Edit dokumen"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-purple-700" />
                <h2 className="text-xl font-bold text-slate-900">
                  {editingDocument ? 'Edit Dokumen' : 'Tambah Dokumen Resmi Baru'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Contoh: Anggaran Dasar & Anggaran Rumah Tangga APM Jambi"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kategori Dokumen *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                >
                  <option value="AD/ART">AD/ART (Anggaran Dasar & Rumah Tangga)</option>
                  <option value="Profil">Profil Organisasi & Portofolio</option>
                  <option value="Legalitas">Legalitas / Akta Notaris / SK</option>
                  <option value="Laporan">Laporan Tahunan / Program</option>
                  <option value="Lainnya">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Keterangan singkat mengenai isi dokumen..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* Source Mode: Upload file vs External Link */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sumber Dokumen *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      uploadType === 'file'
                        ? 'bg-purple-50 border-purple-600 text-purple-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Unggah Berkas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      uploadType === 'url'
                        ? 'bg-purple-50 border-purple-600 text-purple-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Tautan URL (Drive/Cloud)</span>
                  </button>
                </div>

                {uploadType === 'file' ? (
                  <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-6 text-center space-y-2 transition-colors">
                    <UploadCloud className="w-8 h-8 text-purple-600 mx-auto" />
                    <div className="text-xs text-slate-600">
                      <label className="font-semibold text-purple-700 hover:underline cursor-pointer">
                        Pilih Berkas PDF/DOCX
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.file ? (
                      <p className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
                        File terpilih: {formData.file.name}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">Maksimal 10 MB (Format: PDF, DOCX)</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      name="file_url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={formData.file_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Tampilkan dokumen ke halaman publik</p>
                  <p className="text-xs text-slate-500">Dokumen privat hanya dapat dilihat oleh admin.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <span className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-purple-600 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-500" />
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{editingDocument ? 'Menyimpan...' : 'Menyimpan...'}</span>
                    </>
                  ) : (
                    <span>{editingDocument ? 'Simpan Perubahan' : 'Simpan Dokumen'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
