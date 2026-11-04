<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('badge')->nullable();
            $table->string('title');
            $table->string('category');
            $table->longText('description');
            $table->json('highlights')->nullable();
            $table->string('image')->nullable();
            $table->string('color', 20)->default('purple');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });

        $now = now();
        DB::table('programs')->insert([
            [
                'badge' => 'Pilar 01',
                'title' => 'Advokasi & Pendampingan Hak Perempuan',
                'category' => 'Perlindungan Hukum & Gender',
                'description' => 'Program ini berfokus pada pemberian sosialisasi hukum dasar, penyuluhan pencegahan kekerasan dalam rumah tangga (KDRT), serta pendampingan komunitas bagi perempuan yang membutuhkan bantuan keadilan.',
                'highlights' => json_encode([
                    'Sosialisasi Hak-Hak Hukum Perempuan di Tingkat Komunitas',
                    'Pendampingan Dan Konsultasi Kasus Kekerasan Berbasis Gender',
                    'Kampanye Kesetaraan Dan Perlindungan Perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
                'color' => 'purple',
                'display_order' => 1,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'badge' => 'Pilar 02',
                'title' => 'Pemberdayaan Ekonomi & UMKM Perempuan',
                'category' => 'Kemandirian Finansial & Usaha Mikro',
                'description' => 'Mendorong perempuan untuk memiliki kemandirian finansial melalui pelatihan keterampilan usaha kreatif, pemasaran produk UMKM lokal, pengelolaan keuangan keluarga, dan koperasi simpan pinjam anggota.',
                'highlights' => json_encode([
                    'Pelatihan Pembuatan Kerajinan & Kuliner Khas Jambi',
                    'Workshop Digital Marketing & Manajerial UMKM',
                    'Penguatan Kelompok Usaha Bersama (KUBE) Perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'color' => 'blue',
                'display_order' => 2,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'badge' => 'Pilar 03',
                'title' => 'Pengembangan Kepemimpinan & Edukasi Sosio-Budaya',
                'category' => 'Kapasitas & Pendidikan Komunitas',
                'description' => 'Meningkatkan rasa percaya diri dan keterampilan kepemimpinan pemudi dan perempuan lokal agar aktif berpartisipasi dalam musyawarah warga, kegiatan desa, serta kepengurusan organisasi publik.',
                'highlights' => json_encode([
                    'Sekolah Kepemimpinan Perempuan Muda (SKPM)',
                    'Edukasi Kesehatan Reproduksi & Nutrisi Keluarga',
                    'Diskusi Publik & Forum Tematik Perempuan',
                ]),
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'color' => 'red',
                'display_order' => 3,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $homeContent = [
            'hero_badge' => 'Aliansi Perempuan Mandiri Jambi',
            'hero_title' => 'Membangun Kemandirian & Kesetaraan Hak Perempuan Jambi',
            'hero_description' => 'Wadah independen yang berdedikasi untuk pemberdayaan sosio-ekonomi, advokasi hak asasi perempuan, serta penguatan kepemimpinan komunitas perempuan di Provinsi Jambi.',
            'hero_image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
            'hero_card_label' => 'Komunitas & Advokasi',
            'hero_card_title' => 'Pemberdayaan Perempuan Desa & Komunitas Lokal Jambi',
            'stat_years' => '10+',
            'stat_community' => '500+',
            'stat_activities' => '50+',
            'about_title' => 'Bersama Menguatkan Suara & Kemandirian Perempuan',
            'about_description' => 'Aliansi Perempuan Mandiri (APM) Jambi berdiri sebagai wujud solidaritas dalam mendorong pemenuhan hak-hak perempuan, perlindungan dari kekerasan, peningkatan ekonomi kreatif warga, serta partisipasi aktif dalam pembangunan sosial di Provinsi Jambi.',
        ];
        $aboutContent = [
            'header_title' => 'Profil & Identitas Organisasi',
            'header_description' => 'Mengenal Sejarah, Visi, Misi, Legalitas, AD/ART, dan Struktur Kepengurusan Aliansi Perempuan Mandiri Jambi.',
            'history_title' => 'Sejarah Aliansi Perempuan Mandiri Jambi',
            'history_image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
            'structure_intro' => 'Badan Pengawas, Pengurus, dan Pelaksana APM Jambi.',
        ];

        foreach (['home' => $homeContent, 'profile' => $aboutContent] as $group => $settings) {
            foreach ($settings as $key => $value) {
                DB::table('organization_settings')->updateOrInsert(
                    ['group' => $group, 'key' => $key],
                    ['value' => $value, 'created_at' => $now, 'updated_at' => $now]
                );
            }
        }
    }

    public function down(): void
    {
        DB::table('organization_settings')->where('group', 'home')->delete();
        DB::table('organization_settings')
            ->where('group', 'profile')
            ->whereIn('key', ['header_title', 'header_description', 'history_title', 'history_image', 'structure_intro'])
            ->delete();
        Schema::dropIfExists('programs');
    }
};
