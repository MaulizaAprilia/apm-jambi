<?php

namespace Tests\Feature;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_requires_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@apmjambi.or.id',
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@apmjambi.or.id',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_admin_can_login_and_access_protected_endpoint(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@apmjambi.or.id',
            'password' => bcrypt('correct-password'),
        ]);

        $login = $this->postJson('/api/admin/login', [
            'email' => 'admin@apmjambi.or.id',
            'password' => 'correct-password',
        ]);

        $login->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonPath('data.token', fn ($token) => is_string($token) && $token !== '');

        $this->withToken($login->json('data.token'))
            ->getJson('/api/admin/me')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_protected_admin_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/news')
            ->assertUnauthorized();
    }

    public function test_admin_can_create_and_delete_news(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/admin/news', [
            'title' => 'Berita Baru',
            'content' => '<p>Isi berita baru</p>',
            'status' => 'draft',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'berita-baru');

        $news = News::first();
        $this->deleteJson("/api/admin/news/{$news->id}")
            ->assertOk();

        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }
}
