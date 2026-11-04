<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('documents')
            ->where('id', 4)
            ->orWhere('file_path', 'like', '%sk-kemenkumham%')
            ->update([
                'file_size' => '163 KB',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
    }
};

