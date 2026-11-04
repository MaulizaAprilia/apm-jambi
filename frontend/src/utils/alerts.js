import Swal from 'sweetalert2';

// Custom APM brand theme for SweetAlert2
const swalCustom = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl border border-slate-200 shadow-2xl p-6 font-sans',
    title: 'text-xl font-bold text-slate-900',
    htmlContainer: 'text-sm text-slate-600 leading-relaxed',
    confirmButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-sm focus:outline-none mx-1.5',
    cancelButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none mx-1.5',
    denyButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-colors focus:outline-none mx-1.5',
  },
  buttonsStyling: false,
});

/**
 * Quick toast notification in top-end corner
 */
export const showToast = (title, icon = 'success') => {
  return swalCustom.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

/**
 * Success modal alert
 */
export const showSuccessAlert = (title, text = '') => {
  return swalCustom.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Selesai',
  });
};

/**
 * Error modal alert
 */
export const showErrorAlert = (title, text = '') => {
  return swalCustom.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Tutup',
  });
};

/**
 * Warning modal alert
 */
export const showWarningAlert = (title, text = '') => {
  return swalCustom.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Mengerti',
  });
};

/**
 * Confirmation dialog for deletion
 */
export const confirmDelete = async ({
  title = 'Konfirmasi Hapus Data',
  text = 'Data yang dihapus tidak dapat dipulihkan kembali.',
  confirmButtonText = 'Ya, Hapus Data',
  cancelButtonText = 'Batal',
} = {}) => {
  const result = await swalCustom.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl border border-slate-200 shadow-2xl p-6 font-sans',
      title: 'text-xl font-bold text-slate-900',
      htmlContainer: 'text-sm text-slate-600 leading-relaxed',
      confirmButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm focus:outline-none mx-1.5',
      cancelButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none mx-1.5',
    },
  });

  return result.isConfirmed;
};

/**
 * Confirmation dialog for logout
 */
export const confirmLogout = async () => {
  const result = await swalCustom.fire({
    title: 'Keluar dari Sistem?',
    text: 'Sesi login Anda akan diakhiri dan dialihkan kembali ke form login.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Tetap di Dashboard',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl border border-slate-200 shadow-2xl p-6 font-sans',
      title: 'text-xl font-bold text-slate-900',
      htmlContainer: 'text-sm text-slate-600 leading-relaxed',
      confirmButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm focus:outline-none mx-1.5',
      cancelButton: 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none mx-1.5',
    },
  });

  return result.isConfirmed;
};

export default swalCustom;
