# People2FA

A tiny open-source web app for sharing a TOTP authenticator between two people.

Inspired by [Vouch](https://ericscalibur.github.io/Vouch/) — same idea of proving it’s really someone you trust, reduced to a single shared authenticator secret.

## What it does

1. Enter **Both Names** (for example `Jamie Vicky` or `Jamie&Vicky`).
2. Tap **Generate**.
3. Names are sanitized to uppercase letters/digits only (`Jamie&Vicky` → `JAMIEVICKY`).
4. Get an `otpauth://totp/...` URI, a QR code, a tap-to-add link, and backup details.

Example output:

```text
otpauth://totp/JAMIEVICKY?secret=JBSWY3DPEHPK3PXP&issuer=People2FA&algorithm=SHA1&digits=6&period=30
```

Secrets are short/medium (80-bit / 16 Base32 characters), generated in the browser with `crypto.getRandomValues`. Nothing is uploaded.

## Safety notes

- Prefer Google Authenticator **without** signing in, or another app that does not sync codes to the cloud.
- Do not send the QR, secret, or otpauth link over WhatsApp, SMS, email, or other online apps.
- Keep a written copy of the secret offline.

## Run locally

Static files only — no build step:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy

Host the folder on any static HTTPS host (GitHub Pages, Netlify, Caddy, nginx, etc.).

## License

MIT
