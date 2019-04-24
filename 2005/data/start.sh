# !/usr/bin/env bash
for file in * ; do
    num=$(wc -l $file)
    echo $num
done