export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, phone, zone } = JSON.parse(event.body);

    if (!name || !phone || !zone) {
      return { statusCode: 400, body: JSON.stringify({ ok: false }) };
    }

    const text = [
      "📩 *Новая заявка — SVD Beauty*",
      "",
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      `✨ Зона: ${zone}`,
      "",
      `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Riga" })}`,
    ].join("\n");

    const res = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      },
    );

    const data = await res.json();
    return {
      statusCode: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: data.ok }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
}
