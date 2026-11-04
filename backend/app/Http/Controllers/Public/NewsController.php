<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with('user:id,name,role')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $limit = $request->query('limit', 10);
        $news = $query->paginate($limit);

        return response()->json([
            'success' => true,
            'message' => 'Data berita berhasil diambil',
            'data' => $news->items(),
            'pagination' => [
                'current_page' => $news->currentPage(),
                'last_page' => $news->lastPage(),
                'total' => $news->total(),
            ],
        ]);
    }

    public function show($slug)
    {
        $news = News::with('user:id,name,role')
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->where('status', 'published')
            ->first();

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel berita tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail berita berhasil diambil',
            'data' => $news,
        ]);
    }
}
