<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');
        $query = Document::where('is_public', true)->latest();

        if ($category) {
            $query->where('category', $category);
        }

        $documents = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar dokumen berhasil diambil',
            'data' => $documents,
        ]);
    }
}
