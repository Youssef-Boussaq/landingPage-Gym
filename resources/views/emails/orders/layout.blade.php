<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>@yield('title')</title>
</head>
<body style="font-family: Arial, sans-serif; color: #0f172a; background: #f8fafc; padding: 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <tr>
            <td style="padding: 24px 28px; border-bottom: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #64748b;">Fit Youness</p>
                <h1 style="margin: 8px 0 0; font-size: 22px;">@yield('heading')</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 28px;">
                @yield('content')
                <p style="margin-top: 28px; font-size: 14px; color: #64748b;">
                    Merci de faire confiance à Fit Youness.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
