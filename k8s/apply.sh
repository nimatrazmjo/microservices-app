#!/bin/bash

# auth service
cd ~/microservice-app/auth-service
docker build -t auth-service:dev -f Dockerfile.dev . ~/microservice-app/auth-service

#deploy auth service
cd ~/microservice-app/k8s/basic/auth
kubectl apply -f auth-deployment.yml

echo "✅ Auth service deployed successfully! Access via:"
kubectl get svc auth-service