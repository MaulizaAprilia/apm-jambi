import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Search, 
  Image as ImageIcon,
  Maximize2,
  X,
  ExternalLink,
  Tag
} from 'lucide-react';
import { galleryService } from '../../../services/galleryService';
import { resolveApiAssetUrl } from '../../../services/api';
import { confirmDelete, showToast, showErrorAlert } from '../../../utils/alerts';

const CATEGORIES = [
  'Semua Kategori',
  'Pemberdayaan Ekonomi',
  'Advokasi & Hak Hukum',
  'Musyawarah & Kelembagaan',
  'Kesehatan Reproduksi & HKSR',
  'Community Center',
];

export default function GalleryList() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getAdminGallery();
      const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setGallery(items);
    } catch (error) {
      showErrorAlert('Gagal Memuat Galeri', error.response?.data?.message || 'Tidak dapat memuat dokumentasi foto.');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const isConfirmed = await confirmDelete({
      title: 'Hapus Foto Dokumentasi?',
      text: `Apakah Anda yakin ingin menghapus foto "${title}"? Foto yang dihapus tidak dapat dipulihkan.`,
      confirmButtonText: 'Ya, Hapus Foto',
    });

    if (isConfirmed) {
      try {
        await galleryService.deleteGallery(id);
        showToast('Foto dokumentasi berhasil dihapus.', 'success');
        await fetchGallery();
      } catch (error) {
        showErrorAlert('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = 
      categoryFilter === 'Semua Kategori' ||
      (item.category && item.category.toLowerCase().includes(categoryFilter.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(categoryFilter.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-700" />
            <span>Manajemen Galeri Dokumentasi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola arsip visual kegiatan lapangan, pelatihan, musyawarah, dan advokasi APM Jambi
          </p>
        </div>
        <Link
          to="/admin/gallery/create"
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul atau deskripsi foto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
          <p className="text-xs">Memuat galeri foto...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-semibold">Tidak ada foto dokumentasi yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Photo Image with category badge */}
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                <img
                  src={resolveApiAssetUrl(item.image) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                  {item.category || 'Dokumentasi Lapangan'}
                </span>

                <button
                  onClick={() => setPreviewPhoto(item)}
                  className="absolute bottom-3 right-3 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:bg-purple-700 transition-colors cursor-pointer"
                  title="Lihat Gambar Penuh"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-purple-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description || 'Dokumentasi kegiatan resmi Aliansi Perempuan Mandiri Jambi.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">
                    ID #{item.id}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/admin/gallery/${item.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                      title="Edit Foto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-3xl w-full text-white shadow-2xl space-y-4 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <div>
                <h4 className="text-sm font-bold truncate max-w-md">{previewPhoto.title}</h4>
                <p className="text-xs text-purple-300">{previewPhoto.category || 'Dokumentasi Kegiatan'}</p>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={resolveApiAssetUrl(previewPhoto.image)}
                alt={previewPhoto.title}
                className="max-h-[62vh] w-auto object-contain"
              />
            </div>

            {previewPhoto.description && (
              <p className="text-xs text-slate-300 px-2 pb-1 leading-relaxed">
                {previewPhoto.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
