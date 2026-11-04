<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('AD/ART'); // e.g. AD/ART, Profil, Legalitas, Laporan
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_name')->nullable();
            $table->string('file_size')->nullable();
            $table->string('file_type')->default('pdf');
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
