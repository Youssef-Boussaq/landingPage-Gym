<?php

namespace App\Console\Commands;
use Intervention\Image\Encoders\WebpEncoder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ConvertImagesToWebp extends Command
{
    protected $signature = 'images:convert-webp';

    protected $description = 'Convert product images from JFIF/JPEG/PNG to WebP';

    public function handle(): int
    {
        $disk = Storage::disk('public');

        $files = $disk->allFiles('categories');

        $manager = new ImageManager(
            new Driver()
        );

        $converted = 0;

        foreach ($files as $file) {

            $extension = strtolower(
                pathinfo($file, PATHINFO_EXTENSION)
            );

            if (! in_array($extension, [
                'jfif',
                'jpg',
                'jpeg',
                'png',
            ])) {
                continue;
            }

            $outputPath = preg_replace(
                '/\.(jfif|jpg|jpeg|png)$/i',
                '.webp',
                $file
            );

            try {

                // Read image binary from Laravel Storage
                $contents = $disk->get($file);

                // Decode image using Intervention Image 4
                $image = $manager->decode($contents);

                // Convert to WebP
                $webp = $image->encode(
    new WebpEncoder(quality: 85)
);

                // Save WebP to Storage
                $disk->put(
                    $outputPath,
                    (string) $webp
                );

                $this->info(
                    "✓ {$file} → {$outputPath}"
                );

                $converted++;

            } catch (\Throwable $e) {

                $this->error(
                    "✗ {$file}"
                );

                $this->error(
                    $e->getMessage()
                );
            }
        }

        $this->newLine();

        $this->info(
            "Conversion terminée : {$converted} image(s)."
        );

        return self::SUCCESS;
    }
}