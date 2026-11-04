<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 20);
        $galleries = Gallery::latest()->paginate($limit);

        return response()->json([
            'success' => true,
            'message' => 'Data galeri foto berhasil diambil',
            'data' => $galleries->items(),
            'pagination' => [
                'current_page' => $galleries->currentPage(),
                'last_page' => $galleries->lastPage(),
                'total' => $galleries->total(),
            ],
        ]);
    }
}
