#!/bin/bash
set -euo pipefail

# 1. Delete all resources EXCEPT PVCs/PVs
kubectl delete all,ingresses,secrets,configmaps --all --ignore-not-found

# 2. Force-delete stuck PVCs
for pvc in $(kubectl get pvc -o name); do
    kubectl patch $pvc -p '{"metadata":{"finalizers":null}}' || true
    kubectl delete $pvc --force --grace-period=0 || true
done

# 3. Delete PVs (if not in use)
for pv in $(kubectl get pv -o name); do
    kubectl patch $pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}' || true
    kubectl delete $pv --force --grace-period=0 || true
done

echo "Cleanup complete!"