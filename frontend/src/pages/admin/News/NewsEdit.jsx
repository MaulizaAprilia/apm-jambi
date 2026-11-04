import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle, Lock, User } from 'lucide-react';
import { newsService } from '../../../services/newsService';
import { authService } from '../../../services/authService';
import { showWarningAlert, showToast } from '../../../utils/alerts';

export default function NewsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getUserData();

  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('published');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsService.getAdminNewsById(id)
      .then((res) => {
        const item = res.data || res;
        if (item) {
          setTitle(item.title || '');
          setSlug(item.slug || '');
          setStatus(item.status || 'published');
          setContent(item.content || '');
          setAuthor(item.author || currentUser?.name || 'Admin APM Jambi');
          setImagePreview(item.featured_image || null);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Gagal memuat data berita.');
      })
      .finally(() => setLoading(false));
  }, [id, currentUser?.name]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarningAlert('File Terlalu Besar', 'Ukuran file gambar maksimal 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('status', status);
    formData.append('author', author);
    formData.append('content', content);
    if (imageFile) {
      formData.append('featured_image', imageFile);
    }

    try {
      await newsService.updateNews(id, formData);
      showToast('Artikel berita berhasil diperbarui!', 'success');
      navigate('/admin/news');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui berita.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
        <p className="text-xs font-semibold">Memuat data artikel berita...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 hover:text-purple-950 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Berita</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Artikel Berita #{id}</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Judul Berita *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Reporter / Penulis (Locked) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Identitas Penulis / Reporter
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-md">
              <Lock className="w-3 h-3" /> Terkunci (Read-Only)
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={author}
              readOnly
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-2.5 text-xs text-slate-700 font-medium cursor-not-allowed select-none shadow-xs"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Nama penulis dikunci sesuai identitas pembuat/reporter artikel dan tidak dapat diubah sembarangan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Status Publikasi</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="published">Published (Tampil Publik)</option>
              <option value="draft">Draft (Simpan Internal)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Ganti Gambar Utama (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Gambar Utama Saat Ini:</p>
            <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-xl object-cover border border-slate-200 shadow-xs" />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Isi Konten Berita *</label>
          <textarea
            rows="10"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Link
            to="/admin/news"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Perbarui Artikel</span>
          </button>
        </div>
      </form>
    </div>
  );
}
