# People2FA

A tiny open-source web app for sharing a TOTP authenticator between two people.

Inspired by [Vouch](https://ericscalibur.github.io/Vouch/) — same idea of proving it’s really someone you trust, reduced to a single shared authenticator secret.

## Use it

**Download one file**  
Save [`index.html`](https://github.com/orangesuitcase/People2FA/raw/main/index.html) and open it in any browser. No install, no build, no server — everything runs locally in that file.

**Or host on GitHub Pages**  
In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save**.  
Then open https://orangesuitcase.github.io/People2FA/

## What it does

1. Enter **Both Names** (for example `Romeo Juliet` or `Romeo&Juliet`).
2. Tap **Generate**.
3. Names are sanitized to uppercase letters/digits only (`Romeo&Juliet` → `ROMEOJULIET`).
4. Get an `otpauth://totp/...` URI, a QR code, a tap-to-add link, and backup details.

Example output:

```text
otpauth://totp/ROMEOJULIET?secret=JBSWY3DPEHPK3PXP&issuer=People2FA&algorithm=SHA1&digits=6&period=30
```

Secrets are short/medium (80-bit / 16 Base32 characters), generated in the browser with `crypto.getRandomValues`. Nothing is uploaded.

## Safety notes

- Prefer Google Authenticator **without** signing in, or another app that does not sync codes to the cloud.
- Do not send the QR, secret, or otpauth link over WhatsApp, SMS, email, or other online apps.
- Keep a written copy of the secret offline.

## License

MIT
