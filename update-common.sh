#!/bin/bash

# Define the package name you want to update
PACKAGE_NAME="@raypan2022-tickets/common"

# List of directories to update
DIRECTORIES=(
  "auth"
  "client"
  "expiration"
  "orders"
  "tickets"
  "payments"
)

# Update the npm package in common
cd common
npm run pub
cd ..

# Loop through the specified directories
for dir in "${DIRECTORIES[@]}"; do
  if [ -d "$dir" ]; then
    echo "Updating $PACKAGE_NAME in $dir"
    cd "$dir" || exit
    if [ -f package.json ]; then
      npm install "$PACKAGE_NAME@latest"
    else
      echo "No package.json found in $dir, skipping."
    fi
    cd - || exit
  else
    echo "Directory $dir does not exist, skipping."
  fi
done