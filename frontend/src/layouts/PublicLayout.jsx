import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  MapPin, 
  Shield, 
  ChevronDown, 
  MessageSquare, 
  Mail
} from 'lucide-react';
import { contactService } from '../services/contactService';
import { programService } from '../services/programService';
import { extractPublicItems, initialPrograms, initialContact } from '../data/publicContentDefaults';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [footerContact, setFooterContact] = useState(initialContact);
  const [footerPrograms, setFooterPrograms] = useState(initialPrograms.slice(0, 4));
  const location = useLocation();

  const primaryLinks = [{ path: '/', label: 'Beranda' }];
  const endLinks = [{ path: '/kontak', label: 'Kontak' }];
  const navGroups = [
    {
      label: 'Tentang APM',
      links: [
        { path: '/tentang', label: 'Profil & Sejarah' },
        { path: '/tentang#visi-misi', label: 'Visi & Misi' },
        { path: '/tentang#struktur-pengurus', label: 'Struktur Organisasi' },
        { path: '/tentang#pedoman-perilaku', label: 'Pedoman Perilaku (16 Prinsip)' },
        { path: '/tentang#mars-hymne', label: 'Mars & Hymne APM' },
        { path: '/tentang#community-centers', label: 'Jaringan Community Center' },
        { path: '/tentang#mitra-strategis', label: 'Mitra & Kolaborasi' },
        { path: '/tentang#dokumen-legalitas', label: 'Dokumen Resmi & SK' },
      ],
    },
    { kind: 'link', path: '/program', label: 'Program & Kegiatan' },
    {
      label: 'Publikasi',
      links: [
        { path: '/berita', label: 'Berita & Artikel' },
        { path: '/galeri', label: 'Galeri Foto Kegiatan' },
      ],
    },
  ];

  const footerLinks = [
    ...primaryLinks,
    { path: '/program', label: 'Program & Kegiatan' },
    { path: '/tentang', label: 'Tentang APM' },
    { path: '/berita', label: 'Berita & Artikel' },
    { path: '/galeri', label: 'Galeri Kegiatan' },
    ...endLinks,
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isGroupActive = (group) => group.kind === 'link'
    ? isActive(group.path)
    : group.links.some((link) => isActive(link.path.split('#')[0]));

  const closeNavigation = () => {
    setOpenDesktopGroup(null);
    setOpenMobileGroup(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    contactService.getPublicContact()
      .then((response) => {
        if (response.success && response.data) {
          setFooterContact((current) => ({ ...current, ...response.data }));
        }
      })
      .catch(() => {});

    programService.getPublicPrograms()
      .then((response) => {
        const items = extractPublicItems(response);
        if (items.length > 0) setFooterPrograms(items.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const cleanWhatsappNumber = (num) => {
    if (!num) return '6281274005678';
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    return cleaned;
  };

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber(footerContact.whatsapp || '0812-7400-5678')}?text=${encodeURIComponent('Halo Admin APM Jambi, saya ingin bertanya mengenai program dan informasi organisasi.')}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 selection:bg-purple-100 selection:text-purple-900 font-sans relative">
      {/* Top Banner Bar with Quick Contacts & Admin Link */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-purple-200 text-xs py-2 px-4 border-b border-purple-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              Aliansi Perempuan Mandiri Jambi
            </span>
            <span className="hidden md:inline text-purple-600">•</span>
            <span className="hidden md:inline text-purple-300">
              SK Kemenkumham RI: AHU-0001146.AH.01.08.TAHUN 2025
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp:</span>
              <span>{footerContact.whatsapp || '0812-7400-5678'}</span>
            </a>

            <a 
              href={`mailto:${footerContact.email || 'sekretariat@apmjambi.or.id'}`}
              className="hidden lg:flex items-center gap-1 text-purple-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{footerContact.email || 'sekretariat@apmjambi.or.id'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpenDesktopGroup(null);
            setOpenMobileGroup(null);
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-20 gap-4">
            {/* Brand Logo */}
            <Link to="/" onClick={closeNavigation} className="flex items-center space-x-3 group">
              <img
                src="/images/logo-bg.png"
                alt="Logo APM Jambi"
                className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-purple-950 tracking-tight leading-tight group-hover:text-purple-700 transition-colors">
                  APM JAMBI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Aliansi Perempuan Mandiri
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeNavigation}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'text-purple-950 bg-purple-100/70 font-bold'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {navGroups.map((group) => {
                if (group.kind === 'link') {
                  return (
                    <Link
                      key={group.path}
                      to={group.path}
                      onClick={closeNavigation}
                      aria-current={isActive(group.path) ? 'page' : undefined}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive(group.path)
                          ? 'text-purple-950 bg-purple-100/70 font-bold'
                          : 'text-slate-600 hover:text-purple-900 hover:bg-slate-100'
                      }`}
                    >
                      {group.label}
                    </Link>
                  );
                }
                const expanded = openDesktopGroup === group.label;
                const active = isGroupActive(group);
                return (
                  <div className="relative" key={group.label}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-haspopup="true"
                      onClick={() => setOpenDesktopGroup(expanded ? null : group.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        active || expanded
                          ? 'text-purple-950 bg-purple-100/70 font-bold'
                          : 'text-slate-600 hover:text-purple-900 hover:bg-slate-100'
                      }`}
                    >
                      {group.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-purple-900/60 bg-purple-950 p-2 text-white shadow-2xl shadow-purple-950/30 animate-in fade-in slide-in-from-top-1 duration-150">
                        <p className="px-3 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                          {group.label}
                        </p>
                        <div className="h-px bg-purple-800/80 mb-1" />
                        <div className="space-y-0.5">
                          {group.links.map((link) => {
                            const activeLink = isActive(link.path.split('#')[0])
                              && (!link.path.includes('#') || location.hash === link.path.slice(link.path.indexOf('#')));
                            return (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeNavigation}
                                aria-current={activeLink ? 'page' : undefined}
                                className={`block rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                                  activeLink
                                    ? 'bg-purple-800 text-white font-bold'
                                    : 'text-purple-100 hover:bg-purple-900/80 hover:text-white'
                                }`}
                              >
                                {link.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {endLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeNavigation}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'text-purple-950 bg-purple-100/70 font-bold'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Direct CTA Header Button */}
              <div className="pl-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-emerald-500 hover:to-teal-600 hover:shadow-md transition-all duration-200"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Konsultasi Cepat</span>
                </a>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-purple-900 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl space-y-2">
            <div className="space-y-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeNavigation}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isActive(link.path) ? 'bg-purple-100 text-purple-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {navGroups.map((group) => {
                if (group.kind === 'link') {
                  return (
                    <Link
                      key={group.path}
                      to={group.path}
                      onClick={closeNavigation}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-semibold ${
                        isActive(group.path) ? 'bg-purple-100 text-purple-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {group.label}
                    </Link>
                  );
                }
                const expanded = openMobileGroup === group.label;
                return (
                  <div key={group.label} className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => setOpenMobileGroup(expanded ? null : group.label)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700"
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="mt-1 ml-4 border-l-2 border-purple-200 pl-3 space-y-1">
                        {group.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={closeNavigation}
                            className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:text-purple-950 hover:bg-purple-50"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {endLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeNavigation}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isActive(link.path) ? 'bg-purple-100 text-purple-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content View */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Interactive Floating WhatsApp Button */}
      <aside aria-label="Akses Cepat WhatsApp" className="fixed bottom-6 right-6 z-50 group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 shadow-2xl shadow-emerald-950/40 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline font-bold text-sm tracking-wide">
            Konsultasi Admin
          </span>
        </a>
      </aside>

      {/* Modern High-Impact Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-purple-900/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Organization Bio */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/logo-bg.png"
                  alt="Logo APM Jambi"
                  className="h-12 w-auto object-contain bg-white p-1 rounded-xl shadow-xs"
                />
                <div>
                  <span className="text-xl font-black text-white tracking-wide block">APM JAMBI</span>
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">Aliansi Perempuan Mandiri</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Organisasi perempuan berbentuk perkumpulan yang berdedikasi membangun otonomi perempuan pedesaan dan anak di Provinsi Jambi sejak tahun 2003.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-purple-300 font-semibold">
                <span className="px-3 py-1 rounded-full bg-purple-900/50 border border-purple-800">
                  SK Kemenkumham RI 2025
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/50 border border-purple-800">
                  NPWP: 02.372.149.1-333.000
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/50 border border-purple-800">
                  33+ Community Center
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-3">
                Navigasi Situs
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {footerLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={closeNavigation}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <span className="text-purple-400">›</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Program Pillars */}
            <div>
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-purple-500 pl-3">
                Pilar Utama Program
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                {footerPrograms.map((program) => (
                  <li key={program.id} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="line-clamp-2">{program.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Secretariat & Contact */}
            <div className="space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
                Sekretariat & Hubungan
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                  <span>{footerContact.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-300 underline font-medium">
                    {footerContact.whatsapp || '0812-7400-5678'} (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href={`mailto:${footerContact.email || 'sekretariat@apmjambi.or.id'}`} className="hover:text-purple-300">
                    {footerContact.email || 'sekretariat@apmjambi.or.id'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Sign-off */}
          <div className="pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Aliansi Perempuan Mandiri Jambi (APM Jambi). Hak Cipta Dilindungi.</p>
            <p className="text-slate-500">Website Profil & Publikasi Kegiatan Resmi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
