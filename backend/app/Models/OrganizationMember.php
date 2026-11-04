<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationMember extends Model
{
    use HasFactory;

    public const CATEGORIES = [
        'oversight',
        'management',
        'implementation',
    ];

    protected $fillable = [
        'category',
        'name',
        'position',
        'description',
        'photo_url',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
