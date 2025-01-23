#!/bin/bash

docker compose up -d

trap "docker compose down; exit" SIGINT

npm run dev

docker compose down