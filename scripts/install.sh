#!/bin/bash

echo "Installing backend dependencies..."
cd ../backend
npm i

echo "Installing frontend dependencies..."
cd ../frontend
npm i

echo "Installing seed dependencies..."
cd ../scripts/seed
npm i
