<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'featured_image',
        'content',
        'status',
        'published_at',
        'author',
        'user_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * The user account that authored/reported this article
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
