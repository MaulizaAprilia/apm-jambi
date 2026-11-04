<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = OrganizationSetting::getGroup('profile');

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'history' => 'required|string',
            'vision' => 'required|string',
            'mission' => 'required|string',
            'header_title' => 'sometimes|required|string|max:255',
            'header_description' => 'sometimes|required|string|max:2000',
            'history_title' => 'sometimes|required|string|max:255',
            'structure_intro' => 'sometimes|required|string|max:1000',
            'tagline' => 'required|string|max:1000',
            'profile_purpose' => 'required|string|max:5000',
            'profile_vision' => 'required|string|max:1000',
            'strategies' => 'required|string|max:5000',
            'scope' => 'required|string|max:1000',
            'beneficiaries' => 'required|string|max:2000',
            'project_history' => 'required|string|max:5000',
            'legal_status' => 'required|string|max:3000',
            'principles' => 'required|string|max:3000',
            'funding' => 'required|string|max:2000',
            'secretariat_address' => 'required|string|max:1000',
        ]);

        OrganizationSetting::setGroup('profile', $validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil organisasi berhasil diperbarui',
            'data' => OrganizationSetting::getGroup('profile'),
        ]);
    }
}
