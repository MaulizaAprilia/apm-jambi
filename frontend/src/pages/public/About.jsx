import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Target, 
  Eye, 
  Users, 
  FileText, 
  Download, 
  FileCheck, 
  X, 
  Search, 
  MapPin, 
  Award, 
  Music, 
  Building2, 
  Scale, 
  Maximize2
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import { documentService } from '../../services/documentService';
import { organizationMemberService } from '../../services/organizationMemberService';
import { communityCenterService } from '../../services/communityCenterService';
import { resolveApiAssetUrl } from '../../services/api';
import {
  extractPublicItems,
  initialCommunityCenters,
  initialOrganizationMembers,
} from '../../data/publicContentDefaults';

const organizationCategories = [
  { key: 'oversight', id: 'badan-pengawas', title: 'Badan Pengawas', structure: 'Menjalankan fungsi pengawasan tata kerja, keuangan, dan penegakan pedoman perilaku organisasi.' },
  { key: 'management', id: 'pengurus', title: 'Badan Pengurus', structure: 'Menetapkan garis kebijakan organisasi, tata kelola administrasi, dan akuntabilitas kelembagaan.' },
  { key: 'implementation', id: 'pelaksana', title: 'Badan Pelaksana (Direktur Eksekutif)', structure: 'Memimpin implementasi operasional harian, advokasi pemenuhan hak-hak perempuan, dan jejaring lapangan.' },
];

const categoryKey = (category) => {
  const normalized = String(category || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (['oversight', 'pengawas', 'badanpengawas'].includes(normalized)) return 'oversight';
  if (['management', 'pengurus', 'badanpengurus'].includes(normalized)) return 'management';
  if (['implementation', 'pelaksana', 'badanpelaksana'].includes(normalized)) return 'implementation';
  return normalized;
};

// 8 Community Center Pendiri Organisasi (Anggaran Dasar Pasal 4 Ayat 2)
const foundingCenters = [
  { name: 'CC Sehat Mandiri', village: 'Desa Mampun Baru', district: 'Pamenang Barat' },
  { name: 'CC Pinang Sehat', village: 'Desa Pinang Merah', district: 'Pamenang Barat' },
  { name: 'CC Tunas Sehat', village: 'Desa Rasau', district: 'Renah Pamenang' },
  { name: 'CC Lebah Madu Sehat', village: 'Desa Sialang', district: 'Pamenang' },
  { name: 'CC Bangkit Semangat', village: 'Desa Simpang Limbur', district: 'Pamenang Barat' },
  { name: 'CC Mentari Sehat', village: 'Desa Bukit Bungkul', district: 'Renah Pamenang' },
  { name: 'CC Harapan Sehat', village: 'Desa Sungai Kapas', district: 'Bangko' },
  { name: 'CC Merpati Mandiri', village: 'Desa Meranti', district: 'Renah Pamenang' },
];

// 16 Prinsip Pedoman Perilaku (Pedoman Perilaku Bab II Pasal 2 - Pasal 17)
const codeOfConductPrinciples = [
  { title: 'Berbasis Hak Asasi Perempuan', desc: 'Mengakui hak asasi perempuan sebagai HAM universal yang melekat, tanpa diskriminasi peran biologis maupun sosial.' },
  { title: 'Anti Diskriminasi', desc: 'Menolak pembedaan atas dasar gender, ras, agama, status sosial, kondisi fisik, maupun pilihan orientasi.' },
  { title: 'Setara', desc: 'Perilaku saling menghargai tanpa ada relasi dominasi atau subordinasi di dalam maupun di luar kelembagaan.' },
  { title: 'Inklusif', desc: 'Menjamin akses dan manfaat penuh bagi ragam fungsi fisik/mental, disabilitas, dan kelompok rentan.' },
  { title: 'Partisipatif', desc: 'Keterlibatan aktif dan bermakna anggota dalam seluruh tahapan desain, pelaksanaan, dan audit program.' },
  { title: 'Transparan & Akuntabel', desc: 'Keterbukaan informasi kinerja, pembukuan keuangan yang siap diaudit akuntan publik, dan mekanisme gugatan publik.' },
  { title: 'Profesional yang Handal', desc: 'Standar etika dan kompetensi tinggi, bebas dari konflik kepentingan dan nepotisme keluarga.' },
  { title: 'Non Partisan', desc: 'Independen dari afiliasi partai politik mana pun dan tidak terlibat politik praktis pemilu.' },
  { title: 'Berbagi Daya & Saling Belajar', desc: 'Berbagi pengetahuan, keterampilan, dan kapasitas antar-anggota untuk saling menguatkan gerakan.' },
  { title: 'Keterpaduan', desc: 'Membangun sinergi lintas program dengan analisis interseksi yang mengutamakan kepentingan pemanfaat.' },
  { title: 'Loyal', desc: 'Komitmen memelihara integritas, kepatuhan anggaran dasar, dan menjaga kerahasiaan masalah internal.' },
  { title: 'Akrab & Solidaritas', desc: 'Menumbuhkan ruang aman, saling mengenal, dan menguatkan persaudaraan sesama pejuang hak perempuan.' },
  { title: 'Nol Toleransi Kekerasan', desc: 'Sikap tegas menolak segala bentuk kekerasan fisik, psikis, seksual, dan ekonomi terhadap perempuan & anak.' },
  { title: 'Keadilan Gender & Inklusi (GEDSI)', desc: 'Transformasi nilai, norma, dan budaya menuju keadilan sosial yang setara bagi semua jenis kelamin.' },
  { title: 'Transformatif', desc: 'Kemauan beradaptasi dan berinovasi menciptakan model pemberdayaan yang berdampak sistemik.' },
  { title: 'Anti Fraud, Korupsi, Kolusi & Nepotisme', desc: 'Nol toleransi terhadap suap, gratifikasi, penyalahgunaan wewenang, dan rekrutmen berbasis primordialisme.' },
];

// Mitra Kolaborasi Strategis (Profil Organisasi Halaman 5-6)
const localPartners = [
  { name: 'UPPA Polres Merangin', scope: 'Penanganan kasus korban tindak kekerasan perempuan dan anak' },
  { name: 'BPPKB & PA Merangin', scope: 'Penanganan kasus kekerasan dan pembinaan PIK-R di sekolah' },
  { name: 'P2TP2A Kab. Merangin', scope: 'Layanan rujukan perlindungan korban kekerasan' },
  { name: 'Dinas Koperasi & Perdagangan', scope: 'Pemberdayaan Koperasi Perempuan Mandiri (KPM)' },
  { name: 'Dinas Kesehatan Kab. Merangin', scope: 'Klinik KESPRO APM dan Program HKSR terpadu' },
  { name: 'Dinas Pendidikan', scope: 'Penguatan isu kesehatan reproduksi remaja sekolah' },
  { name: 'Pemerintah Desa (Pemdes)', scope: 'Penganggaran desa responsif gender dan pos layanan aman' },
  { name: 'Lembaga Adat & Tokoh Agama', scope: 'Penanganan kasus remaja peka adat dan perlindungan hak' },
  { name: 'Puskesmas Meranti & Tambang Emas', scope: 'Program Pelayanan Kesehatan Peduli Remaja (PKPR)' },
  { name: 'KPUD Kab. Merangin', scope: 'Pendidikan pemilih pemula dan pemilih cerdas perempuan' },
  { name: 'Media Massa & Radio Lokal', scope: 'Diseminasi informasi publik dan kampanye hak perempuan' },
];

const nationalPartners = [
  { name: 'Komnas Perempuan RI', role: 'Penanganan kasus, forum belajar pengada layanan, materi 16 HAKTP' },
  { name: 'Konsorsium Permampu / MAMPU', role: 'Peningkatan status gizi, kepemimpinan perempuan, pencegahan stunting' },
  { name: 'HIVOS', role: 'Women Access to Justice (penjangkauan akses keadilan perempuan)' },
  { name: 'Aliansi Masyarakat Adat Nusantara (AMAN)', role: 'Advokasi dampak industri ekstraktif pada perempuan adat' },
  { name: 'Koalisi Perempuan Indonesia (KPI)', role: 'Pendidikan kritis dan pendidikan politik perempuan' },
  { name: 'JASS Asia Tenggara', role: 'Peningkatan kapasitas kepemimpinan feminis muda' },
  { name: 'Yayasan Kesehatan Perempuan (YPKP)', role: 'Beasiswa sekolah bidan komunitas dan edukasi HKSR' },
  { name: 'Yayasan Mitra Inti', role: 'Pengelolaan klinik kesehatan reproduksi esensial' },
  { name: 'FBCB Sumatra', role: 'Forum capacity building peningkatan kapasitas perempuan Sumatra' },
];

function MemberAvatar({ member, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = resolveApiAssetUrl(member?.photo_url);

  const sizeClasses = {
    xs: 'w-8 h-8 text-[10px] rounded-lg',
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 sm:w-16 sm:h-16 text-sm rounded-2xl',
    lg: 'w-20 h-20 text-lg rounded-2xl',
    xl: 'w-28 h-28 sm:w-36 sm:h-36 text-3xl rounded-3xl',
  }[size] || 'w-14 h-14 rounded-2xl';

  const initials = (member?.name || 'APM')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (photoUrl && !imgError) {
    return (
      <div className={`${sizeClasses} overflow-hidden bg-slate-100 border-2 border-purple-200/80 shadow-xs shrink-0 relative group-hover:border-purple-400 transition-colors`}>
        <img
          src={photoUrl}
          alt={member?.name || 'Pengurus APM'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 border-2 border-purple-300/40 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none`}>
      {initials}
    </div>
  );
}

export default function About() {
  const [profile, setProfile] = useState({
    history: 'Profil organisasi mencatat Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003 di Desa Pinang Merah. Akta pendirian No. 58 dibuat oleh Notaris Sri Hermawati, SH pada 17 April 2003; perubahan akta No. 2 dibuat oleh Notaris Solihin, SH pada 2 Januari 2015. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi) dan memperluas mandat pemberdayaan di Provinsi Jambi.',
    vision: 'Kekuatan otonomi perempuan dan keluarga yang berperspektif GEDSI.',
    mission: `1. Mewujudkan kekuatan otonomi perempuan di bidang ekonomi, politik, sosial yang peka GEDSI.\n2. Advokasi terhadap perempuan dan keluarga dalam pemenuhan hak-hak dasar.\n3. Membentuk kader-kader perempuan untuk layanan yang berperspektif GEDSI.\n4. Memberdayakan perempuan dewasa dan muda dalam bidang informasi dan teknologi.\n5. Membentuk SDM berkualitas untuk tatanan keluarga dan masyarakat peka GEDSI.\n6. Menciptakan kerja sama dan konsolidasi dengan Forum Multi Stakeholder (FMS) untuk mengakselerasi keadilan sosial gender terutama di pedesaan.`,
    header_title: 'Aliansi Perempuan Mandiri Jambi',
    header_description: 'Organisasi perempuan berbentuk perkumpulan yang bekerja untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
    history_title: 'Sejarah dan Identitas Organisasi',
    history_image: '',
    structure_intro: 'Struktur kepengurusan APM Jambi terdiri atas Musyawarah Besar (Mubes), Badan Pengawas, Badan Pengurus, dan Badan Pelaksana (Direktur Eksekutif) yang berkomitmen pada tata kelola organisasi transparan dan akuntabel.',
    tagline: 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kekuatan kolektif untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
    profile_purpose: 'Pemberdayaan dan pengorganisasian perempuan pedesaan; pemenuhan hak sosial, ekonomi, dan politik serta kesetaraan; berbagi sumber daya, pembelajaran dan kepemimpinan akar rumput; layanan komprehensif bagi korban kekerasan; advokasi HKSR; serta perbaikan kebijakan dan akses informasi maupun layanan.',
    profile_vision: 'Otonomi Perempuan & keluarga atas sumber kehidupan berkelanjutan berperspektif gender.',
    strategies: 'Pendidikan dan penyadaran hak HKSR dengan perspektif gender dan pendekatan multi-stakeholder di pedesaan.\nAdvokasi dan kajian kebijakan responsif gender.\nPenguatan otonomi perempuan dan keluarga.\nPenguatan organisasi dan jaringan.',
    scope: 'Merangin, Bungo, dan Sarolangun, Provinsi Jambi, Indonesia.',
    beneficiaries: 'Perempuan dan perempuan muda pedesaan serta perempuan miskin kota dalam kelompok Community Center (CC), dengan kegiatan ekonomi dan diskusi kritis reguler.',
    legal_status: "Pengesahan Kemenkumham RI Terbaru: AHU-0001146.AH.01.08.TAHUN 2025 (Tanggal 09 Juli 2025).\nAkta Notaris: Muhammad Rizki Maulana, S.H., M.Kn. No. 09 Tanggal 09 Juli 2025.\nNPWP Perkumpulan: 02.372.149.1-333.000 (APMJ Merangin).\nAkta Pendirian: Notaris Sri Hermawati, SH No. 58 (17 April 2003); Perubahan No. 2 Notaris Solihin, SH (2 Januari 2015).\nPencatatan Kesbangpol: Bakesbangpol Merangin No. 220/XI/10/155/IV/2015 & Bakesbangpol Jambi No. 220/1458/Bakesbang-Pol/XI/2017.",
    secretariat_address: 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.',
  });

  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showSKModal, setShowSKModal] = useState(false);
  const [members, setMembers] = useState(initialOrganizationMembers);
  const [communityCenters, setCommunityCenters] = useState(initialCommunityCenters);
  const [chartView, setChartView] = useState('interactive'); // 'interactive' | 'scanned'
  
  // Interactive Community Center Filter State
  const [selectedRegency, setSelectedRegency] = useState('Semua');
  const [searchCenter, setSearchCenter] = useState('');

  // Interactive Partner Filter Tab
  const [partnerTab, setPartnerTab] = useState('local');

  useEffect(() => {
    profileService.getPublicProfile()
      .then((res) => {
        if (res.success && res.data) {
          const publishedProfile = Object.fromEntries(
            Object.entries(res.data).filter(([, value]) => value !== null && value !== '')
          );
          setProfile((prev) => ({ ...prev, ...publishedProfile }));
        }
      })
      .catch(() => {});

    documentService.getPublicDocuments()
      .then((res) => {
        if (res.success && res.data) setDocuments(res.data);
      })
      .catch(() => {});

    organizationMemberService.getPublicMembers()
      .then((res) => {
        const items = extractPublicItems(res);
        if (items.length > 0) setMembers(items);
      })
      .catch(() => {});

    communityCenterService.getPublicCenters()
      .then((res) => {
        const items = extractPublicItems(res);
        if (items.length > 0) setCommunityCenters(items);
      })
      .catch(() => {});
  }, []);

  const getFullDocUrl = (filePath) => resolveApiAssetUrl(filePath);

  const getPreviewUrl = (doc) => {
    const url = getFullDocUrl(doc.file_path);
    if (url === '#') return '#';
    const ext = (doc.file_type || '').toLowerCase();
    if (ext === 'doc' || ext === 'docx') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return url;
  };

  const isDocImage = (doc) => {
    const ext = (doc.file_type || '').toLowerCase();
    const path = (doc.file_path || '').toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png');
  };

  const filteredCenters = communityCenters.filter((center) => {
    const matchesRegency = selectedRegency === 'Semua' || String(center.regency || '').trim() === selectedRegency;
    const matchesQuery = !searchCenter || 
      center.name.toLowerCase().includes(searchCenter.toLowerCase()) ||
      center.village.toLowerCase().includes(searchCenter.toLowerCase()) ||
      center.district.toLowerCase().includes(searchCenter.toLowerCase());
    return matchesRegency && matchesQuery;
  });

  return (
    <div className="py-12 space-y-12">
      {/* HEADER HERO */}
      <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-purple-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 border border-purple-700 text-xs font-semibold text-purple-200">
            <Shield className="w-4 h-4 text-purple-300" />
            <span>Profil Resmi Organisasi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{profile.header_title}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {profile.header_description}
          </p>

          {/* Quick Navigation Pills */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {[
              { id: 'profile', label: 'Sejarah & Pendiri' },
              { id: 'visi-misi', label: 'Visi, Misi & Sasaran' },
              { id: 'struktur-pengurus', label: 'Struktur Organisasi' },
              { id: 'pedoman-perilaku', label: 'Pedoman Perilaku (16 Prinsip)' },
              { id: 'mars-hymne', label: 'Mars & Hymne APM' },
              { id: 'community-centers', label: '33+ Community Center' },
              { id: 'mitra-strategis', label: 'Mitra & Kolaborasi' },
              { id: 'dokumen-legalitas', label: 'Legalitas & Berkas Resmi' },
            ].map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-md"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 1. SEJARAH & 8 COMMUNITY CENTER PENDIRI */}
      <section id="profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Sejak 1 Januari 2003
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile.history_title}
              </h2>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold">
              23+ Tahun Dedikasi Gerakan
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {profile.history}
              {profile.tagline && (
                <div className="border-l-4 border-purple-700 bg-purple-50/60 p-4 rounded-r-2xl text-purple-950 font-medium italic text-base">
                  “{profile.tagline}”
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] shadow-xs">
                <img
                  src="/images/workshop.jpg"
                  alt="Aktivitas Komunitas APM Jambi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <p><strong>Bentuk Lembaga:</strong> Perkumpulan Resmi (Organisasi Perempuan Akar Rumput)</p>
                <p><strong>Cakupan Wilayah:</strong> Merangin, Bungo, dan Sarolangun</p>
                <p><strong>Basis Komunitas:</strong> 33+ Kelompok Community Center (CC) Pedesaan</p>
              </div>
            </div>
          </div>

          {/* 8 Community Center Pendiri Organisasi (Sesuai Anggaran Dasar Pasal 4 Ayat 2) */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-800" />
              <h3 className="text-base font-extrabold text-slate-900">
                8 Kelompok Community Center (CC) Pendiri APM Jambi (2003)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {foundingCenters.map((cc, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-purple-700">Pendiri #{i+1}</span>
                  <p className="font-bold text-slate-900">{cc.name}</p>
                  <p className="text-[11px] text-slate-500">{cc.village}, {cc.district}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISI & MISI */}
      <section id="visi-misi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VISI */}
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-purple-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-800 text-purple-200 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Visi Organisasi</h3>
              <p className="text-purple-100 text-lg leading-relaxed italic">
                "{profile.vision}"
              </p>
            </div>
            <div className="pt-4 border-t border-purple-800/80 text-xs text-purple-300">
              Visi normatif AD/ART APM Jambi, 14 Desember 2024
            </div>
          </div>

          {/* MISI */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Misi Utama</h3>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-2">
                {profile.mission}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              Komitmen aksi nyata dalam keberlanjutan program
            </div>
          </div>
        </div>

        {/* Maksud, Tujuan & Sasaran */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 space-y-3">
            <h3 className="text-xl font-bold text-slate-900">Maksud, Tujuan & Sasaran</h3>
            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{profile.profile_purpose}</p>
            <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
              <p><strong>Sasaran Utama:</strong> {profile.beneficiaries}</p>
              <p><strong>Wilayah:</strong> {profile.scope}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 space-y-3">
            <h3 className="text-xl font-bold text-slate-900">Strategi Organisasi</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
              {profile.strategies.split('\n').filter(Boolean).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. STRUKTUR ORGANISASI RESMI */}
      <section id="struktur-pengurus" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Struktur Kepengurusan Periode 2023–2028</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Bagan Struktur & Pengurus APM Jambi
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {profile.structure_intro}
            </p>
          </div>

          {/* Official Chart Showcase Banner with Dynamic & Scanned Views */}
          <div className="rounded-3xl overflow-hidden border border-purple-200 bg-purple-50/40 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200/80 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  Infografis Resmi Terverifikasi · 2023–2028
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 mt-1.5">
                  Bagan Struktur Organisasi APM Jambi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi tata kelola kepengurusan lengkap dengan foto profil personil dan mandat resmi kelembagaan.
                </p>
              </div>

              {/* View Switcher Tabs & Zoom Button */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                <div className="inline-flex rounded-xl bg-purple-100/80 p-1 border border-purple-200">
                  <button
                    onClick={() => setChartView('interactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartView === 'interactive'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-purple-800 hover:text-purple-950'
                    }`}
                  >
                    Bagan Live & Interaktif
                  </button>
                  <button
                    onClick={() => setChartView('scanned')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartView === 'scanned'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-purple-800 hover:text-purple-950'
                    }`}
                  >
                    Pindai Dokumen Asli
                  </button>
                </div>

                {chartView === 'scanned' && (
                  <button
                    onClick={() => setShowChartModal(true)}
                    className="inline-flex items-center gap-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB CONTENT: Interactive Live Organogram */}
            {chartView === 'interactive' ? (
              <div className="p-4 sm:p-8 bg-white rounded-2xl border border-purple-100 shadow-inner overflow-x-auto">
                <div className="min-w-[760px] max-w-4xl mx-auto space-y-8 py-2">
                  
                  {/* Top Level: MUBES */}
                  <div className="flex flex-col items-center">
                    <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs sm:text-sm tracking-wide shadow-md border-2 border-amber-300 text-center">
                      MUBES (Musyawarah Besar)
                      <span className="block text-[10px] font-normal text-amber-100 mt-0.5">
                        Forum Pengambilan Keputusan Tertinggi Organisasi
                      </span>
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300" />
                  </div>

                  {/* Level 2: Badan Pengurus & Badan Pengawas */}
                  <div className="grid grid-cols-2 gap-8 relative">
                    {/* Connecting Horizontal Line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 -translate-y-px" />

                    {/* Column Left: Badan Pengurus */}
                    <div className="space-y-3">
                      <div className="text-center pb-1">
                        <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                          Badan Pengurus (3 Personil)
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {members.filter((m) => categoryKey(m.category) === 'management').map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all shadow-2xs group"
                          >
                            <MemberAvatar member={m} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-900">
                                {m.name}
                              </h5>
                              <p className="text-[10px] font-semibold text-purple-700 truncate">
                                {m.position}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column Right: Badan Pengawas */}
                    <div className="space-y-3">
                      <div className="text-center pb-1">
                        <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                          Badan Pengawas (3 Personil)
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {members.filter((m) => categoryKey(m.category) === 'oversight').map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs group"
                          >
                            <MemberAvatar member={m} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-900">
                                {m.name}
                              </h5>
                              <p className="text-[10px] font-semibold text-indigo-700 truncate">
                                {m.position}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Level 3: Badan Pelaksana / Direktur Eksekutif */}
                  <div className="flex flex-col items-center pt-2">
                    <div className="w-0.5 h-6 bg-slate-300" />
                    {(() => {
                      const leader = members.find(
                        (m) => (m.name || '').toLowerCase().includes('marsiyam') || (m.position || '').toLowerCase().includes('direktur')
                      ) || { name: 'Marsiyam', position: 'Direktur Eksekutif', photo_url: null };

                      return (
                        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-lg border-2 border-purple-400 flex items-center gap-4 min-w-[280px] max-w-md">
                          <MemberAvatar member={leader} size="md" />
                          <div className="min-w-0">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-rose-500/80 text-rose-100 text-[10px] font-bold uppercase tracking-wider">
                              Kepemimpinan Eksekutif
                            </span>
                            <h4 className="text-sm font-extrabold text-white mt-0.5">{leader.name}</h4>
                            <p className="text-[11px] text-purple-200 font-semibold">{leader.position}</p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="w-0.5 h-6 bg-slate-300" />
                  </div>

                  {/* Level 4: Tim Staf & Koordinator Program */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Badan Pelaksana & Staf Operasional
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {members
                        .filter((m) => categoryKey(m.category) === 'implementation')
                        .filter((m) => !(m.name || '').toLowerCase().includes('marsiyam') && !(m.position || '').toLowerCase().includes('direktur'))
                        .map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-white transition-all shadow-2xs group"
                          >
                            <MemberAvatar member={m} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-900">
                                {m.name}
                              </h5>
                              <p className="text-[10px] font-semibold text-purple-700 truncate">
                                {m.position}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Level 5: Kelompok Dampingan (Base) */}
                  <div className="flex flex-col items-center pt-2">
                    <div className="w-0.5 h-6 bg-slate-300" />
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs sm:text-sm tracking-wide shadow-md border-2 border-emerald-300 text-center">
                      Kelompok Dampingan APM Jambi
                      <span className="block text-[10px] font-normal text-emerald-100 mt-0.5">
                        33 Pos Community Center (CC) di Kabupaten Merangin, Bungo, dan Sarolangun
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* TAB CONTENT: Official Scanned Infographic */
              <div 
                onClick={() => setShowChartModal(true)}
                className="rounded-2xl overflow-hidden bg-white border border-slate-200 cursor-pointer group relative max-h-[420px] flex items-center justify-center p-3"
              >
                <img
                  src="/assets/apm-org-chart-2023-2028.jpeg"
                  alt="Bagan Struktur Organisasi Resmi APM Jambi"
                  className="w-full h-auto max-h-[390px] object-contain group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-lg flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Klik untuk melihat resolusi penuh
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Highlight Executive Leadership Card (Direktur APM J: Marsiyam) */}
          {(() => {
            const executiveLeader = members.find(
              (m) => (m.name || '').toLowerCase().includes('marsiyam') || (m.position || '').toLowerCase().includes('direktur')
            ) || {
              name: 'Marsiyam',
              position: 'Direktur APM J (Direktur Eksekutif)',
              description: 'Memimpin implementasi operasional harian, advokasi pemenuhan hak-hak perempuan, dan kemitraan strategis dengan para pemangku kepentingan di Provinsi Jambi.',
              photo_url: null,
            };

            return (
              <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-3 flex justify-center">
                    <MemberAvatar member={executiveLeader} size="xl" />
                  </div>
                  <div className="md:col-span-9 space-y-2 text-center md:text-left">
                    <span className="inline-block px-3 py-1 rounded-full bg-rose-600/80 text-rose-100 text-xs font-bold uppercase tracking-wider">
                      Pimpinan Eksekutif Lembaga
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{executiveLeader.name}</h3>
                    <p className="text-sm font-bold text-purple-200">
                      {executiveLeader.position}
                    </p>
                    <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-2xl">
                      {executiveLeader.description || 'Memimpin implementasi operasional harian, advokasi pemenuhan hak-hak perempuan, dan kemitraan strategis dengan para pemangku kepentingan di Provinsi Jambi.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Three Governance Groups Cards with Full Profile Photos */}
          <div className="space-y-8">
            {organizationCategories.map((group) => {
              const groupMembers = members.filter((m) => categoryKey(m.category) === group.key);
              return (
                <div key={group.key} className="space-y-4">
                  <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{group.title}</h3>
                      <p className="text-xs text-slate-500">{group.structure}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg w-fit">
                      {groupMembers.length} Personel
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupMembers.map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 bg-white hover:shadow-md transition-all flex items-start gap-4 group shadow-2xs"
                      >
                        <MemberAvatar member={m} size="md" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            {m.position}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors truncate">
                            {m.name}
                          </h4>
                          {m.description && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. 16 PRINSIP PEDOMAN PERILAKU / KODE ETIK */}
      <section id="pedoman-perilaku" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Kode Etik & Integritas Moral Organisasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              16 Prinsip Pedoman Perilaku APM Jambi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Disahkan pada Musyawarah Besar Luar Biasa (14 Desember 2024), seluruh personal dan organ kelembagaan APM Jambi wajib mematuhi dan menjalankan standar perilaku berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {codeOfConductPrinciples.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-purple-300 hover:shadow-xs transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <p>
              <strong>Mekanisme Pengaduan:</strong> Badan Pengawas APM Jambi membuka kanal aduan tertulis atas dugaan pelanggaran kode etik dengan asas kerahasiaan dan perlindungan pelapor.
            </p>
            <a 
              href="#dokumen-legalitas" 
              className="font-bold underline shrink-0 hover:text-amber-950"
            >
              Unduh Naskah Lengkap PDF
            </a>
          </div>
        </div>
      </section>

      {/* 5. MARS & HYMNE APM JAMBI (Atribut Seni Gerakan) */}
      <section id="mars-hymne" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-purple-800 shadow-xl space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500/40 text-rose-200 text-xs font-bold uppercase tracking-wider">
              <Music className="w-3.5 h-3.5" />
              <span>Atribut & Panji Perjuangan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Mars & Hymne APM Jambi
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm">
              Termaktub dalam Anggaran Rumah Tangga (ART) Bab II Pasal 2 sebagai pengobar semangat pembebasan dan kepemimpinan perempuan pedesaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MARS APM */}
            <div className="p-6 sm:p-8 rounded-2xl bg-purple-900/40 border border-purple-800 space-y-4">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Mars APM Jambi
              </span>
              <div className="text-purple-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 font-medium">
                {`Hai APM Jambi Maju kehadapan
Singkirkan penghalang satukan tujuan
Bersama berjuang kita kikis kebodohan
Bersama berjuang kita kikis kemiskinan (2x)

Majulah wahai APM Jambi
Singsingkanlah lengan satukan barisan 
Janganlah ragu dan jangan bimbang
Pemberdayaan kita telah datang (2x)`}
              </div>
            </div>

            {/* HYMNE APM */}
            <div className="p-6 sm:p-8 rounded-2xl bg-indigo-900/40 border border-indigo-800 space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Hymne APM Jambi
              </span>
              <div className="text-purple-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 font-medium">
                {`Mari bersama bergandeng tangan
Wujudkan keadilan perempuan
Bersatu semua melangkah ciptakan demokrasi
Kini zamannya reformasi hilangkankalah dominasi
Ciptakan kesatuan Gender dan HAM nya perempuan
Tak ada lagi perbedaan insan semuanya sama
Harus saling menghormati agar tercapai kedamaian
Merdeka bersatu jaya

Saatnya kita berbicara ungkapkan semua harapan
Janganlah membisu membeku kaku bagaikan batu
Bangkitlah hai semua kaumku suarakan aspirasimu
Bersama berjuang tuk capai cita-cita kita`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. JARINGAN 33+ COMMUNITY CENTER (CC) */}
      <section id="community-centers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="rounded-3xl border border-purple-200 bg-white p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Akar Rumput Pedesaan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Jaringan 33+ Community Center (CC)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pusat pengorganisasian, layanan pengaduan, dan kegiatan ekonomi perempuan di desa.
              </p>
            </div>

            {/* Interactive Search Bar for Centers */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari desa atau nama CC..."
                value={searchCenter}
                onChange={(e) => setSearchCenter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Regency Interactive Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['Semua', 'Merangin', 'Bungo', 'Sarolangun'].map((regency) => {
              const count = regency === 'Semua' 
                ? communityCenters.length 
                : communityCenters.filter(c => String(c.regency || '').trim() === regency).length;
              return (
                <button
                  key={regency}
                  onClick={() => setSelectedRegency(regency)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRegency === regency
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {regency} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid of Filtered Centers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredCenters.map((center) => (
              <div 
                key={center.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-purple-50/50 hover:border-purple-300 transition-colors flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">CC {center.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{center.village}, Kec. {center.district}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                    Kab. {center.regency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MITRA STRATEGIS & KOLABORASI (Lokal & Nasional) */}
      <section id="mitra-strategis" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Sinergi Multipihak
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Jaringan Kerja & Mitra Kolaborasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Dokumentasi resmi kemitraan pemerintah, kepolisian, dinas terkait, serta jejaring NGO tingkat lokal dan nasional.
              </p>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setPartnerTab('local')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  partnerTab === 'local' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat Daerah ({localPartners.length})
              </button>
              <button
                onClick={() => setPartnerTab('national')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  partnerTab === 'national' ? 'bg-purple-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat Nasional ({nationalPartners.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(partnerTab === 'local' ? localPartners : nationalPartners).map((partner, i) => (
              <div 
                key={i}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-800 shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{partner.name}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {partner.scope || partner.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DOKUMEN RESMI, LEGALITAS & SK KEMENKUMHAM 2025 */}
      <section id="dokumen-legalitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-purple-900 shadow-xl space-y-8">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-900/80 border border-purple-700 text-purple-200 text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-purple-300" />
              <span>Transparansi & Legalitas Hukum</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Dokumen Resmi, Legalitas & AD/ART
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Berkas publikasi resmi yang dapat diunduh dan dipratinjau langsung oleh publik, pemangku kebijakan, mitra lembaga, dan anggota APM Jambi.
            </p>
          </div>

          {/* Special Feature Card: SK Kemenkumham RI Terbaru 2025 */}
          <div className="rounded-3xl border border-purple-700/60 bg-purple-900/40 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div 
                onClick={() => setShowSKModal(true)}
                className="w-48 h-64 rounded-2xl overflow-hidden border-2 border-purple-400 bg-white p-1 cursor-pointer group relative shadow-xl"
              >
                <img
                  src="/assets/sk-kemenkumham-2025.jpg"
                  alt="SK Kemenkumham RI APM Jambi 2025"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Pratinjau SK
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Status Hukum Resmi Terbaru
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Keputusan Menteri Hukum RI Nomor: AHU-0001146.AH.01.08.TAHUN 2025
              </h3>
              <div className="space-y-1.5 text-xs text-purple-200">
                <p>• <strong>Tanggal Penetapan:</strong> 09 Juli 2025 oleh Dirjen Administrasi Hukum Umum (AHU)</p>
                <p>• <strong>Akta Notaris:</strong> Muhammad Rizki Maulana, S.H., M.Kn. No. 09 Tanggal 09 Juli 2025</p>
                <p>• <strong>Nama Perkumpulan:</strong> Aliansi Perempuan Mandiri Jambi (APMJ)</p>
                <p>• <strong>NPWP Resmi:</strong> 02.372.149.1-333.000 (Berkedudukan di Kab. Merangin)</p>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSKModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat Surat Keputusan Penuh</span>
                </button>
                <a
                  href="/assets/sk-kemenkumham-2025.jpg"
                  download="SK_Kemenkumham_APM_Jambi_2025.jpg"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas SK</span>
                </a>
              </div>
            </div>
          </div>

          {/* Documents Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-600/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-900 text-purple-200 border border-purple-700">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">
                      {doc.file_type || 'PDF'} · {doc.file_size || ''}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau</span>
                  </button>

                  <a
                    href={getFullDocUrl(doc.file_path)}
                    download={doc.file_name || true}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden relative">
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-900 text-purple-300 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">{previewDoc.title}</h3>
                  <p className="text-xs text-purple-300 font-medium">
                    Kategori: {previewDoc.category} · Format: {(previewDoc.file_type || 'PDF').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={getFullDocUrl(previewDoc.file_path)}
                  download={previewDoc.file_name || true}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Iframe or Image Container */}
            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
              {isDocImage(previewDoc) ? (
                <img
                  src={getFullDocUrl(previewDoc.file_path)}
                  alt={previewDoc.title}
                  className="max-h-[75vh] w-auto object-contain p-4"
                />
              ) : (
                <iframe
                  src={getPreviewUrl(previewDoc)}
                  title={previewDoc.title}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Bagan Organisasi Lengkap */}
      {showChartModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowChartModal(false)}
        >
          <div 
            className="bg-slate-900 rounded-3xl border border-purple-800 shadow-2xl max-w-5xl w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Bagan Struktur Organisasi APM Jambi 2023–2028</h3>
                <p className="text-xs text-purple-300">Infografis resmi yang memuat seluruh foto kepengurusan</p>
              </div>
              <button 
                onClick={() => setShowChartModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-white p-2 max-h-[75vh] flex items-center justify-center">
              <img
                src="/assets/apm-org-chart-2023-2028.jpeg"
                alt="Bagan Struktur Organisasi APM Jambi"
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal SK Kemenkumham 2025 Lengkap */}
      {showSKModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowSKModal(false)}
        >
          <div 
            className="bg-slate-900 rounded-3xl border border-purple-800 shadow-2xl max-w-4xl w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">SK Menteri Hukum RI No. AHU-0001146.AH.01.08.TAHUN 2025</h3>
                <p className="text-xs text-purple-300">Pengesahan Perubahan Perkumpulan Aliansi Perempuan Mandiri Jambi</p>
              </div>
              <button 
                onClick={() => setShowSKModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-white p-2 max-h-[75vh] flex items-center justify-center">
              <img
                src="/assets/sk-kemenkumham-2025.jpg"
                alt="SK Kemenkumham RI APM Jambi"
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
