<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = OrganizationSetting::getGroup('profile');

        return response()->json([
            'success' => true,
            'message' => 'Data profil organisasi berhasil diambil',
            'data' => $profile,
        ]);
    }
}
