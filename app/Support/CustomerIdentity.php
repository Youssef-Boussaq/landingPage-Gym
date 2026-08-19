<?php

namespace App\Support;

use Illuminate\Http\Request;

class CustomerIdentity
{
    public function __construct(
        private readonly ?int $userId,
        private readonly ?string $guestToken,
    ) {
    }

    public static function resolve(Request $request): self
    {
        $user = $request->user();

        if ($user) {
            return new self(
                userId: $user->id,
                guestToken: null,
            );
        }

        return new self(
            userId: null,
            guestToken: $request->cookie('guest_token'),
        );
    }

    public function userId(): ?int
    {
        return $this->userId;
    }

    public function guestToken(): ?string
    {
        return $this->guestToken;
    }

    public function isAuthenticated(): bool
    {
        return $this->userId !== null;
    }

    public function isGuest(): bool
    {
        return $this->userId === null
            && $this->guestToken !== null;
    }
}