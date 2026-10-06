<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'appearance.primary',
                'value' => '#9de500',
                'type' => 'color',
            ],
            [
                'key' => 'appearance.primary_hover',
                'value' => '#8cd000',
                'type' => 'color',
            ],
            [
                'key' => 'appearance.primary_dark',
                'value' => '#7ec000',
                'type' => 'color',
            ],
            [
                'key' => 'appearance.primary_light',
                'value' => '#b8f526',
                'type' => 'color',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                ]
            );
        }
    }
}