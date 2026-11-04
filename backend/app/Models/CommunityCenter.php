<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityCenter extends Model
{
    protected $fillable = [
        'name',
        'village',
        'district',
        'regency',
        'display_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }
}
