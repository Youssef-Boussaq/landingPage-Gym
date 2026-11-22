<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Fit Youness')</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #f0efe7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <!-- Main Email Card -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border: 1px solid #000000; text-align: left;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #000000; background-color: #ffffff;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: #000000;">
                                            FIT YOUNESS
                                        </h1>
                                        <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #666666;">
                                            Coaching Haute Performance & E-Store
                                        </p>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 4px 10px; background-color: #000000; color: #ffffff; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
                                            Officiel
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Subject / Heading Banner -->
                    <tr>
                        <td style="padding: 24px 32px 16px 32px; background-color: #fafafa; border-bottom: 1px solid #e5e7eb;">
                            <h2 style="margin: 0; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #000000;">
                                @yield('heading')
                            </h2>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px; font-size: 14px; line-height: 1.6; color: #222222;">
                            @yield('content')

                            <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; font-size: 13px; font-weight: 600; color: #000000;">
                                    Une question sur votre commande ?
                                </p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666666;">
                                    Répondez directement à cet email ou contactez notre support client Fit Youness.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #000000; text-align: center;">
                            <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #ffffff;">
                                FIT YOUNESS • COACHING SPORTIF & NUTRITION
                            </p>
                            <p style="margin: 6px 0 0 0; font-size: 10px; color: #aaaaaa;">
                                © {{ date('Y') }} Fit Youness. Tous droits réservés.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
