#!/bin/bash

echo "🚀 Starting Stormer API Testing Platform..."
echo ""

# Kill any existing processes
echo "📦 Cleaning up old processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

sleep 1

# Start backend
echo "🔧 Starting backend server on port 5001..."
cd "$(dirname "$0")"
PORT=5001 node server/index.js &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Stormer is running!"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
