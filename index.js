require('dotenv');
const { Telegraf, Markup, Format } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const commands = [
];

bot.start(({ reply }) => {
    let msg = 'Welcome! 💪\nAvailable commands:';
    for (let cmd of commands) {
        msg += `\n${cmd}`;
    }
    reply(msg);
});

bot.hears('hi', (ctx) => {
    ctx.reply('hello!');
    console.log(ctx);
});

bot.hears('hello', (ctx) => {
    ctx.replyWithHTML('<b>Hello</b>. <i>How are you today?</i>', Markup.inlineKeyboard([
        Markup.button.callback('Not bad', 'not bad'),
        Markup.button.callback('All right', 'all right')
    ]))
});

bot.action('not bad', (ctx) => {
    ctx.editMessageText('Have a nice day 😊')
});

bot.action('all right', (ctx) => {
    ctx.editMessageText('May happiness be with you 🙏')
});


console.log('bot started!');

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
