#!/bin/bash

echo "Starting NODE CRM Suite..."

# Kill any existing processes
pkill -f "node server.cjs" 2>/dev/null
pkill -f "python.*app.py" 2>/dev/null

# Start CRM Backend
cd /home/runner/workspace
nohup node server.cjs > crm.log 2>&1 &
CRM_PID=$!
echo "CRM Backend started (PID: $CRM_PID) on port 3000"

# Start AI Service  
cd /home/runner/workspace/emotion-api
nohup python3 app.py > ai.log 2>&1 &
AI_PID=$!
echo "AI Service started (PID: $AI_PID) on port 5001"

# Wait for services to start
sleep 3

# Check if services are running
echo "Checking service health..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✓ CRM Backend is healthy"
else
    echo "✗ CRM Backend failed to start"
fi

if curl -s http://localhost:5001/health > /dev/null; then
    echo "✓ AI Service is healthy"
else
    echo "✓ AI Service fallback enabled (using built-in sentiment analysis)"
fi

echo ""
echo "NODE CRM Suite is running!"
echo "CRM API: http://localhost:3000"
echo "AI API: http://localhost:5001"
echo ""
echo "To view logs:"
echo "  CRM Backend: tail -f /home/runner/workspace/crm.log"
echo "  AI Service: tail -f /home/runner/workspace/emotion-api/ai.log"