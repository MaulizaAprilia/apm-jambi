import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Save, 
  Loader2, 
  CheckCircle, 
  ShieldCheck, 
  Target, 
  FileCheck, 
  Sparkles,
  MapPin,
  Scale
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import { showToast, showErrorAlert } from '../../utils/alerts';

export default function Profile() {
  const [history, setHistory] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerDescription, setHeaderDescription] = useState('');
  const [historyTitle, setHistoryTitle] = useState('');
  const [structureIntro, setStructureIntro] = useState('');
  const [sourceContent, setSourceContent] = useState({
    tagline: '', 
    profile_purpose: '', 
    profile_vision: '', 
    strategies: '', 
    scope: '',
    beneficiaries: '', 
    project_history: '', 
    legal_status: '', 
    principles: '', 
    funding: '', 
    secretariat_address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileService.getAdminProfile()
      .then((res) => {
        if (res.success && res.data) {
          setHistory(res.data.history || '');
          setVision(res.data.vision || '');
          setMission(res.data.mission || '');
          setHeaderTitle(res.data.header_title || '');
          setHeaderDescription(res.data.header_description || '');
          setHistoryTitle(res.data.history_title || '');
          setStructureIntro(res.data.structure_intro || '');
          setSourceContent((current) => Object.fromEntries(Object.keys(current).map((key) => [key, res.data[key] || ''])));
        }
      })
      .catch((error) => {
        showErrorAlert('Gagal Memuat Profil', error.response?.data?.message || 'Tidak dapat memuat profil organisasi.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileService.updateAdminProfile({
        history,
        vision,
        mission,
        header_title: headerTitle,
        header_description: headerDescription,
        history_title: historyTitle,
        structure_intro: structureIntro,
        ...sourceContent,
      });
      showToast('Profil organisasi dan legalitas hukum berhasil diperbarui.', 'success');
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
        <p className="text-xs font-semibold">Memuat profil organisasi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-purple-700" />
          <span>Profil Organisasi & Legalitas Lembaga</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola sejarah pendirian sejak 2003, visi-misi AD/ART 2024, status pengesahan Kemenkumham, dan deskripsi institusi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Identitas & Pengantar Halaman */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Header Halaman Tentang Kami</h2>
              <p className="text-xs text-slate-500">Judul utama dan tagline yang menyapa pembaca di halaman profil</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Judul Halaman Profil *</label>
                <input 
                  required 
                  value={headerTitle} 
                  onChange={(e) => setHeaderTitle(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Tagline Resmi Organisasi *</label>
                <input 
                  required 
                  value={sourceContent.tagline} 
                  onChange={(e) => setSourceContent({ ...sourceContent, tagline: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat Profil *</label>
              <textarea 
                rows="2" 
                required 
                value={headerDescription} 
                onChange={(e) => setHeaderDescription(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed" 
              />
            </div>
          </div>
        </div>

        {/* Card 2: Sejarah & Rekam Jejak */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sejarah & Rekam Jejak Kelembagaan</h2>
              <p className="text-xs text-slate-500">Transformasi dari Aliansi Perempuan Merangin (2003) hingga APM Jambi (2024)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Judul Bagian Sejarah *</label>
              <input 
                required 
                value={historyTitle} 
                onChange={(e) => setHistoryTitle(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Naskah Sejarah Lengkap *</label>
              <textarea
                rows="5"
                required
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Visi, Misi & Strategi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Visi, Misi & Strategi Pergerakan</h2>
              <p className="text-xs text-slate-500">Arah strategis berperspektif Gender Equality, Disability & Social Inclusion (GEDSI)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Visi Resmi Organisasi (AD/ART 2024) *</label>
              <textarea
                rows="2"
                required
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">6 Misi Utama Organisasi *</label>
              <textarea
                rows="6"
                required
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Strategi Pendekatan (Satu per baris) *</label>
              <textarea 
                rows="3" 
                required 
                value={sourceContent.strategies} 
                onChange={(e) => setSourceContent({ ...sourceContent, strategies: e.target.value })} 
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed" 
              />
            </div>
          </div>
        </div>

        {/* Card 4: Legalitas Hukum & Wilayah Dampingan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Legalitas Hukum & Wilayah Dampingan</h2>
              <p className="text-xs text-slate-500">Status hukum SK Kemenkumham, NPWP, dan cakupan geografis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Status Legalitas & Nomor Pencatatan Hukum *</label>
              <textarea 
                rows="4" 
                required 
                value={sourceContent.legal_status} 
                onChange={(e) => setSourceContent({ ...sourceContent, legal_status: e.target.value })} 
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed font-mono" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Cakupan Wilayah Kerja *</label>
                <input 
                  required 
                  value={sourceContent.scope} 
                  onChange={(e) => setSourceContent({ ...sourceContent, scope: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Sasaran & Kelompok Penerima Manfaat *</label>
                <input 
                  required 
                  value={sourceContent.beneficiaries} 
                  onChange={(e) => setSourceContent({ ...sourceContent, beneficiaries: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pengantar Bagan Struktur Organisasi *</label>
              <textarea 
                rows="2" 
                required 
                value={structureIntro} 
                onChange={(e) => setStructureIntro(e.target.value)} 
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
            <span>Simpan Perubahan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
