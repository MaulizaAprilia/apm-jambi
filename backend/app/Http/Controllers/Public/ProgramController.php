<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Program;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Program::where('is_published', true)
                ->orderBy('display_order')
                ->orderBy('id')
                ->get(),
        ]);
    }
}
