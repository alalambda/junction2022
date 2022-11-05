require('dotenv');
const { Telegraf, Markup, Format, Scenes, Context } = require('telegraf');
const { enter, leave } = Scenes.Stage;
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

if (process.env.BOT_TOKEN === undefined) {
    throw new TypeError("BOT_TOKEN must be provided!");
}

if (process.env.LANGUAGE_KEY === undefined) {
    throw new TypeError("LANGUAGE_KEY must be provided!");
}

if (process.env.LANGUAGE_ENDPOINT === undefined) {
    throw new TypeError("LANGUAGE_ENDPOINT must be provided!");
}

const lkey = process.env.LANGUAGE_KEY;
const lendpoint = process.env.LANGUAGE_ENDPOINT;

const client = new TextAnalyticsClient(lendpoint, new AzureKeyCredential(lkey));

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    let msg = 'Hi! How are you feeling today?';
    ctx.reply(msg);
});

bot.on("text", async (ctx) => {
    if (ctx.message.text.indexOf('hi') > -1) {
        ctx.reply(
            'Special buttons keyboard',
            Markup.keyboard([
                Markup.button.callback('Send contact', 'asd'),
                Markup.button.callback('Send location', 'asds')
            ])
        )        
    } else {
        ctx.reply('asdsadas')
    }
})

// bot.on("text", async (ctx) => {
//     const msg = ctx.message.text.toLowerCase();

//     if (msg.indexOf('I am a failure. I always ruin everything.') != -1) {
//         ctx.reply('What event caused these thoughts?');
//     } else if (msg.indexOf('I felt lonely, anxious and afraid, I couldn’t speak.') != -1) {
//         ctx.reply('You said that you felt lonely, anxious and afraid. These thoughts lead you thinking that you are a failure and you always ruin everything. Is that correct?');
//     } else if (msg.indexOf('Yes.') != -1) {
//         ctx.reply('Given the situation, how would you rate your belief in your statement that you are ‘a failure and ruin everything’?')
//     } else if (msg.indexOf('90%') != -1) {
//         ctx.reply(' - Given the extreme nature of this judgement, a profound feeling of loneliness, anxiety and fear is understandable.'
//             + ' - The thought ‘I am a failure. I always ruin everything.’ Is the hidden meaning your mind has assigned to this event.'
//             + ' - What would be the worst-case scenario, and why?')
//     } else if (msg.indexOf('People would think I don’t like them and wouldn’t want to hang out with me anymore. I will lose all my friends because they are ashamed of my behaviour.') != -1) {
//         ctx.reply('Okay. And what would be the best-case scenario in your described situation?');
//     } else if (msg.indexOf('People would understand that I got nervous and would offer me support.') != -1) {
//         ctx.reply('Did your described best case scenario ever happen in your life?');
//     } else if (msg.indexOf('Yes') != -1) {
//         ctx.reply('Did your described worst case scenario ever happen in your life?')
//     } else if (msg.indexOf('No') != -1) {
//         ctx.reply('Given the worst and the best case scenarios that you described, how would you rate your belief in your initial thoughts that you are ‘a failure and ruin everything’?');
//     } else if (msg.indexOf('25%') != -1) {
//         ctx.reply('Your belief in destructive thoughts significantly decreased, which is really good.'
//             + ' - Do you want to share your answers with your mental health professional?');
//     } else if (msg.indexOf('Yes') != -1) {
//         ctx.reply(' Thank you for being open with me today. Your answers will be shared with your mental health professional.'
//             + ' - Try to do something for yourself today, like: taking a bath, ordering favourite food or reading a good book. '
//             + ' - Have a nice day/evening.')
//     }
//     else {
//         ctx.reply('I\'m sorry, but I\'m not that smart yet to help you out.');
//     }
// });

// bot.on("text", async (ctx) => {
//     let results = await client.analyzeSentiment([ctx.message.text]);
//     console.log(results);
//     if (results[0].sentiment === 'negative') {
//         await ctx.reply('Sorry you feel that way 😥');
//     } else if (results[0].sentiment === 'positive') {
//         await ctx.reply('Have a good day!');
//     } else {
//         await ctx.reply('It\'s okay to feel meh sometimes!');
//     }
// })

bot.launch();

console.log('bot launched!');

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
