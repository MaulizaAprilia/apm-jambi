import React, { useEffect, useState, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  X, 
  Maximize2, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { galleryService } from '../../services/galleryService';
import { resolveApiAssetUrl } from '../../services/api';
import { initialGalleries, extractPublicItems } from '../../data/publicContentDefaults';

const categories = [
  'Semua Foto',
  'Pemberdayaan Ekonomi',
  'Advokasi & Hak Hukum',
  'Kesehatan Reproduksi & HKSR',
  'Musyawarah & Kelembagaan',
  'Community Center',
];

export default function Gallery() {
  const [photos, setPhotos] = useState(initialGalleries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Foto');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    galleryService.getPublicGallery({ limit: 50 })
      .then((res) => {
        const items = extractPublicItems(res);
        if (items.length > 0) {
          setPhotos(items);
        } else {
          setPhotos(initialGalleries);
        }
      })
      .catch((err) => {
        // Fallback to initialGalleries
        setPhotos(initialGalleries);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPhotos = photos.filter((item) => {
    if (selectedCategory === 'Semua Foto') return true;
    return item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const selectedPhoto = selectedIndex !== null ? filteredPhotos[selectedIndex] : null;

  const handleNextPhoto = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  }, [selectedIndex, filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [selectedIndex, filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNextPhoto, handlePrevPhoto]);

  return (
    <div className="py-12 space-y-12">
      {/* HEADER HERO */}
      <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-purple-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 border border-purple-700 text-xs font-semibold text-purple-200">
            <ImageIcon className="w-4 h-4 text-purple-300" />
            <span>Dokumentasi Terstruktur</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Galeri Kegiatan & Dokumentasi APM Jambi
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Arsip visual kegiatan advokasi hak perempuan, lokakarya kewirausahaan mandiri, musyawarah kader komunitas, serta interaksi pos pelayanan di pedesaan.
          </p>
        </div>
      </section>

      {/* CATEGORY TABS FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const count = cat === 'Semua Foto' 
              ? photos.length 
              : photos.filter(p => p.category && p.category.toLowerCase().includes(cat.toLowerCase())).length;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedIndex(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-900 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-purple-800" />
            <p className="text-sm font-medium">Memuat galeri dokumentasi...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Belum ada foto dalam kategori ini</h3>
            <p className="text-xs text-slate-500">
              Silakan pilih kategori dokumentasi lain untuk melihat foto kegiatan.
            </p>
            <button
              onClick={() => setSelectedCategory('Semua Foto')}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold"
            >
              Lihat Semua Foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => setSelectedIndex(index)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="h-60 bg-slate-100 overflow-hidden relative">
                  {item.image ? (
                    <img 
                      src={resolveApiAssetUrl(item.image)} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  {item.category && (
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-purple-200 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-purple-800/60">
                      {item.category}
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-xs font-bold">Klik untuk perbesar</span>
                      <Maximize2 className="w-4 h-4 text-purple-300 shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border-t border-slate-100 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 text-[10px] text-slate-400 font-semibold uppercase">
                    Dokumentasi APM Jambi
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FULLSCREEN INTERACTIVE LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Modal Card */}
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-purple-800 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded-md border border-purple-800">
                  {selectedPhoto.category || 'Dokumentasi Kegiatan'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{selectedPhoto.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-purple-300 font-medium">
                  {selectedIndex + 1} / {filteredPhotos.length}
                </span>
                <button 
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo Viewer Container with Left/Right Navigation */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] max-h-[60vh]">
              <img 
                src={resolveApiAssetUrl(selectedPhoto.image)} 
                alt={selectedPhoto.title} 
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />

              {/* Prev Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/20 transition-all cursor-pointer"
                  title="Foto sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/20 transition-all cursor-pointer"
                  title="Foto berikutnya (Panah Kanan)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Description Footer */}
            {selectedPhoto.description && (
              <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 shrink-0">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
