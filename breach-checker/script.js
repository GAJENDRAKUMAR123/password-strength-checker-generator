const passwordInput = document.getElementById("password");
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");

/* Toggle password visibility */
function togglePassword() {
  const type =
    passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
}

/* Main breach check */
async function checkBreach() {
  const password = passwordInput.value.trim();

  if (!password) {
    resultDiv.innerHTML = "<p>Please enter a password.</p>";
    return;
  }

  resultDiv.innerHTML = "";
  loader.classList.remove("hidden");

  const hash = await sha1(password);
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    const data = await response.text();

    loader.classList.add("hidden");

    const match = data
      .split("\n")
      .find(line => line.startsWith(suffix));

    const strength = calculateStrength(password);

    if (match) {
      const count = match.split(":")[1];
      resultDiv.innerHTML = `
        <p class="danger">⚠️ Password found in breaches</p>
        <p>Exposed <b>${count.trim()}</b> times</p>
        <p>Strength: <b>${strength}</b></p>
        <p>Recommendation: Change immediately</p>
      `;
    } else {
      resultDiv.innerHTML = `
        <p class="safe">✅ Password not found in known breaches</p>
        <p>Strength: <b>${strength}</b></p>
        <p>Recommendation: Safe to use</p>
      `;
    }
  } catch {
    loader.classList.add("hidden");
    resultDiv.innerHTML =
      "<p>Error checking breach data. Try again later.</p>";
  }
}

/* Password strength */
function calculateStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score === 3) return "Moderate";
  if (score === 4) return "Strong";
  return "Very Strong";
}

/* SHA-1 hashing */
async function sha1(text) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
