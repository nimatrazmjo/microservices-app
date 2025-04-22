#!/bin/bash

set -e

echo "🔧 Installing RabbitMQ Cluster Operator..."

kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml

echo "⏳ Waiting for operator pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=rabbitmq-cluster-operator -n rabbitmq-system --timeout=180s

echo "✅ Operator is ready."

echo "📦 Creating RabbitMQ cluster with guest credentials..."

kubectl apply -f - <<EOF
apiVersion: rabbitmq.com/v1beta1
kind: RabbitmqCluster
metadata:
  name: my-rabbit
  namespace: default
spec:
  replicas: 1
  rabbitmq:
    additionalConfig: |
      default_user = guest
      default_pass = guest
      loopback_users.guest = false
EOF

echo "⏳ Waiting for RabbitMQ pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=my-rabbit --timeout=180s

echo "🔐 Configuring guest user access..."
kubectl exec my-rabbit-server-0 -- rabbitmqctl set_permissions -p / guest ".*" ".*" ".*"

echo "🔄 Cleaning up old services if they exist..."
kubectl delete svc my-rabbit-ui my-rabbit-amqp --ignore-not-found

echo "🌐 Exposing RabbitMQ UI and AMQP using NodePort..."

kubectl expose service my-rabbit \
  --port=5672 \
  --target-port=5672 \
  --name=my-rabbit-amqp \
  --type=NodePort

kubectl expose service my-rabbit \
  --port=15672 \
  --target-port=15672 \
  --name=my-rabbit-ui \
  --type=NodePort

sleep 3

AMQP_PORT=$(kubectl get svc my-rabbit-amqp -o=jsonpath='{.spec.ports[0].nodePort}')
UI_PORT=$(kubectl get svc my-rabbit-ui -o=jsonpath='{.spec.ports[0].nodePort}')

echo ""
echo "✅ RabbitMQ cluster is up and running!"
echo "------------------------------------------"
echo "⚠️ WARNING: Using default credentials - UNSAFE FOR PRODUCTION ⚠️"
echo "🔐 Credentials: guest / guest"
echo "🌐 Management UI:     http://localhost:${UI_PORT}"
echo "📡 AMQP connection:   amqp://localhost:${AMQP_PORT}"
echo "------------------------------------------"
echo "💡 Production recommendations:"
echo "1. Change password immediately:"
echo "   kubectl exec my-rabbit-server-0 -- rabbitmqctl change_password guest 'new-password'"
echo "2. Better alternative: Create dedicated admin user and remove guest:"
echo "   kubectl exec my-rabbit-server-0 -- rabbitmqctl add_user admin securepassword"
echo "   kubectl exec my-rabbit-server-0 -- rabbitmqctl set_user_tags admin administrator"
echo "   kubectl exec my-rabbit-server-0 -- rabbitmqctl delete_user guest"