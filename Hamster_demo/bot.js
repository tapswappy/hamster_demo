const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Token of your Telegram bot
const TOKEN = 'your-telegram-bot-token';
const WEBHOOK_URL = 'http://127.0.0.1:4040/bot'; // Public URL of your server

const bot = new TelegramBot(TOKEN);
const app = express();

// Webhook setup
bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN}`);

// Endpoint to receive data from the Web App
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Handles the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Play Tap Game',
                    web_app: { url: 'https://orlandovcj.github.io/tap-game/index.html' }
                }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Click the button below to play the Tap Game!', opts);
});

// Handles data sent from the Web App
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    bot.sendMessage(chatId, `You clicked ${data.tapCount} times!`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
