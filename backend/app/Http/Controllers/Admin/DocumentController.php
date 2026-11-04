<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::latest()->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Daftar dokumen berhasil diambil',
            'data' => $documents->items(),
            'pagination' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'total' => $documents->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:10240', // max 10MB
            'file_url' => 'nullable|string|url', // fallback if external link provided
            'is_public' => 'nullable|boolean',
        ]);

        $filePath = null;
        $fileName = null;
        $fileSize = null;
        $fileType = 'pdf';

        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = strtolower($uploadedFile->getClientOriginalExtension());
            $bytes = $uploadedFile->getSize();
            $fileSize = $this->formatBytes($bytes);

            $storedPath = $uploadedFile->store('documents', 'public');
            $filePath = Storage::url($storedPath);
        } elseif ($request->filled('file_url')) {
            $filePath = $request->file_url;
            $fileName = basename(parse_url($filePath, PHP_URL_PATH) ?? 'document.pdf');
            $fileType = pathinfo($fileName, PATHINFO_EXTENSION) ?: 'pdf';
            $fileSize = 'Link Eksternal';
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unggah berkas dokumen atau berikan URL tautan dokumen.',
            ], 422);
        }

        $document = Document::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $fileSize,
            'file_type' => $fileType,
            'is_public' => $request->boolean('is_public', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil disimpan',
            'data' => $document,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:10240',
            'file_url' => 'nullable|string|url',
            'is_public' => 'nullable|boolean',
        ]);

        $filePath = $document->file_path;
        $fileName = $document->file_name;
        $fileSize = $document->file_size;
        $fileType = $document->file_type;

        if ($request->hasFile('file')) {
            if ($document->file_path && str_starts_with($document->file_path, '/storage/')) {
                $this->deleteStoredFile($document->file_path);
            }

            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = strtolower($uploadedFile->getClientOriginalExtension());
            $bytes = $uploadedFile->getSize();
            $fileSize = $this->formatBytes($bytes);

            $filePath = Storage::url($uploadedFile->store('documents', 'public'));
        } elseif ($request->filled('file_url')) {
            $filePath = $request->file_url;
            $fileName = basename(parse_url($filePath, PHP_URL_PATH) ?? 'document.pdf');
            $fileType = pathinfo($fileName, PATHINFO_EXTENSION) ?: 'pdf';
            $fileSize = 'Link Eksternal';
        }

        $document->update([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $fileSize,
            'file_type' => $fileType,
            'is_public' => $request->boolean('is_public', $document->is_public),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil diperbarui',
            'data' => $document->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $this->deleteStoredFile($document->file_path);
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil dihapus',
        ]);
    }

    private function deleteStoredFile(?string $fileUrl): void
    {
        if (! $fileUrl || ! str_starts_with($fileUrl, '/storage/')) {
            return;
        }

        $relativePath = ltrim(parse_url($fileUrl, PHP_URL_PATH) ?? '', '/');
        $relativePath = preg_replace('/^storage\//', '', $relativePath) ?? $relativePath;

        if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
