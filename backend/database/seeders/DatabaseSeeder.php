<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\News;
use App\Models\Gallery;
use App\Models\Program;
use App\Models\OrganizationMember;
use App\Models\CommunityCenter;
use App\Models\OrganizationSetting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Multi-Role Staff Users
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@apmjambi.or.id'],
            [
                'name' => 'Marsiyam (Direktur APM Jambi)',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_active' => true,
            ]
        );

        $editorUser = User::updateOrCreate(
            ['email' => 'sugeng@apmjambi.or.id'],
            [
                'name' => 'Sugeng Hadi Kusuma',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $advokasiUser = User::updateOrCreate(
            ['email' => 'siti.nurjanah@apmjambi.or.id'],
            [
                'name' => 'Siti Nurjanah',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'is_active' => true,
            ]
        );

        $reporterUser = User::updateOrCreate(
            ['email' => 'rahmawati@apmjambi.or.id'],
            [
                'name' => 'Rahmawati Fitri',
                'password' => Hash::make('password'),
                'role' => 'reporter',
                'is_active' => true,
            ]
        );

        // 2. Seed High-Quality News & Articles (With Authors Linked)
        $newsItems = [
            [
                'title' => 'Musyawarah Besar Luar Biasa APM Jambi Tetapkan Arah Strategis Transformasi GEDSI 2024–2028',
                'slug' => 'mubes-lb-apm-jambi-tetapkan-arah-strategis-transformasi-gedsi-2024-2028',
                'category' => 'Kelembagaan & Advokasi',
                'content' => "Musyawarah Besar Luar Biasa Aliansi Perempuan Mandiri Jambi (APM Jambi) yang berlangsung khidmat di Bukit Bungkul, Merangin pada 14 Desember 2024 secara aklamasi mengesahkan pembaruan Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) serta Pedoman Perilaku Kelembagaan.\n\nDalam forum tertinggi organisasi yang dihadiri oleh delegasi 33 Community Center (CC) dari Kabupaten Merangin, Bungo, dan Sarolangun, ditegaskan komitmen APM Jambi untuk memperkuat otonomi perempuan desa di tengah tantangan alih fungsi lahan dan kerentanan ekonomi keluarga.\n\nKetua Badan Pengurus, Sualjimah, menyampaikan bahwa transformasi nama kelembagaan mempertegas mandat organisasi untuk tidak hanya fokus di Merangin, namun mengawal perluasan gerakan perempuan mandiri se-Provinsi Jambi dengan pendekatan Gender Equality, Disability, and Social Inclusion (GEDSI).",
                'featured_image' => 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Siti Nurjanah',
                'user_id' => $advokasiUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Lokakarya Penguatan Paralegal Desa: Mempercepat Layanan Pendampingan Kasus Kekerasan Berbasis Gender',
                'slug' => 'lokakarya-penguatan-paralegal-desa-layanan-pendampingan-kasus-kekerasan-gender',
                'category' => 'Bantuan Hukum & Paralegal',
                'content' => "Sebagai garda terdepan perlindungan perempuan dan anak di pelosok pedesaan, 45 kader paralegal komunitas binaan APM Jambi mengikuti pelatihan intensif pendampingan korban tindak pidana kekerasan seksual (TPKS) dan KDRT di Bangko.\n\nPelatihan ini membedah mekanisme rujukan medis terpadu, visum et repertum, bantuan hukum cuma-cuma, serta teknik konseling psikososial berbasis kebutuhan korban.\n\nDirektur Eksekutif APM Jambi, Marsiyam, menegaskan bahwa keberadaan paralegal komunitas terbukti menurunkan stigma negatif terhadap korban dan mempercepat pemulihan trauma fisik serta psikis keluarga dampingan.",
                'featured_image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Marsiyam (Direktur APM Jambi)',
                'user_id' => $adminUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Kemandirian Ekonomi Perempuan Pedesaan: Koperasi Simpan Pinjam dan Produksi Olahan Pangan Mandiri',
                'slug' => 'kemandirian-ekonomi-perempuan-pedesaan-koperasi-simpan-pinjam-olahan-pangan',
                'category' => 'Pemberdayaan Ekonomi',
                'content' => "Kelompok Usaha Bersama (KUB) dampingan APM Jambi di Kecamatan Pamenang Barat mencatatkan kenaikan omzet produktif melalui hilirisasi komoditas kebun lokal menjadi aneka kripik pisang rasa rempah dan olahan jahe merah bersertifikat halal.\n\nSelain produksi pangan olahan, unit simpan pinjam komunitas berbasis transparansi buku kas digital memberikan akses permodalan tanpa bunga mencekik bagi ratusan buruh tani perempuan.\n\nKoordinator Program, Sutiyem, menjelaskan bahwa otonomi ekonomi adalah fondasi utama otonomi sosial perempuan, mengurangi ketergantungan finansial yang rentan memicu tindak kekerasan domestik.",
                'featured_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Sugeng Hadi Kusuma',
                'user_id' => $editorUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => 'Edukasi Hak Kesehatan Seksual & Reproduksi (HKSR) Remaja di Pos PKPR Puskesmas Meranti',
                'slug' => 'edukasi-hak-kesehatan-seksual-dan-reproduksi-remaja-pkpr-puskesmas-meranti',
                'category' => 'Kesehatan Reproduksi (HKSR)',
                'content' => "Kolaborasi sinergis antara APM Jambi bersama Puskesmas Meranti dan kader posyandu menghadirkan ruang edukasi ramah remaja mengenai kesehatan reproduksi, nutrisi pencegahan anemia, dan pemahaman pencegahan perkawinan usia anak.\n\nDalam kegiatan interaktif ini, puluhan remaja putri dan kader muda mendiskusikan mitos seputar menstruasi, infeksi menular seksual, serta hak untuk menolak paksaan pernikahan sebelum genap berusia 19 tahun demi masa depan pendidikan.",
                'featured_image' => 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Rahmawati Fitri',
                'user_id' => $reporterUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => 'Rembuk Kebijakan Multi-Stakeholder: Mendorong Alokasi Anggaran Desa Responsif Gender di Sarolangun',
                'slug' => 'rembuk-kebijakan-multi-stakeholder-alokasi-anggaran-desa-responsif-gender-sarolangun',
                'category' => 'Advokasi Kebijakan',
                'content' => "Forum Multi-Stakeholder (FMS) yang difasilitasi APM Jambi bersama perangkat desa di Kabupaten Sarolangun menghasilkan kesepakatan tertulis mengenai penyisihan dana desa untuk pos pelayanan pengaduan kekerasan dan pemeriksaan gizi balita stunting.\n\nPartisipasi aktif perempuan dalam Musrenbangdes dinilai krusial agar kebutuhan spesifik air bersih, posyandu lansia, dan sanitasi publik mendapatkan prioritas anggaran riil.",
                'featured_image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Siti Nurjanah',
                'user_id' => $advokasiUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(25),
            ],
            [
                'title' => 'Pertemuan Akbar 33 Community Center (CC): Memperkuat Solidaritas Akar Rumput Tiga Kabupaten',
                'slug' => 'pertemuan-akbar-33-community-center-solidaritas-akar-rumput-tiga-kabupaten',
                'category' => 'Community Center',
                'content' => "Sebanyak 33 kelompok Community Center (CC) dari Kabupaten Merangin, Bungo, dan Sarolangun berkumpul dalam silaturahmi akbar tahunan. Acara ini menjadi ajang pertukaran praktik baik antar-pos CC, pameran produk kerajinan bambu dan pangan organik, serta refleksi capaian pendampingan kelompok dampingan.",
                'featured_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Rahmawati Fitri',
                'user_id' => $reporterUser->id,
                'status' => 'published',
                'published_at' => now()->subDays(30),
            ],
        ];

        foreach ($newsItems as $item) {
            News::updateOrCreate(
                ['slug' => $item['slug']],
                $item
            );
        }

        // 3. Seed Professional Categorized Gallery Photos
        $galleries = [
            [
                'title' => 'Workshop Kewirausahaan Mandiri & Pengolahan Pangan Komunitas',
                'category' => 'Pemberdayaan Ekonomi',
                'description' => 'Pelatihan peningkatan kapasitas ekonomi bagi kader perempuan pedesaan dalam memproduksi dan memasarkan olahan produk lokal berkelanjutan.',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Sosialisasi Kesadaran Hukum & Perlindungan Hak Perempuan Pedesaan',
                'category' => 'Advokasi & Hak Hukum',
                'description' => 'Edukasi dan penyuluhan pemahaman UU TPKS dan PKDRT bersama paralegal komunitas di Kabupaten Merangin.',
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Musyawarah Tahunan & Penguatan Jejaring Community Center (CC)',
                'category' => 'Musyawarah & Kelembagaan',
                'description' => 'Konsolidasi pengurus dan delegasi kader Community Center dari Kabupaten Merangin, Bungo, dan Sarolangun.',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Kunjungan Lapangan & Pembinaan Kelompok Usaha Bersama (KUB)',
                'category' => 'Pemberdayaan Ekonomi',
                'description' => 'Bimbingan teknis pencatatan keuangan sederhana bagi kelompok simpan pinjam anggota perempuan di desa.',
                'image' => 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Pelatihan Literasi Digital & Publikasi Media Komunitas',
                'category' => 'Pemberdayaan Ekonomi',
                'description' => 'Pemberdayaan perempuan muda dalam pemanfaatan teknologi informasi untuk advokasi dan promosi produk kerajinan daerah.',
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Forum Multi-Stakeholder untuk Akselerasi Keadilan Sosial Gender',
                'category' => 'Advokasi & Hak Hukum',
                'description' => 'Dialog kolaboratif bersama instansi pemerintah daerah, tokoh adat masyarakat, dan mitra strategis pemenuhan hak perempuan.',
                'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Edukasi Kesehatan Reproduksi (HKSR) dan Nutrisi Balita',
                'category' => 'Kesehatan Reproduksi & HKSR',
                'description' => 'Penyuluhan hak kesehatan seksual dan reproduksi serta pencegahan stunting pada kelompok ibu balita desa.',
                'image' => 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Pertemuan Rutin Pos Community Center Desa Pulau Tujuh',
                'category' => 'Community Center',
                'description' => 'Diskusi kritis mingguan anggota CC mengenai isu-isu perlindungan anak dan kemandirian ekonomi rumah tangga.',
                'image' => 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($galleries as $gal) {
            Gallery::updateOrCreate(
                ['title' => $gal['title']],
                $gal
            );
        }

        // 4. Seed Organization Profile Settings
        $this->seedSettings('profile', [
            'header_title' => 'Aliansi Perempuan Mandiri Jambi (APM Jambi)',
            'header_description' => 'Organisasi perempuan berbentuk perkumpulan yang bekerja untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
            'history_title' => 'Sejarah dan Identitas Organisasi',
            'history' => 'Profil organisasi mencatat bahwa Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003. Akta pendirian No. 58 dibuat oleh Notaris Sri Hermawati, SH pada 17 April 2003; perubahan akta No. 2 dibuat oleh Notaris Solihin, SH pada 2 Januari 2015. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi) dan menyatakan sebutan organisasi menjadi APM Jambi. Pengesahan Menkumham RI terbaru No. AHU-0001146.AH.01.08.TAHUN 2025 Tanggal 09 Juli 2025.',
            'vision' => 'Kekuatan otonomi perempuan dan keluarga yang berperspektif GEDSI.',
            'mission' => "1. Mewujudkan kekuatan otonomi perempuan di bidang ekonomi, politik, sosial yang peka GEDSI.\n2. Advokasi terhadap perempuan dan keluarga dalam pemenuhan hak-hak dasar.\n3. Membentuk kader-kader perempuan untuk layanan yang berperspektif GEDSI.\n4. Memberdayakan perempuan dewasa dan muda dalam bidang informasi dan teknologi.\n5. Membentuk SDM berkualitas untuk tatanan keluarga dan masyarakat peka GEDSI.\n6. Menciptakan kerja sama dan konsolidasi dengan Forum Multi Stakeholder (FMS) untuk mengakselerasi keadilan sosial gender terutama di pedesaan.",
            'profile_vision' => 'Otonomi Perempuan & keluarga atas sumber kehidupan berkelanjutan berperspektif gender.',
            'scope' => 'Merangin, Bungo, dan Sarolangun, Provinsi Jambi, Indonesia.',
            'secretariat_address' => 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.',
            'tagline' => 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kekuatan kolektif untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
            'legal_status' => "Pengesahan Kemenkumham RI Terbaru: AHU-0001146.AH.01.08.TAHUN 2025 (Tanggal 09 Juli 2025).\nAkta Notaris: Muhammad Rizki Maulana, S.H., M.Kn. No. 09 Tanggal 09 Juli 2025.\nNPWP Perkumpulan: 02.372.149.1-333.000 (APMJ Merangin).\nAkta Pendirian: Notaris Sri Hermawati, SH No. 58 (17 April 2003); Perubahan No. 2 Notaris Solihin, SH (2 Januari 2015).\nPencatatan Kesbangpol: Bakesbangpol Merangin No. 220/XI/10/155/IV/2015 & Bakesbangpol Jambi No. 220/1458/Bakesbang-Pol/XI/2017.",
        ]);

        // 5. Seed Organization Contact Settings
        $this->seedSettings('contact', [
            'address' => 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.',
            'whatsapp' => '0812-7400-5678',
            'email' => 'sekretariat@apmjambi.or.id',
            'facebook' => 'https://facebook.com/apmjambi',
            'instagram' => 'https://instagram.com/apmjambi_official',
            'youtube' => 'https://youtube.com/@apmjambi',
            'maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2f7596c3746617%3A0x6b4f7ceec1c7bb39!2sPamenang%2C%20Merangin%20Regency%2C%20Jambi!5e0!3m2!1sid!2sid',
        ]);

        // 6. Seed Home Content Settings
        $this->seedSettings('home', [
            'hero_badge' => 'Aliansi Perempuan Mandiri Jambi (APM Jambi)',
            'hero_title' => 'Kekuatan Kolektif untuk Pemberdayaan Perempuan & Anak',
            'hero_description' => 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kemandirian ekonomi, advokasi hak keadilan gender, dan perlindungan sosial di Provinsi Jambi.',
            'about_badge' => 'Mengenal APM Jambi',
            'about_title' => 'Sejarah, Integritas, dan Dedikasi Sejak 2003',
            'about_description' => "Aliansi Perempuan Mandiri Jambi (APM Jambi) didirikan pada 1 Januari 2003 di Merangin, Jambi. Selama lebih dari dua dekade, lembaga ini konsisten mengorganisir kelompok perempuan akar rumput pedesaan, menyediakan layanan pendampingan hukum dan kesehatan reproduksi, serta mendampingi 33+ Community Center (CC) di Merangin, Bungo, dan Sarolangun.",
        ]);
    }

    private function seedSettings(string $group, array $settings): void
    {
        foreach ($settings as $key => $value) {
            OrganizationSetting::updateOrCreate(
                ['group' => $group, 'key' => $key],
                ['value' => $value],
            );
        }
    }
}
