<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\OrganizationSetting;

class ContactController extends Controller
{
    public function index()
    {
        $contact = OrganizationSetting::getGroup('contact');

        return response()->json([
            'success' => true,
            'message' => 'Informasi kontak berhasil diambil',
            'data' => $contact,
        ]);
    }
}
