<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->query('role') !== 'all') {
            $query->where('role', $request->query('role'));
        }

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $isActive = $request->query('status') === 'active';
            $query->where('is_active', $isActive);
        }

        $users = $query->paginate($request->query('limit', 20));

        return response()->json([
            'success' => true,
            'message' => 'Daftar pengguna berhasil diambil',
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['super_admin', 'admin', 'staff', 'editor', 'reporter'])],
            'is_active' => 'nullable|boolean',
        ], [
            'email.unique' => 'Email ini sudah terdaftar sebagai pengguna.',
            'password.min' => 'Password minimal harus 6 karakter.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna baru berhasil ditambahkan.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at,
            ],
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => 'nullable|string|min:6',
            'role' => ['required', Rule::in(['super_admin', 'admin', 'staff', 'editor', 'reporter'])],
            'is_active' => 'nullable|boolean',
        ], [
            'email.unique' => 'Email ini sudah digunakan oleh akun lain.',
            'password.min' => 'Password minimal harus 6 karakter jika ingin diganti.',
        ]);

        // Prevent self-deactivation
        if (isset($validated['is_active']) && !$validated['is_active'] && $request->user() && $request->user()->id == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif login.',
            ], 422);
        }

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (array_key_exists('is_active', $validated)) {
            $updateData['is_active'] = (bool) $validated['is_active'];
        }

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Toggle active status of user.
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user() && $request->user()->id == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat mengubah status akun Anda sendiri.',
            ], 422);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $statusText = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return response()->json([
            'success' => true,
            'message' => "Akun {$user->name} berhasil {$statusText}.",
            'data' => [
                'id' => $user->id,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent self deletion
        if ($request->user() && $request->user()->id == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif login.',
            ], 422);
        }

        // Prevent deleting the last remaining admin
        if (in_array($user->role, ['admin', 'super_admin'])) {
            $adminCount = User::whereIn('role', ['admin', 'super_admin'])->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus administrator terakhir dalam sistem.',
                ], 422);
            }
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun pengguna berhasil dihapus.',
        ]);
    }
}
