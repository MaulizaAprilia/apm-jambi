<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update/Insert Official Verified Documents
        $officialDocs = [
            [
                'id' => 1,
                'title' => 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) APM Jambi',
                'category' => 'AD/ART',
                'description' => 'Naskah resmi Anggaran Dasar & Anggaran Rumah Tangga APM Jambi yang disahkan pada Musyawarah Besar Luar Biasa, 14 Desember 2024 di Bukit Bungkul, Merangin. Ditandatangani oleh Ketua Badan Pengawas, Ketua Badan Pengurus, dan Direktur Eksekutif.',
                'file_path' => '/storage/documents/uExK5YUQIBWKakiHgGJrGtZUQfLdmhwnf9kgO4L6.pdf',
                'file_name' => 'AD_ART_APM_Jambi_Desember_2024.pdf',
                'file_size' => '441 KB',
                'file_type' => 'pdf',
                'is_public' => true,
            ],
            [
                'id' => 2,
                'title' => 'Profil Lengkap & Rekam Jejak Organisasi APM Jambi',
                'category' => 'Profil Lembaga',
                'description' => 'Dokumen resmi memuat sejarah pendirian, visi-misi, pilar program, jejaring 33 pos Community Center di tiga kabupaten, serta daftar kemitraan strategis tingkat lokal dan nasional.',
                'file_path' => '/storage/documents/OFulLieH04mSWxTW71u3cILSyPCfGoQFHnUFENEe.pdf',
                'file_name' => 'Profil_Resmi_APM_Jambi.pdf',
                'file_size' => '631 KB',
                'file_type' => 'pdf',
                'is_public' => true,
            ],
            [
                'id' => 3,
                'title' => 'Pedoman Perilaku (Kode Etik Kelembagaan) APM Jambi',
                'category' => 'Kode Etik',
                'description' => 'Pedoman perilaku resmi memuat 16 prinsip nilai dasar, standar integritas moral, komitmen anti-kekerasan, anti-fraud/korupsi, serta mekanisme perlindungan pengaduan. Disahkan Badan Pengawas 14 Desember 2024.',
                'file_path' => '/storage/documents/AT3MKGk3AKPalArv4UrQXvv8HC0aO2XXFWJXGbVF.pdf',
                'file_name' => 'Pedoman_Perilaku_APM_Jambi_2024.pdf',
                'file_size' => '434 KB',
                'file_type' => 'pdf',
                'is_public' => true,
            ],
            [
                'id' => 4,
                'title' => 'SK Menteri Hukum RI No. AHU-0001146.AH.01.08.TAHUN 2025',
                'category' => 'Legalitas Hukum',
                'description' => 'Surat Keputusan Menteri Hukum RI tentang Persetujuan Perubahan Perkumpulan Aliansi Perempuan Mandiri Jambi (APMJ) tertanggal 09 Juli 2025. Akta Notaris Muhammad Rizki Maulana, S.H., M.Kn. No. 09 Tanggal 09 Juli 2025.',
                'file_path' => '/storage/documents/sk-kemenkumham-2025.jpg',
                'file_name' => 'SK_Kemenkumham_APM_Jambi_2025.jpg',
                'file_size' => '105 KB',
                'file_type' => 'jpg',
                'is_public' => true,
            ],
            [
                'id' => 5,
                'title' => 'Bagan Struktur Organisasi Resmi Periode 2023–2028',
                'category' => 'Struktur Organisasi',
                'description' => 'Bagan resmi struktur organisasi APM Jambi periode 2023–2028 yang memuat hierarki Musyawarah Besar, Badan Pengawas, Badan Pengurus, Badan Pelaksana (Direktur Eksekutif), serta kelompok dampingan.',
                'file_path' => '/storage/documents/apm-org-chart-2023-2028.jpeg',
                'file_name' => 'Struktur_Organisasi_APM_Jambi_2023_2028.jpeg',
                'file_size' => '119 KB',
                'file_type' => 'jpeg',
                'is_public' => true,
            ],
        ];

        foreach ($officialDocs as $doc) {
            DB::table('documents')->updateOrInsert(
                ['id' => $doc['id']],
                [
                    'title' => $doc['title'],
                    'category' => $doc['category'],
                    'description' => $doc['description'],
                    'file_path' => $doc['file_path'],
                    'file_name' => $doc['file_name'],
                    'file_size' => $doc['file_size'],
                    'file_type' => $doc['file_type'],
                    'is_public' => $doc['is_public'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        // 2. Update Legal Status Profile Setting with 2025 SK Kemenkumham
        $legalStatus = "Pengesahan Kemenkumham RI Terbaru: AHU-0001146.AH.01.08.TAHUN 2025 (Tanggal 09 Juli 2025).\nAkta Notaris: Muhammad Rizki Maulana, S.H., M.Kn. No. 09 Tanggal 09 Juli 2025.\nNPWP Perkumpulan: 02.372.149.1-333.000 (APMJ Merangin).\nAkta Pendirian: Notaris Sri Hermawati, SH No. 58 (17 April 2003); Perubahan No. 2 Notaris Solihin, SH (2 Januari 2015).\nPencatatan Kesbangpol: Bakesbangpol Merangin No. 220/XI/10/155/IV/2015 & Bakesbangpol Jambi No. 220/1458/Bakesbang-Pol/XI/2017.";

        DB::table('organization_settings')->updateOrInsert(
            ['group' => 'profile', 'key' => 'legal_status'],
            ['value' => $legalStatus, 'updated_at' => now()]
        );
    }

    public function down(): void
    {
    }
};

