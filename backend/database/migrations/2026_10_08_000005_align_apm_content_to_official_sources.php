<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('community_centers')) {
            Schema::create('community_centers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('village');
                $table->string('district');
                $table->string('regency');
                $table->unsignedInteger('display_order')->default(0);
                $table->boolean('is_published')->default(true)->index();
                $table->timestamps();
            });
        }

        $centers = [
            ['Sehat Mandiri', 'Pulau Tujuh', 'Pamenang Barat', 'Merangin'],
            ['Pinang Sehat', 'Pinang Merah', 'Pamenang Barat', 'Merangin'],
            ['Lentera Hati', 'Mampun Baru', 'Pamenang Barat', 'Merangin'],
            ['Semangat Maju', 'Simp. Limbur', 'Pamenang Barat', 'Merangin'],
            ['Tunas Sehat', 'Rasau', 'Renah Pamenang', 'Merangin'],
            ['Merpati Mandiri', 'Meranti', 'Renah Pamenang', 'Merangin'],
            ['Mentari Sehat', 'Bukit Bungkul', 'Renah Pamenang', 'Merangin'],
            ['Sinar Pelangi', 'Lantak Seribu', 'Renah Pamenang', 'Merangin'],
            ['Sido Rukun', 'Tambang Emas', 'Pamenang Selatan', 'Merangin'],
            ['Tanjung Sari', 'Tjg. Benuang', 'Pamenang Selatan', 'Merangin'],
            ['Maju Bersama', 'Pulau Bayur', 'Pamenang Selatan', 'Merangin'],
            ['Lebah Madu Sehat', 'Sialang', 'Pamenang', 'Merangin'],
            ['Melati Berseri', 'Pauh Menang', 'Pamenang', 'Merangin'],
            ['Mekarsari', 'Bukit Beringin', 'Bangko Barat', 'Merangin'],
            ['Merpati Putih', 'Sei Putih', 'Bangko Barat', 'Merangin'],
            ['Harapan Sehat', 'Sei Kapas', 'Bangko', 'Merangin'],
            ['Masurai Indah', 'Pasar Atas', 'Bangko', 'Merangin'],
            ['Pandesra', 'Rantau Alai', 'Batang Masumai', 'Merangin'],
            ['Cadika Maju', 'Cadika', 'Rimbo Tengah', 'Bungo'],
            ['Harapan Bunda', 'Mengkuang', 'Rimbo Tengah', 'Bungo'],
            ['Sehati', 'Kel. Tj. Gedang', 'Pasar Muara Bungo', 'Bungo'],
            ['Melati', 'Kel. Taman Agung', 'Bathin III', 'Bungo'],
            ['Makmur Jaya', 'Dsn. Suka Makmur', 'Bathin II', 'Bungo'],
            ['Bunda Sehati', 'Bangun Jayo', 'Bathin VIII', 'Sarolangun'],
            ['Kembang Harapan', 'Kel. Gunung Kembang', 'Sarolangun', 'Sarolangun'],
            ['Permata Hati', 'Panti', 'Sarolangun', 'Sarolangun'],
            ['Harapan Sejahtera', 'Bernai Dalam', 'Bathin VIII', 'Sarolangun'],
            ['Baung Sejahtera', 'Desa Sei Baung', 'Bathin VIII', 'Sarolangun'],
            ['OP-BUBU', 'Bukit Bungkul', 'Renah Pamenang', 'Merangin'],
            ['IRPB', 'Bukit Beringin', 'Bangko Barat', 'Merangin'],
            ['IRPIS', 'Sei Putih', 'Bangko Barat', 'Merangin'],
            ['Perpam', 'Mampun Baru', 'Pamenang Barat', 'Merangin'],
            ['Ikrar', 'Pulau Tujuh', 'Pamenang Barat', 'Merangin'],
        ];
        if (! DB::table('community_centers')->exists()) {
            $now = now();
            DB::table('community_centers')->insert(array_map(
                static fn (array $row, int $index): array => [
                    'name' => $row[0],
                    'village' => $row[1],
                    'district' => $row[2],
                    'regency' => $row[3],
                    'display_order' => $index + 1,
                    'is_published' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                $centers,
                array_keys($centers),
            ));
        }

        DB::table('programs')->where(function ($query) {
            $query->where([
                'title' => 'Advokasi & Pendampingan Hak Perempuan',
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
                'description' => 'Program ini berfokus pada pemberian sosialisasi hukum dasar, penyuluhan pencegahan kekerasan dalam rumah tangga (KDRT), serta pendampingan komunitas bagi perempuan yang membutuhkan bantuan keadilan.',
            ])->orWhere([
                'title' => 'Pemberdayaan Ekonomi & UMKM Perempuan',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'description' => 'Mendorong perempuan untuk memiliki kemandirian finansial melalui pelatihan keterampilan usaha kreatif, pemasaran produk UMKM lokal, pengelolaan keuangan keluarga, dan koperasi simpan pinjam anggota.',
            ])->orWhere([
                'title' => 'Pengembangan Kepemimpinan & Edukasi Sosio-Budaya',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'description' => 'Meningkatkan rasa percaya diri dan keterampilan kepemimpinan pemudi dan perempuan lokal agar aktif berpartisipasi dalam musyawarah warga, kegiatan desa, serta kepengurusan organisasi publik.',
            ]);
        })->delete();

        $services = [
            'Pendampingan perempuan korban HKSR dan kekerasan berbasis gender',
            'Informasi UU PKDRT, UUTPKS, dan Perlindungan Anak',
            'Pengorganisasian kelompok perempuan dan perempuan muda',
            'Pendidikan kritis bagi perempuan',
            'Advokasi kebijakan',
            'Peningkatan ekonomi perempuan',
            'Penyadaran kesehatan reproduksi perempuan',
            'Pencegahan perkawinan sebelum usia 19 tahun',
            'Mendukung program pemerintah yang tidak bertentangan dengan visi dan misi APM',
        ];
        foreach ($services as $index => $title) {
            if (! DB::table('programs')->where('title', $title)->exists()) {
                DB::table('programs')->insert([
                    'badge' => 'Layanan ' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                    'title' => $title,
                    'category' => 'Layanan dan program kerja',
                    'description' => $title . '.',
                    'highlights' => json_encode([]),
                    'image' => null,
                    'color' => ['purple', 'blue', 'red', 'emerald'][$index % 4],
                    'display_order' => $index + 1,
                    'is_published' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $profile = [
            'header_title' => 'Aliansi Perempuan Mandiri Jambi',
            'header_description' => 'Organisasi perempuan berbentuk perkumpulan yang bekerja untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
            'history_title' => 'Sejarah dan identitas organisasi',
            'history_image' => '',
            'structure_intro' => 'AD/ART menetapkan Badan Pengawas berjumlah 3 orang, Badan Pengurus 3 orang (ketua, sekretaris, bendahara), dan Badan Pelaksana sebagai Direktur Eksekutif. Nama yang ditampilkan hanya yang tercantum dalam dokumen yang disediakan.',
            'history' => 'Profil organisasi mencatat bahwa Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003. Akta pendirian No. 58 dibuat oleh Notaris Sri Hermawati, SH pada 17 April 2003; perubahan akta No. 2 dibuat oleh Notaris Solihin, SH pada 2 Januari 2015. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi) dan menyatakan sebutan organisasi menjadi APM Jambi.',
            'vision' => 'Kekuatan otonomi perempuan dan keluarga yang berperspektif GEDSI.',
            'mission' => "1. Mewujudkan kekuatan otonomi perempuan di bidang ekonomi, politik, sosial yang peka GEDSI.\n2. Advokasi terhadap perempuan dan keluarga dalam pemenuhan hak-hak dasar.\n3. Membentuk kader-kader perempuan untuk layanan yang berperspektif GEDSI.\n4. Memberdayakan perempuan dewasa dan muda dalam bidang informasi dan teknologi.\n5. Membentuk SDM berkualitas untuk tatanan keluarga dan masyarakat peka GEDSI.\n6. Menciptakan kerja sama dan konsolidasi dengan Forum Multi Stakeholder (FMS) untuk mengakselerasi keadilan sosial gender terutama di pedesaan.",
            'tagline' => 'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kekuatan kolektif untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
            'profile_purpose' => 'Pemberdayaan dan pengorganisasian perempuan pedesaan; pemenuhan hak sosial, ekonomi, dan politik serta kesetaraan; berbagi sumber daya, pembelajaran dan kepemimpinan akar rumput; layanan komprehensif bagi korban kekerasan; advokasi kesehatan dan hak seksual dan reproduksi (HKSR); serta perbaikan kebijakan dan akses informasi maupun layanan. Tujuan profil juga mencakup entrepreneurship dan jaringan layanan HKSR.',
            'profile_vision' => 'Otonomi Perempuan & keluarga atas sumber kehidupan berkelanjutan berperspektif gender.',
            'strategies' => "Pendidikan dan penyadaran hak HKSR dengan perspektif gender dan pendekatan multi-stakeholder di pedesaan.\nAdvokasi dan kajian kebijakan responsif gender.\nPenguatan otonomi perempuan dan keluarga.\nPenguatan organisasi dan jaringan.",
            'scope' => 'Merangin, Bungo, dan Sarolangun, Provinsi Jambi, Indonesia.',
            'beneficiaries' => 'Perempuan dan perempuan muda pedesaan serta perempuan miskin kota dalam kelompok Community Center (CC), dengan kegiatan ekonomi dan diskusi kritis reguler.',
            'project_history' => "Pemda Merangin (2009–2010): akses hak dasar dan perlindungan.\nHivos – Women Access to Justice (2007–2012).\nPermampu – KTD (2014).\nKonsorsium Permampu/MAMPU (2015–2019): kepemimpinan, kesehatan, dan gizi.\nPermampu (2017): survei stunting dan gizi.",
            'legal_status' => "Nomor Kesbangpol Merangin: 220/XI/10/155/IV/2015.\nNomor Kesbangpol Provinsi Jambi: 220/1458/Bakesbang-Pol/XI/2017.\nPengesahan Kemenkumham: AHU-0003260.AH.01.07 Tahun 2019.",
            'principles' => 'Berbasis HAM perempuan dan keluarga; anti-diskriminasi; setara dan inklusif; partisipatif; transparan dan akuntabel; profesional; nonpartisan; berbagi daya dan saling belajar; keterpaduan; loyal dan akrab; tanpa toleransi kekerasan; keadilan gender dan inklusi; transformatif; tanpa toleransi fraud, korupsi, kolusi, nepotisme, dan primordialisme.',
            'funding' => 'Iuran anggota; jasa pengelolaan program; jasa profesional pelaksana; sumbangan tidak mengikat yang sesuai visi dan nilai; serta usaha legal.',
            'secretariat_address' => 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.',
        ];
        foreach ($profile as $key => $value) {
            $existing = DB::table('organization_settings')
                ->where(['group' => 'profile', 'key' => $key])
                ->value('value');
            if ($existing === null) {
                DB::table('organization_settings')->insert([
                    'group' => 'profile',
                    'key' => $key,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                continue;
            }

            $demoValues = [
                'header_title' => ['Profil & Identitas Organisasi'],
                'header_description' => ['Mengenal Sejarah, Visi, Misi, Legalitas, AD/ART, dan Struktur Kepengurusan Aliansi Perempuan Mandiri Jambi.'],
                'history_title' => ['Sejarah Aliansi Perempuan Mandiri Jambi'],
                'history_image' => ['https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'],
                'structure_intro' => ['Badan Pengawas, Pengurus, dan Pelaksana APM Jambi.'],
                'history' => [
                    'Aliansi Perempuan Mandiri (APM) Jambi didirikan sebagai wadah independen berbasis kemasyarakatan yang memperjuangkan kesetaraan gender, perlindungan perempuan dari kekerasan, serta peningkatan kemandirian ekonomi keluarga di Provinsi Jambi. Berdiri dengan semangat kebersamaan dan solidaritas sosial, APM Jambi senantiasa bergerak mendampingi kelompok perempuan perkotaan dan pedesaan.',
                    'Profil organisasi mencatat Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003. Akta pendirian No. 58, Notaris Sri Hermawati, SH, 17 April 2003; perubahan akta No. 2, Notaris Solihin, SH, 2 Januari 2015. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi) dan menyatakan sebutan organisasi menjadi APM Jambi.',
                ],
                'vision' => ['Terwujudnya tatanan masyarakat Jambi yang adil, setara gender, bebas dari kekerasan, serta memiliki kemandirian sosial dan ekonomi yang berkelanjutan.'],
                'mission' => [
                    "1. Mendorong advokasi dan kesadaran hukum bagi pemenuhan hak-hak perempuan.\n2. Mengembangkan program pemberdayaan ekonomi kreatif dan kewirausahaan perempuan.\n3. Membangun jejaring kerjasama dengan pemerintah, akademisi, dan organisasi sosial.\n4. Memperkuat kapasitas kepemimpinan perempuan dalam pengambilan keputusan komunitas.",
                ],
            ];
            if (in_array($existing, $demoValues[$key] ?? [], true)) {
                DB::table('organization_settings')->where(['group' => 'profile', 'key' => $key])
                    ->update(['value' => $value, 'updated_at' => now()]);
            }
        }

        $this->replaceSetting('home', 'hero_badge', ['Aliansi Perempuan Mandiri Jambi'], 'Aliansi Perempuan Mandiri Jambi (APM Jambi)');
        $this->replaceSetting('home', 'hero_title', ['Membangun Kemandirian & Kesetaraan Hak Perempuan Jambi'], 'Aliansi Perempuan Mandiri Jambi');
        $this->replaceSetting('home', 'hero_description', ['Wadah independen yang berdedikasi untuk pemberdayaan sosio-ekonomi, advokasi hak asasi perempuan, serta penguatan kepemimpinan komunitas perempuan di Provinsi Jambi.'], $profile['tagline']);
        $this->replaceSetting('home', 'hero_card_label', ['Komunitas & Advokasi'], 'Aliansi Perempuan Mandiri Jambi');
        $this->replaceSetting('home', 'hero_card_title', ['Pemberdayaan Perempuan Desa & Komunitas Lokal Jambi'], 'Mengakar kuat, tumbuh dan berkembang bersama mitra');
        $this->replaceSetting('home', 'about_title', ['Bersama Menguatkan Suara & Kemandirian Perempuan'], 'Tentang APM Jambi');
        $this->replaceSetting('home', 'about_description', ['Aliansi Perempuan Mandiri (APM) Jambi berdiri sebagai wujud solidaritas dalam mendorong pemenuhan hak-hak perempuan, perlindungan dari kekerasan, peningkatan ekonomi kreatif warga, serta partisipasi aktif dalam pembangunan sosial di Provinsi Jambi.'], $profile['history']);

        $this->replaceSetting('contact', 'address', ['Jl. Jendral Sudirman No. 45, Kota Jambi, Provinsi Jambi 36138'], $profile['secretariat_address']);
        $this->replaceSetting('contact', 'whatsapp', ['+62 812-3456-7890'], '');
        $this->replaceSetting('contact', 'email', ['info@apmjambi.or.id'], '');
        $this->replaceSetting('contact', 'facebook', ['https://facebook.com/apmjambi'], '');
        $this->replaceSetting('contact', 'instagram', ['https://instagram.com/apmjambi'], '');
        $this->replaceSetting('contact', 'youtube', ['https://youtube.com/@apmjambi'], '');
        $this->replaceSetting('contact', 'maps_embed', ['https://maps.google.com/?q=Kota+Jambi'], '');

        $signedOrgMembers = [
            ['oversight', 'Erat Indri Hastuti, S.Pd', 'Ketua Badan Pengawas'],
            ['oversight', 'Sarjoko, A.Md., S.Pd', 'Badan Pengawas'],
            ['oversight', 'Lasmi', 'Badan Pengawas'],
            ['management', 'Sualjimah', 'Ketua Badan Pengurus'],
            ['implementation', 'Marsiyam', 'Direktur Eksekutif'],
        ];
        foreach ($signedOrgMembers as $index => [$category, $name, $position]) {
            if (! DB::table('organization_members')->where('name', $name)->exists()) {
                DB::table('organization_members')->insert([
                    'category' => $category,
                    'name' => $name,
                    'position' => $position,
                    'description' => null,
                    'photo_url' => null,
                    'display_order' => $index + 1,
                    'is_published' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        DB::table('organization_members')->where(function ($query) {
            $query->where([
                'category' => 'management',
                'name' => 'Sekretaris',
                'position' => 'Administrasi & Hubungan Kelembagaan',
                'description' => null,
                'photo_url' => null,
            ])->orWhere([
                'category' => 'management',
                'name' => 'Bendahara',
                'position' => 'Pengelolaan Keuangan & Aset',
                'description' => null,
                'photo_url' => null,
            ])->orWhere([
                'category' => 'implementation',
                'name' => 'Divisi Advokasi & Ekonomi',
                'position' => 'Koordinasi Lapangan & Pendampingan',
                'description' => null,
                'photo_url' => null,
            ]);
        })->delete();
        DB::table('organization_members')
            ->where('category', 'management')
            ->where('name', 'Marsiyam')
            ->where('position', 'Direktur APM Jambi')
            ->whereNull('description')
            ->whereNull('photo_url')
            ->update(['category' => 'implementation', 'position' => 'Direktur Eksekutif', 'updated_at' => now()]);
    }

    private function replaceSetting(string $group, string $key, array $demoValues, string $value): void
    {
        $existing = DB::table('organization_settings')->where(compact('group', 'key'))->value('value');
        if ($existing === null || in_array($existing, $demoValues, true)) {
            DB::table('organization_settings')->updateOrInsert(
                compact('group', 'key'),
                ['value' => $value, 'created_at' => now(), 'updated_at' => now()],
            );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('community_centers');
    }
};
