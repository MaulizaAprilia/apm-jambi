<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_members', function (Blueprint $table) {
            $table->id();
            $table->string('category', 30)->index();
            $table->string('name');
            $table->string('position');
            $table->text('description')->nullable();
            $table->string('photo_url')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_members');
    }
};
