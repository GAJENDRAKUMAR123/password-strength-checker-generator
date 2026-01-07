const input = document.getElementById("password");
const result = document.getElementById("result");

function togglePassword() {
  input.type = input.type === "password" ? "text" : "password";
}

function analyze() {
  const pwd = input.value;

  if (!pwd) {
    result.innerHTML = "<p>Please enter a test password.</p>";
    return;
  }

  const pool = getPoolSize(pwd);
  if (pool === 0) {
    result.innerHTML = "<p>Unsupported characters detected.</p>";
    return;
  }

  const entropy = pwd.length * Math.log2(pool);
  const crackTime = estimateCrackTime(entropy);
  const strength = getStrength(entropy);

  result.innerHTML = `
    <p><b>Length:</b> ${pwd.length}</p>
    <p><b>Character Pool:</b> ${pool}</p>
    <p><b>Entropy:</b> ${entropy.toFixed(2)} bits</p>
    <p><b>Estimated Crack Time:</b> ${crackTime}</p>
    <p><b>Strength Level:</b> ${strength}</p>
  `;
}

function getPoolSize(pwd) {
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;
  return pool;
}

function getStrength(entropy) {
  if (entropy < 40) return "Weak";
  if (entropy < 60) return "Moderate";
  if (entropy < 80) return "Strong";
  return "Very Strong";
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e9; // 1 billion guesses/sec
  const seconds = Math.pow(2, entropy) / guessesPerSecond;

  if (seconds < 60) return "Less than a minute";
  if (seconds < 3600) return "Minutes";
  if (seconds < 86400) return "Hours";
  if (seconds < 31536000) return "Days";
  if (seconds < 3153600000) return "Years";
  return "Centuries";
}
