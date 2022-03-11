@echo off

cd ../backend

echo Building auth...
call npm run build auth

echo Building data...
call npm run build data

echo Building rating...
call npm run build rating

echo Building search...
call npm run build search

cd ../frontend

echo Building frontend...
call npm run build
