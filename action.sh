#!/system/bin/sh
echo "This Gonna Take a Long Time ⏰"
echo "Go Sleep 💤"
sleep 5

#
echo "Cleaning PKG Cache 🗑️"
rm -rf /data/system/package_cache
sync
sleep 2

#perfmode
echo "Temporarily Enabling Performance Governer 🚀"
sleep 2

for gov in /sys/devices/system/cpu/cpufreq/policy*/scaling_governor; do
  echo performance > "$gov"
done

# Dexopt on all installed apps using speed-profile
pm list packages -3 | cut -f2 -d: | while read pkg; do
    echo "Compiling $pkg with speed-profile ⚡"
    cmd package compile --reset $pkg
    cmd package compile -m speed-profile -f $pkg
    sync
done

echo "Done ✅"

echo "Please Reboot Now 🔁"