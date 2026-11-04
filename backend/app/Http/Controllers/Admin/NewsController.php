<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with('user:id,name,email,role')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        $news = $query->paginate($request->query('limit', 20));

        return response()->json([
            'success' => true,
            'message' => 'Daftar berita admin berhasil diambil',
            'data' => $news->items(),
            'pagination' => [
                'current_page' => $news->currentPage(),
                'last_page' => $news->lastPage(),
                'total' => $news->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['title']);
        if (News::where('slug', $slug)->exists()) {
            $slug .= '-' . time();
        }

        $imagePath = null;
        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('news', 'public');
            $imagePath = Storage::url($imagePath);
        }

        // Author is ALWAYS retrieved directly from the authenticated session user
        $user = $request->user();
        $authorName = $user?->name ?? 'Admin APM Jambi';
        $userId = $user?->id;

        $news = News::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $validated['content'],
            'status' => $validated['status'],
            'featured_image' => $imagePath,
            'author' => $authorName,
            'user_id' => $userId,
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil disimpan oleh ' . $authorName,
            'data' => $news->load('user:id,name,email,role'),
        ], 201);
    }

    public function show($id)
    {
        $news = News::with('user:id,name,email,role')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:news,slug,' . $id,
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Maintain or associate author information
        if (!$news->user_id && $request->user()) {
            $validated['user_id'] = $request->user()->id;
        }
        if (empty($news->author) && $request->user()) {
            $validated['author'] = $request->user()->name;
        }

        if ($request->hasFile('featured_image')) {
            $this->deleteStoredFile($news->featured_image);
            $imagePath = $request->file('featured_image')->store('news', 'public');
            $validated['featured_image'] = Storage::url($imagePath);
        }

        if ($validated['status'] === 'published' && !$news->published_at) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diperbarui',
            'data' => $news->load('user:id,name,email,role'),
        ]);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $this->deleteStoredFile($news->featured_image);
        $news->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus',
        ]);
    }

    private function deleteStoredFile(?string $fileUrl): void
    {
        if (! $fileUrl || ! str_starts_with($fileUrl, '/storage/')) {
            return;
        }

        $relativePath = ltrim(parse_url($fileUrl, PHP_URL_PATH) ?? '', '/');
        $relativePath = Str::after($relativePath, 'storage/');

        if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
