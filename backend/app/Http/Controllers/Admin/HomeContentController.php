<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;
use Illuminate\Http\Request;

class HomeContentController extends Controller
{
    public function show()
    {
        return response()->json([
            'success' => true,
            'data' => OrganizationSetting::getGroup('home'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_badge' => ['required', 'string', 'max:255'],
            'hero_title' => ['required', 'string', 'max:500'],
            'hero_description' => ['required', 'string', 'max:2000'],
            'about_badge' => ['required', 'string', 'max:120'],
            'about_title' => ['required', 'string', 'max:255'],
            'about_description' => ['required', 'string', 'max:2000'],
        ]);

        OrganizationSetting::setGroup('home', $validated);

        return response()->json([
            'success' => true,
            'message' => 'Konten beranda berhasil diperbarui.',
            'data' => OrganizationSetting::getGroup('home'),
        ]);
    }
}
