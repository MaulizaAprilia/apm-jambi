<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add optional category column to galleries and news if not existing
        if (Schema::hasTable('galleries') && !Schema::hasColumn('galleries', 'category')) {
            Schema::table('galleries', function (Blueprint $table) {
                $table->string('category', 100)->nullable()->after('title');
            });
        }

        if (Schema::hasTable('news') && !Schema::hasColumn('news', 'category')) {
            Schema::table('news', function (Blueprint $table) {
                $table->string('category', 100)->nullable()->after('slug');
            });
        }

        // 2. Comprehensive Contact Settings Update
        $contactSettings = [
            'address' => 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.',
            'whatsapp' => '0812-7400-5678',
            'email' => 'sekretariat@apmjambi.or.id',
            'facebook' => 'https://facebook.com/apmjambi',
            'instagram' => 'https://instagram.com/apmjambi_official',
            'youtube' => 'https://youtube.com/@apmjambi',
            'maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2f7596c3746617%3A0x6b4f7ceec1c7bb39!2sPamenang%2C%20Merangin%20Regency%2C%20Jambi!5e0!3m2!1sid!2sid',
        ];

        foreach ($contactSettings as $key => $value) {
            DB::table('organization_settings')->updateOrInsert(
                ['group' => 'contact', 'key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        // 3. Home Content Settings
        $homeSettings = [
            'hero_badge' => 'Aliansi Perempuan Mandiri Jambi (APM Jambi)',
            'hero_title' => 'Kekuatan Kolektif untuk Pemberdayaan Perempuan & Anak',
            'hero_description' => 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kemandirian ekonomi, advokasi hak keadilan gender, dan perlindungan sosial di Provinsi Jambi.',
            'about_badge' => 'Mengenal APM Jambi',
            'about_title' => 'Sejarah, Integritas, dan Dedikasi Sejak 2003',
            'about_description' => "Aliansi Perempuan Mandiri Jambi (APM Jambi) didirikan pada 1 Januari 2003 di Merangin, Jambi. Selama lebih dari dua dekade, lembaga ini konsisten mengorganisir kelompok perempuan akar rumput pedesaan, menyediakan layanan pendampingan hukum dan kesehatan reproduksi, serta mendampingi 33+ Community Center (CC) di Merangin, Bungo, dan Sarolangun.",
        ];

        foreach ($homeSettings as $key => $value) {
            DB::table('organization_settings')->updateOrInsert(
                ['group' => 'home', 'key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        // 4. Seed Professional News Articles
        $newsItems = [
            [
                'title' => 'Pelatihan Kewirausahaan & Literasi Keuangan Bagi Kader Perempuan Komunitas Merangin',
                'slug' => 'pelatihan-kewirausahaan-perempuan-kota-jambi',
                'category' => 'Pemberdayaan Ekonomi',
                'featured_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
                'content' => "Aliansi Perempuan Mandiri (APM) Jambi sukses menyelenggarakan rangkaian pelatihan intensif kewirausahaan dan tata kelola keuangan kelompok simpan pinjam bagi 45 perwakilan kader perempuan pedesaan dari Kabupaten Merangin.\n\nKegiatan ini difasilitasi langsung oleh tim pemberdayaan ekonomi APM Jambi bersama praktisi usaha mikro. Para peserta dilatih menyusun pencatatan arus kas sederhana, strategi pengemasan produk olahan hasil bumi pedesaan, serta penjajakan kerja sama pemasaran bersama antar-desa.\n\nDirektur APM Jambi, Marsiyam, menegaskan pentingnya kemandirian ekonomi sebagai fondasi otonomi perempuan dalam keluarga dan masyarakat. Program ini akan berlanjut dengan pendampingan mingguan pada pos-pos Community Center terdekat.",
                'author' => 'Marsiyam (Direktur APM J)',
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Sosialisasi UU Tindak Pidana Kekerasan Seksual (TPKS) & Penguatan Paralegal Desa',
                'slug' => 'sosialisasi-kesadaran-hukum-muaro-jambi',
                'category' => 'Advokasi & Hukum',
                'featured_image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
                'content' => "Sebagai komitmen mewujudkan ruang hidup yang aman dan adil bagi perempuan dan anak, APM Jambi menggelar sesi sosialisasi mendalam terkait implementasi UU Nomor 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual (TPKS) serta UU PKDRT di wilayah pedesaan.\n\nDalam kegiatan ini, paralegal komunitas dilatih mengenali bentuk-bentuk kekerasan berbasis gender, tata laksana rujukan medis dan psikososial, serta prosedur pendampingan hukum yang peka korban. Peserta berdiskusi aktif mengenai tantangan riil penanganan kasus di tingkat akar rumput.\n\nKetua Badan Pengurus APM Jambi, Sualjimah, menyampaikan bahwa kehadiran paralegal terlatih di tiap desa adalah kunci respon cepat dalam melindungi korban dan mencegah normalisasi kekerasan.",
                'author' => 'Sualjimah (Ketua Badan Pengurus)',
                'status' => 'published',
                'published_at' => now()->subDays(6),
            ],
            [
                'title' => 'Rapat Kerja Tahunan APM Jambi 2026: Merumuskan Agenda Aksi Inklusif 2026–2027',
                'slug' => 'rapat-kerja-tahunan-apm-jambi-2026',
                'category' => 'Musyawarah & Kelembagaan',
                'featured_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                'content' => "Badan Pengawas, Badan Pengurus, serta Pelaksana Eksekutif APM Jambi menggelar Rapat Kerja Tahunan (RKT) 2026 untuk mengevaluasi capaian program serta menetapkan prioritas strategis organisasi kurun waktu 2026–2027.\n\nAgenda tahun ini menitikberatkan pada perluasan kapasitas 33 kelompok Community Center di Merangin, Bungo, dan Sarolangun, digitalisasi sistem pelaporan monitoring lapangan, serta penguatan kemitraan dengan instansi pemerintah daerah dan organisasi masyarakat sipil.\n\nKetua Badan Pengawas, Erat Indri Hastuti, mengapresiasi kinerja seluruh pengurus dan menegaskan komitmen tata kelola organisasi yang transparan, akuntabel, dan bebas dari toleransi fraud maupun kekerasan.",
                'author' => 'Erat Indri Hastuti (Ketua Badan Pengawas)',
                'status' => 'published',
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => 'Edukasi Hak Kesehatan Seksual & Reproduksi (HKSR) Serta Pencegahan Perkawinan Anak',
                'slug' => 'edukasi-kesehatan-reproduksi-pencegahan-perkawinan-anak',
                'category' => 'Kesehatan & HKSR',
                'featured_image' => 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
                'content' => "Guna menekan angka perkawinan dini di bawah usia 19 tahun dan meningkatkan kesadaran nutrisi keluarga, APM Jambi menyelenggarakan lokakarya edukasi kesehatan reproduksi di beberapa desa dampingan.\n\nAcara dihadiri perempuan muda, kader posyandu, dan tokoh pendidik setempat. Materi difokuskan pada pemahaman kesehatan reproduksi perempuan, pencegahan stunting pada balita, serta penguatan dialog antara orang tua dan anak remaja.\n\nStaf Advokasi APM Jambi, Siti Nurjanah, menjelaskan bahwa edukasi komprehensif sejak dini terbukti efektif membangun kesadaran kritis generasi muda dalam merencanakan masa depan yang sehat dan mandiri.",
                'author' => 'Siti Nurjanah (Staf Advokasi)',
                'status' => 'published',
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => 'Kunjungan Lapangan & Monitoring Kemajuan Kelompok Usaha Bersama (KUB) Perempuan Desa',
                'slug' => 'kunjungan-monitoring-kub-perempuan-desa',
                'category' => 'Community Center',
                'featured_image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
                'content' => "Tim monitoring lapangan APM Jambi melaksanakan kunjungan berkala ke sentra-sentra Kelompok Usaha Bersama (KUB) di Kecamatan Renah Pamenang dan Bangko Barat.\n\nDalam kunjungan ini, tim meninjau langsung perkembangan produksi keripik olahan singkong dan anyaman tradisional yang diinisiasi oleh anggota Community Center. Hasil evaluasi menunjukkan adanya peningkatan omzet rata-rata sebesar 25% setelah diterapkannya sistem pencatatan keuangan rapi.\n\nStaf Lapang Merangin, Rahmawati Fitri, menyampaikan bahwa APM Jambi akan terus menghubungkan produk-produk komunitas ini dengan pameran lokal serta jejaring pasar digital.",
                'author' => 'Rahmawati Fitri (Staf Lapang Merangin)',
                'status' => 'published',
                'published_at' => now()->subDays(24),
            ],
            [
                'title' => 'Dialog Multipihak (FMS): Mendorong Kebijakan Desa yang Responsif Gender dan Inklusif',
                'slug' => 'dialog-multipihak-fms-kebijakan-desa-responsif-gender',
                'category' => 'Advokasi & Hukum',
                'featured_image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                'content' => "APM Jambi memfasilitasi Forum Multi-Stakeholder (FMS) yang mempertemukan aparatur pemerintah desa, Badan Permusyawaratan Desa (BPD), perwakilan kader perempuan, serta pegiat perlindungan anak di Merangin.\n\nDialog ini berfokus pada alokasi anggaran dana desa yang pro-perempuan dan ramah anak, khususnya penyediaan pos layanan pengaduan kekerasan dan program gizi cegah stunting.\n\nMelalui forum ini, beberapa pemerintah desa berkomitmen mengintegrasikan program pemberdayaan perempuan dalam Rencana Kerja Pemerintah Desa (RKPDes) tahun mendatang.",
                'author' => 'Tim Advokasi Kebijakan APM Jambi',
                'status' => 'published',
                'published_at' => now()->subDays(30),
            ],
        ];

        foreach ($newsItems as $item) {
            DB::table('news')->updateOrInsert(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'category' => $item['category'],
                    'featured_image' => $item['featured_image'],
                    'content' => $item['content'],
                    'author' => $item['author'],
                    'status' => $item['status'],
                    'published_at' => $item['published_at'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        // 5. Seed Comprehensive High Quality Galleries
        $galleryItems = [
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

        foreach ($galleryItems as $gallery) {
            DB::table('galleries')->updateOrInsert(
                ['title' => $gallery['title']],
                [
                    'category' => $gallery['category'],
                    'description' => $gallery['description'],
                    'image' => $gallery['image'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        // Reversible
    }
};

