require('dotenv');
const { Telegraf, Markup, Format } = require('telegraf');

const lkey = process.env.LANGUAGE_KEY;
const lendpoint = process.env.LANGUAGE_ENDPOINT;

const bot = new Telegraf(process.env.BOT_TOKEN);


const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const client = new TextAnalyticsClient(lendpoint, new AzureKeyCredential(lkey));

const commands = [
];

bot.start(({ reply }) => {
    let msg = 'Welcome! 💪\nAvailable commands:';
    for (let cmd of commands) {
        msg += `\n${cmd}`;
    }
    reply(msg);
});

// bot.hears('hi', (ctx) => {
//     ctx.reply('hello!');
//     console.log(ctx);
// });

bot.on("text", async (ctx) => {
    let results = await client.analyzeSentiment([ctx.message.text]);
    console.log(results);
    if (results[0].sentiment === 'negative') {
        await ctx.reply('Sorry you feel that way 😥');
    } else if (results[0].sentiment === 'positive') {
        await ctx.reply('Have a good day!');
    } else {
        await ctx.reply('It\'s okay to feel meh sometimes!');
    }
})

bot.hears('hello', (ctx) => {
    ctx.replyWithHTML('<b>Hello</b>. <i>How are you today?</i>', Markup.inlineKeyboard([
        Markup.button.callback('Not bad', 'not bad'),
        Markup.button.callback('All right', 'all right')
    ]))
});

bot.action('not bad', (ctx) => {
    ctx.editMessageText('Have a nice day 😊');
});

bot.action('all right', (ctx) => {
    ctx.editMessageText('May happiness be with you 🙏');
});


console.log('bot started!');

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
