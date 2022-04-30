#!/bin/bash

echo What should the version be?
read VERSION
echo Setting version to v$VERSION

docker buildx build --platform linux/amd64 -t shreyask3004/lireddit:v$VERSION .
docker push shreyask3004/lireddit:v$VERSION

ssh root@167.99.195.123 "docker pull shreyask3004/lireddit:v$VERSION && docker tag shreyask3004/lireddit:v$VERSION dokku/api:v$VERSION && dokku deploy api v$VERSION"