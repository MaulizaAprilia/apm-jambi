<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('documents')
            ->where('title', 'Surat Keputusan Legalitas & Akta Pendirian NGO')
            ->where('file_name', 'Legalitas_Akta_APM_Jambi.pdf')
            ->update([
                'title' => 'Berkas Legalitas APM Jambi',
                'description' => 'Berkas legalitas organisasi APM Jambi.',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        // Keep the corrected public label.
    }
};
