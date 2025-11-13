# JCORP Project Setup Documentation

## Project Structure

```
JCORP/
├── frontend/          # React application
├── main/              # Django main app
├── config/            # Django project settings
├── static/            # Django static files
├── templates/         # Django templates
├── media/             # Media files
├── start.sh           # Complete startup script (starts both backend and frontend)
└── requirements.txt   # Python dependencies
```

## Port Configuration

### Django Backend
- **Port**: `9441` (explicitly configured)
- **URL**: `http://localhost:9441` or `http://0.0.0.0:9441`
- **Configuration**: Set in `start.sh` script and `config/settings.py`
- **Environment Variables**:
  - `DJANGO_PORT=9441` (explicitly set in start.sh)
  - `DJANGO_HOST=0.0.0.0` (explicitly set in start.sh)
- **Script**: `./start.sh` - Automatically sets port to 9441

### React Frontend
- **Port**: `9444` (configured to avoid conflicts with port 3000)
- **URL**: `http://localhost:9444`
- **Configuration**: Set via `PORT` environment variable in `start.sh`
- **Environment Variables**:
  - `PORT=9444` (explicitly set in start.sh)
  - `REACT_APP_API_URL=http://localhost:9441` (points to Django backend)
- **Script**: `./start.sh` - Automatically sets port to 9444
- **API Base URL**: `http://localhost:9441` (configured in `frontend/src/pages/Payment.jsx`)

## Virtual Environment

- **Location**: `~/.virtualenvs/jcorp`
- **Activation**: `source ~/.virtualenvs/jcorp/bin/activate`
- **Usage**: Used for Django Python dependencies

## Startup Scripts

### Single Startup Script (Recommended)

#### Using start.sh - Starts Both Backend and Frontend
```bash
cd /home/jevon/DEV/JCORP/JCORP
chmod +x start.sh
./start.sh
```

This single script will:
- **Start Django Backend** on port `9441` (http://0.0.0.0:9441)
- **Start React Frontend** on port `9444` (http://localhost:9444)
- **Automatically sets** all required environment variables:
  - `DJANGO_PORT=9441`
  - `DJANGO_HOST=0.0.0.0`
  - `PORT=9444`
  - `REACT_APP_API_URL=http://localhost:9441`
- **Activates virtual environment** if available at `~/.virtualenvs/jcorp`
- **Runs both servers in background** with proper cleanup on exit
- **Displays** clear port and URL information for both servers
- **Handles cleanup** - Press Ctrl+C to stop both servers gracefully
- **Monitors processes** - Automatically detects if servers stop unexpectedly

**Logs:**
- Backend logs: `tail -f /tmp/jcorp_backend.log`
- Frontend logs: `tail -f /tmp/jcorp_frontend.log`

### Manual Startup (Alternative)

If you need to run servers separately:

#### Django Backend Only
```bash
cd /home/jevon/DEV/JCORP/JCORP
source ~/.virtualenvs/jcorp/bin/activate
export DJANGO_PORT=9441
export DJANGO_HOST=0.0.0.0
python manage.py runserver ${DJANGO_HOST}:${DJANGO_PORT}
```

#### React Frontend Only
```bash
cd /home/jevon/DEV/JCORP/JCORP/frontend
export PORT=9444
export REACT_APP_API_URL=http://localhost:9441
PORT=${PORT} npm run dev
```

## Environment Variables

All environment variables are loaded from `.secret/.env` using `python-decouple`. The `.secret/` directory is automatically ignored by git.

### Django Settings (config/settings.py)
Environment variables are loaded from `.secret/.env`:
```python
# Server Configuration
SERVER_PORT = int(get_env('DJANGO_PORT', 9441))
SERVER_HOST = get_env('DJANGO_HOST', '0.0.0.0')

# Web3 Payment Configuration
WALLET_ADDRESS = get_env('WALLET_ADDRESS', '0x0000000000000000000000000000000000000000')
RPC_URL = get_env('RPC_URL', 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID')
CHAIN_ID = int(get_env('CHAIN_ID', 1))
PAYMENT_AMOUNT_ETH = float(get_env('PAYMENT_AMOUNT_ETH', 0.02))
PAYMENT_EXPIRY_HOURS = int(get_env('PAYMENT_EXPIRY_HOURS', 24))

# Django Secret Key
SECRET_KEY = get_env('SECRET_KEY', default='...')
```

### Creating `.secret/.env` File
Create `.secret/.env` with your configuration:
```bash
# Django Configuration
SECRET_KEY=your-django-secret-key-here
DJANGO_PORT=9441
DJANGO_HOST=0.0.0.0

# Web3 Payment Configuration
WALLET_ADDRESS=0x...
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CHAIN_ID=1
PAYMENT_AMOUNT_ETH=0.02
PAYMENT_EXPIRY_HOURS=24
```

### React Configuration
- **API Base URL**: `http://localhost:9441` (configured via `REACT_APP_API_URL` environment variable)
- **Port**: `9444` (configured via `PORT` environment variable in `start.sh`)

## Dependencies

### Python (Django)
```bash
cd /home/jevon/DEV/JCORP/JCORP
source ~/.virtualenvs/jcorp/bin/activate
pip install -r requirements.txt
```

Key packages:
- Django==5.2.7
- python-decouple==3.8
- web3==6.15.1
- eth-account==0.10.0

### Node.js (React)
```bash
cd /home/jevon/DEV/JCORP/JCORP/frontend
npm install
```

Key packages:
- react==19.2.0
- react-dom==19.2.0
- react-scripts==5.0.1
- @react-three/fiber==9.4.0
- @react-three/drei==10.7.6
- ethers==6.15.0
- three==0.181.0

## API Endpoints

### Django Backend (Port 9441)
- **Home**: `http://localhost:9441/`
- **API Payment Info**: `http://localhost:9441/api/payment/info/`
- **API Payment Verify**: `http://localhost:9441/api/payment/verify/`
- **API Download**: `http://localhost:9441/api/download/<token>/`
- **Admin**: `http://localhost:9441/admin/`

### React Frontend (Port 9444)
- **App**: `http://localhost:9444/`
- **Connects to**: `http://localhost:9441` (Django API)

## Development Workflow

1. **Start Both Servers** (single command):
   ```bash
   cd /home/jevon/DEV/JCORP/JCORP
   ./start.sh
   ```

2. **Access**:
   - React App: `http://localhost:9444`
   - Django API: `http://localhost:9441`
   - Django Admin: `http://localhost:9441/admin`

3. **Stop Servers**: Press `Ctrl+C` in the terminal running `start.sh`

## Important Notes

- **Virtual Environment**: Always use `~/.virtualenvs/jcorp` for Django
- **Ports**: Django on 9441, React on 9444
- **React Dev Server**: Runs on port 9444 (configured via PORT environment variable in start.sh)
- **Django Port**: Configured via environment variables, defaults to 9441
- **API Communication**: React frontend connects to Django backend on port 9441

## Script Locations

- **Complete Startup**: `/home/jevon/DEV/JCORP/JCORP/start.sh` (starts both backend and frontend)

## Troubleshooting

### Django not starting on 9441
- Check if port is already in use: `lsof -i :9441`
- Verify environment variables are set correctly
- Check `config/settings.py` for port configuration

### React not starting on 9444
- Check if port is already in use: `lsof -i :9444`
- Verify `PORT=9444` is set in `start.sh`
- Verify `package.json` scripts are correct
- Check logs: `tail -f /tmp/jcorp_frontend.log`

### React can't connect to Django API
- Verify Django is running on port 9441
- Check `REACT_APP_API_URL` environment variable is set to `http://localhost:9441`
- Check CORS settings in Django if needed

## Last Updated
- Date: 2025-11-08
- Setup: Django on 9441, React on 9444
- Virtual Environment: ~/.virtualenvs/jcorp

