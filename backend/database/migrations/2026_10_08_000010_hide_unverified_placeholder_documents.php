<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $documents = [
            [
                'title' => 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) APM Jambi',
                'file_name' => 'AD_ART_APM_Jambi.pdf',
            ],
            [
                'title' => 'Profil Singkat & Portofolio Organisasi APM Jambi',
                'file_name' => 'Profil_Organisasi_APM_Jambi.pdf',
            ],
            [
                'title' => 'Berkas Legalitas APM Jambi',
                'file_name' => 'Legalitas_Akta_APM_Jambi.pdf',
            ],
        ];

        foreach ($documents as $document) {
            DB::table('documents')
                ->where($document)
                ->update([
                    'title' => 'Berkas lama - perlu verifikasi',
                    'description' => 'Berkas ini belum diverifikasi terhadap dokumen resmi yang disampaikan. Unggah berkas sumber yang benar sebelum dipublikasikan.',
                    'is_public' => false,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // Unverified uploads must not be republished automatically.
    }
};
