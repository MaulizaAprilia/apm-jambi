import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  MapPin, 
  MessageSquare, 
  Globe, 
  ExternalLink, 
  Share2, 
  Map, 
  Clock, 
  Send, 
  Check, 
  Copy
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import { initialContact } from '../../data/publicContentDefaults';

export default function Contact() {
  const [contact, setContact] = useState(initialContact);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    emailOrPhone: '',
    subject: 'Konsultasi Kasus / Pendampingan',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    contactService.getPublicContact()
      .then((response) => {
        if (response && response.data) {
          setContact((current) => ({ ...current, ...response.data }));
        }
      })
      .catch(() => {});
  }, []);

  const getMapEmbedSrc = (raw) => {
    if (!raw) return null;
    const match = raw.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
    if (/^https?:\/\//i.test(raw)) return raw;
    return null;
  };

  const defaultMap = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2f7596c3746617%3A0x6b4f7ceec1c7bb39!2sPamenang%2C%20Merangin%20Regency%2C%20Jambi!5e0!3m2!1sid!2sid';
  const mapSrc = getMapEmbedSrc(contact.maps_embed) || defaultMap;

  const displayWhatsapp = contact.whatsapp || '0812-7400-5678';
  const displayEmail = contact.email || 'sekretariat@apmjambi.or.id';
  const displayAddress = contact.address || 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.';

  const cleanWhatsappNumber = (num) => {
    if (!num) return '6281274005678';
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    return cleaned;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = `Halo Admin APM Jambi,
Nama: ${form.name || '-'}
Kontak: ${form.emailOrPhone || '-'}
Perihal: ${form.subject}
Pesan: ${form.message || '-'}`;
    const url = `https://wa.me/${cleanWhatsappNumber(displayWhatsapp)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const socialLinks = [
    { name: 'Facebook', url: contact.facebook || 'https://facebook.com/apmjambi', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Instagram', url: contact.instagram || 'https://instagram.com/apmjambi_official', color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'YouTube', url: contact.youtube || 'https://youtube.com/@apmjambi', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="space-y-12 pb-20 bg-slate-50/60">
      {/* Header Banner */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 px-4 py-20 text-center text-white sm:px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-900/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-200">
            <MapPin className="h-4 w-4 text-rose-400" />
            <span>Kanal Komunikasi & Sekretariat</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Kontak & Lokasi Kantor APM Jambi
          </h1>
          <p className="mx-auto max-w-2xl text-purple-100 text-sm sm:text-base leading-relaxed">
            Hubungi pengurus dan tim advokasi kami melalui WhatsApp, surat elektronik, atau kunjungi kantor sekretariat resmi kami.
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                Layanan Pengaduan & Informasi
              </span>
              <h2 className="text-2xl font-black text-slate-900">Kirim Pesan / Pengaduan Cepat</h2>
              <p className="text-xs text-slate-500">
                Isi formulir di bawah ini untuk terhubung langsung dengan tim admin APM Jambi.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">Terima Kasih, Pesan Anda Telah Siap!</h3>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                    Anda juga dapat langsung mengalihkan pesan ini ke WhatsApp resmi admin untuk respon instan.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Lanjutkan ke WhatsApp</span>
                  </button>
                  <button
                    onClick={() => { setFormSubmitted(false); setForm({ name: '', emailOrPhone: '', subject: 'Konsultasi Kasus / Pendampingan', message: '' }); }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Siti Rahma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Email *</label>
                    <input
                      type="text"
                      required
                      placeholder="0812xxxx atau email@domain.com"
                      value={form.emailOrPhone}
                      onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Keperluan / Kategori Layanan</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50"
                  >
                    <option value="Konsultasi Kasus / Pendampingan">Konsultasi Kasus / Pendampingan Kekerasan</option>
                    <option value="Kemitraan & Kolaborasi Program">Kemitraan & Kolaborasi Program</option>
                    <option value="Kelompok Usaha Bersama (KUB) & UMKM">Kelompok Usaha Bersama (KUB) & UMKM</option>
                    <option value="Informasi Pos Community Center">Informasi Pos Community Center</option>
                    <option value="Pertanyaan Umum Lainnya">Pertanyaan Umum Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Isi Pesan / Narasi Pengaduan *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan pesan atau hal yang ingin Anda sampaikan..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold px-6 py-3 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Sekarang</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Langsung ke WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Channels & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-700" />
                <span>Kanal Kontak Resmi</span>
              </h3>

              <div className="space-y-3">
                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${cleanWhatsappNumber(displayWhatsapp)}?text=${encodeURIComponent('Halo Admin APM Jambi, saya ingin berdiskusi mengenai informasi organisasi.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/90 transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">WhatsApp Resmi</p>
                      <p className="text-sm font-black text-slate-900">{displayWhatsapp}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Email Direct */}
                <a
                  href={`mailto:${displayEmail}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100/90 transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-800 text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Surat Elektronik (Email)</p>
                      <p className="text-sm font-black text-slate-900">{displayEmail}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-purple-700" />
                  <span>Jam Layanan Sekretariat:</span>
                </div>
                <p>Senin – Jumat: <strong>08.30 – 16.30 WIB</strong></p>
                <p className="text-[11px] text-slate-400">Sabtu, Minggu & Hari Libur Nasional: Tutup (Layanan darurat via WhatsApp)</p>
              </div>

              {/* Social Media Links */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Media Sosial Resmi</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-2xs transition-colors ${social.color}`}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>{social.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-80" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Address Card with Copy Button */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-800" />
                  <h4 className="text-base font-bold text-slate-900">Alamat Kantor Utama</h4>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 hover:text-purple-950 cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>

              <address className="not-italic text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {displayAddress}
              </address>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Wilayah Operasional: Merangin · Bungo · Sarolangun</span>
                <span className="font-semibold text-purple-900">Jambi, Indonesia</span>
              </div>
            </div>

          </div>

        </div>

        {/* Google Maps Embed Section */}
        {mapSrc && (
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Map className="h-6 w-6 text-purple-700 shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Peta Lokasi Kantor Sekretariat</h2>
                  <p className="text-xs text-slate-500">Pamenang Barat, Kabupaten Merangin, Jambi</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Pamenang,+Merangin,+Jambi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Petunjuk Arah di Google Maps</span>
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 aspect-[16/9] md:aspect-[21/9] w-full bg-slate-100">
              <iframe
                title="Peta Lokasi Sekretariat APM Jambi"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
