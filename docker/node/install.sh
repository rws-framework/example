if [ ! -f /var/www/app/node_modules/.node_install_done ]; then
  cd /var/www/app

  npm install -g yarn
  npm install -g typescript
  yarn -W add global typescript

  ${NODE_PACKAGER_CMD:-yarn}  

  touch /var/www/app/node_modules/.node_install_done
fi
