const Io = require('../utils/io.js');
const dataWR = new Io('./db/users.json')
const Models = require('../models/models');
const { keyboard } = require('../helpers/contact.js');

const { Router } = require('@grammyjs/router');
const router = new Router((ctx) => ctx.session.step);

const step1 = router.route('start');
step1.command('start', async (ctx) => {
  await ctx.reply(`Assalomu Alaykum <b><a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a></b>`, {
    parse_mode: 'HTML',
  });
  
  
  ctx.session.userId=ctx.from.id
  const datas=await dataWR.read()
    const findUser=datas.find((user)=>user.user_id===ctx.from.id)
    if (findUser===undefined) {
      await ctx.reply('Ismingizni kiriting:')
      ctx.session.step='step2'
    }
  else{ctx.session.step = 'step4';}
});

const step2 = router.route('step2');
step2.on(':text', async (ctx) => {
  ctx.reply('Familyangizni kiriting');
  ctx.session.firstName=ctx.message.text
  ctx.session.step = 'step3';
});

const step3 = router.route('step3');
step3.on(':text', async (ctx) => {
  ctx.reply('Telefon raqamingizni yuboring', {
    reply_markup: {
      ...keyboard,
      resize_keyboard: true,
      remove_keyboard: true,
    },
  });
  ctx.session.surName=ctx.message.text
  ctx.session.step = 'step4';
});
const step4=router.route('step4')
step4.on(':contact',async(ctx)=>{
    const name = ctx.session.firstName
    const sur=ctx.session.surName
    const userId=ctx.session.userId
    ctx.session.contact=ctx.message.contact.phone_number
    const number=ctx.session.contact

    const datas=await dataWR.read()
    const newData=new Models(userId,name,sur,number)
    const data= datas.length?[...datas,newData]:[newData]
    await dataWR.write(data)
    router.session.step=''
}) 
/* const step5=router.route('step5'); */



module.exports = router;
