const MODDIR = "/data/adb/modules/optimax";

function runShell(command) {
  if (typeof ksu !== "object" || typeof ksu.exec !== "function")
    return Promise.reject("KernelSU JavaScript API not available.");
  const cb = `cb_${Date.now()}`;
  return new Promise((resolve, reject) => {
    window[cb] = (code, stdout, stderr) => {
      delete window[cb];
      code === 0 ? resolve(stdout) : reject(stderr || "Shell error");
    };
    ksu.exec(command, "{}", cb);
  });
}

async function getCodename() {
  const prop = await runShell("getprop ro.product.device");
  return prop.trim();
}

async function loadDeviceConfig() {
  try {
    const codename = await getCodename();
    const url = `https://raw.githubusercontent.com/xetrazxz/optimax/main/config/${codename}.sh`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No config found for ${codename}`);
    const script = await response.text();

    document.getElementById("output").textContent = `Running ${codename}.sh...\n\n${script}`;
    await runShell(script);
  } catch (e) {
    document.getElementById("output").textContent = `❌ ${e.message}`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("saturation-slider");
  const valueText = document.getElementById("saturation-value");

  slider.addEventListener("input", async () => {
    const val = parseFloat(slider.value).toFixed(2);
    valueText.textContent = val;
    const cmd = `service call SurfaceFlinger 1022 f ${val}`;
    try {
      await runShell(cmd);
    } catch (err) {
      console.error("Saturation failed:", err);
    }
  });

  document.getElementById("load-config").addEventListener("click", loadDeviceConfig);
});
