#!/system/bin/sh
#
echo "Cleaning PKG Cache 🗑️"
rm -rf /data/system/package_cache
sync
sleep 2
reboot