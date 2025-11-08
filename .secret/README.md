# Secret Files Directory

This directory contains all secret and sensitive files for the JCORP project.

## Files

- `.env` - Environment variables and configuration secrets

## Security

⚠️ **IMPORTANT**: This entire directory is ignored by git (see `.gitignore`).

Never commit secret files to version control. Always use environment variables or secure secret management in production.

## Usage

The Django settings automatically load environment variables from `.secret/.env` using `python-decouple`.

To add new secrets:
1. Add them to `.secret/.env` file
2. Access them in `settings.py` using the `get_env()` helper function

## Example `.env` file structure

```
SECRET_KEY=your-django-secret-key-here
DJANGO_PORT=9444
DJANGO_HOST=0.0.0.0
WALLET_ADDRESS=0x...
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CHAIN_ID=1
PAYMENT_AMOUNT_ETH=0.02
PAYMENT_EXPIRY_HOURS=24
```

