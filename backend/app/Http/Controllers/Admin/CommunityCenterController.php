<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityCenter;
use Illuminate\Http\Request;

class CommunityCenterController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => CommunityCenter::orderBy('regency')->orderBy('display_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $center = CommunityCenter::create($this->validatedData($request));

        return response()->json(['success' => true, 'data' => $center], 201);
    }

    public function update(Request $request, CommunityCenter $center)
    {
        $center->update($this->validatedData($request));

        return response()->json(['success' => true, 'data' => $center->refresh()]);
    }

    public function destroy(CommunityCenter $center)
    {
        $center->delete();

        return response()->json(['success' => true, 'message' => 'Community Center berhasil dihapus.']);
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'village' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'regency' => ['required', 'string', 'max:255'],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ]);
    }
}
