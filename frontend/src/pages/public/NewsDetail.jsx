import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  User, 
  Share2, 
  Check, 
  Copy, 
  MessageSquare
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { resolveApiAssetUrl } from '../../services/api';
import { extractPublicItems } from '../../data/publicContentDefaults';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    newsService.getPublicNewsBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setArticle(res.data);
        } else {
          setArticle(null);
          setError('Artikel tidak ditemukan atau tidak lagi dipublikasikan.');
        }
      })
      .catch((requestError) => {
        setArticle(null);
        setError(requestError.response?.status === 404
          ? 'Artikel tidak ditemukan atau tidak lagi dipublikasikan.'
          : requestError.response?.data?.message || 'Artikel belum dapat dimuat.');
      })
      .finally(() => setLoading(false));

    // Fetch related latest news
    newsService.getPublicNews({ limit: 4 })
      .then((res) => {
        const items = extractPublicItems(res);
        setRelated(items.filter(n => n.slug !== slug).slice(0, 3));
      })
      .catch(() => {});
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article?.title || 'Berita APM Jambi');

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-800 mx-auto mb-3" />
        <p className="text-slate-500 font-medium text-sm">Memuat artikel berita...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Artikel Tidak Ditemukan</h2>
        <p role={error ? 'alert' : undefined} className="text-slate-500 text-sm">
          {error || 'Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.'}
        </p>
        <Link to="/berita" className="inline-flex items-center gap-2 text-purple-800 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12 bg-slate-50/60">
      {/* Top Back Nav & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-900 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Berita & Publikasi</span>
        </Link>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
              {article.category || 'Publikasi Resmi'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Author info pill */}
          <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{article.author || 'Tim Redaksi APM Jambi'}</p>
              <p className="text-[11px] text-slate-500">Aliansi Perempuan Mandiri Jambi</p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200 shadow-lg">
          <img
            src={resolveApiAssetUrl(article.featured_image) || '/images/hero.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-6">
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {article.content}
          </div>

          {/* Share Actions Bar */}
          <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-700" />
              <span>Bagikan Artikel Ini:</span>
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${shareTitle}%20${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                title="Bagikan ke WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center w-9 h-9 font-bold text-xs"
                title="Bagikan ke Facebook"
              >
                FB
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center w-9 h-9 font-bold text-xs"
                title="Bagikan ke X / Twitter"
              >
                X
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Salin Tautan"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </article>

      {/* RELATED ARTICLES */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">
              Artikel & Kabar Terkait Lainnya
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <div className="h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={resolveApiAssetUrl(item.featured_image) || '/images/workshop.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                      {item.category || 'Berita'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-900 line-clamp-2 leading-snug">
                      <Link to={`/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <Link to={`/berita/${item.slug}`} className="text-purple-800 font-bold hover:underline">
                      Baca ›
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
