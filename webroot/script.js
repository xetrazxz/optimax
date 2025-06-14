const MODDIR = "/data/adb/modules/optimax";
const HELPER = "/data/adb/modules/optimax-helper";

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

async function UClock() {
  try {
    const codename = await getCodename();
    const url = `https://raw.githubusercontent.com/xetrazxz/optimax/main/config/${codename}-uc.sh`;
    await runShell(`curl -sL ${url} -o ${MODDIR}/uclock.sh && sh ${MODDIR}/uclock.sh`);
  } catch (e) {
    printOutput("Config load failed: " + e.message);
  }
}

async function bootDeviceConfigOn() {
  try {
    const codename = await getCodename();
    const url = `https://raw.githubusercontent.com/xetrazxz/optimax/main/config/${codename}.sh`;
    await runShell(`curl -sL ${url} -o ${HELPER}/service.sh && echo "Set Service at Boot"`);
  } catch (e) {
    printOutput("Config load failed: " + e.message);
  }
}

async function bootDeviceConfigOff() {
  try {
    await runShell(`rm -rf ${HELPER}/service.sh && echo "Removed Service at Boot"`);
  } catch (e) {
    printOutput("Config load failed: " + e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("saturation-slider");
  const valueText = document.getElementById("saturation-value");
  const accentPicker = document.getElementById("accent-picker");

  // Load accent from localStorage
  const savedAccent = localStorage.getItem("optimax-accent");
  if (savedAccent) {
    document.documentElement.style.setProperty('--accent', savedAccent);
    accentPicker.value = savedAccent;
  }

  accentPicker.addEventListener("input", () => {
    const color = accentPicker.value;
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem("optimax-accent", color);
  });

  // CMD buttons in row
  document.querySelectorAll('.colormod-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cmd = btn.dataset.cmd;
      try {
        await runShell(cmd);
      } catch (e) {
        printOutput("Command failed: " + e);
      }
    });
  });

  // Saturation slider
  slider.addEventListener("input", async () => {
    const val = parseFloat(slider.value).toFixed(2);
    valueText.textContent = val;
    await runShell(`service call SurfaceFlinger 1022 f ${val}`);
  });

  // Dexopt
  document.getElementById("run-dexopt").addEventListener("click", async () => {
    const profile = document.getElementById("dexopt-profile").value;
    const cmd = `pm compile -m ${profile} -a && pm compile -m ${profile} --secondary-dex -a & pm compile --compile-layouts -a & pm compile -m ${profile} --full -a && pm art dexopt-packages -r bg-dexopt && pm art cleanup `;
    await runShell(cmd);
  });

  // Governor
  document.getElementById("apply-governor").addEventListener("click", async () => {
    const governor = document.getElementById("governor-select").value;
    try {
      await runShell(`for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo ${governor} > $i; done && echo "Governor Set To ${governor}"`);
    } catch (e) {
      printOutput("Governor error: " + e);
    }
  });

  // Load config
  document.getElementById("load-config").addEventListener("click", loadDeviceConfig);
  
  document.getElementById("underclock").addEventListener("click", UClock);
  
  document.getElementById("boot-configon").addEventListener("click", bootDeviceConfigOn);
  
  document.getElementById("boot-configoff").addEventListener("click", bootDeviceConfigOff);
  
});
