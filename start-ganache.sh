#! /bin/bash

# make sure directory is existed
mkdir -p ./chain

# echo $rpc_pid
rpc_pid= ps -A | grep rpc | grep -v grep | head -n 1 | awk '{print $1}'
if [ $rpc_pid ]; then
    kill $rpc_pid
fi

yarn ganache-cli \
--account="0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce,1000000000000000000000000"  \
--account="0x75c3e3150c0127af37e7e9df51430d36faa4c4660b6984c1edff254486d834e9,1000000000000000000000000"  \
--unlock 0 \
--unlock 1 \
-d \
--db="./chain"  \
-i 8888 \
--debug
