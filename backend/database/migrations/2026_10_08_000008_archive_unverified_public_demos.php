<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $demoNews = [
            [
                'slug' => 'pelatihan-kewirausahaan-perempuan-kota-jambi',
                'title' => 'Pelatihan Kewirausahaan & Literasi Keuangan Bagi Perempuan Komunitas Kota Jambi',
                'featured_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'content' => 'APM Jambi menyelenggarakan workshop kewirausahaan mandiri guna mendorong kemandirian finansial anggota kelompok perempuan di Kota Jambi. Kegiatan diikuti 45 peserta dari berbagai perwakilan komunitas perempuan.',
            ],
            [
                'slug' => 'sosialisasi-kesadaran-hukum-muaro-jambi',
                'title' => 'Sosialisasi Kesadaran Hukum & Pencegahan Kekerasan Berbasis Gender di Kabupaten Muaro Jambi',
                'featured_image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
                'content' => 'Kegiatan edukasi masyarakat mengenai pentingnya perlindungan hukum bagi perempuan dan anak di wilayah pedesaan Kabupaten Muaro Jambi.',
            ],
            [
                'slug' => 'rapat-kerja-tahunan-apm-jambi-2026',
                'title' => 'Rapat Kerja Tahunan APM Jambi: Merumuskan Agenda Advokasi & Program Pemberdayaan 2026-2027',
                'featured_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'content' => 'Pengurus APM Jambi menetapkan prioritas pendampingan hukum dan penguatan unit usaha ekonomi berbasis komunitas untuk tahun anggaran 2026-2027.',
            ],
        ];

        foreach ($demoNews as $demo) {
            DB::table('news')->where($demo)->update(['status' => 'draft', 'updated_at' => now()]);
        }

        $demoGallery = [
            ['Workshop Kewirausahaan 2026', 'Pelatihan pembuatan produk UMKM lokal bagi perempuan komunitas.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'],
            ['Sosialisasi Hukum Masyarakat', 'Edukasi kesadaran hukum dan pencegahan KDRT di pedesaan.', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'],
            ['Rapat Anggota APM Jambi', 'Musyawarah tahunan penyusunan rencana advokasi.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'],
            ['Pendampingan Komunitas Desa', 'Kegiatan pembinaan kelompok usaha bersama di Muaro Jambi.', 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80'],
            ['Pelatihan Usaha Mikro Warga', 'Workshop pemasaran digital produk kreatif ibu-ibu rumah tangga.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'],
            ['Diskusi Publik Hak Gender', 'Forum tematik bersama praktisi dan aktivis kesetaraan gender.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'],
        ];

        foreach ($demoGallery as [$title, $description, $image]) {
            DB::table('galleries')->where(compact('title', 'description', 'image'))->delete();
        }
    }

    public function down(): void
    {
        // Do not restore unverified demo stories or photos.
    }
};
