#!/bin/bash

# JCORP Complete Startup Script
# Starts both Django Backend (Port 9444) and React Frontend (Port 3001)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
PROJECT_DIR="/home/jevon/DEV/JCORP/JCORP"
FRONTEND_DIR="${PROJECT_DIR}/frontend"

# Port configuration
DJANGO_PORT=9444
DJANGO_HOST=0.0.0.0
FRONTEND_PORT=3001

# PID files for cleanup
BACKEND_PID_FILE="${PROJECT_DIR}/.backend.pid"
FRONTEND_PID_FILE="${PROJECT_DIR}/.frontend.pid"

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        BACKEND_PID=$(cat "$BACKEND_PID_FILE")
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping Django backend (PID: $BACKEND_PID)...${NC}"
            kill $BACKEND_PID 2>/dev/null
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping React frontend (PID: $FRONTEND_PID)...${NC}"
            kill $FRONTEND_PID 2>/dev/null
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # Kill any remaining processes
    pkill -f "manage.py runserver" 2>/dev/null
    pkill -f "react-scripts start" 2>/dev/null
    
    echo -e "${GREEN}Cleanup complete.${NC}"
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Activate virtual environment if it exists
if [ -f ~/.virtualenvs/jcorp/bin/activate ]; then
    echo -e "${BLUE}Activating virtual environment...${NC}"
    source ~/.virtualenvs/jcorp/bin/activate
fi

# Set Django environment variables
export DJANGO_PORT=$DJANGO_PORT
export DJANGO_HOST=$DJANGO_HOST

# Set React environment variables
export PORT=$FRONTEND_PORT
export REACT_APP_API_URL="http://localhost:${DJANGO_PORT}"

echo -e "${GREEN}=========================================="
echo -e "JCORP Project Startup"
echo -e "==========================================${NC}"
echo -e "${BLUE}Backend:${NC}  Django on port ${GREEN}${DJANGO_PORT}${NC}"
echo -e "${BLUE}Frontend:${NC} React on port ${GREEN}${FRONTEND_PORT}${NC}"
echo -e "${BLUE}Backend URL:${NC}  http://${DJANGO_HOST}:${DJANGO_PORT}"
echo -e "${BLUE}Frontend URL:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "${GREEN}==========================================${NC}\n"

# Start Django Backend
echo -e "${BLUE}Starting Django backend server...${NC}"
cd "$PROJECT_DIR"
python manage.py runserver ${DJANGO_HOST}:${DJANGO_PORT} > /tmp/jcorp_backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$BACKEND_PID_FILE"
echo -e "${GREEN}✓ Django backend started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to initialize
sleep 2

# Start React Frontend
echo -e "${BLUE}Starting React frontend server...${NC}"
cd "$FRONTEND_DIR"
PORT=${FRONTEND_PORT} npm run dev > /tmp/jcorp_frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$FRONTEND_PID_FILE"
echo -e "${GREEN}✓ React frontend started (PID: $FRONTEND_PID)${NC}"

echo -e "\n${GREEN}=========================================="
echo -e "Both servers are running!"
echo -e "==========================================${NC}"
echo -e "${BLUE}Backend logs:${NC}  tail -f /tmp/jcorp_backend.log"
echo -e "${BLUE}Frontend logs:${NC} tail -f /tmp/jcorp_frontend.log"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Keep script running and wait for background processes
while true; do
    # Check if backend is still running
    if [ -f "$BACKEND_PID_FILE" ]; then
        BACKEND_PID=$(cat "$BACKEND_PID_FILE")
        if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "${RED}Backend process stopped unexpectedly${NC}"
            cleanup
            exit 1
        fi
    fi
    
    # Check if frontend is still running
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "${RED}Frontend process stopped unexpectedly${NC}"
            cleanup
            exit 1
        fi
    fi
    
    sleep 2
done
