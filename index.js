const { Composer, Stage, Scene, session } = require('micro-bot');
const Commands = require('./commands');

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


module.exports = bot;
