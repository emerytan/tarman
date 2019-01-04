#!/bin/bash


appPath="/usr/local/bin/appleDirs.scpt"

DIR=$(osascript $appPath | sed 's/:/\//g' | awk '{ print $2 }' | sed 's/gamma//g')

echo -n ${DIR}

