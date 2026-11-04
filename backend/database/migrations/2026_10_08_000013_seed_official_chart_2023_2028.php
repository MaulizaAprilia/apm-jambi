<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\OrganizationMember;

return new class extends Migration
{
    public function up(): void
    {
        // Clear previous unverified placeholders
        OrganizationMember::truncate();

        $members = [
            // Badan Pengawas (Oversight)
            [
                'category' => 'oversight',
                'name' => 'Erat Indri Hastuti',
                'position' => 'Ketua Badan Pengawas',
                'description' => 'Ketua Badan Pengawas APM Jambi Periode 2023–2028.',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'category' => 'oversight',
                'name' => 'Silvester Sarjoko',
                'position' => 'Anggota Badan Pengawas',
                'description' => 'Anggota Badan Pengawas APM Jambi Periode 2023–2028.',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'category' => 'oversight',
                'name' => 'Lasmi',
                'position' => 'Anggota Badan Pengawas',
                'description' => 'Anggota Badan Pengawas APM Jambi Periode 2023–2028.',
                'display_order' => 3,
                'is_published' => true,
            ],

            // Badan Pengurus (Management)
            [
                'category' => 'management',
                'name' => 'Sualjimah',
                'position' => 'Ketua Badan Pengurus',
                'description' => 'Ketua Badan Pengurus APM Jambi Periode 2023–2028.',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'category' => 'management',
                'name' => 'Reni Mardiani',
                'position' => 'Sekretaris Badan Pengurus',
                'description' => 'Sekretaris Badan Pengurus APM Jambi Periode 2023–2028.',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'category' => 'management',
                'name' => 'Eko Wati',
                'position' => 'Bendahara Badan Pengurus',
                'description' => 'Bendahara Badan Pengurus APM Jambi Periode 2023–2028.',
                'display_order' => 3,
                'is_published' => true,
            ],

            // Badan Pelaksana & Staf (Implementation)
            [
                'category' => 'implementation',
                'name' => 'Marsiyam',
                'position' => 'Direktur Eksekutif',
                'description' => 'Direktur Eksekutif Badan Pelaksana APM Jambi.',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Sutiyem',
                'position' => 'Koordinator Program',
                'description' => 'Koordinator Program Badan Pelaksana APM Jambi.',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Sugeng Hadi Kusuma',
                'position' => 'Staf IT',
                'description' => 'Staf IT & Sistem Informasi APM Jambi.',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Sulastri',
                'position' => 'Staf Keuangan',
                'description' => 'Staf Keuangan APM Jambi.',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Siti Nurjanah',
                'position' => 'Staf Advokasi',
                'description' => 'Staf Advokasi Hak Perempuan & HKSR APM Jambi.',
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Rahmawati Fitri',
                'position' => 'Staf Lapang Merangin',
                'description' => 'Staf Pendampingan Lapangan Kabupaten Merangin.',
                'display_order' => 6,
                'is_published' => true,
            ],
            [
                'category' => 'implementation',
                'name' => 'Rahmaini',
                'position' => 'Staf Lapang Bungo',
                'description' => 'Staf Pendampingan Lapangan Kabupaten Bungo.',
                'display_order' => 7,
                'is_published' => true,
            ],
        ];

        foreach ($members as $member) {
            OrganizationMember::create($member);
        }
    }

    public function down(): void
    {
        OrganizationMember::truncate();
    }
};
