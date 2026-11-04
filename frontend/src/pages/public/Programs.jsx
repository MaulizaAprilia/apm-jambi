import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Shield, 
  Users, 
  Search, 
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { programService } from '../../services/programService';
import { contactService } from '../../services/contactService';
import { resolveApiAssetUrl } from '../../services/api';
import { extractPublicItems, initialPrograms, initialContact } from '../../data/publicContentDefaults';

const categoryFilters = [
  'Semua Program',
  'Perlindungan Hukum & Gender',
  'Edukasi & Kesadaran Hukum',
  'Kemandirian Ekonomi',
  'Kesehatan Reproduksi',
  'Advokasi & Kebijakan',
];

export default function Programs() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState(initialContact);

  // Interactive filters
  const [selectedCategory, setSelectedCategory] = useState('Semua Program');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    programService.getPublicPrograms()
      .then((response) => {
        const items = extractPublicItems(response);
        if (items.length > 0) setPrograms(items);
      })
      .catch(() => {
        // Fallback to initialPrograms
        setPrograms(initialPrograms);
      })
      .finally(() => setLoading(false));

    contactService.getPublicContact()
      .then((res) => {
        if (res.success && res.data) setContact(res.data);
      })
      .catch(() => {});
  }, []);

  const cleanWhatsappNumber = (num) => {
    if (!num) return '6281274005678';
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    return cleaned;
  };

  const filteredPrograms = programs.filter((prog) => {
    const matchesCategory = selectedCategory === 'Semua Program' || 
      (prog.category && prog.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (selectedCategory.toLowerCase().includes(String(prog.category || '').toLowerCase()));
    
    const matchesQuery = !searchQuery ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(prog.highlights) && prog.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesQuery;
  });

  const getWhatsappProgramUrl = (progTitle) => {
    const msg = `Halo Admin APM Jambi, saya ingin berkonsultasi mengenai program: "${progTitle}". Mohon informasi selengkapnya.`;
    return `https://wa.me/${cleanWhatsappNumber(contact.whatsapp || '0812-7400-5678')}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="py-12 space-y-16">
      {/* HEADER HERO */}
      <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-purple-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 border border-purple-700 text-xs font-semibold text-purple-200">
            <Users className="w-4 h-4 text-purple-300" />
            <span>Agenda & Program Kerja</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Program Kerja & Layanan APM Jambi
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Rincian 9 pilar aksi nyata pemenuhan hak perempuan, pendampingan hukum, kemandirian ekonomi, serta penguatan pos Community Center di pedesaan.
          </p>

          {/* Interactive Search Bar in Hero */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari program layanan (contoh: HKSR, UMKM, TPKS, paralegal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-xl"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & PROGRAM LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categoryFilters.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Status / Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-purple-800" />
            <span>Memuat rincian program kerja...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPrograms.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3 max-w-lg mx-auto">
            <Shield className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Tidak ada program yang cocok</h3>
            <p className="text-xs text-slate-500">
              Silakan reset kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              onClick={() => { setSelectedCategory('Semua Program'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Program Cards Grid */}
        <div className="space-y-6">
          {!loading && filteredPrograms.map((program, index) => {
            const isEven = index % 2 === 0;
            return (
              <article 
                key={program.id || index}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Description Column */}
                <div className={`lg:col-span-8 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold text-xs uppercase tracking-wider">
                      {program.badge || `Pilar 0${index + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {program.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {program.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>

                  {/* Highlights Bullet Points */}
                  {Array.isArray(program.highlights) && program.highlights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Fokus Aksi & Kegiatan Utama:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {program.highlights.map((item) => (
                          <div key={item} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-slate-700 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={getWhatsappProgramUrl(program.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Konsultasi Program via WhatsApp</span>
                    </a>

                    <Link
                      to="/kontak"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-3 transition-colors"
                    >
                      <span>Ajukan Kemitraan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* Right Visual Image */}
                <div className={`lg:col-span-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-xs group">
                    <img
                      src={resolveApiAssetUrl(program.image) || '/images/workshop.jpg'}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA: AJUKAN KERJA SAMA PROGRAM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 p-8 sm:p-10 text-white border border-purple-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Ingin Bermitra dalam Program APM Jambi?</h3>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
              Kami membuka kolaborasi bersama pemerintah desa, dinas terkait, perguruan tinggi, serta lembaga swadaya masyarakat untuk memajukan kesetaraan gender dan perlindungan anak.
            </p>
          </div>
          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all shrink-0"
          >
            <span>Hubungi Sekretariat APM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
