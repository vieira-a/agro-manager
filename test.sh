#!/bin/bash

URL="http://localhost:3000/api/v1/health"
TOTAL_REQUESTS=15
DELAY=1  # segundos entre requisições

echo "Enviando $TOTAL_REQUESTS requisições para $URL com intervalo de $DELAY segundos..."

for i in $(seq 1 $TOTAL_REQUESTS); do
  echo -n "[$i] "
  curl -s -o /dev/null -w "%{http_code}\n" $URL
  sleep $DELAY
done
