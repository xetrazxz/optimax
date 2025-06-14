const MODDIR = "/data/adb/modules/optimax";

function runShell(command) {
  if (typeof ksu !== "object" || typeof ksu.exec !== "function")
    return Promise.reject("KernelSU JavaScript API not available.");

  const cb = `cb_${Date.now()}`;
  return new Promise((resolve, reject) => {
    window[cb] = (code, stdout, stderr) => {
      delete window[cb];
      (stdout || stderr) && printOutput((stdout || stderr).trim());
      code === 0 ? resolve(stdout) : reject(stderr || "Shell error");
    };
    ksu.exec(command, "{}", cb);
  });
}

function printOutput(text) {
  document.getElementById("output").textContent = text;
}

async function getCodename() {
  const prop = await runShell("getprop ro.product.device");
  return prop.trim();
}

async function loadDeviceConfig() {
  try {
    const codename = await getCodename();
    const url = `https://raw.githubusercontent.com/xetrazxz/optimax/main/config/${codename}.sh`;
    await runShell(`curl -sL ${url} -o ${MODDIR}/config.sh && sh ${MODDIR}/config.sh`);
  } catch (e) {
    printOutput("Config load failed: " + e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("saturation-slider");
  const valueText = document.getElementById("saturation-value");

  slider.addEventListener("input", async () => {
    const val = parseFloat(slider.value).toFixed(2);
    valueText.textContent = val;
    await runShell(`service call SurfaceFlinger 1022 f ${val}`);
  });

  document.getElementById("run-dexopt").addEventListener("click", async () => {
    const profile = document.getElementById("dexopt-profile").value;
    const cmd = `cmd package compile -a --compile-layouts -f -m ${profile}`;
    await runShell(cmd);
  });

  document.getElementById("apply-governor").addEventListener("click", async () => {
    const governor = document.getElementById("governor-select").value;
    try {
      await runShell(`for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo ${governor} > $i; done && echo "Governer Set To ${governor}"`);
    } catch (e) {
      printOutput("Governor error: " + e);
    }
  });

  document.getElementById("load-config").addEventListener("click", loadDeviceConfig);

});
