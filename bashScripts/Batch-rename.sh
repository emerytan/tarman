#!/bin/bash
# batch rename  
# Emery Anderson - 20160915

# Globals
fullDate=`date "+%Y%m%d-%H%M"`
LogPath="/Users/$USER/sanitizier/fix-dirs/"$src_base""

#
# Get directory to be hashed
clear
tput setaf 11
echo -e "|--->    batch rename filenames    <---|"
tput setaf 9
echo -e "|--->                              <---|"
tput sgr 0
echo -e "\nProcess is as follows: "
echo -e "\t1. define directory to be batch renamed."
echo -e "\t2. define value to match to."
echo -e "\t3. define value to replace with."
echo -e "\t4. preview files to be renamed."
echo -e "\t5. Rename files as shown in the preview."
echo -e "\n\tRename command will not overwrite. Nonethless, this process is risky and batch renames will"
echo -e "\tdefinitely break any link between applications and existing paths to files."
echo -e "\n\tUse this utility at your own risk..."
echo -e -n "\n\ndrop directory: "
read DROP
echo -e -n "match to: "
read matchTo
echo -e -n "replace with: "
read replaceWith
src_base=`basename "$DROP"`
mkdir -p "$LogPath"
LOG=""$LogPath"/"$src_base"-$fullDate.txt"
touch "$LOG"
cd "$DROP"
FileCount=`ls -1 | wc -l | awk '{ print $1 }'`
BFN=`ls -1 | grep -e $matchTo > "$LOG"`
COUNT=`wc -l "$LOG" | awk '{ print $1 }'`
tput setaf 9
echo -e "\n\n\tBase directory: "$src_base" "
tput setaf 11
echo -e "\tdirectory count prior to sanitizaion:\t\t\t$FileCount "
if [ "$COUNT" != "0" ]; then
    echo -e "\tnumber of items to be cleaned up:\t\t\t$COUNT "
    else
    echo -e "\tnumber of items to be cleaned up:$(tput setaf 10)\t\t\t$COUNT "
    rm -rf "$LOG"
    tput sgr 0
    echo -e "\n\nNo Bad filenames names found."
    echo -e "\n\n"
    sleep 3
    exit
fi
tput sgr 0
echo -e -n "\nready to preview? (y) to continue: "
read CNF
if [ "$CNF" != "y" ]; then
    echo -e "Have a nice day\n"
    rm -rf "$LOG"
    exit
else
    cd "$DROP"
    echo -e "\n\nPreview of "$src_base" directory rename\n\n" | tee -a "$LOG"
    ls -1 | grep $matchTo | while read FILEDIR; do
    	#DIR="${FILEDIR}"
        FILE="${FILEDIR/*\/}"
    	NEWFILE="${FILE//$matchTo/$replaceWith}"
    	echo -e "\n$FILE\t-->\n$NEWFILE\t<--\n" | tee -a "$LOG"
    done
fi
echo -e -n "\nready to rename everything? (y) to continue: "
read CNF
if [ "$CNF" != "y" ]; then
    echo -e "Have a wonderful day\n"
	rm -rf "$LOG"
    exit
else
	ls -1 | while read FILEDIR
    do
	   FILE="${FILEDIR/*\/}"
        NEWFILE="${FILE//$matchTo/$replaceWith}"
	   mv -n "$FILE" "$NEWFILE"
	done
fi
PLOG=$LogPath"/"$src_base"-fixed-$fullDate.txt"
PostFileCount=`ls -1 | wc -l | awk '{ print $1 }'`
BFN=`ls -1 | grep -e $matchTo > "$PLOG"`
COUNT=`wc -l "$PLOG" | awk '{ print $1 }'`
tput setaf 9
echo -e "\n\n\tWorking directory: "$src_base" "
tput setaf 11
echo -e "\tfile count pre sanitizaion:\t\t$FileCount "
echo -e "\tfile count post sanitizaion:\t\t$PostFileCount "
if [ $COUNT == 0  ]; then
  echo -e "\tnumber of items to be cleaned up:$(tput setaf 2)\t$COUNT "
else
  echo -e "\tnumber of items to be cleaned up:\t$COUNT "
fi
tput sgr 0
echo -e -n "\nany key to exit: "
read -n 1
echo -e "\n\n"
rm -rf "$PLOG"
rm -rf "$LOG"
exit
