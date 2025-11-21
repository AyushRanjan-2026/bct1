#!/bin/bash

# Force Node.js 20 for MPA Project

echo "🔧 Setting up Node.js 20 for MPA Project..."

# Check if nvm exists
if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "✅ nvm installed!"
    echo ""
    echo "⚠️  Please restart your terminal or run:"
    echo "   source ~/.zshrc"
    echo ""
    echo "Then run this script again."
    exit 0
fi

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 if not available
if ! nvm list 20 &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    nvm install 20
fi

# Use Node.js 20
echo "🔄 Switching to Node.js 20..."
nvm use 20

# Set as default for this project
echo "20" > /Users/ayushranjan/Desktop/bct1/backend/.nvmrc

# Verify
NODE_VERSION=$(node --version)
echo ""
echo "✅ Node.js version: $NODE_VERSION"
echo ""

if [[ "$NODE_VERSION" == v20* ]]; then
    echo "✅ Successfully switched to Node.js 20!"
    echo ""
    echo "Now run:"
    echo "  cd /Users/ayushranjan/Desktop/bct1/backend"
    echo "  rm -rf node_modules package-lock.json"
    echo "  npm install"
    echo "  npm start"
else
    echo "❌ Error: Still not on Node.js 20. Current version: $NODE_VERSION"
    echo "Please manually run: nvm use 20"
fi

