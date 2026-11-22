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
    ['Бонд', 'Абе заеби го тоа…'] ] },
  { file: '09-4', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '4/6', lines: [
    ['Стартапот', 'Немаме приход, ама имаме визија.'],
    ['Бонд', 'И јас имам визија. Се гледам како одам дома.'] ] },
  { file: '09-5', chapter: 'ПОГЛАВЈЕ 9', title: 'СТАРТАП ПИТЧ', page: '5/6', lines: [
    ['Стартапот', 'Ќе бидеме следниот Uber.'],
    ['Бонд', 'Ве викнав такси. Платете со крипто.'] ] },
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
    ['Бонд', 'Абе заеби го тоа…'] ] },
  { file: '13-klientot', chapter: 'ПОГЛАВЈЕ 13', title: 'КЛИЕНТОТ', lines: [
    ['Клиентот', 'Сакам 50% принос годишно, без ризик.'],
    ['Бонд', 'И јас сакам понеделник да не постои.'] ] },
];

const css = `
@font-face{font-family:Oswald;src:url(${font('Oswald-Bold.ttf')});font-weight:700}
@font-face{font-family:Mont;src:url(${font('Montserrat-Medium.ttf')});font-weight:500}
@font-face{font-family:Mont;src:url(${font('Montserrat-ExtraBold.ttf')});font-weight:800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;font-family:Mont,sans-serif}
.post{width:1080px;height:1350px;display:flex;flex-direction:column;position:relative;
  background:#1F4FD8 repeating-linear-gradient(180deg,rgba(0,0,0,.0) 0 38px,rgba(10,20,80,.28) 38px 64px)}
.head{display:flex;justify-content:space-between;align-items:center;padding:52px 64px 0}
.tag{font-family:Oswald;font-size:34px;letter-spacing:3px;color:#1F4FD8;background:#F2E6D8;padding:8px 22px;border-radius:10px}
.page{font-family:Oswald;font-size:30px;color:#F2E6D8;opacity:.85}
.title{font-family:Oswald;font-size:92px;line-height:1;color:#fff;padding:22px 64px 0;letter-spacing:1px;
  text-shadow:0 6px 0 rgba(10,20,80,.45)}
.chat{display:flex;flex-direction:column;gap:22px;padding:34px 64px 0}
.msg{max-width:84%;padding:22px 30px 24px;border-radius:30px;position:relative;box-shadow:0 10px 0 rgba(10,20,80,.35)}
.who{font-family:Oswald;font-size:26px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.txt{font-weight:800;font-size:44px;line-height:1.18}
.small .txt{font-size:36px}.small .msg{padding:16px 26px 18px}.small .chat{gap:14px;padding-top:24px}.small .title{font-size:72px}
.them{align-self:flex-start;background:#fff;color:#3B2A20;border-bottom-left-radius:6px}
.them .who{color:#1F4FD8}
.bond{align-self:flex-end;background:#3B2A20;color:#F2E6D8;border-bottom-right-radius:6px}
.bond .who{color:#E8A3A0}
.photo{flex:1;margin-top:34px;position:relative;background:url(${cat}) center bottom/cover no-repeat;min-height:420px}
.photo:before{content:"";position:absolute;inset:0 0 auto 0;height:140px;background:linear-gradient(#1F4FD8,rgba(31,79,216,0))}
.foot{padding:24px 64px 28px;display:flex;justify-content:space-between;align-items:center;background:#3B2A20}
.brand{font-family:Oswald;font-size:40px;color:#fff;letter-spacing:2px;line-height:1}
.brand span{display:block;font-family:Mont;font-weight:500;font-size:22px;letter-spacing:1px;color:#F2E6D8;margin-top:8px}
.catch{font-family:Oswald;font-size:28px;color:#E8A3A0}
.cover .lead{font-weight:800;font-size:58px;line-height:1.15;color:#F2E6D8;padding:30px 64px 0}
.cover .title{font-size:130px}
`;

const esc = (s) => s;
const html = (p) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="post ${p.small ? 'small' : ''} ${p.cover ? 'cover' : ''}">
  <div class="head"><div class="tag">${p.chapter}</div><div class="page">${p.page || ''}</div></div>
  <div class="title">${p.title}</div>
  ${p.cover ? `<div class="lead">${p.cover}</div>` : `<div class="chat">${p.lines.map(([who, t]) =>
    `<div class="msg ${who === 'Бонд' ? 'bond' : 'them'}"><div class="who">${who}</div><div class="txt">${esc(t)}</div></div>`).join('')}</div>`}
  <div class="photo"></div><div class="foot">
    <div class="brand">НАМЌОРЕНИОТ ИНВЕСТИТОР<span>The Grumpy Investor</span></div>
    <div class="catch">${p.cover ? 'ЛИЗГАЈ →' : 'НЕ МИ СЕ ЖИВЕЕ.'}</div>
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
