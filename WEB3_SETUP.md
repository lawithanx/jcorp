# Web3 Payment Integration Setup Guide

## Overview
This Django + Three.js site now supports Web3 crypto payments. Users can pay in ETH directly from their MetaMask wallet to purchase and download the 3D business card.

## Features Implemented

### Frontend
- ✅ "Buy Business Card" button with payment amount display
- ✅ MetaMask wallet connection
- ✅ Transaction sending via MetaMask
- ✅ Real-time payment status updates
- ✅ Automatic polling for transaction confirmations
- ✅ Download button appears after payment confirmation

### Backend
- ✅ Payment model for tracking transactions
- ✅ Web3.py integration for blockchain verification
- ✅ API endpoints for payment verification
- ✅ Transaction verification (address, amount, confirmations)
- ✅ Secure download token generation
- ✅ Payment logging and admin interface

## Setup Instructions

### 1. Install Dependencies
```bash
cd /home/jevon/DEV/JCORP/JCORP
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.secret/.env` file or set environment variables:

```bash
# Create .secret directory if it doesn't exist
mkdir -p .secret

# Add to .secret/.env file:
# Wallet Configuration
WALLET_ADDRESS=0xYourWalletAddressHere
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
# OR use Alchemy: https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY

# Network Configuration
CHAIN_ID=1  # 1 for Ethereum mainnet, 5 for Goerli testnet

# Payment Configuration
PAYMENT_AMOUNT_ETH=0.02  # Amount in ETH (default: 0.02)
PAYMENT_EXPIRY_HOURS=24  # Download link validity (default: 24 hours)

# Django Secret Key
SECRET_KEY=your-django-secret-key-here
```

**Note**: The `.secret/` directory is automatically ignored by git. All secret files should be placed in `.secret/`.

### 3. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Get RPC Provider Access

#### Option A: Infura (Recommended)
1. Go to https://infura.io/
2. Create an account
3. Create a new project
4. Copy your Project ID
5. Add `RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID` to `.secret/.env`

#### Option B: Alchemy
1. Go to https://www.alchemy.com/
2. Create an account
3. Create a new app
4. Copy your API Key
5. Add `RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY` to `.secret/.env`

### 5. Test Network Setup (Optional)
For testing, use Goerli testnet. Add to `.secret/.env`:
```bash
CHAIN_ID=5
RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
PAYMENT_AMOUNT_ETH=0.001  # Lower amount for testing
```

### 6. Start the Server
```bash
python manage.py runserver
```

## Usage Flow

1. **User clicks "Buy Business Card"**
   - MetaMask opens (if installed)
   - User connects wallet
   - Payment amount is displayed

2. **User confirms payment**
   - Transaction is sent to blockchain
   - Transaction hash is captured
   - Frontend polls for confirmations

3. **Backend verification**
   - Django receives transaction hash
   - Web3.py verifies transaction on-chain
   - Checks: recipient address, amount, confirmations (min 3)
   - Generates secure download token

4. **Download enabled**
   - Download button appears after confirmation
   - User can download business card
   - Download link expires after configured hours

## API Endpoints

### GET `/api/payment/info/`
Returns payment configuration:
```json
{
  "success": true,
  "wallet_address": "0x...",
  "amount_eth": 0.02,
  "chain_id": 1,
  "network": "Ethereum Mainnet"
}
```

### POST `/api/payment/verify/`
Verifies a blockchain transaction:
```json
{
  "transaction_hash": "0x...",
  "from_address": "0x..."
}
```

Response (success):
```json
{
  "success": true,
  "status": "confirmed",
  "confirmations": 3,
  "download_token": "...",
  "download_url": "/api/download/.../",
  "message": "Payment verified successfully"
}
```

Response (processing):
```json
{
  "success": false,
  "status": "processing",
  "confirmations": 1,
  "required_confirmations": 3,
  "message": "Waiting for confirmations (1/3)"
}
```

### GET `/api/download/<token>/`
Downloads business card after payment verification.

## Admin Interface

Access payment records at `/admin/main/payment/`:
- View all transactions
- See payment status and confirmations
- Monitor download tokens
- Filter by status, network, date

## Security Considerations

1. **Environment Variables**: All secrets are stored in `.secret/.env` which is automatically ignored by git. Never commit wallet addresses or RPC keys to git.
2. **Download Tokens**: Tokens expire after configured hours
3. **Transaction Verification**: All transactions verified on-chain
4. **CSRF Protection**: API endpoints use CSRF tokens
5. **Address Validation**: All addresses normalized and validated

## Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed
- Check browser console for errors
- Try refreshing the page

### Transaction Verification Fails
- Check RPC URL is correct and accessible
- Verify wallet address matches configuration
- Check transaction is on correct network (mainnet/testnet)
- Ensure sufficient confirmations (minimum 3)

### Payment Status Stuck
- Check backend logs for errors
- Verify Web3.py can connect to RPC
- Check transaction exists on blockchain explorer

## Future Enhancements

- [ ] Celery background tasks for confirmation polling
- [ ] Support for multiple cryptocurrencies (USDC, DAI)
- [ ] Email notifications on payment confirmation
- [ ] Payment history for users
- [ ] Refund functionality
- [ ] Coinbase Commerce integration (alternative)

## Testing

1. Use Goerli testnet for testing
2. Get test ETH from faucet: https://goerlifaucet.com/
3. Test wallet connection
4. Test payment flow
5. Verify transaction on Etherscan (Goerli)

## Support

For issues or questions:
- Check Django logs: `python manage.py runserver --verbosity 2`
- Check browser console for frontend errors
- Verify RPC connection: Test with `curl` or Postman

