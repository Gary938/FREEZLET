#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}    Webpack Configuration Rebuild${NC}"
echo -e "${CYAN}============================================${NC}"
echo

echo -e "${YELLOW}[1/4] Cleaning webpack cache...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✓ Dist folder cleaned${NC}"
fi
mkdir -p dist
echo -e "${GREEN}✓ Dist folder created${NC}"
echo

echo -e "${YELLOW}[2/4] Building preload script...${NC}"
npx webpack --config webpack.preload.config.cjs
preload_result=$?
echo

echo -e "${YELLOW}[3/4] Building renderer script...${NC}"
npx webpack --config webpack.renderer.config.cjs
renderer_result=$?
echo

echo -e "${YELLOW}[4/4] Checking build result...${NC}"
if [ $preload_result -eq 0 ] && [ $renderer_result -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully!${NC}"
    echo
    echo -e "${BLUE}Build output in ./dist:${NC}"
    ls -la dist/
    echo
    echo -e "${CYAN}Configured aliases:${NC}"
    echo -e "${CYAN}-------------------${NC}"
    echo -e "${CYAN}@UI        - UI Components${NC}"
    echo -e "${CYAN}@Main      - Main Logic${NC}"
    echo -e "${CYAN}@Preload   - Preloader${NC}"
    echo -e "${CYAN}@FileManager - File Manager${NC}"
    echo -e "${CYAN}@CSS       - Styles${NC}"
    echo -e "${CYAN}@Buttons   - Button Components${NC}"
    echo -e "${CYAN}@Renderer  - Renderer${NC}"
    echo -e "${CYAN}@Progress  - Progress${NC}"
else
    echo -e "${RED}✗ Build error!${NC}"
    echo -e "${RED}Check webpack configuration files${NC}"
    echo -e "${RED}Preload build result: $preload_result${NC}"
    echo -e "${RED}Renderer build result: $renderer_result${NC}"
fi

echo
echo -e "${CYAN}============================================${NC}"
echo -e "${YELLOW}Auto-closing in 2 seconds...${NC}"
sleep 2