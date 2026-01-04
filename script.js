const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const suggestions = document.getElementById("suggestions");

const commonPasswords = ["123456", "password", "qwerty", "admin", "111111"];

passwordInput.addEventListener("input", checkStrength);

function checkStrength() {
  const pwd = passwordInput.value;
  let score = 0;
  suggestions.innerHTML = "";

  if (pwd.length >= 8) score++;
  else addSuggestion("Use at least 8 characters");

  if (/[A-Z]/.test(pwd)) score++;
  else addSuggestion("Add uppercase letters");

  if (/[a-z]/.test(pwd)) score++;
  else addSuggestion("Add lowercase letters");

  if (/[0-9]/.test(pwd)) score++;
  else addSuggestion("Add numbers");

  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  else addSuggestion("Add special symbols");

  if (commonPasswords.includes(pwd.toLowerCase())) {
    score = 0;
    addSuggestion("Avoid common passwords");
  }

  updateMeter(score);
}

function addSuggestion(text) {
  const li = document.createElement("li");
  li.textContent = text;
  suggestions.appendChild(li);
}

function updateMeter(score) {
  if (score <= 2) {
    strengthBar.style.width = "30%";
    strengthBar.style.background = "red";
    strengthText.textContent = "Weak Password";
  } else if (score <= 4) {
    strengthBar.style.width = "60%";
    strengthBar.style.background = "orange";
    strengthText.textContent = "Medium Password";
  } else {
    strengthBar.style.width = "100%";
    strengthBar.style.background = "green";
    strengthText.textContent = "Strong Password";
  }
}

/* ---------------- Password Generator ---------------- */

const lengthSlider = document.getElementById("length");
const lenVal = document.getElementById("lenVal");

lengthSlider.oninput = () => lenVal.textContent = lengthSlider.value;

function generatePassword() {
  const length = lengthSlider.value;
  let chars = "";

  if (upper.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower.checked) chars += "abcdefghijklmnopqrstuvwxyz";
  if (number.checked) chars += "0123456789";
  if (symbol.checked) chars += "!@#$%^&*()_+";

  if (!chars) return alert("Select at least one option");

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("generatedPassword").value = password;
}

function copyPassword() {
  const field = document.getElementById("generatedPassword");
  field.select();
  document.execCommand("copy");
  alert("Password copied!");
}
