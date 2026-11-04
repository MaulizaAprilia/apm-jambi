<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;

class HomeContentController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => OrganizationSetting::getGroup('home'),
        ]);
    }
}
