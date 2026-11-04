import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon, 
  ShieldCheck, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Building2, 
  MessageSquare, 
  Sparkles, 
  Maximize2, 
  X, 
  User 
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { galleryService } from '../../services/galleryService';
import { homeContentService } from '../../services/homeContentService';
import { programService } from '../../services/programService';
import { contactService } from '../../services/contactService';
import { resolveApiAssetUrl } from '../../services/api';
import { 
  extractPublicItems, 
  initialHomeContent, 
  initialPrograms, 
  initialGalleries, 
  initialContact 
} from '../../data/publicContentDefaults';

const heroSlides = [
  {
    badge: 'Aliansi Perempuan Mandiri Jambi',
    title: 'Kekuatan Kolektif untuk Pemberdayaan Perempuan & Anak',
    description: 'Mengakar kuat bersama komunitas akar rumput di Merangin, Bungo, dan Sarolangun dalam memperjuangkan hak sosial, hukum, dan ekonomi berperspektif gender.',
    image: '/images/hero.jpg',
    primaryBtn: { text: 'Jelajahi Program Kami', link: '/program' },
    secondaryBtn: { text: 'Profil Organisasi', link: '/tentang' },
    tag: 'Fokus Gerakan'
  },
  {
    badge: 'Advokasi & Hak Hukum',
    title: 'Layanan Pendampingan Kasus & Edukasi UU TPKS / PKDRT',
    description: 'Menyediakan bantuan rujukan, penguatan paralegal komunitas di pedesaan, serta pendampingan komprehensif bagi korban kekerasan seksual dan domestik.',
    image: '/images/advocacy.jpg',
    primaryBtn: { text: 'Layanan Pendampingan', link: '/program' },
    secondaryBtn: { text: 'Hubungi Kontak Kasus', link: '/kontak' },
    tag: 'Perlindungan Korban'
  },
  {
    badge: 'Kemandirian Ekonomi',
    title: 'Pelatihan Kewirausahaan & 33+ Jejaring Community Center',
    description: 'Mendorong kemandirian finansial kader perempuan desa melalui kelompok usaha bersama (KUB), olahan pangan lokal, dan literasi tata kelola keuangan.',
    image: '/images/workshop.jpg',
    primaryBtn: { text: 'Kelompok Usaha Bersama', link: '/program' },
    secondaryBtn: { text: 'Galeri Kegiatan', link: '/galeri' },
    tag: 'Pemberdayaan Ekonomi'
  }
];

export default function Home() {
  const [content, setContent] = useState(initialHomeContent);
  const [programs, setPrograms] = useState(initialPrograms.slice(0, 4));
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState(initialGalleries.slice(0, 6));
  const [contact, setContact] = useState(initialContact);
  
  // Interactive Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  // Home Lightbox Modal State
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    homeContentService.getPublicContent()
      .then((response) => {
        if (response.success && response.data) {
          const publishedContent = Object.fromEntries(
            Object.entries(response.data).filter(([, value]) => value !== null && value !== '')
          );
          setContent((current) => ({ ...current, ...publishedContent }));
        }
      })
      .catch(() => {});

    programService.getPublicPrograms()
      .then((response) => {
        const items = extractPublicItems(response);
        if (items.length > 0) setPrograms(items.slice(0, 4));
      })
      .catch(() => {});

    newsService.getPublicNews({ limit: 3 })
      .then((response) => {
        const items = extractPublicItems(response);
        if (items.length > 0) setNews(items.slice(0, 3));
      })
      .catch(() => {});

    galleryService.getPublicGallery({ limit: 6 })
      .then((response) => {
        const items = extractPublicItems(response);
        if (items.length > 0) setGallery(items.slice(0, 6));
      })
      .catch(() => {});

    contactService.getPublicContact()
      .then((response) => {
        if (response.success && response.data) {
          setContact((current) => ({ ...current, ...response.data }));
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance banner slider
  useEffect(() => {
    if (isPaused) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(slideTimerRef.current);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const cleanWhatsappNumber = (num) => {
    if (!num) return '6281274005678';
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    return cleaned;
  };

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber(contact.whatsapp || '0812-7400-5678')}?text=${encodeURIComponent('Halo Admin APM Jambi, saya ingin berdiskusi mengenai program atau informasi lembaga.')}`;

  return (
    <div className="space-y-16 pb-20 overflow-hidden bg-slate-50/60">
      
      {/* 1. INTERACTIVE HERO BANNER SLIDER */}
      <section 
        className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide Background Images */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover filter contrast-125 transition-transform duration-[7000ms]"
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-950/90 to-slate-950/75 z-0" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/60 z-0" />

        {/* Ambient Decorative Glows */}
        <div className="absolute -top-10 -left-10 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-900/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-200 backdrop-blur-md shadow-xs">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                <span>{heroSlides[currentSlide].badge}</span>
              </div>

              {/* Title with smooth keyframe animation */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                {heroSlides[currentSlide].title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-purple-100/90 max-w-2xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={heroSlides[currentSlide].primaryBtn.link}
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/40 transition-all duration-200 hover:from-rose-500 hover:to-rose-600 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>{heroSlides[currentSlide].primaryBtn.text}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to={heroSlides[currentSlide].secondaryBtn.link}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
                >
                  <span>{heroSlides[currentSlide].secondaryBtn.text}</span>
                  <ChevronRight className="h-4 w-4 text-purple-300" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 px-5 py-3.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/60 transition-all duration-200"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp Cepat</span>
                </a>
              </div>

              {/* Working Scope Footer in Hero */}
              <div className="pt-4 border-t border-purple-800/60 flex flex-wrap items-center gap-6 text-xs text-purple-300 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <span>Wilayah Kerja: <strong>Merangin · Bungo · Sarolangun</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-300" />
                  <span>Sekretariat: Marga Mulya, Pamenang Barat</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Showcase Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900">
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full w-fit mb-2">
                      {heroSlides[currentSlide].tag}
                    </span>
                    <p className="text-xs font-semibold text-purple-100 line-clamp-2">
                      Dokumentasi Aksi Nyata Aliansi Perempuan Mandiri Jambi
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ke slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-rose-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="-mt-10 relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="p-3 sm:p-4 border-r border-slate-100 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-purple-950">3</p>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kabupaten Wilayah Kerja</p>
            <p className="text-[11px] text-slate-400">Merangin, Bungo, & Sarolangun</p>
          </div>
          <div className="p-3 sm:p-4 lg:border-r border-slate-100 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-purple-950">33+</p>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pos Community Center</p>
            <p className="text-[11px] text-slate-400">Jejaring perempuan akar rumput</p>
          </div>
          <div className="p-3 sm:p-4 border-r border-slate-100 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-purple-950">2003</p>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tahun Berdiri</p>
            <p className="text-[11px] text-slate-400">23+ tahun dedikasi advokasi</p>
          </div>
          <div className="p-3 sm:p-4 space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-rose-700">9</p>
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pilar Program Kerja</p>
            <p className="text-[11px] text-slate-400">HKSR, TPKS, PKDRT, & Ekonomi</p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT OVERVIEW SECTION (Sekilas Profil APM Jambi) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Description Left */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-900">
                <Award className="h-4 w-4 text-purple-700" />
                <span>{content.about_badge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {content.about_title}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {content.about_description}
              </p>
            </div>

            {/* Visual Photo Showcase in About */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] group relative">
                <img 
                  src="/images/advocacy.jpg" 
                  alt="Pendampingan Advokasi APM" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] font-bold text-white">Pendampingan Korban</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] group relative">
                <img 
                  src="/images/workshop.jpg" 
                  alt="Pelatihan Komunitas APM" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] font-bold text-white">Pelatihan Kemandirian</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/tentang"
                className="group inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-950"
              >
                <span>Lihat Profil Lengkap, Struktur Pengurus & Visi-Misi</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-purple-700" />
              </Link>
            </div>
          </div>

          {/* Right Quote & Leadership Highlight */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-8 sm:p-10 rounded-3xl border border-purple-800 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
            
            <div className="space-y-5 relative z-10">
              <span className="inline-block px-3 py-1 rounded-lg bg-rose-600/30 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                Komitmen Lembaga
              </span>
              <blockquote className="text-lg sm:text-xl font-bold leading-relaxed text-purple-50 italic">
                “Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kekuatan kolektif untuk pemberdayaan perempuan dan anak di Provinsi Jambi.”
              </blockquote>
              <div className="pt-4 border-t border-purple-800/80 space-y-1">
                <p className="text-sm font-black text-white">Marsiyam</p>
                <p className="text-xs text-purple-300 font-medium">Direktur APM Jambi (Direktur Eksekutif)</p>
              </div>
            </div>

            {/* Quick Principles Pills */}
            <div className="pt-6 relative z-10 border-t border-purple-800/60 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-purple-900/60 p-2.5 rounded-xl border border-purple-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Peka GEDSI & Inklusi</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/60 p-2.5 rounded-xl border border-purple-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nol Toleransi Kekerasan</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/60 p-2.5 rounded-xl border border-purple-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Non-Partisan & Akuntabel</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/60 p-2.5 rounded-xl border border-purple-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kepemimpinan Akar Rumput</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PROGRAM & KEGIATAN UTAMA (Highlights) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Kerja & Layanan Komunitas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pilar Aksi Nyata Pemberdayaan
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Fokus pelayanan dan pengorganisasian APM Jambi untuk mewujudkan hak otonomi perempuan.
            </p>
          </div>
          <Link
            to="/program"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-700"
          >
            <span>Lihat Semua 9 Pilar Program</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog, idx) => (
            <div 
              key={prog.id || idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900">
                    {prog.badge || `Layanan 0${idx + 1}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{prog.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-2">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/program"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 group-hover:text-rose-600 transition-colors"
                >
                  <span>Detail Program</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BERITA & PUBLIKASI KEGIATAN TERBARU */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-900 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-purple-700" />
              <span>Kabar Terkini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Berita & Publikasi Kegiatan
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Informasi terkini mengenai agenda, advokasi lapangan, dan kegiatan komunitas di Jambi.
            </p>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-700"
          >
            <span>Buka Semua Publikasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img
                  src={resolveApiAssetUrl(item.featured_image) || '/images/hero.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.category && (
                  <span className="absolute top-4 left-4 bg-purple-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-700/50">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {item.author && (
                      <span className="flex items-center gap-1 line-clamp-1">
                        <User className="w-3.5 h-3.5" />
                        {item.author.split('(')[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/berita/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-rose-600 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. DOKUMENTASI GALERI FOTO PILIHAN (With Lightbox Preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-900 text-xs font-bold uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Dokumentasi Lapangan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Galeri Kegiatan APM Jambi
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Dokumentasi aktivitas pelatihan, musyawarah desa, dan pendampingan warga.
            </p>
          </div>
          <Link
            to="/galeri"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-700"
          >
            <span>Buka Seluruh Galeri Foto</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewPhoto(item)}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 cursor-pointer border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300"
            >
              <img
                src={resolveApiAssetUrl(item.image)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-white">
                <Maximize2 className="w-4 h-4 text-purple-300 mb-1" />
                <p className="text-[11px] font-bold line-clamp-1 leading-tight">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. QUICK CONTACT & CALL TO ACTION (CTA) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-purple-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Konsultasi & Pengaduan Cepat</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Mari Bersama Membangun Masa Depan Perempuan Berdaya
              </h2>
              <p className="text-purple-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                Apakah Anda membutuhkan pendampingan kasus, ingin bermitra dalam program pemberdayaan, atau membutuhkan informasi lebih lanjut mengenai APM Jambi? Tim kami siap merespons Anda.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Hubungi via WhatsApp</span>
              </a>

              <Link
                to="/kontak"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 text-sm font-semibold transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-purple-300" />
                <span>Lihat Alamat & Lokasi Kantor</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal on Home */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-purple-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded-md border border-purple-800">
                  {previewPhoto.category || 'Dokumentasi Lapangan'}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">{previewPhoto.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewPhoto(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-hidden flex items-center justify-center bg-black">
              <img src={resolveApiAssetUrl(previewPhoto.image)} alt={previewPhoto.title} className="max-h-[65vh] w-auto object-contain" />
            </div>
            {previewPhoto.description && (
              <div className="p-4 bg-slate-950 border-t border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed">{previewPhoto.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
