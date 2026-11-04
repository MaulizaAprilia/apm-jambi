import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { showToast, showErrorAlert } from '../../utils/alerts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        showToast('Login berhasil! Selamat datang di Portal Admin APM.', 'success');
        navigate(from, { replace: true });
      } else {
        const msg = res.message || 'Login gagal. Periksa kembali email & password Anda.';
        setError(msg);
        showErrorAlert('Gagal Masuk', msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Email atau password tidak sesuai.';
      setError(msg);
      showErrorAlert('Gagal Masuk', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@apmjambi.or.id');
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-900 mx-auto flex items-center justify-center text-white shadow-xl border border-purple-700/60">
          <ShieldCheck className="w-9 h-9 text-purple-200" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portal Administrator CMS
          </h2>
          <p className="mt-1 text-xs text-purple-400 font-medium">
            Aliansi Perempuan Mandiri (APM) Jambi
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials Pill */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-purple-200">Akun Demo Pengelola:</p>
              <p className="text-[11px] text-purple-400">admin@apmjambi.or.id · password</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
            >
              Isi Otomatis
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alamat Email Admin
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apmjambi.or.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-900/40 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Publik APM</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
