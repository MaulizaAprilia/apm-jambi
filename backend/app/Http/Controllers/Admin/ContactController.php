<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function show()
    {
        $contact = OrganizationSetting::getGroup('contact');

        return response()->json([
            'success' => true,
            'data' => $contact,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:1000',
            'whatsapp' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'facebook' => 'nullable|string|max:2048',
            'instagram' => 'nullable|string|max:2048',
            'youtube' => 'nullable|string|max:2048',
            'maps_embed' => 'nullable|string|max:2048',
        ]);

        OrganizationSetting::setGroup('contact', $validated);

        return response()->json([
            'success' => true,
            'message' => 'Informasi kontak berhasil diperbarui',
            'data' => OrganizationSetting::getGroup('contact'),
        ]);
    }
}
