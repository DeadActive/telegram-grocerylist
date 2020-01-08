const Telegraf = require("telegraf");
const CONFIG = require("./config.json");

const bot = new Telegraf(CONFIG.api_token);
bot.start(ctx => ctx.reply("Welcome"));
bot.help(ctx => ctx.reply("Send me a sticker"));
bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));
bot.launch();
