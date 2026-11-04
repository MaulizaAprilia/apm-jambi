<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OrganizationMemberController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => OrganizationMember::orderBy('category')
                ->orderBy('display_order')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', Rule::in(OrganizationMember::CATEGORIES)],
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'photo_url' => ['nullable', 'string', 'max:2048'],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('organization', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        unset($validated['photo']);

        $member = OrganizationMember::create($validated);

        return response()->json(['success' => true, 'data' => $member], 201);
    }

    public function update(Request $request, OrganizationMember $member)
    {
        $validated = $request->validate([
            'category' => ['required', Rule::in(OrganizationMember::CATEGORIES)],
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'photo_url' => ['nullable', 'string', 'max:2048'],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('photo')) {
            $this->deleteStoredFile($member->photo_url);
            $path = $request->file('photo')->store('organization', 'public');
            $validated['photo_url'] = Storage::url($path);
        }

        unset($validated['photo']);

        $member->update($validated);

        return response()->json(['success' => true, 'data' => $member->refresh()]);
    }

    public function destroy(OrganizationMember $member)
    {
        $this->deleteStoredFile($member->photo_url);
        $member->delete();

        return response()->json(['success' => true, 'message' => 'Data struktur organisasi berhasil dihapus.']);
    }

    private function deleteStoredFile(?string $fileUrl): void
    {
        if (! $fileUrl || ! str_starts_with($fileUrl, '/storage/')) {
            return;
        }

        $relativePath = ltrim(parse_url($fileUrl, PHP_URL_PATH) ?? '', '/');
        $relativePath = Str::after($relativePath, 'storage/');

        if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
