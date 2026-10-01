<?php

namespace App\Services\Ameex;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AmeexClient
{
    private string $baseUrl;
    private string $apiId;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim(
            (string) config('services.ameex.base_url'),
            '/'
        );

        $this->apiId = (string) config('services.ameex.api_id');
        $this->apiKey = (string) config('services.ameex.api_key');

        if ($this->baseUrl === '') {
            throw new RuntimeException(
                'AMEEX_BASE_URL is not configured.'
            );
        }

        if ($this->apiId === '') {
            throw new RuntimeException(
                'AMEEX_API_ID is not configured.'
            );
        }

        if ($this->apiKey === '') {
            throw new RuntimeException(
                'AMEEX_API_KEY is not configured.'
            );
        }
    }

    /**
     * Base HTTP client for AMEEX.
     */
    protected function http(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->asForm()
            ->withHeaders([
                'C-Api-Id' => $this->apiId,
                'C-Api-Key' => $this->apiKey,
            ])
            ->connectTimeout(10)
            ->timeout(30);
    }

    /**
     * GET request.
     */
    public function get(
        string $endpoint,
        array $query = []
    ): array {
        $response = $this->http()->get(
            ltrim($endpoint, '/'),
            $query
        );

        return $this->handleResponse($response);
    }

    /**
     * POST request.
     */
    public function post(
        string $endpoint,
        array $data = []
    ): array {
        $response = $this->http()->post(
            ltrim($endpoint, '/'),
            $data
        );

        return $this->handleResponse($response);
    }

    /**
     * Handle AMEEX response.
     */
    protected function handleResponse(
        Response $response
    ): array {
        if (!$response->successful()) {
            throw new RuntimeException(
                $this->buildErrorMessage($response)
            );
        }

        $json = $response->json();

        if (!is_array($json)) {
            throw new RuntimeException(
                'AMEEX returned an invalid JSON response.'
            );
        }

        return $json;
    }

    /**
     * Build a useful API error message.
     */
    protected function buildErrorMessage(
        Response $response
    ): string {
        $status = $response->status();

        $body = $response->json();

        if (is_array($body)) {
            $message =
                $body['message']
                ?? $body['error']
                ?? $body['msg']
                ?? $body['api']['msg']
                ?? null;

            if (
                is_string($message)
                && trim($message) !== ''
            ) {
                return "AMEEX API error ({$status}): {$message}";
            }
        }

        $bodyText = trim($response->body());

        if ($bodyText !== '') {
            return "AMEEX API error ({$status}): {$bodyText}";
        }

        return "AMEEX API error ({$status}).";
    }
}

