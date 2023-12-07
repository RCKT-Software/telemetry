#!/bin/bash

# Fetch the version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build for ARM architecture
echo "Building for ARM..."
npm run build && electron-forge make
ARM_ZIP="out/make/zip/darwin/arm64/Telemetry-darwin-arm64-${VERSION}.zip"
ARM_DMG="out/make/Telemetry.dmg"

if [ -f "${ARM_ZIP}" ]; then
    mv "${ARM_ZIP}" "out/make/Telemetry-mac-arm-${VERSION}.zip"
    echo "Renamed ZIP for ARM."
fi

if [ -f "${ARM_DMG}" ]; then
    mv "${ARM_DMG}" "out/make/Telemetry-mac-arm-${VERSION}.dmg"
    echo "Renamed DMG for ARM."
fi

# Build for x64 architecture
echo "Building for x64..."
npm run build && electron-forge make --arch=x64 --platform=darwin
X64_ZIP="out/make/zip/darwin/x64/Telemetry-darwin-x64-${VERSION}.zip"
X64_DMG="out/make/Telemetry.dmg"

if [ -f "${X64_ZIP}" ]; then
    mv "${X64_ZIP}" "out/make/Telemetry-mac-x64-${VERSION}.zip"
    echo "Renamed ZIP for x64."
fi

if [ -f "${X64_DMG}" ]; then
    mv "${X64_DMG}" "out/make/Telemetry-mac-x64-${VERSION}.dmg"
    echo "Renamed DMG for x64."
fi
