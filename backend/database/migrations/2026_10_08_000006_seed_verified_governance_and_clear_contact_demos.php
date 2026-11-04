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

        foreach ($members as $index => [$category, $name, $position]) {
            if (! DB::table('organization_members')->where('name', $name)->exists()) {
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

        DB::table('organization_members')->where(function ($query) {
            $query->where([
                'category' => 'management',
                'name' => 'Sekretaris',
                'position' => 'Administrasi & Hubungan Kelembagaan',
                'description' => null,
                'photo_url' => null,
            ])->orWhere([
                'category' => 'management',
                'name' => 'Bendahara',
                'position' => 'Pengelolaan Keuangan & Aset',
                'description' => null,
                'photo_url' => null,
            ])->orWhere([
                'category' => 'implementation',
                'name' => 'Divisi Advokasi & Ekonomi',
                'position' => 'Koordinasi Lapangan & Pendampingan',
                'description' => null,
                'photo_url' => null,
            ]);
        })->delete();

        DB::table('organization_members')
            ->where('category', 'management')
            ->where('name', 'Marsiyam')
            ->where('position', 'Direktur APM Jambi')
            ->whereNull('description')
            ->whereNull('photo_url')
            ->update(['category' => 'implementation', 'position' => 'Direktur Eksekutif', 'updated_at' => now()]);

        $fakeContactValues = [
            'whatsapp' => ['+62 812-3456-7890', '+6281234567890'],
            'email' => ['info@apmjambi.or.id'],
            'facebook' => ['https://facebook.com/apmjambi'],
            'instagram' => ['https://instagram.com/apmjambi'],
            'youtube' => ['https://youtube.com/@apmjambi'],
            'maps_embed' => [
                'https://maps.google.com/?q=Kota+Jambi',
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127606.3792070387!2d103.5414578!3d-1.6099719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e25888a70c3ec47%3A0xb2bbdf2e92c2db!2sJambi!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
            ],
        ];
        foreach ($fakeContactValues as $key => $values) {
            DB::table('organization_settings')
                ->where(['group' => 'contact', 'key' => $key])
                ->whereIn('value', $values)
                ->update(['value' => '', 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        // Keep source-verified records and any subsequent admin edits.
    }
};
