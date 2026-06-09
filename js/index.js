/* ── Drawer ── */
function toggleDrawer() {
  document.getElementById("drawer").classList.toggle("open");
}

/* ── Modal ── */
function openModal() {
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  document.body.style.overflow = "";
  // reset form
  document.getElementById("f-name").value = "";
  document.getElementById("f-phone").value = "";
  document.getElementById("f-zone").value = "";
  const msg = document.getElementById("f-msg");
  msg.className = "form-msg";
  msg.textContent = "";
  const btn = document.getElementById("f-submit");
  btn.disabled = false;
  btn.textContent = "Отправить заявку";
}

/* ── Form submit → Netlify Function → Telegram ── */
async function submitForm() {
  const name = document.getElementById("f-name").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const zone = document.getElementById("f-zone").value;
  const msg = document.getElementById("f-msg");
  const btn = document.getElementById("f-submit");

  if (!name || !phone || !zone) {
    msg.className = "form-msg error";
    msg.textContent = "Пожалуйста, заполните все поля.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Отправка…";
  msg.className = "form-msg";
  msg.textContent = "";

  try {
    const res = await fetch("/.netlify/functions/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, zone }),
    });
    const data = await res.json();

    if (res.ok && data.ok) {
      msg.className = "form-msg success";
      msg.textContent = "✓ Заявка отправлена! Мы свяжемся с вами скоро.";
      btn.textContent = "✓ Отправлено";
      setTimeout(closeModal, 2200);
    } else {
      throw new Error("Server error");
    }
  } catch {
    msg.className = "form-msg error";
    msg.textContent =
      "Ошибка отправки. Попробуйте ещё раз или напишите нам напрямую.";
    btn.disabled = false;
    btn.textContent = "Отправить заявку";
  }
}

/* Close drawer on outside click */
document.addEventListener("click", (e) => {
  const drawer = document.getElementById("drawer");
  const burger = document.getElementById("burger");
  if (
    drawer.classList.contains("open") &&
    !drawer.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    drawer.classList.remove("open");
  }
});
