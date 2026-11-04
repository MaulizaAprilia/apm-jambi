<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\OrganizationMember;

class OrganizationMemberController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => OrganizationMember::where('is_published', true)
                ->orderBy('category')
                ->orderBy('display_order')
                ->orderBy('id')
                ->get(),
        ]);
    }
}
