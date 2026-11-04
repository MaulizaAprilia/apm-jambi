import React, { useEffect, useState } from 'react';
import { 
  Contact as ContactIcon, 
  Save, 
  Loader2, 
  CheckCircle, 
  MapPin, 
  MessageSquare, 
  Mail, 
  Globe, 
  ExternalLink,
  Share2
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import { showToast, showErrorAlert } from '../../utils/alerts';

export default function Contact() {
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [mapsEmbed, setMapsEmbed] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contactService.getAdminContact()
      .then((res) => {
        if (res.success && res.data) {
          setAddress(res.data.address || '');
          setWhatsapp(res.data.whatsapp || '');
          setEmail(res.data.email || '');
          setFacebook(res.data.facebook || '');
          setInstagram(res.data.instagram || '');
          setYoutube(res.data.youtube || '');
          setMapsEmbed(res.data.maps_embed || '');
        }
      })
      .catch((error) => {
        showErrorAlert('Gagal Memuat Kontak', error.response?.data?.message || 'Tidak dapat memuat informasi kontak.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      address,
      whatsapp,
      email,
      facebook,
      instagram,
      youtube,
      maps_embed: mapsEmbed
    };

    try {
      await contactService.updateAdminContact(payload);
      showToast('Informasi kontak berhasil diperbarui dan disinkronkan ke situs publik.', 'success');
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
        <p className="text-xs font-semibold">Memuat informasi kontak...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ContactIcon className="w-6 h-6 text-purple-700" />
          <span>Informasi Kontak & Lokasi Sekretariat</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur nomor layanan pengaduan WhatsApp, email resmi, tautan media sosial, dan peta Google Maps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Alamat Sekretariat & Peta Lokasi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Alamat Sekretariat & Titik Lokasi Peta</h2>
              <p className="text-xs text-slate-500">Pusat operasional dan pos pengaduan fisik APM Jambi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Lengkap Sekretariat *</label>
              <textarea
                rows="3"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">URL Embed Google Maps (iframe src)</label>
              <input
                type="text"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={mapsEmbed}
                onChange={(e) => setMapsEmbed(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-[11px] text-slate-400">
                Masukkan tautan `src` dari fitur Share → Embed a map di Google Maps
              </p>
            </div>

            {mapsEmbed && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                <iframe
                  title="Pratinjau Peta"
                  src={mapsEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Saluran Komunikasi Langsung */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Saluran Komunikasi Langsung</h2>
              <p className="text-xs text-slate-500">Nomor kontak rujukan darurat dan surat-menyurat resmi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nomor WhatsApp Pengaduan *</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0812-7400-5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email Resmi *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="sekretariat@apmjambi.or.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Media Sosial & Kanal Publikasi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Kanal Media Sosial & Publikasi Digital</h2>
              <p className="text-xs text-slate-500">Tautan profil resmi organisasi di jejaring sosial</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tautan Facebook</label>
              <input
                type="url"
                placeholder="https://facebook.com/apmjambi"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tautan Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/apmjambi_official"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tautan YouTube</label>
              <input
                type="url"
                placeholder="https://youtube.com/@apmjambi"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            <span>Simpan Informasi Kontak</span>
          </button>
        </div>
      </form>
    </div>
  );
}
