<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Assign authors to existing news
        DB::table('news')
            ->where('slug', 'pelatihan-kewirausahaan-perempuan-kota-jambi')
            ->update([
                'author' => 'Marsiyam (Direktur Eksekutif)',
                'updated_at' => now(),
            ]);

        DB::table('news')
            ->where('slug', 'sosialisasi-kesadaran-hukum-muaro-jambi')
            ->update([
                'author' => 'Sualjimah (Ketua Badan Pengurus)',
                'updated_at' => now(),
            ]);

        DB::table('news')
            ->where('slug', 'rapat-kerja-tahunan-apm-jambi-2026')
            ->update([
                'author' => 'Erat Indri Hastuti (Ketua Badan Pengawas)',
                'updated_at' => now(),
            ]);

        // Default any news with null author
        DB::table('news')->whereNull('author')->update(['author' => 'Tim Redaksi APM Jambi']);

        // 2. Seed representative photo galleries
        $galleries = [
            [
                'title' => 'Workshop Kewirausahaan Mandiri & Olahan Pangan Komunitas',
                'description' => 'Pelatihan peningkatan kapasitas ekonomi bagi kader perempuan pedesaan dalam memproduksi dan memasarkan olahan produk lokal berkelanjutan.',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Sosialisasi Kesadaran Hukum & Pencegahan Kekerasan Berbasis Gender',
                'description' => 'Edukasi dan penyuluhan hak-hak hukum bagi perempuan dan perlindungan anak bersama paralegal komunitas di Merangin.',
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Musyawarah Tahunan & Penguatan Jejaring Community Center (CC)',
                'description' => 'Konsolidasi pengurus dan delegasi kader Community Center dari Kabupaten Merangin, Bungo, dan Sarolangun.',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Pendampingan Kelompok Usaha Bersama (KUB) Perempuan Desa',
                'description' => 'Kunjungan lapangan dan bimbingan teknis pencatatan keuangan sederhana bagi kelompok simpan pinjam perempuan akar rumput.',
                'image' => 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Pelatihan Literasi Digital & Publikasi Media Komunitas',
                'description' => 'Pemberdayaan perempuan muda dalam pemanfaatan teknologi informasi untuk advokasi dan promosi produk kerajinan daerah.',
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Forum Multi-Stakeholder untuk Akselerasi Keadilan Sosial Gender',
                'description' => 'Dialog kolaboratif bersama instansi pemerintah daerah, tokoh masyarakat, dan mitra strategis pemenuhan hak-hak perempuan.',
                'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($galleries as $item) {
            $existing = DB::table('galleries')->where('title', $item['title'])->first();
            if (!$existing) {
                DB::table('galleries')->insert([
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'image' => $item['image'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Update Contact settings with representative data
        $contactData = [
            'whatsapp' => '',
            'email' => '',
            'facebook' => 'https://facebook.com/apmjambi',
            'instagram' => 'https://instagram.com/apmjambi_official',
            'youtube' => 'https://youtube.com/@apmjambi',
            'maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2f7596c3746617%3A0x6b4f7ceec1c7bb39!2sPamenang%2C%20Merangin%20Regency%2C%20Jambi!5e0!3m2!1sid!2sid',
        ];

        foreach ($contactData as $key => $value) {
            DB::table('organization_settings')
                ->updateOrInsert(
                    ['group' => 'contact', 'key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
        }
    }

    public function down(): void
    {
        // Reversible if needed
    }
};
