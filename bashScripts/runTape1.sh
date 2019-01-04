#!/bin/bash

# locals
DATE=$(date)
headerDate=$(date +%k%M%S)
tempDir="/tmp/tarman"
srcBase=$(basename "$1")

mkdir -p "$tempDir"
logFile="$tempDir/$srcBase-DPXDIR.txt"


echo $DATE
echo $headerDate

cd "$1" && echo "cd success"
sleep 3


# make header
if [ -f "$logFile" ]; then 
	rm -fv "$logFile"
	echo "making header file"
	touch "$logFile"
else
	echo "making header file"
	touch "$logFile"
fi


echo -e "#\tFacility:\tSixteen19" | tee -a "$logFile"
echo -e "#\tContact:\thttp://www.sixteen19.com/contact/" | tee -a "$logFile"
echo -e "#\tArchive Date:\t${DATE}" | tee -a "$logFile"
ls -lR --time-style=+%Y:%m:%d:%T:%Z | grep -E 'dpx|tif' | awk '{ print $7, $5, $6 }' | column -t | tee -a "$logFile"


# write header
echo "tape 1 tarball header file..."
sleep 2
if [ -f "$logFile" ]
    then echo "header file exists"
    sudo tar cvf /dev/nst0 -b 1024 "$logFile"
	if [ $? = 0 ]; then
		echo "header file tarred up."
	else
		echo "error while writing header file to tape"
		exit 1
	fi
else
    echo -n "header file doesn't exist"
    exit 1
fi


# write files
cd "$1" && echo "cd to tar souce - sucess"
TARBALL=$(basename `pwd`)
cd .. && echo ""$TARBALL" starting tarball in 5 seconds."
sleep 5
sudo tar cvf /dev/nst0 -b 1024 "$TARBALL"

if [ $? = 0 ]; then
	echo "finsihed writing "$TARBALL""
	echo "rewinding"
	sudo mt -f /dev/st0 rewind && exit
else
	echo "something went wrong while writing "$TARBALL""
	exit 1
fi
