@echo off

echo Installing backend dependencies...
cd ../backend
call npm i

echo Installing frontend dependencies...
cd ../frontend
call npm i

echo Installing seed dependencies...
cd ../scripts/seed
call npm i
