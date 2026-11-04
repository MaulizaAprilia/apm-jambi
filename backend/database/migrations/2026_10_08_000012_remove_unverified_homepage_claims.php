<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $verifiedHistory = 'Profil organisasi mencatat Aliansi Perempuan Merangin (APM) berdiri pada 1 Januari 2003. AD/ART tanggal 14 Desember 2024 menggunakan nama Aliansi Perempuan Mandiri Jambi (APM Jambi).';

        $replacements = [
            'hero_description' => [
                'Wadah independen yang berdedikasi untuk pemberdayaan sosio-ekonomi, advokasi hak asasi perempuan, serta penguatan kepemimpinan komunitas perempuan di Provinsi Jambi.' =>
                    'Mengakar kuat, tumbuh dan berkembang bersama mitra membangun kekuatan kolektif untuk pemberdayaan perempuan dan anak di Provinsi Jambi.',
            ],
            'about_title' => [
                'Bersama Menguatkan Suara & Kemandirian Perempuan' => 'Sejarah dan identitas organisasi',
                'Tentang APM Jambi' => 'Sejarah dan identitas organisasi',
            ],
            'about_description' => [
                'Aliansi Perempuan Mandiri (APM) Jambi berdiri sebagai wujud solidaritas dalam mendorong pemenuhan hak-hak perempuan, perlindungan dari kekerasan, peningkatan ekonomi kreatif warga, serta partisipasi aktif dalam pembangunan sosial di Provinsi Jambi.' => $verifiedHistory,
                'Aliansi Perempuan Mandiri (APM) Jambi berdiri sebagai wujud solidaritas dalam mendorong pemenuhan hak-hak perempuan, perlindungan dari kekerasan, serta kemandirian sosial dan ekonomi di Provinsi Jambi.' => $verifiedHistory,
            ],
            'about_feature1_title' => ['Pendampingan Advokasi' => ''],
            'about_feature1_description' => ['Edukasi hak hukum & keadilan gender.' => ''],
            'about_feature2_title' => ['Ekonomi Kreatif' => ''],
            'about_feature2_description' => ['Pelatihan usaha UMKM & kemandirian finansial.' => ''],
            'hero_image' => [
                'https://images.unsplash.com/photo-1573496359142-b8d87734f3e?auto=format&fit=crop&w=800&q=80' => '',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' => '',
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' => '',
            ],
            'about_image' => [
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80' => '',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' => '',
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' => '',
            ],
            'stat_years' => ['10+' => ''],
            'stat_community' => ['500+' => ''],
            'stat_activities' => ['50+' => ''],
        ];

        foreach ($replacements as $key => $values) {
            foreach ($values as $oldValue => $newValue) {
                DB::table('organization_settings')
                    ->where(['group' => 'home', 'key' => $key, 'value' => $oldValue])
                    ->update(['value' => $newValue, 'updated_at' => now()]);
            }
        }
    }

    public function down(): void
    {
        // Do not restore unverified copy, fabricated metrics, or stock image URLs.
    }
};
