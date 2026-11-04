<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $settings = [
        'about_badge' => 'Mengenal APM Jambi',
        'about_image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        'about_feature1_title' => 'Pendampingan Advokasi',
        'about_feature1_description' => 'Edukasi hak hukum & keadilan gender.',
        'about_feature2_title' => 'Ekonomi Kreatif',
        'about_feature2_description' => 'Pelatihan usaha UMKM & kemandirian finansial.',
    ];

    public function up(): void
    {
        $now = now();
        foreach ($this->settings as $key => $value) {
            DB::table('organization_settings')->updateOrInsert(
                ['group' => 'home', 'key' => $key],
                ['value' => $value, 'created_at' => $now, 'updated_at' => $now]
            );
        }
    }

    public function down(): void
    {
        DB::table('organization_settings')
            ->where('group', 'home')
            ->whereIn('key', array_keys($this->settings))
            ->delete();
    }
};
