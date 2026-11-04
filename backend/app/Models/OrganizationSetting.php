<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
    ];

    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->pluck('value', 'key')
            ->toArray();
    }

    public static function setGroup(string $group, array $data): void
    {
        foreach ($data as $key => $value) {
            static::updateOrCreate(
                ['group' => $group, 'key' => $key],
                ['value' => $value]
            );
        }
    }
}
