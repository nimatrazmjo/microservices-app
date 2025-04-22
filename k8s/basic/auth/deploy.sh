#!/bin/bash

# Navigate to the frontend directory (assuming this script is run from k8s/basic/frontend)
cd ../../..
pwd

# build the Docker image for authentication
echo "Building Docker image for auth..."
docker build -t auth:dev -f ./auth-service/Dockerfile.dev ./auth-service/

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Apply the auth db
echo "Applying auth db..."
kubectl apply -f k8s/basic/auth/auth-db.yml

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo "❌ kubectl apply failed"
    exit 1
fi


# Apply the auth deployment
echo "Applying auth deployment..."
kubectl apply -f k8s/basic/auth/auth-deployment.yml

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo "❌ kubectl apply failed"
    exit 1
fi
