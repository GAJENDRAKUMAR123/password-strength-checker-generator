async function detectReuse() {
  const input = document.getElementById("passwords").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerHTML = "<p>Please enter simulated passwords.</p>";
    return;
  }

  const entries = input.split("\n").map(p => p.trim()).filter(Boolean);
  const hashMap = {};
  const results = [];

  for (let value of entries) {
    const hash = await sha256(value);
    hashMap[hash] = (hashMap[hash] || 0) + 1;
    results.push({ value, hash });
  }

  let reusedCount = 0;
  Object.values(hashMap).forEach(c => {
    if (c > 1) reusedCount++;
  });

  let risk = "Low";
  if (reusedCount === 1) risk = "Medium";
  if (reusedCount > 1) risk = "High";

  let html = `
    <p><b>Entries checked:</b> ${entries.length}</p>
    <p><b>Risk level:</b> ${risk}</p>
    <br>
  `;

  results.forEach(r => {
    const reused = hashMap[r.hash] > 1;
    html += `
      <div>
        <b>${reused ? "⚠️ Reused" : "✓ Unique"}</b>
        <div class="hash ${reused ? "reused" : ""}">
          ${r.hash}
        </div>
      </div><br>
    `;
  });

  html += `<p>Recommendation: Use unique passwords for each account.</p>`;

  resultDiv.innerHTML = html;
}

/* SHA-256 hashing */
async function sha256(text) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
