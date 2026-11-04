<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CommunityCenter;

class CommunityCenterController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => CommunityCenter::where('is_published', true)
                ->orderBy('regency')
                ->orderBy('display_order')
                ->orderBy('name')
                ->get(),
        ]);
    }
}
