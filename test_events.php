<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$notifications = DB::table('notifications')->orderBy('created_at', 'desc')->take(3)->get();
foreach ($notifications as $n) {
    echo "Type column: " . $n->type . "\n";
    $data = json_decode($n->data, true);
    echo "Data type: " . ($data['type'] ?? 'none') . "\n";
}
