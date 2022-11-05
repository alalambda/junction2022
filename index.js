const { Composer, Stage, Scene, session } = require('micro-bot');

const bot = new Composer();

const commands = [
];

bot.start(({ reply }) => {
    let msg = 'Welcome! 💪\nAvailable commands:';
    for (let cmd of commands) {
        msg += `\n${cmd}`;
    }
    reply(msg);
});

bot.help((ctx) => ctx.reply('Help!'));

// Commands
// bot.command('subscribe', (ctx) => Commands.subscribe(ctx.update.message.chat.id, ctx.reply));

// Handlers

bot.inlineQuery((query, ctx) => {
    console.log(query);
    console.log(ctx);
    
    ctx.answerInlineQuery([{
        type: 'article',
        id: 1,
        title: 'test title',
        input_message_content: 'test contents',
        photo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/John_Broadus_Watson.JPG'
      }])
})

// bot.hears((message, { reply, replyWithChatAction, replyWithQuiz }) => {
//     console.log(message);
//     if (message.toLowerCase().indexOf('stupid') != -1) {
//         // replyWithPoll(
//         //     'Is that a fact or opinion?',
//         //     ['Fact', 'Opinion']
//         // );

//         replyWithChatAction('typing').then(_ => {

//             replyWithQuiz(
//                 'Is that a fact or opinion?',
//                 ['Fact', 'Opinion'],
//             );
//         });

//         return;
//     }
//     reply(message + ' 42');
// });

module.exports = bot;
