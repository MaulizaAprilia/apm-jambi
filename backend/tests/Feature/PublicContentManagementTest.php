<?php

namespace Tests\Feature;

use App\Models\Gallery;
use App\Models\News;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PublicContentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_local_frontend_origin_can_make_cors_preflight_requests(): void
    {
        $this->call('OPTIONS', '/api/profile', [], [], [], [
            'HTTP_ORIGIN' => 'http://localhost:3000',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'authorization,accept',
        ])
            ->assertNoContent()
            ->assertHeader('access-control-allow-origin', 'http://localhost:3000');

        $this->call('OPTIONS', '/api/profile', [], [], [], [
            'HTTP_ORIGIN' => 'http://127.0.0.1:3000',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'authorization,accept',
        ])
            ->assertNoContent()
            ->assertHeader('access-control-allow-origin', 'http://127.0.0.1:3000');

        $this->call('OPTIONS', '/api/profile', [], [], [], [
            'HTTP_ORIGIN' => 'http://localhost:3004',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'authorization,accept',
        ])
            ->assertNoContent()
            ->assertHeader('access-control-allow-origin', 'http://localhost:3004');
    }

    public function test_admin_can_manage_programs_and_public_api_only_returns_published_programs(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'badge' => 'Pilar 04',
            'title' => 'Program Baru',
            'category' => 'Pemberdayaan',
            'description' => 'Deskripsi program',
            'highlights' => ['Aktivitas satu'],
            'image' => 'https://example.test/program.jpg',
            'color' => 'purple',
            'display_order' => 4,
            'is_published' => false,
        ];

        $created = $this->postJson('/api/admin/programs', $payload)
            ->assertCreated()
            ->assertJsonPath('data.title', 'Program Baru');

        $programId = $created->json('data.id');
        $this->getJson('/api/programs')->assertOk()->assertJsonMissing(['title' => 'Program Baru']);

        $payload['is_published'] = true;
        $this->putJson("/api/admin/programs/{$programId}", $payload)
            ->assertOk()
            ->assertJsonPath('data.is_published', true);
        $this->getJson('/api/programs')->assertJsonFragment(['title' => 'Program Baru']);

        $this->deleteJson("/api/admin/programs/{$programId}")->assertOk();
        $this->assertDatabaseMissing('programs', ['id' => $programId]);
    }

    public function test_admin_can_manage_members_in_the_three_organization_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'category' => 'oversight',
            'name' => 'Nama Pengawas',
            'position' => 'Ketua Badan Pengawas',
            'description' => 'Keterangan anggota',
            'photo_url' => null,
            'display_order' => 1,
            'is_published' => true,
        ];

        $created = $this->postJson('/api/admin/organization-members', $payload)
            ->assertCreated()
            ->assertJsonPath('data.category', 'oversight');
        $memberId = $created->json('data.id');

        $this->getJson('/api/organization-members')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Nama Pengawas']);

        $payload['category'] = 'management';
        $this->putJson("/api/admin/organization-members/{$memberId}", $payload)
            ->assertOk()
            ->assertJsonPath('data.category', 'management');

        $this->deleteJson("/api/admin/organization-members/{$memberId}")->assertOk();
        $this->assertDatabaseMissing('organization_members', ['id' => $memberId]);
    }

    public function test_homepage_content_is_readable_publicly_and_editable_by_admin(): void
    {
        $this->getJson('/api/home-content')
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Aliansi Perempuan Mandiri Jambi');

        Sanctum::actingAs(User::factory()->create());
        $payload = [
            'hero_badge' => 'APM Jambi',
            'hero_title' => 'Judul yang diperbarui',
            'hero_description' => 'Deskripsi baru',
            'hero_image' => 'https://example.test/hero.jpg',
            'hero_card_label' => 'Label',
            'hero_card_title' => 'Kartu hero',
            'stat_years' => '11+',
            'stat_community' => '600+',
            'stat_activities' => '60+',
            'about_badge' => 'Mengenal APM',
            'about_title' => 'Tentang terbaru',
            'about_description' => 'Pengantar terbaru',
            'about_image' => 'https://example.test/about.jpg',
            'about_feature1_title' => 'Advokasi',
            'about_feature1_description' => 'Pendampingan',
            'about_feature2_title' => 'Ekonomi',
            'about_feature2_description' => 'Pemberdayaan',
        ];

        $this->putJson('/api/admin/home-content', $payload)
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Judul yang diperbarui');
        $this->getJson('/api/home-content')
            ->assertJsonPath('data.hero_title', 'Judul yang diperbarui');
    }


    public function test_admin_can_manage_news_with_list_show_create_update_delete_and_publish_visibility(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Storage::fake('public');

        $draft = News::create([
            'title' => 'Berita Draft',
            'slug' => 'berita-draft',
            'content' => '<p>Belum dipublikasi</p>',
            'status' => 'draft',
            'featured_image' => '/storage/news/draft.jpg',
        ]);

        $published = News::create([
            'title' => 'Berita Terbit',
            'slug' => 'berita-terbit',
            'content' => '<p>Sudah dipublikasi</p>',
            'status' => 'published',
            'published_at' => now(),
            'featured_image' => '/storage/news/published.jpg',
        ]);

        $this->getJson('/api/admin/news')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Berita Draft'])
            ->assertJsonFragment(['title' => 'Berita Terbit']);

        $this->getJson("/api/admin/news/{$published->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $published->id)
            ->assertJsonPath('data.title', 'Berita Terbit');

        $created = $this->postJson('/api/admin/news', [
            'title' => 'Berita Baru',
            'content' => '<p>Isi berita barunya</p>',
            'status' => 'published',
            'featured_image' => UploadedFile::fake()->image('news-upload.jpg', 1200, 900),
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Berita Baru');

        $newsId = $created->json('data.id');

        $this->getJson('/api/news')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Berita Terbit'])
            ->assertJsonMissing(['title' => 'Berita Draft']);

        $this->putJson("/api/admin/news/{$newsId}", [
            'title' => 'Berita Diperbarui',
            'content' => '<p>Sebuah pembaruan berita</p>',
            'status' => 'draft',
        ])->assertOk()
            ->assertJsonPath('data.title', 'Berita Diperbarui')
            ->assertJsonPath('data.status', 'draft');

        $this->getJson('/api/news')->assertJsonMissing(['title' => 'Berita Diperbarui']);

        $this->deleteJson("/api/admin/news/{$newsId}")->assertOk();
        $this->assertDatabaseMissing('news', ['id' => $newsId]);

        $this->assertDatabaseHas('news', ['id' => $draft->id, 'status' => 'draft']);
        $this->assertDatabaseHas('news', ['id' => $published->id, 'status' => 'published']);
    }

    public function test_admin_can_manage_gallery_with_list_show_create_update_delete(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Storage::fake('public');

        $gallery = Gallery::create([
            'title' => 'Foto Lama',
            'description' => 'Galeri lama',
            'image' => '/storage/gallery/old.jpg',
        ]);

        $this->getJson('/api/admin/gallery')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Foto Lama']);

        $this->getJson("/api/admin/gallery/{$gallery->id}")
            ->assertOk()
            ->assertJsonPath('data.title', 'Foto Lama');

        $created = $this->postJson('/api/admin/gallery', [
            'title' => 'Foto Baru',
            'description' => 'Deskripsi foto baru',
            'image' => UploadedFile::fake()->image('gallery-new.jpg', 1400, 900),
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Foto Baru');

        $galleryId = $created->json('data.id');
        $this->getJson('/api/gallery')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Foto Baru'])
            ->assertJsonFragment(['title' => 'Foto Lama']);

        $this->putJson("/api/admin/gallery/{$galleryId}", [
            'title' => 'Foto Diperbarui',
            'description' => 'Deskripsi terkini',
            'image' => UploadedFile::fake()->image('gallery-updated.jpg', 1400, 900),
        ])->assertOk()
            ->assertJsonPath('data.title', 'Foto Diperbarui')
            ->assertJsonPath('data.description', 'Deskripsi terkini');

        $this->deleteJson("/api/admin/gallery/{$galleryId}")->assertOk();
        $this->assertDatabaseMissing('galleries', ['id' => $galleryId]);
        $this->assertDatabaseHas('galleries', ['id' => $gallery->id, 'title' => 'Foto Lama']);
    }

    public function test_profile_and_contact_settings_round_trip_from_admin_to_public_api(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $profilePayload = [
            'history' => 'Sejarah organisasi terbaru',
            'vision' => 'Visi organisasi terbaru',
            'mission' => 'Misi organisasi terbaru',
            'header_title' => 'APM Jambi Baru',
            'header_description' => 'Deskripsi header baru',
            'history_title' => 'Sejarah & Identitas',
            'structure_intro' => 'Struktur organisasi baru',
            'tagline' => 'Tagline baru',
            'profile_purpose' => 'Tujuan organisasi baru',
            'profile_vision' => 'Visi operasional baru',
            'strategies' => 'Strategi baru',
            'scope' => 'Kawasan baru',
            'beneficiaries' => 'Penerima manfaat baru',
            'project_history' => 'Riwayat proyek baru',
            'legal_status' => 'Status legal baru',
            'principles' => 'Prinsip baru',
            'funding' => 'Sumber pendanaan baru',
            'secretariat_address' => 'Alamat sekretariat baru',
        ];

        $this->putJson('/api/admin/profile', $profilePayload)
            ->assertOk()
            ->assertJsonPath('data.history', 'Sejarah organisasi terbaru');

        $this->getJson('/api/admin/profile')
            ->assertOk()
            ->assertJsonPath('data.history', 'Sejarah organisasi terbaru');

        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('data.header_title', 'APM Jambi Baru');

        $contactPayload = [
            'address' => 'Jl. Contoh No. 1, Jambi',
            'whatsapp' => '081234567890',
            'email' => 'info@apmjambi.or.id',
            'facebook' => 'https://facebook.com/apmjambi',
            'instagram' => 'https://instagram.com/apmjambi',
            'youtube' => 'https://youtube.com/apmjambi',
            'maps_embed' => 'https://maps.example.com/embed',
        ];

        $this->putJson('/api/admin/contact', $contactPayload)
            ->assertOk()
            ->assertJsonPath('data.email', 'info@apmjambi.or.id');

        $this->getJson('/api/admin/contact')
            ->assertOk()
            ->assertJsonPath('data.address', 'Jl. Contoh No. 1, Jambi');

        $this->getJson('/api/contact')
            ->assertOk()
            ->assertJsonPath('data.whatsapp', '081234567890');

        $this->assertDatabaseHas('organization_settings', [
            'group' => 'profile',
            'key' => 'header_title',
            'value' => 'APM Jambi Baru',
        ]);

        $this->assertDatabaseHas('organization_settings', [
            'group' => 'contact',
            'key' => 'email',
            'value' => 'info@apmjambi.or.id',
        ]);
    }

    public function test_admin_can_update_homepage_settings_and_public_preview_reflects_changes(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'hero_badge' => 'APM Jambi',
            'hero_title' => 'Beranda terbarui',
            'hero_description' => 'Deskripsi baru untuk beranda',
            'about_badge' => 'Mengenal APM',
            'about_title' => 'Tentang kami',
            'about_description' => 'Deskripsi tentang kami',
        ];

        $this->putJson('/api/admin/home-content', $payload)
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Beranda terbarui');

        $this->getJson('/api/admin/home-content')
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Beranda terbarui');

        $this->getJson('/api/home-content')
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Beranda terbarui');

        $this->assertDatabaseHas('organization_settings', ['group' => 'home', 'key' => 'hero_title', 'value' => 'Beranda terbarui']);
    }

    public function test_new_admin_content_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/programs')->assertUnauthorized();
        $this->getJson('/api/admin/organization-members')->assertUnauthorized();
        $this->getJson('/api/admin/home-content')->assertUnauthorized();
        $this->getJson('/api/admin/community-centers')->assertUnauthorized();

    }

    public function test_admin_can_manage_community_centers_and_public_api_hides_unpublished_centers(): void
    {
        $this->getJson('/api/community-centers')
            ->assertOk()
            ->assertJsonCount(33, 'data')
            ->assertJsonFragment(['name' => 'Sehat Mandiri', 'regency' => 'Merangin']);

        Sanctum::actingAs(User::factory()->create());
        $payload = [
            'name' => 'Kelompok Uji',
            'village' => 'Desa Uji',
            'district' => 'Kecamatan Uji',
            'regency' => 'Bungo',
            'display_order' => 34,
            'is_published' => false,
        ];
        $created = $this->postJson('/api/admin/community-centers', $payload)->assertCreated();
        $centerId = $created->json('data.id');
        $this->getJson('/api/community-centers')->assertJsonMissing(['name' => 'Kelompok Uji']);

        $payload['is_published'] = true;
        $this->putJson("/api/admin/community-centers/{$centerId}", $payload)->assertOk();
        $this->getJson('/api/community-centers')->assertJsonFragment(['name' => 'Kelompok Uji']);

        $this->deleteJson("/api/admin/community-centers/{$centerId}")->assertOk();
        $this->assertDatabaseMissing('community_centers', ['id' => $centerId]);
    }

    public function test_public_profile_and_organization_use_only_source_supported_facts(): void
    {
        foreach ([
            ['oversight', 'Erat Indri Hastuti, S.Pd', 'Ketua Badan Pengawas'],
            ['oversight', 'Sarjoko, A.Md., S.Pd', 'Badan Pengawas'],
            ['oversight', 'Lasmi', 'Badan Pengawas'],
            ['management', 'Sualjimah', 'Ketua Badan Pengurus'],
            ['implementation', 'Marsiyam', 'Direktur Eksekutif'],
        ] as [$category, $name, $position]) {
            $member = OrganizationMember::firstOrCreate(
                ['name' => $name],
                ['category' => $category, 'position' => $position, 'display_order' => 1, 'is_published' => true],
            );
            $member->update(['category' => $category, 'position' => $position, 'is_published' => true]);
        }

        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('data.vision', 'Kekuatan otonomi perempuan dan keluarga yang berperspektif GEDSI.')
            ->assertJsonPath('data.secretariat_address', 'Dusun Marga Mulya, Desa Pulau Tujuh, Kecamatan Pamenang Barat, Kabupaten Merangin, Jambi 37318.');

        $this->getJson('/api/programs')
            ->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJsonPath('data.0.description', 'Layanan pendampingan untuk perempuan korban HKSR dan kekerasan berbasis gender.')
            ->assertJsonMissing(['title' => 'Pemberdayaan Ekonomi & UMKM Perempuan']);
        $this->getJson('/api/organization-members')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Erat Indri Hastuti, S.Pd'])
            ->assertJsonFragment(['name' => 'Sualjimah'])
            ->assertJsonMissing(['name' => 'Sekretaris'])
            ->assertJsonMissing(['name' => 'Divisi Advokasi & Ekonomi']);
        $this->getJson('/api/contact')
            ->assertOk()
            ->assertJsonPath('data.whatsapp', '')
            ->assertJsonPath('data.email', '');
    }
}
