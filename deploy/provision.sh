#!/bin/bash
set -e

# install passenger/nginx
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
apt-get install -y apt-transport-https ca-certificates
sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger xenial main > /etc/apt/sources.list.d/passenger.list'
apt-get update
apt-get install -y nginx-extras passenger

# enable passenger
PassengerDisabled="# include /etc/nginx/passenger.conf;"
PassengerEnabled="include /etc/nginx/passenger.conf;"
sed -i "s|$PassengerDisabled|$PassengerEnabled|g" /etc/nginx/nginx.conf

# enable gzip in nginx
GzipDisabled="# gzip_types"
GzipEnabled="gzip_types"
sed -i "s|$GzipDisabled|$GzipEnabled|g" /etc/nginx/nginx.conf

# install node
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install -y nodejs

# install aws cli (to fetch secrets from parameterstore)
rm -rf awscli-bundle.zip awscli-bundle
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
