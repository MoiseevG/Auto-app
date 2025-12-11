#!/bin/bash
# Start both backend and frontend for local development

echo "🚀 Starting backend..."
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 2

cd ..

echo "🚀 Building React app..."
npm run build

echo "🚀 Starting frontend server..."
BACKEND_URL=http://localhost:8000 node server.js &
FRONTEND_PID=$!

echo "✅ Both services running!"
echo "   Frontend: http://localhost:5000"
echo "   Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait
