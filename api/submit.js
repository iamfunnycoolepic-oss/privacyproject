export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, platform, handle } = req.body;

    if (!email || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const time = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York'
    });

    const message =
`🚀 New Early Access Signup

📧 Email: ${email}
📱 Platform: ${platform}
👤 Handle: ${handle || 'N/A'}
🕒 Time: ${time}`;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    if (!telegramRes.ok) {
      throw new Error('Telegram API failed');
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
