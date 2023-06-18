const {Bot,session}=require('grammy')
const config=require('./config/config')
const commands=require('./modules/command')
const bot=new Bot(config.bot_token)



bot.use(session({ initial: () => ({ step: "start" }) }));
bot.use(commands)
bot.start()