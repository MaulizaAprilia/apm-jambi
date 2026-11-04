import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ChevronRight, 
  BookOpen, 
  AlertCircle, 
  Loader2, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { resolveApiAssetUrl } from '../../services/api';
import { extractPublicItems } from '../../data/publicContentDefaults';

const categories = [
  'Semua Berita',
  'Pemberdayaan Ekonomi',
  'Advokasi & Hukum',
  'Kesehatan & HKSR',
  'Musyawarah & Kelembagaan',
  'Community Center',
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Berita');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    newsService.getPublicNews({ search: searchTerm, limit: 12 })
      .then((res) => {
        const items = extractPublicItems(res);
        setNews(items);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Gagal memuat berita. Menampilkan artikel terkini.');
      })
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua Berita' || 
      (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesQuery = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const standardNews = filteredNews.slice(1);

  return (
    <div className="py-12 space-y-12">
      {/* HEADER HERO */}
      <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-purple-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 border border-purple-700 text-xs font-semibold text-purple-200">
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Kabar & Artikel Resmi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Berita & Publikasi APM Jambi
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Dokumentasi narasi kegiatan, dinamika advokasi lapangan, pendidikan kritis gender, dan kabar terkini dari 33+ Community Center di Merangin, Bungo, dan Sarolangun.
          </p>

          {/* Search Bar Form */}
          <div className="max-w-xl mx-auto pt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Cari berita, agenda, atau nama narasumber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-xl"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <button
                type="submit"
                className="absolute right-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN NEWS CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-purple-800" />
            <p className="text-sm font-medium">Memuat publikasi berita...</p>
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Tidak ada berita yang ditemukan</h3>
            <p className="text-xs text-slate-500">
              {error || 'Silakan coba kata kunci pencarian yang lain atau pilih kategori yang berbeda.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('Semua Berita'); setSearchTerm(''); }}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Featured Top Article Banner */}
        {!loading && featuredNews && !searchTerm && selectedCategory === 'Semua Berita' && (
          <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 group">
            <div className="lg:col-span-7 h-72 lg:h-auto bg-slate-900 relative overflow-hidden">
              <img
                src={resolveApiAssetUrl(featuredNews.featured_image) || '/images/hero.jpg'}
                alt={featuredNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Sorotan Utama</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px] uppercase">
                    {featuredNews.category || 'Berita Utama'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredNews.published_at || featuredNews.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-purple-900 transition-colors leading-snug">
                  <Link to={`/berita/${featuredNews.slug}`}>
                    {featuredNews.title}
                  </Link>
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
                  {featuredNews.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Penulis: <strong>{featuredNews.author || 'Tim Redaksi APM'}</strong>
                </span>
                <Link
                  to={`/berita/${featuredNews.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform"
                >
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Regular News Grid */}
        {!loading && (searchTerm || selectedCategory !== 'Semua Berita' ? filteredNews : standardNews).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchTerm || selectedCategory !== 'Semua Berita' ? filteredNews : standardNews).map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <div className="h-52 bg-slate-900 overflow-hidden relative">
                  <img
                    src={resolveApiAssetUrl(item.featured_image) || '/images/workshop.jpg'}
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

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      APM Jambi
                    </span>
                    <Link
                      to={`/berita/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-rose-600 transition-colors"
                    >
                      <span>Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}
