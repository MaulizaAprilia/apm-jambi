<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $services = [
            'Pendampingan perempuan korban HKSR dan kekerasan berbasis gender' =>
                'Layanan pendampingan untuk perempuan korban HKSR dan kekerasan berbasis gender.',
            'Informasi UU PKDRT, UUTPKS, dan Perlindungan Anak' =>
                'Penyediaan informasi mengenai UU PKDRT, UUTPKS, dan Perlindungan Anak.',
            'Pengorganisasian kelompok perempuan dan perempuan muda' =>
                'Pengorganisasian kelompok perempuan dan perempuan muda.',
            'Pendidikan kritis bagi perempuan' =>
                'Pendidikan kritis bagi perempuan.',
            'Advokasi kebijakan' =>
                'Advokasi kebijakan.',
            'Peningkatan ekonomi perempuan' =>
                'Upaya peningkatan ekonomi perempuan.',
            'Penyadaran kesehatan reproduksi perempuan' =>
                'Penyadaran mengenai kesehatan reproduksi perempuan.',
            'Pencegahan perkawinan sebelum usia 19 tahun' =>
                'Pencegahan perkawinan sebelum usia 19 tahun.',
            'Mendukung program pemerintah yang tidak bertentangan dengan visi dan misi APM' =>
                'Dukungan terhadap program pemerintah yang tidak bertentangan dengan visi dan misi APM.',
        ];

        foreach ($services as $title => $description) {
            DB::table('programs')
                ->where('title', $title)
                ->where('description', $title . '.')
                ->update(['description' => $description, 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        // Preserve source-aligned descriptions and any subsequent admin edits.
    }
};
