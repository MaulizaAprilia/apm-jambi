<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'badge',
        'title',
        'category',
        'description',
        'highlights',
        'image',
        'color',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'highlights' => 'array',
        'is_published' => 'boolean',
    ];
}
