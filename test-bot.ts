import { Markup, Scenes, session, Telegraf } from "telegraf";

// Handler factories
const { enter, leave } = Scenes.Stage;

// Greeter scene
const greeter = "greeter";
const greeterScene = new Scenes.BaseScene<Scenes.SceneContext>(greeter);
greeterScene.enter(ctx => ctx.reply("Hi! How are you feeling today?"));
greeterScene.on("text", ctx => {
	if (ctx.message.text.indexOf('I am a failure. I always ruin everything.') != -1) {
		ctx.scene.enter(analyzeFirstTought);
	} else {
		ctx.reply("sorry don't know what to do ;( try different answer");
	}
});

// analyzeFirstTought
const analyzeFirstTought = "analyzeFirstTought";
const analyzeFirstToughtScene = new Scenes.BaseScene<Scenes.SceneContext>(analyzeFirstTought);
analyzeFirstToughtScene.enter(ctx => ctx.reply("What event caused these thoughts?"));
analyzeFirstToughtScene.hears('Correct', async ctx => {
	await ctx.replyWithHTML("Given the situation, how would you rate your belief in your statement that you are ‘a failure and ruin everything’?",
		Markup.keyboard([
			Markup.button.callback('Strong', 'strong'),
			Markup.button.callback('Medium', 'medium'),
			Markup.button.callback('Little', 'little')
		])
		.oneTime()
		.resize())
});
analyzeFirstToughtScene.hears('No', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `Yes`'));
analyzeFirstToughtScene.hears('Strong', async ctx => {
	await ctx.scene.enter(worstCase);
});
analyzeFirstToughtScene.hears('Medium', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `Strong`'));
analyzeFirstToughtScene.hears('Little', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `Strong`'));
analyzeFirstToughtScene.on("text", ctx => {
	ctx.replyWithHTML("You said that you felt <b>lonely</b>, <b>anxious</b> and <b>afraid</b>. These thoughts lead you thinking that you are a <b>failure</b> and you <b>always ruin everything</b>. Is that correct?",
		Markup
			.keyboard([
				Markup.button.callback('Correct', 'yes'),
				Markup.button.callback('No', 'no')
			])
			.oneTime()
			.resize()
	);
});


// belief 1 
const worstCase = "worstCase";
const worstCaseScene = new Scenes.BaseScene<Scenes.SceneContext>(worstCase);
worstCaseScene.enter(ctx => ctx.replyWithHTML(
	'Given the extreme nature of this judgement, a profound feeling of loneliness, anxiety and fear is understandable.'
	+ '\nThe thought ‘<i>I am a failure. I always ruin everything.</i>’ Is the hidden meaning your mind has assigned to this event.'
	+ '\nWhat would be the worst-case scenario, and why?'));
worstCaseScene.on("text", async ctx => {
	// txt should be 
	// People would think I don’t like them and wouldn’t want to hang out with me anymore. I will lose all my friends because they are ashamed of my behaviour.
	ctx.scene.enter(bestCase);
});

const bestCase = "bestCase";
const bestCaseScenario = new Scenes.BaseScene<Scenes.SceneContext>(bestCase);
bestCaseScenario.enter(ctx => ctx.reply("Okay. And what would be the best-case scenario in your described situation?"));
bestCaseScenario.on("text", async ctx => {
	// txt should be 
	// People would think I don’t like them and wouldn’t want to hang out with me anymore. I will lose all my friends because they are ashamed of my behaviour.
	ctx.scene.enter(worstCase2);
});

const worstCase2 = "worstCase2";
const worstCase2Scene = new Scenes.BaseScene<Scenes.SceneContext>(worstCase2);
worstCase2Scene.enter(ctx => ctx.replyWithHTML("Did your described <b>best</b> case scenario ever happen in your life?",
	Markup.keyboard([
		Markup.button.callback('Yes', 'yes'),
		Markup.button.callback('No', 'no')
	])
	.oneTime()
	.resize()
	));
worstCase2Scene.hears('Yes', async ctx => {
	await ctx.replyWithHTML("Did your described <b>worst</b> case scenario ever happen in your life?",
		Markup.keyboard([
			Markup.button.callback('Yeah', 'yes2'),
			Markup.button.callback('No, not really', 'no2')
		])
		.oneTime()
		.resize())
});
worstCase2Scene.hears('No', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `Yes`'));

worstCase2Scene.hears('No, not really', async ctx => {
	await ctx.replyWithHTML('Given the worst and the best case scenarios that you described, how would you rate your belief in your initial thoughts that you are ‘a failure and ruin everything’?',
		Markup.keyboard([
			Markup.button.callback('Strong', 'strong'),
			Markup.button.callback('Medium', 'medium'),
			Markup.button.callback('Little', 'little')
		])
		.oneTime()
		.resize())
})
worstCase2Scene.hears('Yeah', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `No`'));

worstCase2Scene.hears('Little', async ctx => {
	await ctx.replyWithHTML('Your belief in destructive thoughts significantly decreased, which is really good.'
		+ '\nDo you want to share your answers with your mental health professional?',
		Markup.keyboard([
			Markup.button.callback('Share', 'share'),
			Markup.button.callback('Don\'t share', 'dontShare'),
		])
		.oneTime()
		.resize())
});
worstCase2Scene.hears('Medium', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `little`'));
worstCase2Scene.hears('Strong', ctx => ctx.reply('sorry I\'m not programmed to this route, try answering `little`'));

worstCase2Scene.hears('Share', async ctx => {
	await ctx.replyWithHTML('Thank you for being open with me today. Your answers will be shared with your mental health professional.'
		+ '\nTry to do something for yourself today, like: taking a bath, ordering favourite food or reading a good book. '
		+ '\nHave a nice day/evening.');
	await ctx.scene.leave();
});
worstCase2Scene.hears('Don\'t share', async ctx => {
	await ctx.replyWithHTML('Thank you for being open with me today. Your answers won\'t be shared with anyone!'
		+ '\nTry to do something for yourself today, like: taking a bath, ordering favourite food or reading a good book. '
		+ '\nHave a nice day/evening.');
	await ctx.scene.leave();
});



const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN as string);

const stage = new Scenes.Stage<Scenes.SceneContext>([
	greeterScene,
	analyzeFirstToughtScene,
	worstCaseScene,
	bestCaseScenario,
	worstCase2Scene
], {
	ttl: 180,
});

bot.use(session());
bot.use(stage.middleware());
bot.on("message", ctx => ctx.scene.enter(greeter));

bot.launch();

console.log('Bot started!');
