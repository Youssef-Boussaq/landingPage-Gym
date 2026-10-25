<?php

namespace Database\Seeders;

use App\Models\LandingService;
use App\Models\LandingProgram;
use App\Models\LandingReview;
use App\Models\LandingSectionSetting;
use Illuminate\Database\Seeder;

class LandingSectionsSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Section-level settings ─────────────────────────────────────
        foreach (['about', 'services', 'programs', 'reviews'] as $section) {
            LandingSectionSetting::firstOrCreate(['section' => $section]);
        }

        // ─── Services ───────────────────────────────────────────────────
        $services = [
            [
                'slug'        => 'powerlifting',
                'title'       => 'Powerlifting',
                'description' => 'Master the big three lifts with proper form, programming, and safety. Build raw strength.',
                'image'       => 'images/8.png',
                'image_alt'   => 'Powerlifting coaching',
                'icon'        => 'Dumbbell',
                'cta_label'   => 'Learn More',
                'sort_order'  => 1,
                'is_enabled'  => true,
                'is_featured' => false,
            ],
            [
                'slug'        => 'weight-loss',
                'title'       => 'Weight Loss',
                'description' => 'Sustainable fat loss through customized nutrition plans and high-intensity training.',
                'image'       => 'images/7.png',
                'image_alt'   => 'Weight loss coaching',
                'icon'        => 'Flame',
                'cta_label'   => 'Learn More',
                'sort_order'  => 2,
                'is_enabled'  => true,
                'is_featured' => false,
            ],
            [
                'slug'        => 'muscle-building',
                'title'       => 'Muscle Building',
                'description' => 'Hypertrophy-focused training designed to maximize muscle growth and aesthetic proportions.',
                'image'       => 'images/5.png',
                'image_alt'   => 'Muscle building coaching',
                'icon'        => 'Activity',
                'cta_label'   => 'Learn More',
                'sort_order'  => 3,
                'is_enabled'  => true,
                'is_featured' => false,
            ],
            [
                'slug'        => 'stretching',
                'title'       => 'Stretching & Mobility',
                'description' => 'Improve flexibility, prevent injuries, and enhance overall functional movement.',
                'image'       => 'images/6.png',
                'image_alt'   => 'Stretching & mobility coaching',
                'icon'        => 'PersonStanding',
                'cta_label'   => 'Learn More',
                'sort_order'  => 4,
                'is_enabled'  => true,
                'is_featured' => false,
            ],
        ];

        foreach ($services as $data) {
            LandingService::updateOrCreate(['slug' => $data['slug']], $data);
        }

        // ─── Programs ───────────────────────────────────────────────────
        $programs = [
            [
                'slug'              => '1-month',
                'title'             => '1 Month Coaching',
                'description'       => 'Perfect for getting started and learning the fundamentals.',
                'price'             => '600',
                'currency'          => 'MAD',
                'period'            => '/ month',
                'benefits'          => [
                    'Customized Workout Plan',
                    'Basic Nutritional Guidance',
                    'Weekly Progress Check-ins',
                    'WhatsApp Support',
                ],
                'is_popular'        => false,
                'is_enabled'        => true,
                'sort_order'        => 1,
                'cta_label'         => 'Choose Plan',
                'whatsapp_message'  => 'Hello, I would like to start the 1 Month Coaching program.',
            ],
            [
                'slug'              => '3-months',
                'title'             => '3 Months Coaching',
                'description'       => 'The ideal timeframe to see significant physical changes.',
                'price'             => '2,000',
                'currency'          => 'MAD',
                'period'            => '/ 3 months',
                'benefits'          => [
                    'Advanced Workout Programming',
                    'Complete Macro & Meal Plan',
                    'Bi-weekly Form Checks',
                    'Priority WhatsApp Support',
                    'Supplementation Guide',
                ],
                'is_popular'        => true,
                'is_enabled'        => true,
                'sort_order'        => 2,
                'cta_label'         => 'Choose Plan',
                'whatsapp_message'  => 'Hello, I would like to start the 3 Months Coaching program.',
            ],
            [
                'slug'              => '1-year',
                'title'             => '1 Year Coaching',
                'description'       => 'A total lifestyle transformation for committed athletes.',
                'price'             => '5,000',
                'currency'          => 'MAD',
                'period'            => '/ year',
                'benefits'          => [
                    'Year-round Periodized Training',
                    'Dynamic Nutrition Adjustments',
                    'Unlimited Form Analysis',
                    '24/7 VIP Support',
                    'Contest/Photoshoot Prep',
                    'Exclusive Member Resources',
                ],
                'is_popular'        => false,
                'is_enabled'        => true,
                'sort_order'        => 3,
                'cta_label'         => 'Choose Plan',
                'whatsapp_message'  => 'Hello, I would like to start the 1 Year Coaching program.',
            ],
        ];

        foreach ($programs as $data) {
            LandingProgram::updateOrCreate(['slug' => $data['slug']], $data);
        }

        // ─── Reviews ────────────────────────────────────────────────────
        $reviews = [
            [
                'name'       => 'Amine B.',
                'role'       => 'Weight Loss Program',
                'rating'     => 5,
                'text'       => 'مدرب محترف، متمكن وملتزم. ساعدني على تجاوز مراحل الثبات في تطوري بطريقة آمنة وفعالة.',
                'avatar'     => null,
                'is_enabled' => true,
                'sort_order' => 1,
            ],
            [
                'name'       => 'Sarah M.',
                'role'       => 'Muscle Building',
                'rating'     => 5,
                'text'       => 'لم أشعر بالقوة بهذا الشكل من قبل. اهتمامه بأدق تفاصيل أدائي وتحفيزه المستمر ساعداني على الاستمرار حتى عندما كنت أفكر في الاستسلام. أنصح به بشدة! ',
                'avatar'     => null,
                'is_enabled' => true,
                'sort_order' => 2,
            ],
            [
                'name'       => 'Youssef T.',
                'role'       => 'Weight Loss Program',
                'rating'     => 5,
                'text'       => 'مدرب رائع! خسرت 15 كيلوغرامًا خلال 3 أشهر. كانت الخطة الغذائية سهلة التطبيق، والتمارين مصممة بشكل مثالي لتناسب مستواي.',
                'avatar'     => null,
                'is_enabled' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($reviews as $data) {
            // Avoid duplicating on re-seed — match by name + role
            LandingReview::firstOrCreate(
                ['name' => $data['name'], 'role' => $data['role']],
                $data
            );
        }

        $this->command->info('Landing sections seeded successfully.');
    }
}
