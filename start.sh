#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

echo "============================================"
echo "    Quiz Application Startup Script"
echo "============================================"
echo

echo "Starting application..."
echo "Setting up environment..."

# Set environment variables for colored output
export FORCE_COLOR=1
export NODE_ENV=development

# Remove ELECTRON_RUN_AS_NODE (set by VSCode/Claude Code)
# This variable prevents Electron from running as a GUI application
unset ELECTRON_RUN_AS_NODE

# Set DISPLAY if not set (for running from Claude Code)
export DISPLAY="${DISPLAY:-:1}"

# Start the application
npm start

echo
echo "Application finished."
echo "============================================"
