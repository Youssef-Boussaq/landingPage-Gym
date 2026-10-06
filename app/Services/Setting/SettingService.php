<?php

namespace App\Services\Setting;

use App\Models\Setting;
use Illuminate\Support\Collection;

class SettingService
{
    /**
     * Get all settings as key => value.
     */
    public function all(): Collection
    {
        return Setting::query()
            ->pluck('value', 'key');
    }

    /**
     * Get one setting.
     */
    public function get(
        string $key,
        mixed $default = null
    ): mixed {
        return Setting::query()
            ->where('key', $key)
            ->value('value') ?? $default;
    }

    /**
     * Get appearance settings.
     */
    public function appearance(): array
    {
        return [
            'primary' => $this->get(
                'appearance.primary',
                '#9de500'
            ),

            'primary_hover' => $this->get(
                'appearance.primary_hover',
                '#8cd000'
            ),

            'primary_dark' => $this->get(
                'appearance.primary_dark',
                '#7ec000'
            ),

            'primary_light' => $this->get(
                'appearance.primary_light',
                '#b8f526'
            ),
        ];
    }
}