#!/bin/bash

echo "========================================"
echo "Restaurant Management System Startup"
echo "========================================"
echo

echo "Starting Backend Server (Spring Boot)..."
echo "Backend will be available at: http://localhost:8084"
echo

# Start backend in background
cd "$(dirname "$0")"
(mvn spring-boot:run > backend.log 2>&1) &
BACKEND_PID=$!

echo "Waiting 10 seconds for backend to initialize..."
sleep 10

echo
echo "Starting Frontend Server (React)..."
echo "Frontend will be available at: http://localhost:5173"
echo

# Start frontend in background
cd frontend
(npm run dev > ../frontend.log 2>&1) &
FRONTEND_PID=$!

echo
echo "========================================"
echo "Both servers are running!"
echo "========================================"
echo
echo "Backend: http://localhost:8084 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo
echo "Logs:"
echo "Backend: backend.log"
echo "Frontend: frontend.log"
echo
echo "To stop servers:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo

# Keep script running
echo "Press Ctrl+C to stop all servers..."
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait