<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'system' => 'Aliansi Perempuan Mandiri (APM) Jambi Backend REST API',
        'status' => 'Online & Active',
        'api_version' => '1.0.0',
        'frontend_url' => 'http://localhost:3000',
        'endpoints' => [
            'public_news' => 'GET http://localhost:8000/api/news',
            'public_gallery' => 'GET http://localhost:8000/api/gallery',
            'public_profile' => 'GET http://localhost:8000/api/profile',
            'public_contact' => 'GET http://localhost:8000/api/contact',
            'admin_login' => 'POST http://localhost:8000/api/admin/login',
        ],
    ]);
});
