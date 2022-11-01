#!/bin/bash

echo What should the version be?
read VERSION

docker build -t bravinr/lireddit:$VERSION .
docker push bravinr/lireddit:$VERSION
ssh root@<your ip address> "docker pull bravinr/lireddit:$VERSION && docker tag bravinr/lireddit:$VERSION dokku/api:$VERSION && dokku git:from-image api bravinr/lireddit:$VERSION"