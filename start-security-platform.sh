#!/bin/bash

echo "🔐 Starting ARGILETTE Security Platform..."
echo "📍 Platform will be available at: http://localhost:8001"
echo "🎯 Dashboard URL: http://localhost:8001/"
echo ""
echo "Features available:"
echo "✅ User behavior tracking & monitoring"
echo "✅ Keystroke speed analysis" 
echo "✅ Mouse pattern recognition"
echo "✅ Sentiment scoring"
echo "✅ Risk assessment algorithms"
echo "✅ Security alerts & notifications"
echo "✅ Real-time analytics dashboard"
echo ""

# Navigate to security API directory
cd security-api

# Start the FastAPI server
python3 main.py