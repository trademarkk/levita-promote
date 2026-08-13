import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the LEVITA promoter course", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Обучение промоутера LEVITA<\/title>/i);
  assert.match(html, /Первая смена/);
  assert.match(html, /2 занятия/);
  assert.match(html, /женский фитнес-клуб/);
  assert.match(html, /Шпаргалка PDF/);
  assert.match(html, /Соцопрос/);
  assert.match(html, /Три способа заявки|Три способа оставить заявку/);
  assert.doesNotMatch(html, /199\s*₽|(?<!бес)платное пробное/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps the business and test rules in the source", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const start = page.indexOf("const testBank");
  const end = page.indexOf("function shuffle");
  const testBlock = page.slice(start, end);

  assert.equal((testBlock.match(/\bquestion:/g) ?? []).length, 42);
  assert.equal((testBlock.match(/\bcorrect:/g) ?? []).length, 42);
  assert.match(page, /30 - critical\.length/);
  assert.match(page, /score >= 27 && criticalPassed/);
  assert.match(page, /attemptsUsed >= 2/);
  assert.match(page, /randomizeQuestion/);
  assert.match(page, /Правильные ответы показываются только сейчас/);
  assert.ok(page.includes("window.setInterval(() => move(1), 5000)"));
  assert.match(page, /Выбери правильный ответ во всех ситуациях/);
  assert.match(page, /active === 6 && !difficultSituationsPassed/);
  assert.doesNotMatch(page, /className={`answer-explanation/);
  assert.match(page, /девушки и женщины примерно от 25 лет и старше/i);
  assert.match(page, /Повторные заявки не оплачиваются/);
  assert.match(page, /Бывшая клиентка считается оплачиваемым лидом/);
  assert.match(page, /Листовка продолжает заинтересованный разговор/);
  assert.match(page, /Клиентка самостоятельно вводит данные/);
  assert.match(page, /около двух минут и пять коротких вопросов/i);
  assert.match(page, /levita-promoter-test-v4/);
  assert.match(page, /сертификату для Вас.*2 бесплатных групповых занятия/i);
  assert.doesNotMatch(page, /lead-form-example\.png|личной лид-форме/i);
  assert.doesNotMatch(page, /Личной формы больше нет/);
  assert.doesNotMatch(page, /199\s*₽|(?<!бес)платное пробное/i);
});

test("does not make the longest option a reliable test hint", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const testBlock = page.slice(page.indexOf("const testBank"), page.indexOf("function shuffle"));
  const lines = testBlock.split(/\r?\n/).filter((line) => line.includes("{ id:"));
  let correctIsLongest = 0;

  for (const line of lines) {
    const match = line.match(/options: \[(.*?)\], correct: (\d)/);
    assert.ok(match, `could not parse test question: ${line}`);
    const options = JSON.parse(`[${match[1]}]`);
    const correct = Number(match[2]);
    const longest = Math.max(...options.map((option) => option.length));
    if (options[correct].length === longest) correctIsLongest += 1;
  }

  assert.ok(correctIsLongest >= 7 && correctIsLongest <= 14, `correct answer was longest in ${correctIsLongest} of ${lines.length} questions`);
});

test("ships the downloadable PDF and course images", async () => {
  const files = [
    "../public/promoter-cheatsheet.pdf",
    "../public/client-portrait-1.jpg",
    "../public/client-portrait-3.jpg",
    "../public/target-woman-45.webp",
    "../public/target-woman-55.webp",
    "../public/target-woman-45-new.png",
    "../public/target-woman-55-new.png",
    "../public/promoter-sms-qr.png",
    "../public/vk-bot-example.jpg",
    "../public/promoter-leaflet.png",
  ];

  for (const file of files) {
    const info = await stat(new URL(file, import.meta.url));
    assert.ok(info.size > 20_000, `${file} should contain a real asset`);
  }
});
