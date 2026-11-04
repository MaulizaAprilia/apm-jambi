<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kredensial tidak cocok dengan data kami.',
            ], 401);
        }

        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda sedang dinonaktifkan oleh Administrator. Silakan hubungi pengurus pusat untuk informasi lebih lanjut.',
            ], 403);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'admin',
                    'is_active' => (bool) ($user->is_active ?? true),
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar / logout',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }
}
