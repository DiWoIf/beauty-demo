export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, phone, zone } = JSON.parse(event.body);

    if (!name || !phone || !zone) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Missing fields" }) };
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID   = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Server misconfigured" }) };
    }

    const text = [
      "📩 *Новая заявка — SVD Beauty*",
      "",
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      `✨ Зона: ${zone}`,
      "",
      `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Riga" })}`
    ].join("\n");

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" })
      }
    );

    const tgData = await res.json();

    return {
      statusCode: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: tgData.ok })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
}
