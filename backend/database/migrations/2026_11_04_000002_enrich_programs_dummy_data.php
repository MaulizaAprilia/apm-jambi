<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $programs = [
            1 => [
                'title' => 'Pendampingan Perempuan Korban HKSR & Kekerasan Berbasis Gender',
                'category' => 'Perlindungan Hukum & Gender',
                'badge' => 'Layanan 01',
                'description' => 'Layanan pendampingan komprehensif mulai dari konseling psikososial, bantuan medis awal, hingga fasilitasi rujukan hukum bagi perempuan dan anak korban tindak kekerasan serta pelanggaran hak kesehatan reproduksi.',
                'highlights' => json_encode([
                    'Pendampingan kasus psikososial & mediasi peka korban',
                    'Rujukan fasilitas kesehatan dan visum bersama mitra medis',
                    'Bimbingan hukum bersama paralegal komunitas terlatih',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
                'color' => 'rose',
            ],
            2 => [
                'title' => 'Informasi & Edukasi Kritis UU PKDRT, UU TPKS, & Perlindungan Anak',
                'category' => 'Edukasi & Kesadaran Hukum',
                'badge' => 'Layanan 02',
                'description' => 'Penyelenggaraan diseminasi hukum kritis di desa-desa untuk membongkar normalisasi kekerasan domestik, mengedukasi payung hukum perlindungan perempuan, dan mendorong pencegahan dini kejahatan seksual.',
                'highlights' => json_encode([
                    'Penyuluhan hak konstitusi perempuan di tingkat akar rumput',
                    'Sosialisasi mekanisme pelaporan aman kasus TPKS & KDRT',
                    'Pelatihan kader peduli anak di pos-pos desa',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'color' => 'purple',
            ],
            3 => [
                'title' => 'Pengorganisasian Kelompok Perempuan & Perempuan Muda',
                'category' => 'Pengorganisasian Komunitas',
                'badge' => 'Layanan 03',
                'description' => 'Membangun dan memperkuat simpul jejaring 33+ Community Center (CC) di pedesaan sebagai ruang belajar aman, ruang konsolidasi gerakan, dan ruang kepemimpinan perempuan.',
                'highlights' => json_encode([
                    'Pertemuan rutin diskusi kritis mingguan di tiap CC',
                    'Pemberdayaan perempuan muda dalam literasi digital advokasi',
                    'Regenerasi kepemimpinan perempuan desa berkelanjutan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'color' => 'indigo',
            ],
            4 => [
                'title' => 'Pendidikan Kritis Berperspektif Keadilan Gender & Inklusi (GEDSI)',
                'category' => 'Pemberdayaan Kapasitas',
                'badge' => 'Layanan 04',
                'description' => 'Kurikulum pendidikan transformatif yang menyadarkan hak otonomi tubuh, kesetaraan peran sosial, serta inklusi bagi perempuan difabel dan kelompok rentan di pedesaan.',
                'highlights' => json_encode([
                    'Modul belajar kesadaran gender berakar kearifan lokal',
                    'Lokakarya otonomi hak perempuan dan keluarga berdaya',
                    'Pendidikan antikekerasan bagi generasi muda desa',
                ]),
                'image' => 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
                'color' => 'blue',
            ],
            5 => [
                'title' => 'Advokasi Kebijakan Daerah & Anggaran Desa Responsif Gender',
                'category' => 'Advokasi Kebijakan',
                'badge' => 'Layanan 05',
                'description' => 'Mendorong regulasi tingkat desa hingga kabupaten yang berpihak pada pemenuhan hak-hak perempuan, penganggaran responsif gender (ARG), dan fasilitas publik ramah perempuan dan anak.',
                'highlights' => json_encode([
                    'Partisipasi dalam Musrenbangdes untuk alokasi dana perlindungan perempuan',
                    'Kajian kebijakan perda ramah HAM dan perlindungan buruh tani perempuan',
                    'Fasilitasi Forum Multi-Stakeholder (FMS) lintas sektor',
                ]),
                'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
                'color' => 'emerald',
            ],
            6 => [
                'title' => 'Peningkatan Kemandirian Ekonomi & Koperasi Simpan Pinjam Komunitas',
                'category' => 'Kemandirian Ekonomi',
                'badge' => 'Layanan 06',
                'description' => 'Pengembangan Kelompok Usaha Bersama (KUB), pelatihan keterampilan olahan pangan lokal, pencatatan kas digital, dan pengelolaan unit simpan pinjam mandiri kelompok.',
                'highlights' => json_encode([
                    'Pelatihan produksi dan sertifikasi halal olahan hasil kebun lokal',
                    'Sistem pembukuan dan tata kelola simpan pinjam transparan',
                    'Akses kemitraan pameran dan pemasaran digital UMKM perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
                'color' => 'amber',
            ],
            7 => [
                'title' => 'Penyadaran Hak Kesehatan Seksual & Reproduksi (HKSR)',
                'category' => 'Kesehatan Reproduksi',
                'badge' => 'Layanan 07',
                'description' => 'Penyuluhan dan konseling berkala seputar kesehatan reproduksi perempuan, pencegahan infeksi menular, pemenuhan gizi keluarga, dan penurunan angka stunting balita.',
                'highlights' => json_encode([
                    'Pos edukasi HKSR terintegrasi di kelompok perempuan desa',
                    'Penyuluhan gizi seimbang untuk ibu hamil dan menyusui',
                    'Distribusi panduan saku kesehatan reproduksi remaja',
                ]),
                'image' => 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
                'color' => 'rose',
            ],
            8 => [
                'title' => 'Pencegahan Perkawinan Sebelum Usia 19 Tahun',
                'category' => 'Perlindungan Anak & Remaja',
                'badge' => 'Layanan 08',
                'description' => 'Kampanye masif dan konseling bersama tokoh agama, kepala desa, dan orang tua untuk mencegah perkawinan usia anak serta memastikan hak anak menuntaskan pendidikan wajib.',
                'highlights' => json_encode([
                    'Pakta integritas pencegahan perkawinan anak dengan tokoh masyarakat',
                    'Konseling sebaya bagi remaja putri di komunitas',
                    'Pendampingan beasiswa dan keberlanjutan sekolah anak perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
                'color' => 'purple',
            ],
            9 => [
                'title' => 'Kolaborasi Pembangunan Pemerintah & Kemitraan Non-Pemerintah',
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
            DB::table('programs')
                ->where('display_order', $order)
                ->update([
                    'title' => $data['title'],
                    'category' => $data['category'],
                    'badge' => $data['badge'],
                    'description' => $data['description'],
                    'highlights' => $data['highlights'],
                    'image' => $data['image'],
                    'color' => $data['color'],
                    'is_published' => true,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
    }
};

