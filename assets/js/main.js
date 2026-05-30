const sessions = document.querySelectorAll(".session");
const filters = document.querySelectorAll(".filter-btn");

sessions.forEach((session) => {
  session.querySelector(".session-head").addEventListener("click", () => {
    const isOpen = session.classList.contains("open");
    sessions.forEach((s) => s.classList.remove("open"));
    if (!isOpen) session.classList.add("open");
  });
});

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.filter;
    sessions.forEach((s) => {
      const show = target === "all" || s.dataset.group === target;
      s.style.display = show ? "block" : "none";
    });
  });
});

document.querySelectorAll(".related-papers a").forEach((link) => {
  const raw = link.textContent.trim();
  const parts = raw.split(" - ");
  if (parts.length < 2) return;
  const meta = parts.shift();
  const title = parts.join(" - ");
  link.innerHTML = `<span class="paper-title">${title}</span><span class="paper-meta">${meta}</span>`;
});

document.querySelectorAll(".profile[data-url]").forEach((card) => {
  card.addEventListener("click", () => {
    const url = card.dataset.url;
    if (url) window.open(url, "_blank", "noopener");
  });
});

async function loadPapersData() {
  try {
    const res = await fetch("./assets/data/papers-by-section.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();

    document.querySelectorAll("[data-paper-section]").forEach((el) => {
      const sectionKey = el.dataset.paperSection;
      const isOutline = el.classList.contains("outline-step");
      const section = isOutline
        ? data.outline_sections?.[sectionKey]
        : data.sections?.[sectionKey];
      if (!section) return;
      const ul = el.querySelector(".related-papers ul");
      if (!ul) return;
      ul.innerHTML = "";
      const papers = isOutline ? section.papers.slice(0, 3) : section.papers;
      if (!papers.length) {
        const li = document.createElement("li");
        li.textContent = "No explicit citations in Tutorial Outline for this part.";
        ul.appendChild(li);
        return;
      }
      papers.forEach((p) => {
        const li = document.createElement("li");
        const year = p.year ? ` (${p.year})` : "";
        const author = p.author ? `${p.author}${year}` : p.key;
        if (isOutline) {
          li.className = "outline-paper-item";
          li.tabIndex = 0;
          li.dataset.href = p.link;
          const title = document.createElement("div");
          title.className = "outline-paper-title";
          title.textContent = p.title;
          const meta = document.createElement("div");
          meta.className = "outline-paper-meta";
          meta.textContent = author;
          li.appendChild(title);
          li.appendChild(meta);
          li.addEventListener("click", () => {
            window.open(p.link, "_blank", "noopener");
          });
          li.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              window.open(p.link, "_blank", "noopener");
            }
          });
        } else {
          li.className = "session-paper-item";
          li.tabIndex = 0;
          const title = document.createElement("div");
          title.className = "session-paper-title";
          title.textContent = p.title;
          const meta = document.createElement("div");
          meta.className = "session-paper-meta";
          meta.textContent = author;
          li.appendChild(title);
          li.appendChild(meta);
          li.addEventListener("click", () => {
            window.open(p.link, "_blank", "noopener");
          });
          li.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              window.open(p.link, "_blank", "noopener");
            }
          });
        }
        ul.appendChild(li);
      });
    });

  } catch (_) {
    // keep static fallback content
  }
}

loadPapersData();
