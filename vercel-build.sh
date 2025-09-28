#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies and build the frontend
npm install
npm run build