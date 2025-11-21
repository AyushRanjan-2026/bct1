#!/bin/bash

# Medical Policy Automation - Complete Startup Script
# This script starts all services in the correct order

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/ayushranjan/Desktop/bct1"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Medical Policy Automation${NC}"
echo -e "${BLUE}  Complete Startup Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -gt 20 ]; then
    echo -e "${YELLOW}⚠️  Node.js version is $(node --version)${NC}"
    echo -e "${YELLOW}⚠️  Switching to Node.js 20 (required for Veramo)...${NC}"
    
    if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
        if [ -s "$HOME/.nvm/nvm.sh" ]; then
            source "$HOME/.nvm/nvm.sh"
        fi
        nvm install 20 2>/dev/null || true
        nvm use 20
        echo -e "${GREEN}✅ Switched to Node.js $(node --version)${NC}"
    else
        echo -e "${RED}❌ Please install nvm and switch to Node.js 20${NC}"
        echo -e "${YELLOW}Run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}\n"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
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

# Kill existing processes
echo -e "${BLUE}Clearing ports...${NC}"
kill_port 5001  # IPFS
kill_port 8545  # Hardhat
kill_port 3001  # Backend
kill_port 5173  # Frontend
echo -e "${GREEN}✅ Ports cleared${NC}\n"

# Check dependencies
echo -e "${BLUE}Checking dependencies...${NC}"
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    cd "$PROJECT_DIR"
    npm install
fi

if [ ! -d "$PROJECT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$PROJECT_DIR/backend"
    npm install
fi

if [ ! -d "$PROJECT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$PROJECT_DIR/frontend"
    npm install
fi
echo -e "${GREEN}✅ Dependencies checked${NC}\n"

# Start IPFS
if command -v ipfs &> /dev/null; then
    echo -e "${BLUE}Starting IPFS daemon...${NC}"
    ipfs daemon > /tmp/ipfs.log 2>&1 &
    IPFS_PID=$!
    sleep 3
    if ps -p $IPFS_PID > /dev/null; then
        echo -e "${GREEN}✅ IPFS started${NC}"
    else
        echo -e "${YELLOW}⚠️  IPFS may have failed. Check /tmp/ipfs.log${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  IPFS not installed. Skipping...${NC}"
fi

# Start Hardhat Node
echo -e "${BLUE}Starting Hardhat node...${NC}"
cd "$PROJECT_DIR"
npm run node > /tmp/hardhat.log 2>&1 &
HARDHAT_PID=$!
sleep 5
if ps -p $HARDHAT_PID > /dev/null; then
    echo -e "${GREEN}✅ Hardhat node started${NC}"
else
    echo -e "${RED}❌ Hardhat node failed. Check /tmp/hardhat.log${NC}"
    exit 1
fi

# Deploy contracts
echo -e "${BLUE}Deploying contracts...${NC}"
sleep 2
cd "$PROJECT_DIR"
npm run deploy > /tmp/deploy.log 2>&1
if [ -f "$PROJECT_DIR/deployments.json" ]; then
    echo -e "${GREEN}✅ Contracts deployed${NC}"
else
    echo -e "${RED}❌ Contract deployment failed. Check /tmp/deploy.log${NC}"
    exit 1
fi

# Clean backend database
echo -e "${BLUE}Cleaning backend database...${NC}"
cd "$PROJECT_DIR/backend"
rm -f veramo.sqlite veramo.sqlite-journal
echo -e "${GREEN}✅ Database cleaned${NC}"

# Start Backend
echo -e "${BLUE}Starting backend server...${NC}"
cd "$PROJECT_DIR/backend"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 5
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend started${NC}"
    # Test backend
    sleep 2
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✅ Backend is responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend may not be ready yet${NC}"
    fi
else
    echo -e "${RED}❌ Backend failed. Check /tmp/backend.log${NC}"
    exit 1
fi

# Start Frontend
echo -e "${BLUE}Starting frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend started${NC}"
else
    echo -e "${RED}❌ Frontend failed. Check /tmp/frontend.log${NC}"
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

echo -e "${BLUE}Process IDs:${NC}"
[ ! -z "$IPFS_PID" ] && echo -e "  IPFS:    $IPFS_PID"
[ ! -z "$HARDHAT_PID" ] && echo -e "  Hardhat: $HARDHAT_PID"
[ ! -z "$BACKEND_PID" ] && echo -e "  Backend: $BACKEND_PID"
[ ! -z "$FRONTEND_PID" ] && echo -e "  Frontend: $FRONTEND_PID\n"

echo -e "${YELLOW}To stop all services:${NC}"
echo -e "  pkill -f 'ipfs daemon'"
echo -e "  pkill -f 'hardhat node'"
echo -e "  pkill -f 'node.*backend'"
echo -e "  pkill -f 'vite'\n"

echo -e "${BLUE}Opening frontend in browser...${NC}"
sleep 2
open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || echo "Please open http://localhost:5173 in your browser"

echo -e "\n${GREEN}Ready to demo! 🚀${NC}"

