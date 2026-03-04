// ====== سنة الفوتر ======
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====== قائمة الجوال ======
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ====== حفظ طلبات التواصل (localStorage) ======
const STORAGE_KEY = "lh_requests_v1";

function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveRequests(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function packageLabel(value) {
  const map = {
    premium: "الحزمة المميزة",
    classic: "الحزمة الكلاسيكية",
    day: "حزمة اليوم",
    custom: "حزمة مخصصة"
  };
  return map[value] || "غير محدد";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRequests() {
  const box = document.getElementById("savedRequests");
  if (!box) return;

  const requests = loadRequests();

  if (requests.length === 0) {
    box.innerHTML = `<p class="small">لا يوجد طلبات محفوظة بعد.</p>`;
    return;
  }

  // أحدث طلب أولًا
  const rows = requests
    .slice()
    .reverse()
    .map((r) => {
      const when = new Date(r.createdAt).toLocaleString("ar");
      return `
        <div class="card" style="margin-top:10px">
          <h4 style="margin:0 0 6px 0">طلب: ${escapeHtml(packageLabel(r.package))}</h4>
          <p class="small" style="margin:0 0 6px 0"><strong>الاسم:</strong> ${escapeHtml(r.name)} — <strong>البريد:</strong> ${escapeHtml(r.email)}</p>
          <p class="small" style="margin:0 0 6px 0"><strong>التاريخ:</strong> ${escapeHtml(when)}</p>
          <p style="margin:0"><strong>الرسالة:</strong> ${escapeHtml(r.message)}</p>
        </div>
      `;
    })
    .join("");

  box.innerHTML = rows;
}

// ====== نموذج التواصل ======
const form = document.getElementById("contactForm");
if (form) {
  const successMsg = document.getElementById("successMessage");
  const clearBtn = document.getElementById("clearRequestsBtn");

  // اعرض الطلبات المحفوظة عند فتح صفحة التواصل
  renderRequests();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const pkgEl = document.getElementById("package");
    const msgEl = document.getElementById("message");

    const name = nameEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const pkg = pkgEl?.value || "custom";
    const message = msgEl?.value.trim() || "";

    // تحقق بسيط
    if (!name || !email || !message) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    // احفظ الطلب
    const requests = loadRequests();
    requests.push({
      name,
      email,
      package: pkg,
      message,
      createdAt: new Date().toISOString()
    });
    saveRequests(requests);

    // رسالة نجاح
    if (successMsg) {
      successMsg.style.display = "block";
      successMsg.textContent = `تم حفظ طلبك بنجاح: ${packageLabel(pkg)} ✅`;
    }

    // تحديث قائمة الطلبات
    renderRequests();

    // تفريغ الحقول
    form.reset();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const ok = confirm("هل تريد مسح كل الطلبات المحفوظة على هذا الجهاز؟");
      if (!ok) return;
      localStorage.removeItem(STORAGE_KEY);
      renderRequests();
      if (successMsg) {
        successMsg.style.display = "block";
        successMsg.textContent = "تم مسح كل الطلبات المحفوظة ✅";
      }
    });
  }
}// ====== تفاعل صفحة الحزم ======
const pkgButtons = document.querySelectorAll(".pkg-btn");
if (pkgButtons.length) {
  const titleEl = document.getElementById("pkgTitle");
  const imgEl = document.getElementById("pkgImg");
  const descEl = document.getElementById("pkgDesc");

  pkgButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title") || "";
      const img = btn.getAttribute("data-img") || "";
      const desc = btn.getAttribute("data-desc") || "";

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;

      if (imgEl) {
        imgEl.src = img;
        imgEl.alt = `صورة توضيحية لـ ${title}`;
        imgEl.style.display = "block";
      }
    });
  });
}