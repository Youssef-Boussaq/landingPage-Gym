<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Low stock threshold
    |--------------------------------------------------------------------------
    */

    'low_stock_threshold' => (int) env('LOW_STOCK_THRESHOLD', 10),

    /*
    |--------------------------------------------------------------------------
    | Admin notification email
    |--------------------------------------------------------------------------
    |
    | Optional extra inbox (in addition to all users with role = admin).
    |
    */

    'admin_notification_email' => env('ADMIN_NOTIFICATION_EMAIL'),

];
