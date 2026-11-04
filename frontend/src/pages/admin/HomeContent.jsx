import React, { useEffect, useState } from 'react';
import { 
  House, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Eye,
  FileText
} from 'lucide-react';
import { homeContentService } from '../../services/homeContentService';
import { showToast, showErrorAlert } from '../../utils/alerts';

const defaultContent = {
  hero_badge: 'Aliansi Perempuan Mandiri Jambi (APM Jambi)',
  hero_title: 'Kekuatan Kolektif untuk Pemberdayaan Perempuan & Anak',
  hero_description: 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kemandirian ekonomi, advokasi hak keadilan gender, dan perlindungan sosial di Provinsi Jambi.',
  about_badge: 'Mengenal APM Jambi',
  about_title: 'Sejarah, Integritas, dan Dedikasi Sejak 2003',
  about_description: 'Profil organisasi mencatat bahwa Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi) dan memperluas jangkauan pemberdayaan di Provinsi Jambi.',
};

export default function HomeContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    homeContentService.getAdminContent()
      .then((response) => {
        if (response.success && response.data) {
          setContent((current) => ({ ...current, ...response.data }));
        }
      })
      .catch((error) => {
        showErrorAlert('Gagal Memuat', error.response?.data?.message || 'Tidak dapat memuat konten beranda.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await homeContentService.updateAdminContent(content);
      showToast('Konten beranda berhasil diperbarui dan disinkronkan.', 'success');
    } catch (error) {
      showErrorAlert('Gagal Menyimpan', error.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
        <p className="text-xs font-semibold">Memuat konfigurasi beranda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <House className="w-6 h-6 text-purple-700" />
          <span>Kustomisasi Konten Beranda</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur teks hero utama, slogan gerakan, dan ringkasan pengantar organisasi di halaman depan website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Header Hero Beranda (Slider Utama)</h2>
              <p className="text-xs text-slate-500">Teks pembuka pertama yang dibaca pengunjung website</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Badge Label Hero</label>
              <input
                type="text"
                required
                value={content.hero_badge || ''}
                onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Judul Utama Hero (Tagline Utama)</label>
              <textarea
                rows="2"
                required
                value={content.hero_title || ''}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Deskripsi Lengkap Hero</label>
              <textarea
                rows="3"
                required
                value={content.hero_description || ''}
                onChange={(e) => setContent({ ...content, hero_description: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Mengenal APM Jambi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Bagian Pengantar (Mengenal APM Jambi)</h2>
              <p className="text-xs text-slate-500">Penjelasan ringkas visi, dedikasi, dan rekam jejak organisasi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Label Bagian Pengantar</label>
                <input
                  type="text"
                  required
                  value={content.about_badge || ''}
                  onChange={(e) => setContent({ ...content, about_badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Judul Bagian Pengantar</label>
                <input
                  type="text"
                  required
                  value={content.about_title || ''}
                  onChange={(e) => setContent({ ...content, about_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Deskripsi / Ringkasan Profil</label>
              <textarea
                rows="4"
                required
                value={content.about_description || ''}
                onChange={(e) => setContent({ ...content, about_description: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Konten</span>
          </button>
        </div>
      </form>
    </div>
  );
}
