<?php

use Illuminate\Support\Facades\Route;

// Public Endpoints
use App\Http\Controllers\Public\NewsController as PublicNewsController;
use App\Http\Controllers\Public\GalleryController as PublicGalleryController;
use App\Http\Controllers\Public\ProfileController as PublicProfileController;
use App\Http\Controllers\Public\ContactController as PublicContactController;
use App\Http\Controllers\Public\DocumentController as PublicDocumentController;
use App\Http\Controllers\Public\ProgramController as PublicProgramController;
use App\Http\Controllers\Public\OrganizationMemberController as PublicOrganizationMemberController;
use App\Http\Controllers\Public\HomeContentController as PublicHomeContentController;
use App\Http\Controllers\Public\CommunityCenterController as PublicCommunityCenterController;

// Admin Endpoints
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\DocumentController as AdminDocumentController;
use App\Http\Controllers\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Admin\OrganizationMemberController as AdminOrganizationMemberController;
use App\Http\Controllers\Admin\HomeContentController as AdminHomeContentController;
use App\Http\Controllers\Admin\CommunityCenterController as AdminCommunityCenterController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

/*
|--------------------------------------------------------------------------
| Public REST API Routes
|--------------------------------------------------------------------------
*/
Route::get('/news', [PublicNewsController::class, 'index']);
Route::get('/news/{slug}', [PublicNewsController::class, 'show']);
Route::get('/gallery', [PublicGalleryController::class, 'index']);
Route::get('/profile', [PublicProfileController::class, 'index']);
Route::get('/contact', [PublicContactController::class, 'index']);
Route::get('/documents', [PublicDocumentController::class, 'index']);
Route::get('/programs', [PublicProgramController::class, 'index']);
Route::get('/organization-members', [PublicOrganizationMemberController::class, 'index']);
Route::get('/home-content', [PublicHomeContentController::class, 'index']);
Route::get('/community-centers', [PublicCommunityCenterController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Admin REST API Routes
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/me', [AuthController::class, 'me']);

    // Admin News CRUD
    Route::get('/admin/news', [AdminNewsController::class, 'index']);
    Route::post('/admin/news', [AdminNewsController::class, 'store']);
    Route::get('/admin/news/{id}', [AdminNewsController::class, 'show']);
    Route::put('/admin/news/{id}', [AdminNewsController::class, 'update']);
    Route::post('/admin/news/{id}', [AdminNewsController::class, 'update']);
    Route::delete('/admin/news/{id}', [AdminNewsController::class, 'destroy']);

    // Admin Gallery CRUD
    Route::get('/admin/gallery', [AdminGalleryController::class, 'index']);
    Route::post('/admin/gallery', [AdminGalleryController::class, 'store']);
    Route::get('/admin/gallery/{id}', [AdminGalleryController::class, 'show']);
    Route::put('/admin/gallery/{id}', [AdminGalleryController::class, 'update']);
    Route::post('/admin/gallery/{id}', [AdminGalleryController::class, 'update']);
    Route::delete('/admin/gallery/{id}', [AdminGalleryController::class, 'destroy']);

    // Admin Documents CRUD
    Route::get('/admin/documents', [AdminDocumentController::class, 'index']);
    Route::post('/admin/documents', [AdminDocumentController::class, 'store']);
    Route::put('/admin/documents/{id}', [AdminDocumentController::class, 'update']);
    Route::post('/admin/documents/{id}', [AdminDocumentController::class, 'update']);
    Route::delete('/admin/documents/{id}', [AdminDocumentController::class, 'destroy']);

    // Admin Profile & Contact Settings
    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);

    Route::get('/admin/contact', [AdminContactController::class, 'show']);
    Route::put('/admin/contact', [AdminContactController::class, 'update']);

    // Admin Programs CRUD
    Route::get('/admin/programs', [AdminProgramController::class, 'index']);
    Route::post('/admin/programs', [AdminProgramController::class, 'store']);
    Route::put('/admin/programs/{program}', [AdminProgramController::class, 'update']);
    Route::post('/admin/programs/{program}', [AdminProgramController::class, 'update']);
    Route::delete('/admin/programs/{program}', [AdminProgramController::class, 'destroy']);

    // Admin Organization Structure CRUD
    Route::get('/admin/organization-members', [AdminOrganizationMemberController::class, 'index']);
    Route::post('/admin/organization-members', [AdminOrganizationMemberController::class, 'store']);
    Route::put('/admin/organization-members/{member}', [AdminOrganizationMemberController::class, 'update']);
    Route::post('/admin/organization-members/{member}', [AdminOrganizationMemberController::class, 'update']);
    Route::delete('/admin/organization-members/{member}', [AdminOrganizationMemberController::class, 'destroy']);

    // Admin Home Page Content
    Route::get('/admin/home-content', [AdminHomeContentController::class, 'show']);
    Route::put('/admin/home-content', [AdminHomeContentController::class, 'update']);

    // Admin Community Center CRUD
    Route::get('/admin/community-centers', [AdminCommunityCenterController::class, 'index']);
    Route::post('/admin/community-centers', [AdminCommunityCenterController::class, 'store']);
    Route::put('/admin/community-centers/{center}', [AdminCommunityCenterController::class, 'update']);
    Route::delete('/admin/community-centers/{center}', [AdminCommunityCenterController::class, 'destroy']);

    // Admin Users Management CRUD
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
    Route::patch('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
});
