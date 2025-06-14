#!/bin/sh
DEVICENAME="Redmi 12 5G / POCO M6 Pro 5G"
CODENAME="sky"
#
echo $DEVICENAME
echo $CODENAME
#
echo "Underclocker....."
echo "Setting PowerSave Governer ......."
sleep 1
echo "Setting Lower Clock Speed"
#
su -c "echo "powersave" > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor"
su -c "echo "powersave" > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor"
su -c "echo "1632000" > /sys/devices/system/cpu/cpufreq/policy0/scaling_max_freq"
su -c "echo "1900800" > /sys/devices/system/cpu/cpufreq/policy0/scaling_max_freq"
exit 0