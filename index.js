const { default: Telegraf, Markup, session, Extra } = require("telegraf");
const dotenv = require('dotenv');
const { getLanguage } = require("./helpers/lang");

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());


bot.start(ctx => {
  ctx.session.language = ctx.session.language || getLanguage('uz');
  const message = ctx.from.first_name + " " + ctx.from.last_name;

  ctx.reply(ctx.session.language.start(message), {
    reply_markup: Markup.keyboard([
      ['🇺🇿 UZ', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN', '🇷🇺 RU']
    ]).resize().oneTime()
  });
});



bot.on('text', (ctx) => {
  const text = ctx.message.text;
  const fullName = `${ctx.from.first_name}  ${ctx.from.last_name}`
  switch (text) {
    case '🇺🇿 UZ':
      ctx.session.language = getLanguage('uz');

      break;
    case '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN':
      ctx.session.language = getLanguage('en');

      break;
    case '🇷🇺 RU':
      ctx.session.language = getLanguage('ru');
      break;

  }
  if (text == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN' || text == "🇷🇺 RU" || text == "🇺🇿 UZ")
    ctx.reply(ctx.session.language?.askPhoneWithLocation, {
      reply_markup: Markup.keyboard([
        [Markup.contactRequestButton(`${ctx.session.language?.askPhone}`), Markup.locationRequestButton(`${ctx.session.language?.askLocation}`)]
      ]).resize()
    })


})

bot.on('location', ctx => {
  ctx.session.location = ctx.message.location;
  (!ctx.session.contact) ? ctx.reply(ctx.session.language?.askPhone)
    : ctx.reply(`${ctx.session.language?.agree} \n 
      ${ctx.from.first_name}\n 
      ${ctx.from.last_name}\n 
      ${ctx.session.location?.latitude} - ${ctx.session.location?.longitude} \n ${ctx.session.contact}`, {
      reply_markup: Markup.inlineKeyboard([
        Markup.callbackButton(ctx.session?.language?.yes, "yes"),
        Markup.callbackButton(ctx.session?.language?.no, 'no')
      ])
    });
})

bot.action('yes', ctx => {
  ctx.answerCbQuery(ctx.session.language?.thanks, true);
})
bot.action('no', ctx => {
  ctx.reply(ctx.session.language?.askPhoneWithLocation, {
    reply_markup: Markup.keyboard([
      [Markup.contactRequestButton(`${ctx.session.language?.askPhone}`), Markup.locationRequestButton(`${ctx.session.language?.askLocation}`)]
    ]).resize()
  })
})
bot.on('contact', ctx => {
  ctx.session.contact = ctx.message.contact?.phone_number;
  (!ctx.session.location) ? ctx.reply(ctx.session.language?.askLocation) : ctx.reply(ctx.session.language?.agree, {
    reply_markup: Markup.inlineKeyboard([
      Markup.callbackButton(`${ctx.from.first_name}\n ${ctx.from.last_name}\n ${ctx.session.location} \n ${ctx.session.contact}`, "yes"),
      Markup.callbackButton('No', 'no')
    ])
  });
})


bot.launch();
