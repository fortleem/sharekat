#!/bin/bash
echo "Deploying frontend to Vercel..."
cd frontend && vercel --prod
echo "Deploying backend to Render..."
cd ../backend && render deploy
