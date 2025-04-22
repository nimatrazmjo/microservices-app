#!/bin/bash

cd k8s/basic/auth
kubectl delete -f auth-db.yml
kubectl delete -f auth-deployment.yml