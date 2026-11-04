import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User,
  ExternalLink,
  FileText
} from 'lucide-react';
import { newsService } from '../../../services/newsService';
import { resolveApiAssetUrl } from '../../../services/api';
import { confirmDelete, showToast, showErrorAlert } from '../../../utils/alerts';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsService.getAdminNews();
      const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setNews(items);
    } catch (error) {
      showErrorAlert('Gagal Memuat Berita', error.response?.data?.message || 'Tidak dapat mengambil daftar berita.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const isConfirmed = await confirmDelete({
      title: 'Hapus Artikel Berita?',
      text: `Apakah Anda yakin ingin menghapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmButtonText: 'Ya, Hapus Berita',
    });

    if (isConfirmed) {
      try {
        await newsService.deleteNews(id);
        showToast('Berita berhasil dihapus.', 'success');
        await fetchNews();
      } catch (error) {
        showErrorAlert('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('status', newStatus);
    if (item.author) formData.append('author', item.author);
    if (item.content) formData.append('content', item.content);

    try {
      await newsService.updateNews(item.id, formData);
      showToast(`Status berita diubah menjadi ${newStatus === 'published' ? 'Terbit (Published)' : 'Draft'}.`, 'success');
      await fetchNews();
    } catch (error) {
      showErrorAlert('Gagal Mengubah Status', error.response?.data?.message || 'Terjadi kesalahan sistem.');
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-700" />
            <span>Manajemen Berita & Artikel</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan kabar advokasi, kegiatan komunitas, dan rilis pers resmi APM Jambi
          </p>
        </div>
        <Link
          to="/admin/news/create"
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul artikel atau nama penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="all">Semua Status</option>
            <option value="published">Hanya Published (Tayang)</option>
            <option value="draft">Hanya Draft (Internal)</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
            <p className="text-xs">Memuat daftar berita...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">Belum ada berita yang sesuai dengan filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sampul</th>
                  <th className="py-3.5 px-4">Judul & Kategori</th>
                  <th className="py-3.5 px-4">Penulis / Reporter</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal Rilis</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={resolveApiAssetUrl(item.featured_image) || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                          {item.category || 'Berita'}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          /{item.slug || `id-${item.id}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-medium">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>{item.author || item.user?.name || 'Admin APM'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          <Clock className="w-3 h-3 text-amber-600" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {/* View live public article */}
                      <a
                        href={`/berita/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Lihat di Web Publik"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 inline-block transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Toggle status */}
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title={item.status === 'published' ? 'Alihkan ke Draft' : 'Terbitkan Sekarang'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        {item.status === 'published' ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                      </button>

                      {/* Edit */}
                      <Link
                        to={`/admin/news/${item.id}/edit`}
                        title="Edit Berita"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-800 hover:bg-purple-50 inline-block transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Hapus Berita"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
