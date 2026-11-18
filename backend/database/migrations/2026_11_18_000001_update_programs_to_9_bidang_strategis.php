<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $programs = [
            1 => [
                'title' => 'Pendampingan Perempuan Korban HKSR dan Kekerasan Berbasis GEDSI',
                'category' => 'Perlindungan Hukum & GEDSI',
                'badge' => 'Layanan 01',
                'description' => 'Memastikan korban memperoleh perlindungan, pemulihan, dan pemenuhan hak tanpa diskriminasi, serta akses informasi dan layanan kesehatan seksual dan reproduksi yang aman, ramah, berkualitas, dan memperkuat koordinasi lintas sektor dalam penanganan kasus.',
                'highlights' => json_encode([
                    'Memastikan korban memperoleh perlindungan, pemulihan, dan pemenuhan hak tanpa diskriminasi',
                    'Akses terhadap informasi dan layanan kesehatan seksual dan reproduksi yang aman, ramah, dan berkualitas',
                    'Memperkuat koordinasi lintas sektor dalam penanganan kasus kekerasan terhadap perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
                'color' => 'rose',
            ],
            2 => [
                'title' => 'Pembangunan Kesadaran Hukum & Perlindungan Hak Perempuan dan Anak',
                'category' => 'Kesadaran Hukum & Advokasi',
                'badge' => 'Layanan 02',
                'description' => 'Terbangunnya masyarakat yang sadar hukum, responsif gender, inklusif, serta berperan aktif dalam mencegah kekerasan dan memastikan perlindungan hak perempuan dan anak.',
                'highlights' => json_encode([
                    'Peningkatan Pemahaman Hukum Perempuan di tingkat Akar Rumput',
                    'Peningkatan kapasitas kader dan kelompok perempuan dalam mengenali serta merespons kasus kekerasan terhadap Perempuan dan Anak',
                    'Sosialisasi mekanisme pengaduan dan pelaporan kasus',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'color' => 'purple',
            ],
            3 => [
                'title' => 'Pengorganisasian Kelompok Perempuan & Perempuan Muda Lintas Generasi',
                'category' => 'Pengorganisasian & Kepemimpinan',
                'badge' => 'Layanan 03',
                'description' => 'Terbangunnya kelompok perempuan dan perempuan muda yang terorganisir, memiliki kesadaran kritis, kepemimpinan, komitmen, serta kemampuan melakukan aksi kolektif untuk memperjuangkan hak, kepentingan, dan perubahan sosial yang lebih adil dan inklusif.',
                'highlights' => json_encode([
                    'Diskusi rutin dan pendidikan kritis bulanan di Community Center (CC) dan Credit Union (CU)',
                    'Pengembangan kepemimpinan dan kaderisasi perempuan lintas generasi',
                    'Peningkatan kesadaran kritis tentang hak perempuan, kesetaraan gender, dan GEDSI',
                    'Pelatihan kepemimpinan, pengorganisasian, dan advokasi',
                ]),
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'color' => 'indigo',
            ],
            4 => [
                'title' => 'Pendidikan Kritis Berperspektif Keadilan Gender dan Inklusi (GEDSI)',
                'category' => 'Pendidikan Kritis GEDSI',
                'badge' => 'Layanan 04',
                'description' => 'Pendidikan kritis berperspektif keadilan gender dan inklusi (GEDSI) merupakan proses pembelajaran yang bertujuan membangun kesadaran kritis perempuan, perempuan muda, dan masyarakat dalam memahami serta menganalisis berbagai bentuk ketidakadilan, diskriminasi, ketimpangan relasi kuasa, dan hambatan sosial yang dialami oleh kelompok marginal.',
                'highlights' => json_encode([
                    'Penguatan Pemahaman GEDSI',
                    'Penguatan Kepemimpinan Perempuan',
                    'Diskusi kritis mengenai KDRT, perkawinan anak, kekerasan seksual, kemiskinan, dan ketimpangan akses layanan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
                'color' => 'blue',
            ],
            5 => [
                'title' => 'Advokasi Kebijakan Daerah yang Berperspektif Keadilan dan Responsif GEDSI',
                'category' => 'Advokasi Kebijakan & GEDSI',
                'badge' => 'Layanan 05',
                'description' => 'Advokasi kebijakan daerah dan penganggaran responsif GEDSI merupakan upaya mendorong lahirnya kebijakan, regulasi, program, dan alokasi anggaran pemerintah daerah maupun pemerintah desa yang berpihak pada pemenuhan hak perempuan, anak, kelompok disabilitas, lansia, dan kelompok marginal lainnya.',
                'highlights' => json_encode([
                    'Mendorong integrasi isu GEDSI dalam STRADA, RPJMD, RKPD, dan kebijakan sektoral daerah',
                    'Mendorong keterlibatan kelompok perempuan dan perempuan muda dalam Musrenbang Desa, Musrenbang Kecamatan, forum konsultasi publik, dan proses penyusunan kebijakan daerah',
                    'Pengawalan Implementasi Kebijakan',
                    'Fasilitasi Forum Multi-Stakeholder (FMS) Lintas Sektor',
                ]),
                'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
                'color' => 'emerald',
            ],
            6 => [
                'title' => 'Peningkatan Kemandirian Ekonomi Kelompok Credit Union (CU)',
                'category' => 'Kemandirian Ekonomi & CU',
                'badge' => 'Layanan 06',
                'description' => 'Penguatan Kemandirian Ekonomi Kelompok CU melalui peningkatan kapasitas anggota, mengembangkan usaha, meningkatkan pendapatan keluarga, membangun kemandirian ekonomi, serta memperkuat posisi perempuan dalam pengambilan keputusan.',
                'highlights' => json_encode([
                    'Pendidikan dan penguatan kelompok Credit Union (CU)',
                    'Peningkatan literasi dan manajemen keuangan keluarga',
                    'Penguatan kepemimpinan ekonomi perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
                'color' => 'amber',
            ],
            7 => [
                'title' => 'Peningkatan Kesadaran Masyarakat terhadap Hak Kesehatan Seksual dan Reproduksi (HKSR)',
                'category' => 'Kesehatan Reproduksi (HKSR)',
                'badge' => 'Layanan 07',
                'description' => 'Peningkatan kesadaran dan pemahaman masyarakat terhadap Hak Kesehatan Seksual dan Reproduksi (HKSR) yang inklusif, berkeadilan, dan berbasis hak.',
                'highlights' => json_encode([
                    'Sosialisasi pencegahan perkawinan anak, KtPA, KtP, KDRT, pelecehan, serta penguatan perlindungan perempuan dan anak',
                    'Sosialisasi layanan kesehatan reproduksi, penguatan OSS&L di Puskesmas, informasi layanan dan pendampingan rujukan',
                    'Diskusi dan edukasi bersama tokoh masyarakat, adat, dan agama untuk membangun dukungan terhadap pemenuhan HKSR',
                ]),
                'image' => 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
                'color' => 'rose',
            ],
            8 => [
                'title' => 'Pencegahan Perkawinan Anak Usia di Bawah 19 Tahun',
                'category' => 'Pencegahan Perkawinan Anak',
                'badge' => 'Layanan 08',
                'description' => 'Meningkatkan kesadaran masyarakat, memperkuat peran keluarga dan tokoh masyarakat, serta mendorong kebijakan pemerintah untuk mencegah perkawinan pada usia di bawah 19 tahun.',
                'highlights' => json_encode([
                    'Sosialisasi dampak perkawinan anak, diskusi bersama masyarakat dan kampanye pencegahan perkawinan usia di bawah 19 tahun',
                    'Pendidikan HKSR bagi Anak dan Remaja',
                    'Penguatan Peran Keluarga dan Orang Tua',
                    'Penguatan Peran Tokoh Adat, Agama dan Perempuan Potensial',
                    'Penguatan Koordinasi dan Jejaring Layanan',
                    'Penguatan Partisipasi FKPAR dan Aksi Kolektif',
                ]),
                'image' => 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
                'color' => 'purple',
            ],
            9 => [
                'title' => 'Kolaborasi Pembangunan Pemerintah & Lembaga Mitra (Non-Pemerintah)',
                'category' => 'Kemitraan Strategis',
                'badge' => 'Layanan 09',
                'description' => 'Membangun sinergi aktif bersama dinas terkait (DP3A, Dinas Kesehatan, Dinas Sosial) dan lembaga donor independen yang selaras dengan nilai-nilai otonomi APM Jambi.',
                'highlights' => json_encode([
                    'MoU kemitraan layanan rujukan perlindungan perempuan kabupaten',
                    'Partisipasi dalam forum koordinasi perlindungan sosial provinsi',
                    'Riset bersama evaluasi kebijakan sosial inklusif',
                ]),
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'color' => 'teal',
            ],
        ];

        foreach ($programs as $order => $data) {
            DB::table('programs')->updateOrInsert(
                ['display_order' => $order],
                [
                    'title' => $data['title'],
                    'category' => $data['category'],
                    'badge' => $data['badge'],
                    'description' => $data['description'],
                    'highlights' => $data['highlights'],
                    'image' => $data['image'],
                    'color' => $data['color'],
                    'is_published' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
    }
};
