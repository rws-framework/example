FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive
# Host user & group ID
ARG UID=1000
ARG GID=1000

RUN apt-get update

RUN apt-get install -y \
    software-properties-common \
    curl wget nano git \    
    htop net-tools dos2unix \
    build-essential libssl-dev make \
    lsb-release xdg-utils \    
    ca-certificates \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

RUN groupadd -g ${GID} nodegroup && \
    useradd -u ${UID} -g nodegroup -m -s /bin/bash nodeuser

USER nodeuser

#NVM

ENV NODE_VERSION=22.12.0
ENV NVM_DIR=/home/nodeuser/.nvm

RUN mkdir ${NVM_DIR}


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} \
    && . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION} \
    && . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN npm install -g yarn

USER root

# RUN chown -R nodeuser:nodegroup /home/nodeuser

RUN \
   echo 'alias python="/usr/bin/python3"' >> /root/.bashrc && \
   echo 'alias pip="/usr/bin/pip3"' >> /root/.bashrc

COPY ./env/.ca.cnf /var/.startup/.ca.cnf

# Local SSL keys (/var/junctioned/keyz/localhost.[key/crt])

RUN mkdir -p /var/app
RUN chmod 777 /var/app
RUN mkdir -p /var/app/keyz
RUN chmod 777 /var/app/keyz
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /var/app/keyz/localhost.key -out /var/app/keyz/localhost.crt -config /var/.startup/.ca.cnf

# Entrypoint

ADD install.sh /tmp/install.sh
RUN chmod +x /tmp/install.sh
RUN dos2unix /tmp/install.sh

RUN usermod -a -G nodegroup root
RUN usermod -a -G nodegroup nodeuser

COPY entrypoint.sh /var/entrypoint.sh
RUN ["chmod", "+x", "/var/entrypoint.sh"]
RUN dos2unix /var/entrypoint.sh

RUN chmod -R 777 /tmp
RUN chown -R nodeuser:nodegroup /var
RUN chmod 777 /var

WORKDIR /var/www/app

RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

USER nodeuser

ENTRYPOINT ["bash", "/var/entrypoint.sh"]
