#!/system/bin/sh

# Wait 15 Seconds
sleep 15

# I/O Scheduler to MQ-Deadline
for i in /sys/block/mmcblk*/queue/scheduler; do
  echo mq-deadline > "$i"
done

for i in /sys/block/sd*/queue/scheduler; do
  echo mq-deadline > "$i"
done

# Disable WatchDog
echo 0 > /proc/sys/kernel/watchdog
echo 0 > /proc/sys/kernel/watchdog_thresh
echo N > /sys/module/watchdog/parameters/enabled
echo 0 > /sys/module/msm_watchdog/parameters/debug_mask
echo 1 > /sys/class/watchdog/watchdog0/disable

# Kill Xiaomi Thermal
killall mi_thermald 2>/dev/null
killall thermald 2>/dev/null

# Set WALT governor on all CPU policies
for gov in /sys/devices/system/cpu/cpufreq/policy*/scaling_governor; do
  echo walt > "$gov"
done

sleep 5