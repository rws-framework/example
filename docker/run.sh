#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide an argument"
    exit 1
fi

docker-compose exec node_dev_rwsexample bash -c "cd /var/www/app/backend && yarn $1"