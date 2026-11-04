<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::latest()->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Daftar foto galeri berhasil diambil',
            'data' => $galleries->items(),
            'pagination' => [
                'current_page' => $galleries->currentPage(),
                'last_page' => $galleries->lastPage(),
                'total' => $galleries->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $imagePath = $request->file('image')->store('gallery', 'public');

        $gallery = Gallery::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image' => Storage::url($imagePath),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Foto galeri berhasil diunggah',
            'data' => $gallery,
        ], 201);
    }

    public function show($id)
    {
        $gallery = Gallery::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $this->deleteStoredFile($gallery->image);
            $imagePath = $request->file('image')->store('gallery', 'public');
            $validated['image'] = Storage::url($imagePath);
        }

        $gallery->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Foto galeri berhasil diperbarui',
            'data' => $gallery,
        ]);
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        $this->deleteStoredFile($gallery->image);
        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Foto galeri berhasil dihapus',
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
}
