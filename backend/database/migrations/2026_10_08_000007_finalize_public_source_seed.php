<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $members = [
            ['oversight', 'Erat Indri Hastuti, S.Pd', 'Ketua Badan Pengawas'],
            ['oversight', 'Sarjoko, A.Md., S.Pd', 'Badan Pengawas'],
            ['oversight', 'Lasmi', 'Badan Pengawas'],
            ['management', 'Sualjimah', 'Ketua Badan Pengurus'],
            ['implementation', 'Marsiyam', 'Direktur Eksekutif'],
        ];

        foreach ($members as $index => $member) {
            [$category, $name, $position] = $member;
            $existing = DB::table('organization_members')->where('name', $name)->first();
            if ($existing === null) {
                DB::table('organization_members')->insert([
                    'category' => $category,
                    'name' => $name,
                    'position' => $position,
                    'description' => null,
                    'photo_url' => null,
                    'display_order' => $index + 1,
                    'is_published' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        DB::table('organization_settings')
            ->where(['group' => 'contact', 'key' => 'maps_embed'])
            ->whereIn('value', [
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e25888a70c3ec47%3A0xb2bbdf2e92c2db!2sJambi!5e0!3m2!1sid!2sid',
            ])
            ->update(['value' => '', 'updated_at' => now()]);
    }

    public function down(): void
    {
        // Preserve published names and any follow-up edits.
    }
};
