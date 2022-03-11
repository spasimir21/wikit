#!/bin/bash

cd ../backend

echo "Building auth..."
npm run build auth

echo "Building data..."
npm run build data

echo "Building rating..."
npm run build rating

echo "Building search..."
npm run build search

cd ../frontend

echo "Building frontend..."
npm run build
