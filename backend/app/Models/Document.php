<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];
}
