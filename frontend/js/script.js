/* =====================================================
   AKSHAY KASHYAP — PORTFOLIO SCRIPT
   ===================================================== */

// 🔗 Change to deployed URL later (e.g., https://akshay-portfolio-api.onrender.com/api)
const API_BASE = "http://localhost:5000/api";

/* ---------- ESCAPE HTML (prevents XSS if DB data has stray tags) ---------- */
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------- MOUSE-FOLLOW GLOW (per-card, re-attachable) ---------- */
function attachMouseGlow() {
  document.querySelectorAll(".project-card").forEach(card => {
    // Avoid double-binding if called twice
    if (card.dataset.glowBound === "1") return;
    card.dataset.glowBound = "1";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });
}

/* ---------- LOAD PROJECTS ---------- */
async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = `<p class="loading-text">No projects yet.</p>`;
      return;
    }

    grid.innerHTML = projects.map(p => {
      const mainLink = p.liveUrl || p.codeUrl || "";
      const title       = escapeHtml(p.title);
      const description = escapeHtml(p.description);
      const icon        = escapeHtml(p.icon || "fas fa-code");
      const liveUrl     = escapeHtml(p.liveUrl || "");
      const codeUrl     = escapeHtml(p.codeUrl || "");
      const tags        = Array.isArray(p.tags) ? p.tags : [];

      const tagHtml = tags
        .map(t => `<span>${escapeHtml(t)}</span>`)
        .join("");

      // Nested links are illegal HTML → use a div and let JS handle the card click
      const cardOpenAttrs = mainLink
        ? `data-open="${escapeHtml(mainLink)}" role="link" tabindex="0"`
        : "";

      return `
        <div class="project-card" ${cardOpenAttrs}>
          <div class="project-icon"><i class="${icon}"></i></div>
          <h3>${title}</h3>
          <p class="project-desc">${description}</p>
          <div class="project-tags">${tagHtml}</div>
          <div class="project-links">
            ${liveUrl ? `
              <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" data-stop>
                <i class="fas fa-external-link-alt"></i> Live Demo
              </a>` : ""}
            ${codeUrl ? `
              <a href="${codeUrl}" target="_blank" rel="noopener noreferrer" data-stop>
                <i class="fab fa-github"></i> Source Code
              </a>` : ""}
          </div>
        </div>
      `;
    }).join("");

    // Wire up click / keyboard behavior on the cards
    grid.querySelectorAll(".project-card").forEach(card => {
      const openUrl = card.dataset.open;
      if (!openUrl) return;

      const open = (e) => {
        // If the click originated inside a nested link, let the link handle it
        if (e.target.closest("[data-stop]")) return;
        window.open(openUrl, "_blank", "noopener,noreferrer");
      };

      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(e);
        }
      });
    });

    // Attach the mouse glow AFTER cards exist
    attachMouseGlow();

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:#ef4444;">⚠️ Could not load projects. Is the backend running?</p>`;
  }
}

/* ---------- CONTACT FORM ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      message: form.message.value.trim(),
    };

    // Simple client-side validation
    if (!data.name || !data.email || !data.message) {
      status.textContent = "❌ Please fill in all fields.";
      status.style.color = "#ef4444";
      return;
    }

    status.textContent = "Sending…";
    status.style.color = "#a855f7";

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Safely parse JSON — server might return HTML on error
      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        status.textContent = "✅ Message sent! I'll reply soon.";
        status.style.color = "#22c55e";
        form.reset();
      } else {
        status.textContent = "❌ " + (result.error || result.message || "Something went wrong");
        status.style.color = "#ef4444";
      }
    } catch (err) {
      console.error(err);
      status.textContent = "❌ Network error. Try again later.";
      status.style.color = "#ef4444";
    }
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  initContactForm();
});