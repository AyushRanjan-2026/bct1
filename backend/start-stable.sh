#!/bin/bash

# Stable backend startup script

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -gt 20 ]; then
    echo "⚠️  Warning: Node.js version is $(node --version)"
    echo "⚠️  Veramo requires Node.js 18-20. Switching to Node.js 20..."
    if command -v nvm &> /dev/null; then
        source ~/.nvm/nvm.sh 2>/dev/null || true
        nvm use 20 2>/dev/null || nvm install 20
    fi
fi

# Change to backend directory
cd "$(dirname "$0")"

# Clean old database if it's corrupted
if [ -f "veramo.sqlite-journal" ]; then
    echo "🧹 Cleaning old database journal..."
    rm -f veramo.sqlite-journal
fi

# Start server
echo "🚀 Starting backend server..."
node server.js

