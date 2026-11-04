<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add is_active column to users table if not exists
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_active')->default(true)->after('role');
            });
        }

        // 2. Add user_id column with foreign key to news table if not exists
        if (Schema::hasTable('news') && !Schema::hasColumn('news', 'user_id')) {
            Schema::table('news', function (Blueprint $table) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->after('author')
                    ->constrained('users')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('news') && Schema::hasColumn('news', 'user_id')) {
            Schema::table('news', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            });
        }

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('is_active');
            });
        }
    }
};

