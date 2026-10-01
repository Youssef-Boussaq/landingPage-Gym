<?php
namespace App\Http\Controllers;

use App\Services\Ameex\AmeexWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AmeexWebhookController extends Controller
{
    public function handle(
        Request $request,
        AmeexWebhookService $service
    ): JsonResponse {
        $service->handle(
            $request
        );

        return response()->json([
            'success' => true,
        ]);
    }
}

