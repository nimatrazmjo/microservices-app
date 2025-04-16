#!/bin/bash

set -e

echo "🧹 Deleting RabbitMQ cluster and services..."

kubectl delete rabbitmqcluster my-rabbit --ignore-not-found
kubectl delete svc my-rabbit my-rabbit-amqp my-rabbit-ui my-rabbit-nodes --ignore-not-found

echo "❓ Do you also want to remove the RabbitMQ Cluster Operator? (y/n)"
read -r ANSWER

if [[ "$ANSWER" == "y" || "$ANSWER" == "Y" ]]; then
  echo "🧼 Deleting RabbitMQ Cluster Operator..."
  kubectl delete -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml --ignore-not-found
  kubectl delete namespace rabbitmq-system --ignore-not-found
fi

echo "✅ Cleanup complete."
