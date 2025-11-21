#!/bin/bash

# Medical Policy Automation - Startup Script
# This script starts all required services for the MPA project

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/ayushranjan/Desktop/bct1"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Medical Policy Automation Startup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}Port $1 is in use. Killing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

if ! command -v ipfs &> /dev/null; then
    echo -e "${YELLOW}Warning: IPFS is not installed. Install with: brew install ipfs${NC}"
    echo -e "${YELLOW}Continuing without IPFS...${NC}"
    IPFS_AVAILABLE=false
else
    IPFS_AVAILABLE=true
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}\n"

# Install dependencies if needed
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo -e "${BLUE}Installing root dependencies...${NC}"
    cd "$PROJECT_DIR"
    npm install
fi

if [ ! -d "$PROJECT_DIR/backend/node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd "$PROJECT_DIR/backend"
    npm install
fi

if [ ! -d "$PROJECT_DIR/frontend/node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd "$PROJECT_DIR/frontend"
    npm install
fi

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Kill existing processes on required ports
echo -e "${BLUE}Clearing ports...${NC}"
kill_port 5001  # IPFS
kill_port 8545  # Hardhat
kill_port 3001  # Backend
kill_port 5173  # Frontend
echo -e "${GREEN}✓ Ports cleared${NC}\n"

# Start IPFS
if [ "$IPFS_AVAILABLE" = true ]; then
    echo -e "${BLUE}Starting IPFS daemon...${NC}"
    ipfs daemon > /tmp/ipfs.log 2>&1 &
    IPFS_PID=$!
    sleep 3
    if ps -p $IPFS_PID > /dev/null; then
        echo -e "${GREEN}✓ IPFS started (PID: $IPFS_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ IPFS may have failed to start. Check /tmp/ipfs.log${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Skipping IPFS (not installed)${NC}"
fi

# Start Hardhat Node
echo -e "${BLUE}Starting Hardhat node...${NC}"
cd "$PROJECT_DIR"
npm run node > /tmp/hardhat.log 2>&1 &
HARDHAT_PID=$!
sleep 5
if ps -p $HARDHAT_PID > /dev/null; then
    echo -e "${GREEN}✓ Hardhat node started (PID: $HARDHAT_PID)${NC}"
else
    echo -e "${RED}✗ Hardhat node failed to start. Check /tmp/hardhat.log${NC}"
    exit 1
fi

# Deploy contracts
echo -e "${BLUE}Deploying contracts...${NC}"
sleep 2
cd "$PROJECT_DIR"
npm run deploy
if [ -f "$PROJECT_DIR/deployments.json" ]; then
    echo -e "${GREEN}✓ Contracts deployed${NC}"
else
    echo -e "${RED}✗ Contract deployment failed${NC}"
    exit 1
fi

# Start Backend
echo -e "${BLUE}Starting backend server...${NC}"
cd "$PROJECT_DIR/backend"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    # Test backend
    sleep 2
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✓ Backend is responding${NC}"
    else
        echo -e "${YELLOW}⚠ Backend may not be ready yet${NC}"
    fi
else
    echo -e "${RED}✗ Backend failed to start. Check /tmp/backend.log${NC}"
    exit 1
fi

# Start Frontend
echo -e "${BLUE}Starting frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}✗ Frontend failed to start. Check /tmp/frontend.log${NC}"
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  All services started successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Services:${NC}"
echo -e "  ${GREEN}✓${NC} IPFS:        http://127.0.0.1:5001"
echo -e "  ${GREEN}✓${NC} Hardhat:     http://127.0.0.1:8545"
echo -e "  ${GREEN}✓${NC} Backend:     http://localhost:3001"
echo -e "  ${GREEN}✓${NC} Frontend:    http://localhost:5173\n"

echo -e "${BLUE}Process IDs (for stopping):${NC}"
[ ! -z "$IPFS_PID" ] && echo -e "  IPFS:    $IPFS_PID"
[ ! -z "$HARDHAT_PID" ] && echo -e "  Hardhat: $HARDHAT_PID"
[ ! -z "$BACKEND_PID" ] && echo -e "  Backend: $BACKEND_PID"
[ ! -z "$FRONTEND_PID" ] && echo -e "  Frontend: $FRONTEND_PID\n"

echo -e "${YELLOW}To stop all services, run:${NC}"
echo -e "  pkill -f 'ipfs daemon'"
echo -e "  pkill -f 'hardhat node'"
echo -e "  pkill -f 'node.*backend'"
echo -e "  pkill -f 'vite'\n"

echo -e "${BLUE}Opening frontend in browser...${NC}"
sleep 2
open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || echo "Please open http://localhost:5173 in your browser"

echo -e "\n${GREEN}Ready to demo! 🚀${NC}"

