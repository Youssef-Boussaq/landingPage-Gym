<!DOCTYPE html>
<html lang="fr" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- SEO Primary Meta Tags -->
    <title inertia>{{ config('app.name', 'Fit Youness') }} — Coaching Sportif & E-Store Activewear</title>
    <meta name="title" content="Fit Youness — Coaching Sportif Haute Performance & Programmes Sur-Mesure">
    <meta name="description" content="Découvrez Fit Youness : programmes de musculation sur-mesure, transformation physique prouvée, coaching personnalisé et guides digitaux haute performance.">
    <meta name="keywords" content="coaching sportif, musculation, fitness maroc, programme transformation, prise de masse, perte de poids, e-book fitness, activewear, fit youness">
    <meta name="author" content="Fit Youness">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="theme-color" content="#000000">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:site_name" content="Fit Youness">
    <meta property="og:title" content="Fit Youness — Coaching Sportif & Boutique Activewear">
    <meta property="og:description" content="Accompagnement d'élite, nutrition calibrée et programmes d'entraînement sur-mesure pour sculpter un corps athlétique et performant.">
    <meta property="og:image" content="{{ asset('images/2.webp') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Coach Fit Youness">
    <meta property="og:locale" content="fr_FR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="Fit Youness — Coaching Sportif Haute Performance">
    <meta name="twitter:description" content="Programmes d'entraînement sur-mesure, nutrition et guides d'entraînement haute performance.">
    <meta name="twitter:image" content="{{ asset('images/2.webp') }}">

    <!-- Resource Hints & Font Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- Structured Data (JSON-LD Schema for Google Rich Snippets) -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'Organization',
                '@id' => url('/') . '/#organization',
                'name' => 'Fit Youness',
                'url' => url('/'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => asset('images/2.webp'),
                    'caption' => 'Fit Youness Logo',
                ],
                'description' => "Plateforme d'élite de coaching sportif personnalisé, vente de programmes numériques et activewear.",
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressCountry' => 'MA',
                ],
            ],
            [
                '@type' => 'WebSite',
                '@id' => url('/') . '/#website',
                'url' => url('/'),
                'name' => 'Fit Youness',
                'publisher' => [
                    '@id' => url('/') . '/#organization',
                ],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => url('/store') . '?search={search_term_string}',
                    'query-input' => 'required name=search_term_string',
                ],
            ],
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
    </script>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased text-[#000000] bg-white selection:bg-[#000000] selection:text-[#ffffff]">
    @inertia
</body>

</html>
