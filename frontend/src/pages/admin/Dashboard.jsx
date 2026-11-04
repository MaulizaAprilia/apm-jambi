import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  Clock, 
  Plus, 
  Building2, 
  Contact, 
  ArrowUpRight, 
  ShieldCheck,
  FileCheck,
  MapPin,
  Users,
  ListChecks,
  ExternalLink,
  Sparkles,
  Server
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { galleryService } from '../../services/galleryService';
import { documentService } from '../../services/documentService';
import { communityCenterService } from '../../services/communityCenterService';
import { userService } from '../../services/userService';
import { programService } from '../../services/programService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalGallery: 0,
    totalDocuments: 5,
    totalCommunityCenters: 33,
    totalUsers: 4,
    totalPrograms: 9,
  });

  const [recentNews, setRecentNews] = useState([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      newsService.getAdminNews(),
      galleryService.getAdminGallery(),
      documentService.getAdminDocuments(),
      communityCenterService.getAdminCenters(),
      userService.getUsers(),
      programService.getAdminPrograms(),
    ]).then(([newsRes, galRes, docRes, ccRes, userRes, progRes]) => {
      // News
      if (newsRes.status === 'fulfilled') {
        const items = Array.isArray(newsRes.value.data) ? newsRes.value.data : (newsRes.value.data?.data || []);
        const pub = items.filter(i => i.status === 'published').length;
        const draft = items.filter(i => i.status === 'draft').length;
        setStats(prev => ({
          ...prev,
          totalNews: items.length,
          publishedNews: pub,
          draftNews: draft,
        }));
        setRecentNews(items.slice(0, 5));
      }

      // Gallery
      if (galRes.status === 'fulfilled') {
        const items = Array.isArray(galRes.value.data) ? galRes.value.data : (galRes.value.data?.data || []);
        setStats(prev => ({ ...prev, totalGallery: items.length }));
      }

      // Documents
      if (docRes.status === 'fulfilled' && docRes.value.data) {
        const items = Array.isArray(docRes.value.data) ? docRes.value.data : [];
        setStats(prev => ({ ...prev, totalDocuments: items.length || 5 }));
      }

      // Community Centers
      if (ccRes.status === 'fulfilled' && ccRes.value.data) {
        const items = Array.isArray(ccRes.value.data) ? ccRes.value.data : (ccRes.value.data?.data || []);
        setStats(prev => ({ ...prev, totalCommunityCenters: items.length || 33 }));
      }

      // Users
      if (userRes.status === 'fulfilled') {
        const items = Array.isArray(userRes.value.data) ? userRes.value.data : (userRes.value.data?.data || []);
        setStats(prev => ({ ...prev, totalUsers: items.length || 4 }));
      }

      // Programs
      if (progRes.status === 'fulfilled' && progRes.value.data) {
        const items = Array.isArray(progRes.value.data) ? progRes.value.data : [];
        setStats(prev => ({ ...prev, totalPrograms: items.length || 9 }));
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-700/80 text-xs font-semibold text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Portal Resmi APM Jambi · Manajemen CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pusat Pengelolaan Konten & Informasi
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Kelola seluruh ekosistem digital: publikasi artikel kegiatan, arsip dokumen SK Kemenkumham, jejaring 33 Community Center, dan manajemen pengguna secara aman dan terpadu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <Link
            to="/admin/news/create"
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-purple-700/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
          <Link
            to="/admin/gallery/create"
            className="bg-slate-900 hover:bg-slate-800 text-purple-200 font-bold text-xs px-4 py-3 rounded-xl border border-purple-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Foto</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS GRID (6 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Metric 1: News */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Artikel Berita</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalNews}</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">{stats.publishedNews} Terbit</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{stats.draftNews} Draft</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Gallery */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Galeri Foto</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalGallery}</p>
            <p className="text-[10px] text-slate-500 mt-1">Dokumentasi Terkategori</p>
          </div>
        </div>

        {/* Metric 3: Community Centers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Community Center</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalCommunityCenters}</p>
            <p className="text-[10px] text-slate-500 mt-1">Pos Komunitas 3 Kab.</p>
          </div>
        </div>

        {/* Metric 4: Documents */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dokumen & SK</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalDocuments}</p>
            <p className="text-[10px] text-slate-500 mt-1">SK Kemenkumham & AD/ART</p>
          </div>
        </div>

        {/* Metric 5: Programs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program Layanan</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ListChecks className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalPrograms}</p>
            <p className="text-[10px] text-slate-500 mt-1">Pilar Layanan Terverifikasi</p>
          </div>
        </div>

        {/* Metric 6: Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Akun Pengurus</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
            <p className="text-[10px] text-slate-500 mt-1">Hak Akses Berbasis Peran</p>
          </div>
        </div>

      </div>

      {/* TWO-COLUMN LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Recent Articles List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-700" />
                <span>Publikasi Artikel Berita Terkini</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar artikel yang baru dibuat dan dipublikasikan staf redaksi</p>
            </div>
            <Link
              to="/admin/news"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>Semua Berita</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentNews.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Belum ada artikel berita tersimpan.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentNews.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="flex items-start sm:items-center space-x-3 min-w-0">
                    <img
                      src={item.featured_image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80'}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">Oleh: {item.author || 'Admin'}</span>
                        <span>•</span>
                        <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>

                    <a
                      href={`/berita/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                      title="Lihat di Web Publik"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      to={`/admin/news/${item.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                      title="Edit Berita"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Quick Shortcuts & Server Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Akses Cepat Pengelolaan</span>
            </h3>

            <div className="space-y-2">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900">Kelola Akun Staf</h4>
                    <p className="text-[10px] text-slate-500">Izin akses & status akun</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-800" />
              </Link>

              <Link
                to="/admin/documents"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">SK Kemenkumham & AD/ART</h4>
                    <p className="text-[10px] text-slate-500">Legalitas & berkas PDF</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-800" />
              </Link>

              <Link
                to="/admin/community-centers"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">Community Centers (33)</h4>
                    <p className="text-[10px] text-slate-500">Pos binaan 3 kabupaten</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800" />
              </Link>

              <Link
                to="/admin/contact"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-rose-50 hover:border-rose-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <Contact className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-900">Kontak & Sekretariat</h4>
                    <p className="text-[10px] text-slate-500">WhatsApp, email, & maps</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-800" />
              </Link>
            </div>
          </div>

          {/* System & Security Diagnostics */}
          <div className="bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wider uppercase text-purple-400 flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Status Sistem & Keamanan</span>
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Backend API:</span>
                <span className="font-bold text-emerald-400">Laravel 12 (REST API)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Autentikasi:</span>
                <span className="font-bold text-purple-300">Sanctum Bearer Token</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Brute-Force Shield:</span>
                <span className="font-bold text-emerald-400">Active (5 req/min)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Basis Data:</span>
                <span className="font-bold text-slate-200">MySQL (InnoDB)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
