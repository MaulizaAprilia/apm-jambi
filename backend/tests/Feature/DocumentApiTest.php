<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_documents_endpoint_returns_only_public_documents(): void
    {
        Document::create([
            'title' => 'Dokumen Internal',
            'category' => 'Profil',
            'file_path' => '/storage/documents/internal.pdf',
            'file_name' => 'internal.pdf',
            'file_type' => 'pdf',
            'is_public' => false,
        ]);

        Document::create([
            'title' => 'Dokumen Publik',
            'category' => 'Legalitas',
            'file_path' => '/storage/documents/public.pdf',
            'file_name' => 'public.pdf',
            'file_type' => 'pdf',
            'is_public' => true,
        ]);

        $response = $this->getJson('/api/documents');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Dokumen Publik');
    }

    public function test_admin_can_upload_and_delete_document_file(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        Storage::fake('public');

        $file = UploadedFile::fake()->create('proposal.pdf', 1024, 'application/pdf');

        $upload = $this->postJson('/api/admin/documents', [
            'title' => 'Proposal Program',
            'category' => 'Laporan',
            'file' => $file,
            'is_public' => true,
        ]);

        $upload->assertCreated()
            ->assertJsonPath('success', true);

        $document = Document::first();
        $storedPath = ltrim(parse_url($document->file_path, PHP_URL_PATH) ?? '', '/');
        $storedPath = preg_replace('/^storage\//', '', $storedPath) ?? $storedPath;

        Storage::disk('public')->assertExists($storedPath);

        $this->deleteJson("/api/admin/documents/{$document->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        Storage::disk('public')->assertMissing($storedPath);
    }

    public function test_admin_can_update_document_details_and_visibility(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $document = Document::create([
            'title' => 'Dokumen Lama',
            'category' => 'Profil',
            'file_path' => '/storage/documents/old.pdf',
            'file_name' => 'old.pdf',
            'file_type' => 'pdf',
            'is_public' => false,
        ]);

        $response = $this->putJson("/api/admin/documents/{$document->id}", [
            'title' => 'Dokumen Baru',
            'category' => 'Legalitas',
            'description' => 'Deskripsi baru',
            'is_public' => true,
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Dokumen Baru')
            ->assertJsonPath('data.is_public', true);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'title' => 'Dokumen Baru',
            'category' => 'Legalitas',
            'is_public' => true,
        ]);
    }
}
