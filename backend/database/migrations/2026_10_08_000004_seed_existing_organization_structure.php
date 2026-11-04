<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('organization_members')->exists()) {
            return;
        }

        $now = now();
        DB::table('organization_members')->insert([
            [
                'category' => 'management',
                'name' => 'Marsiyam',
                'position' => 'Direktur APM Jambi',
                'display_order' => 1,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category' => 'management',
                'name' => 'Sekretaris',
                'position' => 'Administrasi & Hubungan Kelembagaan',
                'display_order' => 2,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category' => 'management',
                'name' => 'Bendahara',
                'position' => 'Pengelolaan Keuangan & Aset',
                'display_order' => 3,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category' => 'implementation',
                'name' => 'Divisi Advokasi & Ekonomi',
                'position' => 'Koordinasi Lapangan & Pendampingan',
                'display_order' => 1,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('organization_members')
            ->where(function ($query) {
                $query->where(['name' => 'Marsiyam', 'position' => 'Direktur APM Jambi'])
                    ->orWhere(['name' => 'Sekretaris', 'position' => 'Administrasi & Hubungan Kelembagaan'])
                    ->orWhere(['name' => 'Bendahara', 'position' => 'Pengelolaan Keuangan & Aset'])
                    ->orWhere(['name' => 'Divisi Advokasi & Ekonomi', 'position' => 'Koordinasi Lapangan & Pendampingan']);
            })
            ->delete();
    }
};
