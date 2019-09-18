#!/bin/bash

##### BUILD

echo
echo "BUILD STARTED"
echo

cd bdc-portal
docker build -t image-to-build-bdc-portal . --no-cache

docker run --name bdc-portal-node-build -v $PWD/../deploy/dist:/deploy/dist image-to-build-bdc-portal
docker rm bdc-portal-node-build
docker rmi image-to-build-bdc-portal

cd ../deploy
echo
echo "NEW TAG:"
read IMAGE_TAG
IMAGE_BASE="registry.dpi.inpe.br/brazildatacube/portal"
IMAGE_FULL="${IMAGE_BASE}:${IMAGE_TAG}"

docker build -t ${IMAGE_FULL} .
rm -r dist
docker push ${IMAGE_FULL}