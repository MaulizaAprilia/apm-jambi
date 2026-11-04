import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { galleryService } from '../../../services/galleryService';
import { showWarningAlert, showToast } from '../../../utils/alerts';

export default function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    galleryService.getAdminGalleryById(id)
      .then((res) => {
        const item = res.data || res;
        if (item) {
          setTitle(item.title || '');
          setDescription(item.description || '');
          setImagePreview(item.image || null);
        }
      })
      .catch((error) => {
        setError(error.response?.data?.message || 'Gagal memuat data galeri.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarningAlert('File Terlalu Besar', 'Ukuran file foto maksimal 5MB.');
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
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await galleryService.updateGallery(id, formData);
      showToast('Foto galeri berhasil diperbarui.', 'success');
      navigate('/admin/gallery');
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal memperbarui foto galeri.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
        <p className="text-xs font-semibold">Memuat data foto galeri...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 hover:text-purple-950 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Galeri</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Foto Galeri #{id}</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Judul / Nama Kegiatan *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Ganti Foto (Opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        {imagePreview && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Foto Saat Ini:</p>
            <img src={imagePreview} alt="Preview" className="h-48 w-auto rounded-xl object-cover" />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Keterangan / Deskripsi Foto</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Link
            to="/admin/gallery"
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
            <span>Perbarui Foto</span>
          </button>
        </div>
      </form>
    </div>
  );
}
