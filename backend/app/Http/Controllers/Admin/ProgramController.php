<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Program::orderBy('display_order')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'badge' => ['nullable', 'string', 'max:80'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['required', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'image' => ['nullable', 'string', 'max:2048'],
            'color' => ['required', Rule::in(['purple', 'blue', 'red', 'emerald'])],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('programs', 'public');
            $validated['image'] = Storage::url($path);
        } elseif ($request->hasFile('image')) {
            $path = $request->file('image')->store('programs', 'public');
            $validated['image'] = Storage::url($path);
        }

        unset($validated['image_file']);

        $program = Program::create($validated);

        return response()->json(['success' => true, 'data' => $program], 201);
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'badge' => ['nullable', 'string', 'max:80'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['required', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'image' => ['nullable', 'string', 'max:2048'],
            'color' => ['required', Rule::in(['purple', 'blue', 'red', 'emerald'])],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('image_file')) {
            $this->deleteStoredFile($program->image);
            $path = $request->file('image_file')->store('programs', 'public');
            $validated['image'] = Storage::url($path);
        } elseif ($request->hasFile('image')) {
            $this->deleteStoredFile($program->image);
            $path = $request->file('image')->store('programs', 'public');
            $validated['image'] = Storage::url($path);
        }

        unset($validated['image_file']);

        $program->update($validated);

        return response()->json(['success' => true, 'data' => $program->refresh()]);
    }

    public function destroy(Program $program)
    {
        $this->deleteStoredFile($program->image);
        $program->delete();

        return response()->json(['success' => true, 'message' => 'Program berhasil dihapus.']);
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
