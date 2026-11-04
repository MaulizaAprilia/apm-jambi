import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Building2, 
  Contact, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck,
  ExternalLink,
  FileCheck,
  House,
  ListChecks,
  UsersRound,
  Users,
  MapPin,
  Globe
} from 'lucide-react';
import { authService } from '../services/authService';
import { confirmLogout } from '../utils/alerts';

// Grouped navigation for clean, professional hierarchy
const navGroups = [
  {
    group: 'Menu Utama',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Publikasi & Media',
    items: [
      { path: '/admin/news', label: 'Berita & Artikel', icon: FileText },
      { path: '/admin/gallery', label: 'Galeri Dokumentasi', icon: ImageIcon },
      { path: '/admin/documents', label: 'Dokumen & SK', icon: FileCheck },
      { path: '/admin/home-content', label: 'Konten Beranda', icon: House },
    ],
  },
  {
    group: 'Lembaga & Komunitas',
    items: [
      { path: '/admin/programs', label: 'Program & Layanan', icon: ListChecks },
      { path: '/admin/profile', label: 'Profil Organisasi', icon: Building2 },
      { path: '/admin/organization-structure', label: 'Struktur Organisasi', icon: UsersRound },
      { path: '/admin/community-centers', label: 'Community Center', icon: MapPin },
    ],
  },
  {
    group: 'Sistem & Pengaturan',
    items: [
      { path: '/admin/users', label: 'Kelola Akun & Hak Akses', icon: Users },
      { path: '/admin/contact', label: 'Informasi Kontak', icon: Contact },
    ],
  },
];

// Helper to determine active section name
const getSectionInfo = (pathname) => {
  if (pathname.includes('/admin/news')) return { title: 'Manajemen Berita & Publikasi', parent: 'Publikasi & Media' };
  if (pathname.includes('/admin/gallery')) return { title: 'Manajemen Galeri Kegiatan', parent: 'Publikasi & Media' };
  if (pathname.includes('/admin/documents')) return { title: 'Arsip Dokumen Resmi & SK', parent: 'Publikasi & Media' };
  if (pathname.includes('/admin/home-content')) return { title: 'Kustomisasi Konten Beranda', parent: 'Publikasi & Media' };
  if (pathname.includes('/admin/programs')) return { title: 'Kelola 9 Program & Layanan', parent: 'Lembaga & Komunitas' };
  if (pathname.includes('/admin/profile')) return { title: 'Profil & Visi Misi Lembaga', parent: 'Lembaga & Komunitas' };
  if (pathname.includes('/admin/organization-structure')) return { title: 'Struktur Pengurus & Bagan', parent: 'Lembaga & Komunitas' };
  if (pathname.includes('/admin/community-centers')) return { title: 'Kelola 33 Pos Community Center', parent: 'Lembaga & Komunitas' };
  if (pathname.includes('/admin/users')) return { title: 'Kelola Akun & Hak Akses Pengurus', parent: 'Sistem & Pengaturan' };
  if (pathname.includes('/admin/contact')) return { title: 'Informasi Kontak & Peta Sekretariat', parent: 'Sistem & Pengaturan' };
  return { title: 'Ringkasan Eksekutif CMS', parent: 'Menu Utama' };
};

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getUserData() || { name: 'Admin APM', email: 'admin@apmjambi.or.id', role: 'admin' };
  const currentSection = getSectionInfo(location.pathname);

  const handleLogout = async () => {
    const isConfirmed = await confirmLogout();
    if (isConfirmed) {
      await authService.logout();
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(path);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrator';
      case 'staff': return 'Staf Program';
      case 'editor': return 'Editor';
      case 'reporter': return 'Reporter';
      default: return 'Pengurus';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100/90 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-950 border-r border-slate-800 text-white shrink-0 fixed inset-y-0 z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-purple-700 group-hover:bg-purple-600 flex items-center justify-center text-white shadow-md transition-colors border border-purple-500/30">
              <ShieldCheck className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white">APM JAMBI</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-900/90 text-purple-200 border border-purple-700/60 uppercase">
                  CMS v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Panel Administrator</p>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 py-5 px-3.5 space-y-5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.group}
              </div>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        active
                          ? 'bg-purple-700 text-white shadow-sm font-bold border border-purple-600'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-200" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Public Website Preview Link */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/70">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors border border-slate-800/90"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Kunjungi Web Publik</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </a>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/60 font-bold flex items-center justify-center text-xs shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-purple-300 bg-purple-900/60 border border-purple-800/80 px-1.5 py-0.2 rounded font-semibold">
                  {getRoleBadge(user.role)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-950 text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider">APM JAMBI CMS</span>
              <p className="text-[10px] text-slate-400">Portal Kelola Konten</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.group}
              </div>
              <div className="space-y-0.5 pt-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        active ? 'bg-purple-700 text-white font-bold' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-purple-300 rounded-xl text-xs font-semibold transition-colors border border-slate-800"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lihat Web Publik</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold transition-colors border border-rose-900/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold truncate">
                <span>CMS Admin</span>
                <span>/</span>
                <span className="text-purple-700 font-bold">{currentSection.parent}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {currentSection.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {/* System Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[11px]">API Laravel: Aktif</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl border border-purple-200 transition-colors"
            >
              <span>Pratinjau Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Profile Pill */}
            <div className="flex items-center space-x-2.5 p-1 sm:pr-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-purple-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[130px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                  {getRoleBadge(user.role)}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
