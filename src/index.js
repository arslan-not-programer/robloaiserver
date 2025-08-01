const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const API_SECRET = "твой_секретный_ключ";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/твой_вебхук";

app.use(bodyParser.json());

app.post("/ban", (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${API_SECRET}`) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  const { player, reason } = req.body;

  if (!player || !reason) {
    return res.status(400).json({ error: "Missing player or reason" });
  }

  const payload = {
    content: `🚫 Игрок **${player}** был забанен!\n📄 Причина: ${reason}`,
  };

  fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(() => {
    res.json({ status: "ok" });
  }).catch((err) => {
    console.error("Ошибка отправки в Discord:", err);
    res.status(500).json({ error: "Discord Webhook error" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});