// Renders The Grumpy Investor Instagram posts (1080x1350) to PNG.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const cat = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'cat-crop.jpg')).toString('base64');
const font = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');

const posts = [
  { file: '09-1-cover', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', cover: 'Евалуација 3 милиони евра.<br>Бонд не е импресиониран.', page: '1/6' },
  { file: '09-2', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '2/6', lines: [
    ['Стартапот', 'Бараме инвестиција. Евалуација 3 милиони евра.'],
    ['Бонд', 'Ако се лажеме…'] ] },
  { file: '09-3', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '3/6', lines: [
    ['Стартапот', 'Ова ќе се наплаќа со крипто.'],
    ['Бонд', 'Абе заеби ти тоа…'] ] },
  { file: '09-4', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '4/6', lines: [
    ['Стартапот', 'Немаме приход, ама имаме визија.'],
    ['Бонд', 'И јас имам визија. Се гледам како одам дома.'] ] },
  { file: '09-5', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '5/6', lines: [
    ['Стартапот', 'Ќе бидеме следниот Uber.'],
    ['Бонд', 'Ви викнав такси. Платете со крипто.'] ] },
  { file: '09-6', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '6/6', small: true, lines: [
    ['Стартапот', 'Имаме 10.000 корисници!'],
    ['Бонд', 'Колку плаќаат?'],
    ['Стартапот', '…'],
    ['Бонд', 'Не ми се живее.'] ] },
  { file: '10-bankarot', chapter: 'ПОГЛАВЈЕ 10', title: 'БАНКАРОТ', small: true, lines: [
    ['Банкарот', 'Имаме одлична понуда за кредит!'],
    ['Бонд', 'За што?'],
    ['Банкарот', 'За што сакате!'],
    ['Бонд', 'Сакам да не земам кредит.'] ] },
  { file: '11-tetkata', chapter: 'ПОГЛАВЈЕ 11', title: 'ТЕТКАТА НА СЛАВА', small: true, lines: [
    ['Тетката', 'Кога ќе купиш стан?'],
    ['Бонд', 'Кога станот ќе чини колку платата.'],
    ['Тетката', 'Значи никогаш?'],
    ['Бонд', 'Не ми се живее.'] ] },
  { file: '12-influenserot', chapter: 'ПОГЛАВЈЕ 12', title: 'ИНФЛУЕНСЕРОТ', small: true, lines: [
    ['Инфлуенсерот', 'Мојот курс ќе те направи милионер!'],
    ['Бонд', 'Ти милионер си?'],
    ['Инфлуенсерот', 'Ќе бидам, кога ќе го купиш курсот.'],
    ['Бонд', 'Абе заеби ти тоа…'] ] },
  { file: '13-klientot', chapter: 'ПОГЛАВЈЕ 13', title: 'КЛИЕНТОТ', lines: [
    ['Клиентот', 'Сакам 50% принос годишно, без ризик.'],
    ['Бонд', 'И јас сакам понеделник да не постои.'] ] },
];

const css = `
@font-face{font-family:Ral;src:url(${font('Raleway-Light.ttf')});font-weight:300}
@font-face{font-family:Ral;src:url(${font('Raleway-Medium.ttf')});font-weight:500}
@font-face{font-family:Ral;src:url(${font('Raleway-ExtraBold.ttf')});font-weight:800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;font-family:Ral,sans-serif;color:#fff;font-variant-numeric:lining-nums;font-feature-settings:"lnum"}
.post{width:1080px;height:1350px;display:flex;flex-direction:column;position:relative;
  background:radial-gradient(circle at 92% 82%,rgba(70,160,200,.75),rgba(70,160,200,0) 30%),
             radial-gradient(circle at 0% 30%,rgba(60,70,200,.6),rgba(60,70,200,0) 35%),
             linear-gradient(160deg,#4A12C8 0%,#4318C4 55%,#3B3FC0 100%)}
.head{display:flex;flex-direction:column;align-items:center;padding-top:44px}
.head svg{display:block}.lname{font-weight:800;font-size:30px;letter-spacing:1px;color:#fff;margin-top:12px}.lsub{font-weight:800;font-size:15px;letter-spacing:7px;color:#5B8DEF;margin-top:4px;padding-left:7px}
.page{position:absolute;top:56px;right:64px;font-weight:500;font-size:26px;color:rgba(255,255,255,.7)}
.title{font-weight:800;font-size:70px;line-height:1.05;color:#5EE6C4;text-align:center;padding:22px 60px 0}
.chat{display:flex;flex-direction:column;gap:22px;padding:40px 64px 0}
.msg{max-width:86%;padding:20px 30px 22px;border-radius:28px}
.who{font-weight:800;font-size:22px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px}
.txt{font-weight:300;font-size:44px;line-height:1.2}
.small .txt{font-size:36px}.small .msg{padding:14px 26px 16px}.small .chat{gap:12px;padding-top:22px}.small .title{font-size:58px}
.them{align-self:flex-start;border:2px solid rgba(255,255,255,.75);border-bottom-left-radius:6px;background:rgba(255,255,255,.06)}
.them .who{color:rgba(255,255,255,.75)}
.bond{align-self:flex-end;background:#5EE6C4;color:#2A0F7A;border-bottom-right-radius:6px}
.bond .txt{font-weight:500}.bond .who{color:#4A12C8}
.photo{flex:1;margin:30px 64px 0;min-height:340px;border-radius:36px;border:4px solid #5EE6C4;
  background:url(${cat}) center bottom/cover no-repeat}
.foot{padding:26px 64px 36px;display:flex;justify-content:space-between;align-items:flex-end;font-weight:300;font-size:24px;line-height:1.3}
.cover .lead{font-weight:300;font-size:50px;line-height:1.25;text-align:center;padding:36px 80px 0}
.cover .title{font-size:104px;padding-top:30px}
`;

const html = (p) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="post ${p.small ? 'small' : ''} ${p.cover ? 'cover' : ''}">
  <div class="head"><svg width="170" height="92" viewBox="0 0 170 92"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EE6C4"/><stop offset="1" stop-color="#4C8EF2"/></linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="9" stroke-linejoin="round"><rect x="32" y="44" width="30" height="40"/><rect x="72" y="25" width="30" height="59"/><rect x="112" y="6" width="30" height="78"/></g><rect x="10" y="82" width="150" height="9" rx="3" fill="#4C8EF2"/></svg>
    <div class="lname">ФИНАНСИСКИ</div><div class="lsub">ПЛАНЕР</div></div>
  <div class="title">${p.title}</div>
  ${p.cover ? `<div class="lead">${p.cover}</div>` : `<div class="chat">${p.lines.map(([who, t]) =>
    `<div class="msg ${who === 'Бонд' ? 'bond' : 'them'}"><div class="who">${who}</div><div class="txt">${t}</div></div>`).join('')}</div>`}
  <div class="photo"></div>
  <div class="foot">
    <div>Намќорениот инвеститор<br>The Grumpy Investor</div>
    <div>${p.cover ? 'Лизгај →' : 'Не ми се живее.'}</div>
  </div>
</div></body></html>`;

(async () => {
  const out = path.join(dir, 'posts');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const p of posts) {
    await page.setContent(html(p));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, p.file + '.png') });
  }
  await browser.close();
  console.log('done', posts.length);
})();
