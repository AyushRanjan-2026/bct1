#!/bin/bash

# Backend startup script with Node.js version check

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    # Try to source nvm if it exists
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
    else
        echo "❌ Error: nvm (Node Version Manager) is not installed."
        echo ""
        echo "Please install nvm first:"
        echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "  source ~/.zshrc"
        echo ""
        exit 1
    fi
fi

# Check current Node version
CURRENT_NODE=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)

if [ -z "$CURRENT_NODE" ] || [ "$CURRENT_NODE" -gt 20 ]; then
    echo "⚠️  Current Node.js version: $(node --version 2>/dev/null || echo 'unknown')"
    echo "📦 Switching to Node.js 20 (required for Veramo compatibility)..."
    
    # Install Node 20 if not available
    if ! nvm list 20 &> /dev/null; then
        echo "Installing Node.js 20..."
        nvm install 20
    fi
    
    # Use Node 20
    nvm use 20
    
    echo "✅ Switched to Node.js $(node --version)"
fi

# Verify we're on the right version
NODE_VERSION=$(node --version)
echo "🚀 Starting backend with Node.js $NODE_VERSION"

# Start the server
npm start

