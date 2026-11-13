@echo off
title Al-Mawsuah Universal App Launcher
echo Installing dependencies if needed...
if not exist "node_modules" (
  call npm install
)
echo Building standalone PWA bundle...
call npm run build
echo Starting official app server on http://localhost:3000 ...
start "" msedge --app=http://localhost:3000 2>nul || start "" chrome --app=http://localhost:3000 2>nul || start "" http://localhost:3000
call npm start
