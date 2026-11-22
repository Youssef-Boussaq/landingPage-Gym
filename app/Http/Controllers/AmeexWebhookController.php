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
        try {
            $service->handle(
                $request
            );

            return response()->json([
                'success' => true,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('[AMEEX WEBHOOK ERROR] ' . $e->getMessage(), [
                'exception' => $e,
                'payload' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du webhook AMEEX',
            ], 400);
        }
    }
}

