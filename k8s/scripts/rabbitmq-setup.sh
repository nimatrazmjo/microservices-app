
#!/bin/bash

set -e

echo "🔧 Installing RabbitMQ Cluster Operator..."

kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml

echo "⏳ Waiting for operator pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=rabbitmq-cluster-operator -n rabbitmq-system --timeout=180s

echo "✅ Operator is ready."

echo "📦 Creating RabbitMQ cluster..."

kubectl apply -f - <<EOF
apiVersion: rabbitmq.com/v1beta1
kind: RabbitmqCluster
metadata:
  name: my-rabbit
  namespace: default
spec:
  replicas: 1
EOF

echo "⏳ Waiting for RabbitMQ pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=my-rabbit --timeout=180s

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
echo "🔐 Default credentials: guest / guest"
echo "🌐 Management UI:     http://localhost:${UI_PORT}"
echo "📡 AMQP connection:   amqp://localhost:${AMQP_PORT}"
echo "------------------------------------------"
