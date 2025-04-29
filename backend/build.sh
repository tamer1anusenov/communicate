#!/bin/bash

# Remove old build
rm -rf dist

# Build TypeScript
npm run build

# Copy .env file to dist
cp .env dist/

echo "Build completed successfully!" 