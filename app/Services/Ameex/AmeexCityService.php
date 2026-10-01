<?php

namespace App\Services\Ameex;

use App\Models\AmeexCity;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AmeexCityService
{
    public function __construct(
        private readonly AmeexClient $client
    ) {
    }

    /**
     * Synchronize AMEEX cities with the local database.
     *
     * Expected AMEEX response:
     *
     * {
     *     "login": "success",
     *     "api": {
     *         "type": "success",
     *         "msg": "",
     *         "cities": {
     *             "1": {
     *                 "id": 1,
     *                 "name": "Marrakech"
     *             },
     *             "2": {
     *                 "id": 2,
     *                 "name": "Meknes"
     *             }
     *         }
     *     },
     *     "sandbox": 1
     * }
     */
    public function sync(): int
    {
        $response = $this->client->get('/Delivery/Cities');

        $this->ensureSuccessfulResponse($response);

        $cities = $this->extractCities($response);

        if ($cities === []) {
            return 0;
        }

        $count = 0;

        DB::transaction(function () use ($cities, &$count): void {
            foreach ($cities as $city) {
                if (!is_array($city)) {
                    continue;
                }

                $ameexId = $this->extractAmeexId($city);
                $name = $this->extractName($city);

                if ($ameexId === null || $name === null) {
                    continue;
                }

                AmeexCity::updateOrCreate(
                    [
                        'ameex_id' => $ameexId,
                    ],
                    [
                        'name' => $name,
                        'name_ar' => $this->extractArabicName($city),
                        'name_fr' => $this->extractFrenchName($city),
                        'active' => true,
                        'raw_data' => $city,
                    ]
                );

                $count++;
            }
        });

        return $count;
    }

    /**
     * Get all active AMEEX cities from the local database.
     */
    public function activeCities()
    {
        return AmeexCity::query()
            ->where('active', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * Find an active city using the AMEEX city ID.
     */
    public function findByAmeexId(int $ameexId): ?AmeexCity
    {
        return AmeexCity::query()
            ->where('ameex_id', $ameexId)
            ->where('active', true)
            ->first();
    }

    /**
     * Find an active city using our local database ID.
     */
    public function find(int $id): ?AmeexCity
    {
        return AmeexCity::query()
            ->whereKey($id)
            ->where('active', true)
            ->first();
    }

    /**
     * Extract the cities object from the AMEEX response.
     *
     * AMEEX returns cities as an associative object:
     *
     * "cities": {
     *     "1": {
     *         "id": 1,
     *         "name": "Marrakech"
     *     },
     *     "2": {
     *         "id": 2,
     *         "name": "Meknes"
     *     }
     * }
     *
     * array_values() converts it into a normal indexed array.
     */
    private function extractCities(array $response): array
    {
        $cities = $response['api']['cities'] ?? [];

        if (!is_array($cities)) {
            return [];
        }

        return array_values($cities);
    }

    /**
     * Make sure AMEEX reported a successful API response.
     */
    private function ensureSuccessfulResponse(array $response): void
    {
        $type = $response['api']['type'] ?? null;

        if ($type !== 'success') {
            $message = $response['api']['msg'] ?? 'Unknown AMEEX error.';

            throw new RuntimeException(
                "AMEEX cities synchronization failed: {$message}"
            );
        }
    }

    /**
     * Extract AMEEX city ID.
     */
    private function extractAmeexId(array $city): ?int
    {
        $value = $city['id'] ?? null;

        return is_numeric($value)
            ? (int) $value
            : null;
    }

    /**
     * Extract city name.
     */
    private function extractName(array $city): ?string
    {
        $value = $city['name'] ?? null;

        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value !== ''
            ? $value
            : null;
    }

    /**
     * Extract Arabic name if AMEEX provides one.
     */
    private function extractArabicName(array $city): ?string
    {
        $value =
            $city['name_ar']
            ?? $city['arabic_name']
            ?? $city['nameArabic']
            ?? null;

        return is_string($value) && trim($value) !== ''
            ? trim($value)
            : null;
    }

    /**
     * Extract French name if AMEEX provides one.
     */
    private function extractFrenchName(array $city): ?string
    {
        $value =
            $city['name_fr']
            ?? $city['french_name']
            ?? $city['nameFr']
            ?? null;

        return is_string($value) && trim($value) !== ''
            ? trim($value)
            : null;
    }
}

