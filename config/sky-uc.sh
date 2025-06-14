#!/bin/sh
DEVICENAME="Redmi 12 5G / POCO M6 Pro 5G"
CODENAME="sky"
#
echo $DEVICENAME
echo $CODENAME
#
echo "Underclocker"
#
echo "powersave" > /sys/devices/system/cpu/cpufreq/policy0/scaling_available_governors
echo "powersave" > /sys/devices/system/cpu/cpufreq/policy6/scaling_available_governors
echo "1632000" > /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_max_freq
echo "1900800" > /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_max_freq
