#!/bin/sh
#
DEVICENAME="Redmi 12 5G / POCO M6 Pro 5G"
CODENAME="sky"
#
echo $DEVICENAME
echo $CODENAME
#
echo ""
echo "Setting I/O scheduler"
for queue in /sys/block/sd*/queue
do
    echo "none" > "$queue/scheduler"
    echo "0" > "$queue/iostats"
    echo "0" > "$queue/add_random"
    echo "0" > "$queue/nomerges"
    echo "128" > "$queue/nr_requests"
    echo "2" > "$queue/rq_affinity"
    echo "1024" > "$queue/read_ahead_kb"
done ;

for queue in /sys/block/loop*/queue
do
    echo "none" > "$queue/scheduler"
    echo "0" > "$queue/iostats"
    echo "0" > "$queue/add_random"
    echo "0" > "$queue/nomerges"
    echo "128" > "$queue/nr_requests"
    echo "2" > "$queue/rq_affinity"
    echo "1024" > "$queue/read_ahead_kb"
done ;

for queue in /sys/block/dm*/queue
do
    echo "none" > "$queue/scheduler"
    echo "0" > "$queue/iostats"
    echo "0" > "$queue/add_random"
    echo "0" > "$queue/nomerges"
    echo "128" > "$queue/nr_requests"
    echo "2" > "$queue/rq_affinity"
    echo "1024" > "$queue/read_ahead_kb"
done ;

for queue in /sys/block/ram*/queue
do
    echo "none" > "$queue/scheduler"
    echo "0" > "$queue/iostats"
    echo "0" > "$queue/add_random"
    echo "0" > "$queue/nomerges"
    echo "128" > "$queue/nr_requests"
    echo "2" > "$queue/rq_affinity"
    echo "2048" > "$queue/read_ahead_kb"
done ;

for queue in /sys/block/zram*/queue
do
    echo "none" > "$queue/scheduler"
    echo "0" > "$queue/iostats"
    echo "0" > "$queue/add_random"
    echo "0" > "$queue/nomerges"
    echo "128" > "$queue/nr_requests"
    echo "2" > "$queue/rq_affinity"
    echo "2048" > "$queue/read_ahead_kb"
done ;

i=1
while [ "$i" -le 5 ]; do
    echo "Setting to None"
    i=$((i + 1))
    sleep 0.9
done
echo ""
#
echo "Done ....."
exit 0