#!/bin/bash
export NVM_DIR="/home/nodeuser/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

sh /tmp/install.sh

cd /var/www/app

STOP_NODE_EXEC=${STOP_NODE_EXEC:-"0"}
FRONT_WATCH=${FRONT_WATCH:-"0"}

if [ "$STOP_NODE_EXEC" != "1" ]; then
    echo "[DOCKER] START SERVER EXECUTION" 
    if [ "$DEV" = "1" ]; then  
        echo "[DOCKER] BACKEND DEV WATCH STARTED BY \$DEV=1 & \$STOP_NODE_EXEC=0" 
    
        cd /var/www/app/frontend

        if [ "$FRONT_WATCH" = "1" ]; then  
            yarn watch &                         
        fi    

        cd /var/www/app/backend
        if [ "$FRONT_WATCH" = "1" ]; then  
            yarn dev
        fi    
    else
        echo "[DOCKER] BUILD & RUN STARTED BY \$DEV=0 & \$STOP_NODE_EXEC=0" 
        cd /var/www/app/frontend
        yarn build
        cd /var/www/app/backend
        yarn build
        yarn server
        echo "[NODE SERVER] Server started on ws port: <$WS_PORT> and http port: <$PORT>"
    fi    
else
    echo "[DOCKER] SERVER EXECUTION STOPPED BY \$STOP_NODE_EXEC=1"
fi

while true; do sleep 5 ; done;
