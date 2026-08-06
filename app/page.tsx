"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type TestQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  critical?: boolean;
};

type Dialogue = {
  title: string;
  subtitle: string;
  outcome: "success" | "neutral" | "fail";
  messages: Array<{ role: "promoter" | "client"; text: string }>;
  note: string;
};

const modules = [
  { number: "01", title: "Старт", time: "4 мин" },
  { number: "02", title: "Кого приглашать", time: "7 мин" },
  { number: "03", title: "Как заговорить", time: "8 мин" },
  { number: "04", title: "Диалоги", time: "10 мин" },
  { number: "05", title: "Соцопрос", time: "12 мин" },
  { number: "06", title: "VK-бот и листовка", time: "10 мин" },
  { number: "07", title: "Сложные ситуации", time: "12 мин" },
  { number: "08", title: "Первая смена", time: "7 мин" },
  { number: "09", title: "Итоговый тест", time: "18 мин" },
];

const audienceSlides = [
  {
    age: "примерно 30–35 лет",
    src: "/client-portrait-3.jpg",
    alt: "Пример клиентки LEVITA примерно 30–35 лет",
    objectPosition: "center 42%",
    text: "Женщина из нашей реальной аудитории: ей могут быть интересны тонус, танцы, растяжка или новый формат тренировок.",
  },
  {
    age: "примерно 35–40 лет",
    src: "/client-portrait-1.jpg",
    alt: "Пример клиентки LEVITA примерно 35–40 лет",
    objectPosition: "center 28%",
    text: "Может искать время для себя, восстановление после рабочего дня, сильное тело и комфортную женскую атмосферу.",
  },
  {
    age: "примерно 45 лет",
    src: "/target-woman-45.webp",
    alt: "Пример клиентки LEVITA примерно 45 лет",
    objectPosition: "center 30%",
    text: "Ей могут быть важны осанка, движение без перегрузок, индивидуальное внимание и понятные объяснения тренера.",
  },
  {
    age: "примерно 55 лет",
    src: "/target-woman-55.webp",
    alt: "Пример клиентки LEVITA примерно 55 лет",
    objectPosition: "center 25%",
    text: "Возраст не помеха занятиям: в LEVITA можно подобрать спокойный темп и начать с любого уровня подготовки.",
  },
];

const targetCases = [
  {
    text: "Женщина примерно 30 лет идёт в спокойном темпе и смотрит по сторонам.",
    correct: true,
    feedback: "Да. Это целевая аудитория, и момент для короткого приветствия выглядит комфортным.",
  },
  {
    text: "Девушка выглядит заметно младше 25 лет.",
    correct: false,
    feedback: "Нет. Наша аудитория — девушки и женщины примерно от 25 лет и старше.",
  },
  {
    text: "Женщина 50+ разговаривает по телефону и быстро идёт к переходу.",
    correct: false,
    feedback: "Сейчас не подходим. По возрасту она подходит, но момент неудобный и небезопасный.",
  },
  {
    text: "Женщина примерно 40 лет остановилась рядом и заинтересованно посмотрела на листовку.",
    correct: true,
    feedback: "Да. Установи зрительный контакт, поздоровайся и начни с одной короткой фразы.",
  },
];

const dialogues: Dialogue[] = [
  {
    title: "Записалась в боте",
    subtitle: "Успешный диалог",
    outcome: "success",
    messages: [
      { role: "promoter", text: "Здравствуйте! Можно один короткий вопрос про фитнес?" },
      { role: "client", text: "Да, можно." },
      { role: "promoter", text: "Вы раньше занимались растяжкой, пилатесом или танцами?" },
      { role: "client", text: "Давно хотела попробовать пилатес." },
      { role: "promoter", text: "Тогда вам может понравиться LEVITA. Это женский фитнес-клуб, у нас есть и спокойные, и активные направления. По этому сертификату для Вас — 2 групповых занятия." },
      { role: "client", text: "Звучит интересно. Как записаться?" },
      { role: "promoter", text: "Отсканируйте мой личный QR-код: откроется официальный VK-бот LEVITA. Нажмите «Записаться на пробное», выберите удобную студию и заполните запись прямо в своём телефоне." },
      { role: "client", text: "Хорошо, давайте. Я выбрала студию на Мачуги." },
      { role: "promoter", text: "Отлично, запись готова! Вот листовка, чтобы информация осталась у вас. Будем рады видеть вас в LEVITA." },
    ],
    note: "Разговор получился естественным: вопрос, интерес, короткая польза и самостоятельная запись клиентки через личный QR промоутера.",
  },
  {
    title: "Сохранила листовку",
    subtitle: "Интерес есть, но не сейчас",
    outcome: "success",
    messages: [
      { role: "promoter", text: "Здравствуйте! Приглашаем вас познакомиться с женским фитнес-клубом LEVITA. Вам интересны растяжка или мягкий фитнес?" },
      { role: "client", text: "Да, но сейчас не успею записаться." },
      { role: "promoter", text: "Понимаю. Раз вам интересно, возьмите листовку. Когда будет удобно, отсканируйте мой QR-код и запишитесь через официальный VK-бот." },
      { role: "client", text: "Хорошо, спасибо." },
      { role: "promoter", text: "Пожалуйста! По этому сертификату для Вас — 2 групповых занятия. Хорошего дня!" },
    ],
    note: "Листовка выдана правильно: женщина проявила интерес, но выбрала самостоятельную запись позже.",
  },
  {
    title: "Спокойно приняли отказ",
    subtitle: "Без лида, но всё сделано правильно",
    outcome: "neutral",
    messages: [
      { role: "promoter", text: "Здравствуйте! Можно коротко рассказать о женском фитнес-клубе рядом?" },
      { role: "client", text: "Нет, спасибо, мне неинтересно." },
      { role: "promoter", text: "Хорошо, приятного дня!" },
    ],
    note: "Отказ — нормальная часть работы. Не спорим, не задаём второй вопрос и не отдаём листовку человеку без интереса.",
  },
  {
    title: "Разговор сорвался",
    subtitle: "Неудачный пример",
    outcome: "fail",
    messages: [
      { role: "promoter", text: "Девушка, стойте! Берите сертификат и оставляйте номер." },
      { role: "client", text: "Я тороплюсь." },
      { role: "promoter", text: "Это всего минута, почему вы не хотите? Я пойду с вами." },
      { role: "client", text: "Не нужно за мной идти." },
    ],
    note: "Ошибки: команда вместо приветствия, перекрытие выбора, давление, листовка без интереса и преследование. После первого отказа разговор нужно закончить.",
  },
];

const surveyDialogues: Dialogue[] = [
  {
    title: "Есть интерес — записались",
    subtitle: "Успешный соцопрос",
    outcome: "success",
    messages: [
      { role: "promoter", text: "Здравствуйте! Меня зовут Аня, я представляю женский фитнес-клуб LEVITA. Мы проводим короткий опрос о спорте — пять вопросов, около двух минут. Можно?" },
      { role: "client", text: "Да, давайте." },
      { role: "promoter", text: "Получается ли у вас сейчас регулярно заниматься спортом?" },
      { role: "client", text: "Нет, давно хочу начать, но не могу выбрать формат." },
      { role: "promoter", text: "Что вам ближе: активные тренировки, мягкий фитнес, растяжка и танцы или пока не знаете?" },
      { role: "client", text: "Наверное, растяжка или пилатес." },
      { role: "promoter", text: "Что важнее всего: атмосфера, помощь тренера, удобное расписание или разнообразие?" },
      { role: "client", text: "Чтобы тренер помог начать и было не страшно." },
      { role: "promoter", text: "Что чаще мешает начать: время, сложно выбрать клуб, неуверенность или ничего?" },
      { role: "client", text: "Неуверенность." },
      { role: "promoter", text: "Хотели бы получить сертификат на 2 групповых занятия и попробовать подходящее направление в ближайшее время?" },
      { role: "client", text: "Да, попробовала бы." },
      { role: "promoter", text: "Спасибо! По вашим ответам вам может подойти мягкий фитнес в LEVITA. Хотите сейчас записаться через официальный VK-бот? Отсканируйте мой QR-код, нажмите «Записаться на пробное» и выберите удобную студию." },
    ],
    note: "Промоутер представился, честно назвал LEVITA, записал только варианты ответов и предложил запись после явного интереса.",
  },
  {
    title: "Интерес есть — подумает",
    subtitle: "Листовка уместна",
    outcome: "neutral",
    messages: [
      { role: "promoter", text: "Здравствуйте! Я из женского фитнес-клуба LEVITA. Можно пять коротких вопросов о спорте? Это займёт около двух минут." },
      { role: "client", text: "Можно." },
      { role: "promoter", text: "Хотели бы вы попробовать новое направление тренировок в ближайшее время?" },
      { role: "client", text: "Возможно, но сейчас не готова решать." },
      { role: "promoter", text: "Понимаю, спасибо за ответы. Раз тема вам интересна, возьмите листовку. На ней есть информация, а по моему QR-коду можно самостоятельно записаться через VK-бот, когда будет удобно." },
      { role: "client", text: "Хорошо, возьму." },
    ],
    note: "Никакого давления: интерес есть, поэтому листовка уместна. Записаться клиентка сможет сама позже.",
  },
  {
    title: "Интереса нет",
    subtitle: "Завершили без листовки",
    outcome: "neutral",
    messages: [
      { role: "promoter", text: "Здравствуйте! Меня зовут Даша, я представляю LEVITA. Можно короткий опрос о спорте — пять вопросов, около двух минут?" },
      { role: "client", text: "Да." },
      { role: "promoter", text: "Хотели бы вы попробовать новый формат тренировок в ближайшее время?" },
      { role: "client", text: "Нет, спорт мне сейчас совсем неинтересен." },
      { role: "promoter", text: "Поняла, спасибо за ответы. Хорошего дня!" },
    ],
    note: "Опрос не обязан закончиться лидом. При ясном отсутствии интереса благодарим и не отдаём листовку.",
  },
  {
    title: "Так делать не нужно",
    subtitle: "Неудачный соцопрос",
    outcome: "fail",
    messages: [
      { role: "promoter", text: "Здравствуйте, это анонимный опрос. Скажите номер телефона и хотите ли вы похудеть?" },
      { role: "client", text: "А вы вообще откуда?" },
      { role: "promoter", text: "Сначала ответьте, потом расскажу. Возьмите листовку." },
      { role: "client", text: "Нет, спасибо." },
    ],
    note: "Ошибки: промоутер скрыл LEVITA, спросил о внешности и персональных данных, не объяснил формат и навязал листовку.",
  },
];

const difficultSituations = [
  {
    title: "Спрашивают о сертификате",
    situation: "«Что даёт сертификат?»",
    options: [
      "«По этому сертификату для Вас — 2 групповых занятия. Подробности уточнит администратор»",
      "«Наверное, но я не уверена»",
      "«Сначала оставьте номер, потом узнаете»",
    ],
    correct: 0,
    feedback: "Говорим только подтверждённое правило: сертификат даёт 2 групповых занятия.",
  },
  {
    title: "Спрашивают об абонементах",
    situation: "«Сколько потом стоит заниматься?»",
    options: [
      "Назвать примерный диапазон",
      "«Актуальные варианты и условия подробно объяснит администратор после записи или в студии»",
      "Сказать, что это всегда дёшево",
    ],
    correct: 1,
    feedback: "Промоутер не консультирует по абонементам и не называет неподтверждённые цены.",
  },
  {
    title: "Сомневается в QR-коде",
    situation: "«Я не хочу вводить данные в ваш телефон»",
    options: [
      "Предложить записать номер на бумаге",
      "Попросить открыть контакты в её телефоне",
      "«Вводить данные в мой телефон не нужно. Вы сканируете QR и сами заполняете запись в официальном VK-боте»",
    ],
    correct: 2,
    feedback: "Промоутер не получает телефон клиентки: она сама проходит запись в официальном VK-боте.",
  },
  {
    title: "Клиентка торопится",
    situation: "«Мне некогда, я опаздываю»",
    options: [
      "«Понимаю, хорошего дня!» и освободить дорогу",
      "Идти рядом и быстро читать скрипт",
      "Молча вложить листовку в руку",
    ],
    correct: 0,
    feedback: "Если интереса не было, листовку не навязываем. Человека сразу отпускаем.",
  },
  {
    title: "Уже занимается в другом клубе",
    situation: "«Спасибо, я уже хожу на фитнес»",
    options: [
      "Критиковать другой клуб",
      "«Здорово! Если захотите попробовать новое направление или атмосферу, для Вас есть сертификат на 2 групповых занятия»",
      "Сказать, что тогда LEVITA ей не подходит",
    ],
    correct: 1,
    feedback: "Не спорим с её выбором. Показываем дополнительную возможность и оставляем решение за ней.",
  },
  {
    title: "Сомневается из-за возраста",
    situation: "«Мне уже поздно начинать»",
    options: [
      "«В LEVITA занимаются женщины разного возраста и уровня подготовки. Тренер поможет начать комфортно»",
      "«Да что вы, вы выглядите моложе»",
      "«Тогда лучше не пробовать»",
    ],
    correct: 0,
    feedback: "Не оцениваем внешность и возраст. Говорим о бережном старте и разных уровнях подготовки.",
  },
  {
    title: "Живёт в другом районе",
    situation: "«Я не отсюда, мне будет далеко»",
    options: [
      "Попросить домашний адрес",
      "Самостоятельно выбрать ей студию",
      "«В VK-боте можно выбрать удобную студию: на Ставропольской или на Мачуги»",
    ],
    correct: 2,
    feedback: "Не собираем лишние данные и не определяем студию самостоятельно.",
  },
  {
    title: "Спрашивает о данных",
    situation: "«Кто увидит данные, которые я введу?»",
    options: [
      "«Вы сами вводите данные в официальном VK-боте LEVITA и подтверждаете согласие. Я их не записываю и не сохраняю»",
      "«Я сохраню их только до конца смены»",
      "«Это неважно, просто заполните форму»",
    ],
    correct: 0,
    feedback: "Честно объясняем путь данных и не просим передавать телефон промоутеру.",
  },
  {
    title: "Это бывшая клиентка",
    situation: "«Я раньше занималась в LEVITA»",
    options: [
      "Сразу закончить разговор",
      "«Здорово! Если хотите вернуться, можно оставить заявку. Администратор уточнит детали»",
      "Сказать, что бывшим клиенткам пробное запрещено",
    ],
    correct: 1,
    feedback: "Бывшая клиентка считается оплачиваемым лидом. Детали её возвращения уточнит администратор.",
  },
  {
    title: "Человек раздражён",
    situation: "«Отстаньте от меня!»",
    options: [
      "Объяснить, что вы просто работаете",
      "Ответить тем же тоном",
      "Отойти, не спорить и при необходимости сообщить куратору",
    ],
    correct: 2,
    feedback: "Безопасность важнее лида. Не доказываем свою правоту и не продолжаем контакт.",
  },
];

const testBank: TestQuestion[] = [
  { id: "audience", critical: true, question: "Кого мы приглашаем?", options: ["Любых взрослых прохожих", "Женщин примерно от 25 лет и старше", "Только женщин младше 40", "Только опытных спортсменок"], correct: 1, explanation: "Наша аудитория — девушки и женщины примерно от 25 лет и старше." },
  { id: "age-doubt", question: "Ты сомневаешься, подходит ли прохожая по возрасту. Что делать?", options: ["Спросить её точный возраст", "Сделать комплимент внешности", "Выбрать более очевидную аудиторию", "Подойти в любом случае и спросить позже"], correct: 2, explanation: "Мы не обсуждаем возраст и внешность прохожей." },
  { id: "first-step", question: "Как правильно начать контакт?", options: ["Перекрыть путь и сразу начать рассказ", "Поздороваться и попросить полминуты", "Сразу показать QR-код", "Молча протянуть листовку"], correct: 1, explanation: "Начинай с приветствия и короткого разрешения на разговор." },
  { id: "distance", question: "Где находиться во время разговора?", options: ["Встать вплотную прямо перед человеком", "Сбоку, сохраняя свободный путь", "Позади на расстоянии шага", "На краю проезжей части"], correct: 1, explanation: "Сохраняй личное пространство и не перекрывай дорогу." },
  { id: "refusal", critical: true, question: "Клиентка сказала: «Нет, спасибо». Что делать?", options: ["Задать ещё один уточняющий вопрос про спорт", "Предложить листовку молча", "Попрощаться и закончить контакт", "Пойти рядом ещё минуту"], correct: 2, explanation: "Первый ясный отказ завершает разговор." },
  { id: "follow", critical: true, question: "Можно ли идти следом после отказа?", options: ["Да, если не дольше минуты", "Да, если говорить спокойно", "Нет, контакт уже закончен", "Иногда, если мало лидов"], correct: 2, explanation: "Никогда не преследуй человека." },
  { id: "voice", question: "Какой стиль речи лучше?", options: ["Быстро и без пауз", "Спокойно, живо, коротко и с паузами", "Громко по готовому тексту", "Строго и очень уверенно"], correct: 1, explanation: "Нужен обычный человеческий разговор, а не рекламная скороговорка." },
  { id: "certificate", critical: true, question: "Что даёт сертификат промоутера?", options: ["Два групповых занятия", "Месячный абонемент", "Любую тренировку навсегда", "Скидку по выбору промоутера"], correct: 0, explanation: "По этому сертификату для клиентки — 2 групповых занятия." },
  { id: "subscriptions", question: "Что ответить о стоимости дальнейших занятий?", options: ["Назвать примерную цену", "Пообещать самую выгодную скидку клуба", "Направить к администратору", "Сказать, что цены нет"], correct: 2, explanation: "Промоутер не консультирует по абонементам и ценам." },
  { id: "valid", critical: true, question: "Когда лид считается валидным по действующему правилу?", options: ["QR-код просто открыли", "Клиентка взяла листовку", "Состоялся понятный дозвон", "Клиентка купила любой абонемент"], correct: 2, explanation: "Администратор дозвонился, клиентка ответила и понимает, кто и зачем звонит." },
  { id: "bot-open", critical: true, question: "Как начинается запись через VK-бот?", options: ["Клиентка сканирует личный QR промоутера", "Промоутер пишет ей в личку", "Куратор забирает её телефон", "Администратор заполняет бумагу"], correct: 0, explanation: "Личный QR промоутера открывает официальный VK-бот LEVITA." },
  { id: "personal-qr", question: "Зачем промоутеру личный QR-код?", options: ["Он показывает расписание всех смен клуба", "Он связывает лид с промоутером", "Он заменяет аккаунт ВКонтакте", "Он открывает карту территории"], correct: 1, explanation: "По личной ссылке система понимает, от какого промоутера пришла клиентка." },
  { id: "bot-action", critical: true, question: "Кто проходит шаги записи в боте?", options: ["Куратор после смены", "Промоутер со своего телефона", "Клиентка проходит всё на своём телефоне", "Любой человек рядом"], correct: 2, explanation: "Клиентка самостоятельно вводит данные в своём телефоне." },
  { id: "studio", question: "Где клиентка выбирает удобную студию?", options: ["В официальном VK-боте LEVITA", "В бумажном опроснике", "В телефоне промоутера", "После покупки абонемента"], correct: 0, explanation: "Бот предлагает выбрать студию на Ставропольской или на Мачуги." },
  { id: "privacy", critical: true, question: "Можно ли фотографировать экран с данными клиентки?", options: ["Да, чтобы отправить полный отчёт куратору", "Да, если сразу удалить", "Нет, персональные данные не копируем", "Только в первую смену"], correct: 2, explanation: "Не фотографируй, не переписывай и не сохраняй персональные данные." },
  { id: "consent", critical: true, question: "Как клиентка подтверждает обработку данных?", options: ["Устно говорит промоутеру", "Сама подтверждает в VK-боте", "Пишет согласие на обратной стороне листовки", "Передаёт телефон куратору"], correct: 1, explanation: "Согласие встроено в официальный путь записи в боте." },
  { id: "bot-finish", question: "Достаточно ли просто отсканировать QR-код?", options: ["Да, лид уже готов", "Нет, нужно завершить запись в боте", "Да, если взяли листовку", "Нет, сначала нужен телефон промоутера"], correct: 1, explanation: "Помоги дойти до завершения записи, не забирая телефон у клиентки." },
  { id: "duplicate", question: "Оплачивается ли повторная заявка той же клиентки?", options: ["Да, при каждом новом сканировании", "Нет, повтор не оплачивается", "Только на следующий день", "Да, если сменить студию"], correct: 1, explanation: "Повторные заявки не оплачиваются." },
  { id: "former", question: "Оплачивается ли заявка бывшей клиентки LEVITA?", options: ["Да, она считается оплачиваемым лидом", "Нет, она уже знакома с клубом", "Только после покупки", "Решает сам промоутер"], correct: 0, explanation: "Бывшая клиентка считается оплачиваемым лидом." },
  { id: "leaflet-interest", critical: true, question: "Кому отдавать листовку?", options: ["Всем женщинам подряд без разговора", "Только проявившей интерес", "Только знакомым людям", "Всем старше 55 лет"], correct: 1, explanation: "Листовка продолжает заинтересованный разговор, а не заменяет его." },
  { id: "leaflet-refusal", question: "Женщине неинтересно. Нужна ли ей листовка?", options: ["Да, положить в руку", "Нет, спокойно попрощаться", "Да, оставить рядом", "Да, если листовок осталось много"], correct: 1, explanation: "После отказа листовку не навязываем." },
  { id: "hurry", question: "Женщина торопится. Что делать?", options: ["Идти рядом и показывать QR-код", "Освободить путь и попрощаться", "Быстро взять её телефон", "Вложить листовку в сумку"], correct: 1, explanation: "Не задерживай человека и не продолжай разговор на ходу." },
  { id: "irritated", critical: true, question: "Человек требует отойти. Твоё действие?", options: ["Объяснить свою работу", "Отойти и завершить контакт", "Снять ситуацию на видео", "Позвать других промоутеров на помощь"], correct: 1, explanation: "Безопасность и уважение важнее заявки." },
  { id: "weather", question: "Что можно сделать при плохой погоде?", options: ["Уйти домой и ничего не писать куратору", "Зайти в студию и написать куратору", "Работать у проезжей части", "Спрятаться в чужом подъезде"], correct: 1, explanation: "Можно согреться в студии, оставаясь на связи." },
  { id: "territory", question: "Можно ли изменить территорию смены без согласования с куратором?", options: ["Да, если там больше людей", "Нет, сначала согласовать с куратором", "Да, после первого лида", "Да, если предупредить после смены"], correct: 1, explanation: "Работай в обозначенной зоне. Изменение территории сначала согласуют с куратором." },
  { id: "shift", question: "Как обычно устроена смена?", options: ["Всегда длится восемь часов", "Слот в чате, обычно на 2–3 часа", "Начинается без сообщения", "Заканчивается после десяти лидов"], correct: 1, explanation: "Доступные слоты публикуются в рабочем чате." },
  { id: "road", critical: true, question: "Где нельзя останавливать людей?", options: ["На свободной пешеходной зоне", "У дороги, на переходе или в плотной толпе", "Рядом с нашей студией", "На согласованной территории"], correct: 1, explanation: "Не создавай опасность и не мешай движению." },
  { id: "other-club", question: "Клиентка уже ходит в другой клуб. Что сказать?", options: ["Наш клуб точно лучше", "Можно попробовать новое направление", "Ей тогда не нужна LEVITA", "Попросить сначала отказаться от другого клуба"], correct: 1, explanation: "Уважай её выбор и предлагай дополнительную возможность без критики." },
  { id: "older", question: "Женщина считает себя слишком взрослой. Что ответить?", options: ["Сказать, на сколько лет она выглядит", "Рассказать о комфортном старте", "Согласиться с её сомнением", "Обещать быстрый результат"], correct: 1, explanation: "В LEVITA занимаются женщины разного возраста и уровня подготовки." },
  { id: "before", question: "Что проверить до выхода?", options: ["Только число оставшихся листовок", "Территорию, время, заряд и QR", "Цены всех абонементов", "Номера прошлых клиенток"], correct: 1, explanation: "Подготовь телефон, личный QR, листовки, одежду и данные смены." },
  { id: "pay", question: "За что идёт оплата за валидный лид?", options: ["За любую введённую цифру", "За понятный дозвон клиентке", "За каждую выданную листовку на улице", "За каждый начатый разговор"], correct: 1, explanation: "Валидный лид — дозвон, ответ и понимание цели звонка; за запись есть доплата." },
  { id: "report", question: "Что сделать после смены?", options: ["Молча выйти из чата", "Отчитаться и вернуть материалы", "Сохранить данные клиенток", "Выбросить все оставшиеся листовки"], correct: 1, explanation: "Сообщи об окончании и передай куратору полезные замечания." },
  { id: "survey-intro", critical: true, question: "Как честно начать соцопрос?", options: ["Скрыть название клуба до конца", "Назвать себя, LEVITA, пять вопросов и две минуты", "Сразу спросить телефон", "Сказать, что это государственный опрос"], correct: 1, explanation: "Сразу представься, назови LEVITA и скажи: пять вопросов, около двух минут." },
  { id: "survey-record", question: "Что фиксировать на листе соцопроса?", options: ["Имя и номер телефона", "Только выбранные варианты ответов", "Фото и домашний адрес", "Ссылку на личную страницу клиентки"], correct: 1, explanation: "Лист нужен для ответов, а не для персональных данных." },
  { id: "survey-interest", question: "Когда после опроса предложить запись?", options: ["До первого вопроса", "Когда ответы показывают интерес", "Каждой участнице опроса автоматически", "Только после выдачи листовки"], correct: 1, explanation: "Переходи к LEVITA, если клиентка хочет попробовать или явно интересуется форматом." },
  { id: "survey-no-interest", critical: true, question: "По ответам спорт сейчас неинтересен. Что делать?", options: ["Уговорить на бесплатное занятие", "Поблагодарить за ответы и попрощаться", "Отдать две листовки", "Попросить всё же открыть бот"], correct: 1, explanation: "Опрос может закончиться без лида — это нормально." },
  { id: "survey-data", question: "Можно ли писать телефон на листе соцопроса?", options: ["Да, если записать номер очень разборчиво", "Нет, только ответы без контактов", "Да, с разрешения друга", "Только для бывшей клиентки"], correct: 1, explanation: "Контактные данные вводятся клиенткой только в официальном VK-боте." },
  { id: "bot-help", question: "Клиентка просит помочь с ботом. Как поступить?", options: ["Забрать телефон и самостоятельно заполнить всё", "Подсказать шаги, не читая её данные", "Сфотографировать экран для помощи", "Попросить пароль от ВКонтакте"], correct: 1, explanation: "Покажи, куда нажать, но уважай личное пространство и данные." },
];

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function randomizeQuestion(question: TestQuestion): TestQuestion {
  const options = shuffle(question.options.map((text, index) => ({ text, correct: index === question.correct })));
  return {
    ...question,
    options: options.map((option) => option.text),
    correct: options.findIndex((option) => option.correct),
  };
}

function createAttemptQuestions() {
  const critical = testBank.filter((question) => question.critical);
  const regular = shuffle(testBank.filter((question) => !question.critical));
  return shuffle([...critical, ...regular.slice(0, 30 - critical.length)]).map(randomizeQuestion);
}

function Mark({ children }: { children: React.ReactNode }) {
  return <mark>{children}</mark>;
}

function Rule({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="rule">
      <span className="rule-number">{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

function ScriptCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <article className="script-card">
      <span>{label}</span>
      <blockquote>{children}</blockquote>
    </article>
  );
}

function AudienceCarousel() {
  const [current, setCurrent] = useState(0);
  const slide = audienceSlides[current];
  const move = (direction: number) => setCurrent((value) => (value + direction + audienceSlides.length) % audienceSlides.length);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="audience-carousel" aria-label="Примеры целевой аудитории">
      <div className="audience-photo">
        <img key={slide.src} className="audience-slide-image" src={slide.src} alt={slide.alt} style={{ objectPosition: slide.objectPosition }} />
        <span className="age-badge">{slide.age}</span>
      </div>
      <div className="audience-copy" aria-live="polite">
        <span className="eyebrow">Наша целевая аудитория</span>
        <h2>Девушки и женщины от 25 лет и старше</h2>
        <p>{slide.text}</p>
        <div className="carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Предыдущая фотография">←</button>
          <div className="carousel-dots" aria-label="Выбор фотографии">
            {audienceSlides.map((item, index) => (
              <button
                key={item.age}
                type="button"
                className={index === current ? "active" : ""}
                onClick={() => setCurrent(index)}
                aria-label={`Показать: ${item.age}`}
                aria-current={index === current}
              />
            ))}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Следующая фотография">→</button>
        </div>
        <small>Не пытайся угадать точный возраст и никогда не обсуждай его вслух. Фотографии — только ориентир.</small>
      </div>
    </section>
  );
}

function TargetPractice() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  return (
    <div className="target-practice">
      {targetCases.map((item, index) => {
        const answered = Object.prototype.hasOwnProperty.call(answers, index);
        const isCorrect = answers[index] === item.correct;
        return (
          <article key={item.text} className={`target-case ${answered ? (isCorrect ? "correct" : "wrong") : ""}`}>
            <span>Ситуация {index + 1}</span>
            <p>{item.text}</p>
            <div className="target-actions">
              <button type="button" onClick={() => setAnswers((value) => ({ ...value, [index]: true }))}>Подойти</button>
              <button type="button" onClick={() => setAnswers((value) => ({ ...value, [index]: false }))}>Не подходить</button>
            </div>
            {answered && <small>{isCorrect ? "Верно. " : "Не совсем. "}{item.feedback}</small>}
          </article>
        );
      })}
    </div>
  );
}

function DialogueLibrary({ items = dialogues, ariaLabel = "Варианты диалогов" }: { items?: Dialogue[]; ariaLabel?: string }) {
  const [active, setActive] = useState(0);
  const dialogue = items[active];
  return (
    <div className="dialogue-library">
      <div className="dialogue-tabs" role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <button key={item.title} type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)}>
            <small>{item.subtitle}</small>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <article className="phone-dialogue">
        <div className="phone-top"><span>Разговор на улице</span><i /></div>
        <div className="chat-stream">
          {dialogue.messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={`chat-message ${message.role}`}>
              <small>{message.role === "promoter" ? "Промоутер" : "Клиентка"}</small>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className={`dialogue-result ${dialogue.outcome}`}>
          <strong>{dialogue.outcome === "success" ? "Хороший результат" : dialogue.outcome === "neutral" ? "Правильное завершение" : "Нужно исправить"}</strong>
          <p>{dialogue.note}</p>
        </div>
      </article>
    </div>
  );
}

function Scenario({ title, situation, options, correct, feedback, onAnswered }: { title: string; situation: string; options: string[]; correct: number; feedback: string; onAnswered: (title: string) => void }) {
  const [selected, setSelected] = useState<number>();
  return (
    <article className="scenario">
      <span>{title}</span>
      <h3>{situation}</h3>
      <div className="scenario-options">
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={selected === index ? (index === correct ? "correct" : "wrong") : ""}
            onClick={() => {
              setSelected(index);
              if (index === correct) onAnswered(title);
            }}
          >
            <i>{String.fromCharCode(65 + index)}</i>{option}
          </button>
        ))}
      </div>
      {selected !== undefined && (
        <p className={`scenario-feedback ${selected === correct ? "correct" : "wrong"}`}>
          <strong>{selected === correct ? "Верно." : "Попробуй запомнить правильный принцип."}</strong> {feedback}
        </p>
      )}
    </article>
  );
}

type SavedTestState = {
  attemptsUsed: number;
  passed: boolean;
  lastResult?: {
    name: string;
    score: number;
    attempt: number;
    date: string;
    criticalPassed: boolean;
    mistakes: Array<{ id: string; question: string; selected: string; correct: string; explanation: string }>;
  };
};

function TestPanel() {
  const [name, setName] = useState("");
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"intro" | "question" | "result">("intro");
  const [lastResult, setLastResult] = useState<SavedTestState["lastResult"]>();
  const [passed, setPassed] = useState(false);
  const selected = questions[current] ? answers[questions[current].id] : undefined;

  useEffect(() => {
    let timer: number | undefined;
    try {
      const stored = window.localStorage.getItem("levita-promoter-test-v4");
      if (!stored) return;
      const parsed = JSON.parse(stored) as SavedTestState;
      timer = window.setTimeout(() => {
        setAttemptsUsed(parsed.attemptsUsed ?? 0);
        setPassed(Boolean(parsed.passed));
        setLastResult(parsed.lastResult);
        if (parsed.lastResult) {
          setName(parsed.lastResult.name);
          setPhase("result");
        }
      }, 0);
    } catch {
      // Local test progress is optional; a corrupt entry starts a clean attempt.
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const start = () => {
    if (name.trim().length < 2 || attemptsUsed >= 2 || passed) return;
    setQuestions(createAttemptQuestions());
    setAnswers({});
    setCurrent(0);
    setPhase("question");
  };

  const finish = () => {
    const score = questions.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
    const criticalPassed = questions.filter((question) => question.critical).every((question) => answers[question.id] === question.correct);
    const isPassed = score >= 27 && criticalPassed;
    const nextAttempts = attemptsUsed + 1;
    const mistakes = questions
      .filter((question) => answers[question.id] !== question.correct)
      .map((question) => ({
        id: question.id,
        question: question.question,
        selected: question.options[answers[question.id]] ?? "Нет ответа",
        correct: question.options[question.correct],
        explanation: question.explanation,
      }));
    const result = {
      name: name.trim(),
      score,
      attempt: nextAttempts,
      date: new Date().toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" }),
      criticalPassed,
      mistakes,
    };
    setAttemptsUsed(nextAttempts);
    setPassed(isPassed);
    setLastResult(result);
    setPhase("result");
    window.localStorage.setItem("levita-promoter-test-v4", JSON.stringify({ attemptsUsed: nextAttempts, passed: isPassed, lastResult: result } satisfies SavedTestState));
  };

  if (phase === "result" && lastResult) {
    const isPassed = lastResult.score >= 27 && lastResult.criticalPassed;
    return (
      <section className="test-result-wrap">
        <div className={`result-certificate ${isPassed ? "passed" : "failed"}`}>
          <div className="result-brand">LEVITA <span>• обучение промоутера</span></div>
          <span className="eyebrow">Результат итогового теста</span>
          <h1>{isPassed ? "Допущен(а) к первой смене" : "Нужно повторить материал"}</h1>
          <div className="result-person">
            <span>Промоутер</span>
            <strong>{lastResult.name}</strong>
          </div>
          <div className="result-grid">
            <div><span>Результат</span><strong>{lastResult.score} / 30</strong></div>
            <div><span>Попытка</span><strong>{lastResult.attempt} / 2</strong></div>
            <div><span>Критические правила</span><strong>{lastResult.criticalPassed ? "Без ошибок" : "Есть ошибка"}</strong></div>
          </div>
          <p>{lastResult.date}</p>
          <div className="screenshot-callout">Сделай скриншот этого блока целиком и отправь его куратору.</div>
        </div>
        <div className="result-review">
          <div className="section-heading compact">
            <span className="eyebrow">Сводка после завершения</span>
            <h2>{lastResult.mistakes.length === 0 ? "Все ответы верные" : `Разбери ошибки: ${lastResult.mistakes.length}`}</h2>
            <p>Правильные ответы показываются только сейчас — после отправки всего теста.</p>
          </div>
          {lastResult.mistakes.map((mistake, index) => (
            <article className="result-review-item" key={`${mistake.id}-${index}`}>
              <span>Вопрос {index + 1}</span>
              <h3>{mistake.question}</h3>
              <p><strong>Твой ответ:</strong> {mistake.selected}</p>
              <p><strong>Правильный ответ:</strong> {mistake.correct}</p>
              <small>{mistake.explanation}</small>
            </article>
          ))}
        </div>
        {!isPassed && attemptsUsed < 2 && (
          <div className="test-retry">
            <p>У тебя осталась одна попытка. Перед ней повтори целевую аудиторию, работу с листовкой, персональные данные и правила безопасности.</p>
            <button type="button" className="button button-primary" onClick={() => setPhase("intro")}>Подготовиться ко второй попытке</button>
          </div>
        )}
        {!isPassed && attemptsUsed >= 2 && (
          <div className="test-retry locked"><strong>Две попытки использованы.</strong><p>Напиши куратору: он подскажет, какие разделы повторить и что делать дальше.</p></div>
        )}
      </section>
    );
  }

  if (phase === "intro") {
    return (
      <section className="test-start">
        <span className="test-seal">30</span>
        <span className="eyebrow">Финальная проверка</span>
        <h1>Готов(а) к первой смене?</h1>
        <p>В каждой попытке — 30 вопросов из расширенного банка. Варианты перемешиваются. Во время теста подсказок нет: правильные ответы и разбор появятся только после завершения.</p>
        <div className="test-rules">
          <div><strong>2</strong><span>попытки</span></div>
          <div><strong>27 / 30</strong><span>минимальный результат</span></div>
          <div><strong>100%</strong><span>по критическим правилам</span></div>
        </div>
        <label className="name-field">
          <span>Имя и фамилия для результата</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например: Анна Иванова" autoComplete="name" />
        </label>
        {attemptsUsed > 0 && <p className="attempt-note">Использовано попыток: {attemptsUsed} из 2.</p>}
        <button type="button" className="button button-primary" disabled={name.trim().length < 2 || attemptsUsed >= 2 || passed} onClick={start}>
          {attemptsUsed === 0 ? "Начать первую попытку" : "Начать вторую попытку"}
        </button>
      </section>
    );
  }

  const question = questions[current];
  return (
    <section className="test-question">
      <div className="question-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <div className="question-meta"><span>Вопрос {current + 1} из {questions.length}</span>{question.critical && <strong>Критическое правило</strong>}</div>
      <h2>{question.question}</h2>
      <div className="test-options">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={`test-option ${selected === index ? "selected" : ""}`}
            onClick={() => setAnswers((value) => ({ ...value, [question.id]: index }))}
          >
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
      </div>
      <div className="test-navigation">
        <button type="button" className="button button-secondary" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>← Назад</button>
        {current < questions.length - 1 ? (
          <button type="button" className="button button-primary" disabled={selected === undefined} onClick={() => setCurrent((value) => value + 1)}>Следующий вопрос</button>
        ) : (
          <button type="button" className="button button-primary" disabled={selected === undefined} onClick={finish}>Завершить тест</button>
        )}
      </div>
    </section>
  );
}

function ModuleContent({ active, onScenarioAnswered }: { active: number; onScenarioAnswered: (title: string) => void }) {
  if (active === 0) {
    return (
      <>
        <section className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Обучение промоутера LEVITA</span>
            <h1>Первая смена<br />без страха и <em>заученных фраз</em></h1>
            <p className="lead">Здесь ты научишься спокойно знакомиться с людьми, проводить короткий соцопрос и уверенно рассказывать заинтересованным женщинам о следующих шагах без давления.</p>
            <div className="hero-facts">
              <div><strong>25+</strong><span>девушки и женщины от 25 лет и старше</span></div>
              <div><strong>2 занятия</strong><span>по сертификату промоутера</span></div>
              <div><strong>2–3 часа</strong><span>обычная продолжительность смены</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/client-portrait-1.jpg" alt="Женщина из целевой аудитории LEVITA" />
            <div className="hero-note"><span>Твоя роль</span><strong>Познакомить — не продавать</strong><p>Заинтересуй и подскажи удобный следующий шаг.</p></div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading"><span className="eyebrow">Что это за работа</span><h2>Ты — первое дружелюбное знакомство с LEVITA</h2></div>
          <div className="statement-card"><p>LEVITA — <Mark>женский фитнес-клуб</Mark> с активными и спокойными направлениями: силовыми тренировками, пилатесом, растяжкой, танцами и хореографией. Тебе не нужно продавать абонемент. Нужно заинтересовать клиента, помочь сделать следующий шаг и понятно объяснить следующий этап.</p></div>
          <div className="benefit-grid">
            <article><span>01</span><h3>Навык общения</h3><p>Научишься легко начинать разговор и не теряться после неожиданного вопроса.</p></article>
            <article><span>02</span><h3>Понятная оплата</h3><p>Оплата идёт за валидный лид, дополнительная — когда клиентка записалась на пробное.</p></article>
            <article><span>03</span><h3>Поддержка</h3><p>Куратор и рабочий чат помогут со слотами, территорией и сложными ситуациями.</p></article>
            <article><span>04</span><h3>Бонусы</h3><p>Особенно отличившиеся промоутеры смогут посещать занятия LEVITA.</p></article>
          </div>
        </section>
      </>
    );
  }

  if (active === 1) {
    return (
      <section className="content-section wide">
        <div className="section-heading"><span className="eyebrow">Шаг 1</span><h1>К кому подходить на улице</h1><p>Нам подходят девушки и женщины примерно от 25 лет и старше. Важно не только кто перед тобой, но и удобен ли сейчас момент для разговора.</p></div>
        <AudienceCarousel />
        <div className="decision-rule"><strong>Формула выбора</strong><span>Подходит по аудитории</span><i>+</i><span>Не разговаривает по телефону</span><i>+</i><span>Не спешит и находится в безопасном месте</span><i>=</i><b>Можно поздороваться</b></div>
        <div className="section-heading compact"><span className="eyebrow">Проверь себя</span><h2>Подойти или не подходить?</h2></div>
        <TargetPractice />
      </section>
    );
  }

  if (active === 2) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 2</span><h1>Как аккуратно начать разговор</h1><p>Твоя цель — не выдать весь текст за десять секунд. Сначала создай спокойный контакт и пойми, интересно ли человеку продолжать.</p></div>
        <div className="rules-list">
          <Rule number="01" title="Выбери момент">Не подходи на переходе, у проезжей части, во время звонка или когда человек явно спешит.</Rule>
          <Rule number="02" title="Оставь пространство">Подойди немного сбоку, не перекрывай путь и не касайся человека.</Rule>
          <Rule number="03" title="Скажи одну фразу">Поздоровайся и попроси несколько секунд. Затем сделай паузу — не начинай скороговорку.</Rule>
          <Rule number="04" title="Задай лёгкий вопрос">Спроси про фитнес, растяжку или танцы. Ответ поможет продолжить нормальный разговор.</Rule>
          <Rule number="05" title="Прими решение">Если интереса нет — доброжелательно попрощайся. Один ясный отказ завершает разговор.</Rule>
        </div>

        <div className="works-block">
          <div className="works-card good"><span>Помогает разговору</span><ul><li>Спокойное «Здравствуйте!»</li><li>«Можно один короткий вопрос?»</li><li>Нормальная громкость и паузы</li><li>Интерес к ответу клиентки</li><li>Возможность легко отказаться</li></ul></div>
          <div className="works-card bad"><span>Мешает разговору</span><ul><li>«Стойте!» или крик издалека</li><li>Просьба о номере в первой фразе</li><li>Весь скрипт без остановки</li><li>Разговор о ценах и абонементах</li><li>Спор, давление или движение следом</li></ul></div>
        </div>

        <ScriptCard label="Вариант 1 · коротко и прямо">«Здравствуйте! Можно буквально полминуты? Я представляю женский фитнес-клуб LEVITA рядом. Вам было бы интересно попробовать новое направление тренировок?»</ScriptCard>
        <ScriptCard label="Вариант 2 · через вопрос">«Здравствуйте! Можно один короткий вопрос про спорт? Вы раньше занимались фитнесом, растяжкой или танцами?»<br /><br />После ответа: «Тогда вам может понравиться LEVITA. У нас есть и спокойные, и активные направления. По этому сертификату для Вас — 2 групповых занятия».</ScriptCard>

        <div className="conversation-flow" aria-label="Конструктор разговора">
          {[["1","Контакт","Поздоровайся"],["2","Вопрос","Узнай интерес"],["3","Польза","Коротко о LEVITA"],["4","Действие","Запись или листовка"]].map(([number,title,text]) => <div key={number}><span>{number}</span><strong>{title}</strong><small>{text}</small></div>)}
        </div>
      </section>
    );
  }

  if (active === 3) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 3 · практика</span><h1>Четыре разговора, которые стоит запомнить</h1><p>Не учи каждое слово. Запомни порядок: приветствие → вопрос → польза → понятное действие → уважительное завершение.</p></div>
        <DialogueLibrary />
        <div className="memory-card"><strong>Главный ориентир</strong><p>Хороший диалог — это не обязательно заявка. Если ты уважительно принял отказ и не испортил впечатление о LEVITA, ты всё сделал правильно.</p></div>
      </section>
    );
  }

  if (active === 4) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 4 · отдельная механика</span><h1>Механика «Социальный опрос на улице»</h1><p>Опрос помогает начать спокойный разговор и понять интерес клиентки. Это не уловка: сразу назови себя, LEVITA, тему и длительность.</p></div>
        <div className="survey-intro-card">
          <span className="eyebrow">Фраза для старта</span>
          <blockquote>«Здравствуйте! Меня зовут …, я представляю женский фитнес-клуб LEVITA. Мы проводим короткий опрос о спорте — пять вопросов, около двух минут. Можно?»</blockquote>
          <small>Если человек отказался — поблагодари и отпусти. Не начинай вопросы без согласия.</small>
        </div>

        <div className="survey-questions">
          <div className="section-heading compact"><span className="eyebrow">Лист опроса</span><h2>Пять вопросов без персональных данных</h2><p>На выданном листе отмечай только варианты ответов. Имя, телефон, адрес и аккаунт ВКонтакте записывать нельзя.</p></div>
          {[
            ["01", "Получается ли у вас сейчас регулярно заниматься спортом?", "Регулярно · Иногда · Сейчас не занимаюсь"],
            ["02", "Что вам ближе?", "Активные тренировки · Мягкий фитнес · Растяжка и танцы · Пока не знаю"],
            ["03", "Что для вас важнее всего в клубе?", "Атмосфера · Помощь тренера · Удобное расписание · Разнообразие"],
            ["04", "Что чаще мешает начать?", "Не хватает времени · Сложно выбрать формат · Неуверенность · Ничего"],
            ["05", "Хотели бы получить сертификат на 2 групповых занятия и попробовать подходящее направление?", "Да · Возможно · Нет"],
          ].map(([number, question, answers]) => (
            <article className="survey-question" key={number}><span>{number}</span><div><h3>{question}</h3><p>{answers}</p></div></article>
          ))}
        </div>

        <div className="survey-decision">
          <article className="yes"><span>Есть интерес</span><h3>Предложи следующий шаг</h3><p>Клиентка ответила «да» или «возможно» на последний вопрос, хочет начать, называет интересное направление или задаёт вопросы о клубе.</p><blockquote>«Спасибо! По вашим ответам Вам может подойти … По этому сертификату для Вас — 2 групповых занятия. Хотите выбрать удобный способ записи?»</blockquote></article>
          <article className="no"><span>Интереса нет</span><h3>Спокойно заверши</h3><p>Клиентка прямо говорит, что спорт ей неинтересен и пробовать она не хочет.</p><blockquote>«Спасибо за ответы. Хорошего дня!»</blockquote></article>
        </div>

        <div className="section-heading compact"><span className="eyebrow">Примеры</span><h2>Четыре диалога соцопроса</h2><p>Переключай вкладки и обрати внимание на переход от ответа к записи.</p></div>
        <DialogueLibrary items={surveyDialogues} ariaLabel="Примеры социального опроса" />
      </section>
    );
  }

  if (active === 5) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 5</span><h1>Лид через VK-бот и листовка</h1><p>Личный QR-код - один из способов самостоятельной записи. Показывай его заинтересованной клиентке, если ей удобно перейти к записи через VK-бот.</p></div>
        <div className="lead-definition"><span>Почему QR личный</span><p>Ссылка связывает заявку именно с тобой. Поэтому показывай только свой QR и не пересылай код другого промоутера.</p></div>
        <ScriptCard label="Один из способов записи">«Если вам удобно, отсканируйте мой QR-код: откроется официальный VK-бот LEVITA. Там можно самостоятельно выбрать студию и перейти к записи на пробное».</ScriptCard>

        <div className="bot-grid">
          <div className="bot-image"><img src="/vk-bot-example.jpg" alt="Пример записи на пробное занятие в VK-боте LEVITA" /></div>
          <div className="bot-steps">
            <Rule number="01" title="Покажи свой QR">Держи код ровно и дай клиентке спокойно его отсканировать.</Rule>
            <Rule number="02" title="Откройте запись">В боте клиентка нажимает «Записаться на пробное».</Rule>
            <Rule number="03" title="Выберите студию">Клиентка сама выбирает Ставропольскую, 174/1 или Мачуги, 4.</Rule>
            <Rule number="04" title="Завершите шаги">Подсказывай, куда нажать, но не читай и не переписывай её данные.</Rule>
            <Rule number="05" title="Проверь результат">Убедись, что запись завершена. Простого открытия бота недостаточно.</Rule>
          </div>
        </div>

        <div className="leaflet-section">
          <div className="leaflet-visual"><img src="/promoter-leaflet.png" alt="Листовка-сертификат LEVITA с QR-кодами" /></div>
          <div className="leaflet-copy">
            <span className="eyebrow">Листовка — не для массовой раздачи</span>
            <h2>Отдавай её только после появления интереса</h2>
            <p>Листовка помогает сохранить информацию о клубе. Она уместна после хорошего разговора или опроса, если клиентка хочет записаться сейчас либо вернуться к предложению позже.</p>
            <div className="leaflet-decisions">
              <div className="yes"><strong>Дать</strong><span>Есть интерес, вопросы о клубе, желание попробовать или записаться позже.</span></div>
              <div className="no"><strong>Не давать</strong><span>Человек отказался, проходит мимо или не относится к целевой аудитории.</span></div>
            </div>
            <small>Не объясняй условия абонементов. Актуальные варианты клиентке сообщит администратор.</small>
          </div>
        </div>

        <div className="privacy-note"><strong>Персональные данные остаются в телефоне клиентки.</strong><p>Не проси назвать номер вслух, не забирай телефон, не фотографируй экран и не переписывай данные. Согласие на обработку клиентка подтверждает внутри VK-бота.</p></div>
        <div className="pay-note"><div><span>Личный QR</span><p>Помогает связать заявку с тобой.</p></div><div><span>Валидный лид</span><p>Есть дозвон, ответ и понимание цели звонка.</p></div><div><span>Важно</span><p>Повтор не оплачивается. Бывшая клиентка оплачивается.</p></div></div>
      </section>
    );
  }

  if (active === 6) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 6 · тренировка</span><h1>Сложные ситуации без паники</h1><p>Выбирай ответ, получай объяснение и запоминай принцип. На улице не нужно звучать идеально — важно быть честным, спокойным и уважительным.</p></div>
        <div className="scenario-list">
          {difficultSituations.map((scenario) => <Scenario key={scenario.title} {...scenario} onAnswered={onScenarioAnswered} />)}
        </div>
      </section>
    );
  }

  if (active === 7) {
    return (
      <section className="content-section narrow">
        <div className="section-heading"><span className="eyebrow">Шаг 7</span><h1>Подготовка к первой смене</h1><p>Доступные смены публикуются в рабочем чате. Обычная продолжительность — 2–3 часа. Выбирай только тот слот, который точно сможешь отработать.</p></div>
        <div className="timeline">
          <div><span>До выхода</span><ul><li>Выбери свободную смену в чате</li><li>Проверь территорию и точное время</li><li>Заряди телефон и проверь личный QR</li><li>Возьми листы опроса и листовки</li><li>Сохрани контакт куратора</li></ul></div>
          <div><span>Во время смены</span><ul><li>Сообщи о начале работы</li><li>Оставайся в обозначенной территории</li><li>Не стой у дороги и не мешай проходу</li><li>Не заходи за незнакомыми людьми в машину, подъезд или закрытое помещение</li><li>При тревоге или конфликте сразу отойди и напиши куратору</li></ul></div>
          <div><span>После смены</span><ul><li>Сообщи об окончании в рабочем чате</li><li>Верни листы опроса и оставшиеся материалы</li><li>Расскажи, какие вопросы задавали чаще всего</li><li>Не храни данные и скриншоты клиенток</li><li>Отметь, что хотелось бы потренировать</li></ul></div>
        </div>
        <div className="weather-card"><div className="weather-symbol">☕</div><div><span className="eyebrow">Если испортилась погода</span><h2>Можно зайти в студию</h2><p>Согрейся, выпей чай, познакомься с атмосферой и клиентками. Сообщи куратору, где находишься, и не рискуй здоровьем ради заявки.</p></div></div>
        <div className="safety-grid"><article><strong>Человек грубит</strong><p>Не отвечай тем же. Отойди и сообщи куратору, если ситуация не заканчивается.</p></article><article><strong>Стало плохо</strong><p>Сразу прекрати работу, зайди в безопасное место и свяжись с куратором или близким взрослым.</p></article><article><strong>Не уверен(а), что ответить</strong><p>Не придумывай. Скажи: «Этот вопрос лучше уточнить у администратора».</p></article></div>
      </section>
    );
  }

  return <TestPanel />;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const maxUnlocked = Math.min(8, completed.size);
  const progress = Math.round((completed.size / 8) * 100);
  const difficultSituationsPassed = completedScenarios.size === difficultSituations.length;

  const completeAndNext = () => {
    if (active >= 8 || (active === 6 && !difficultSituationsPassed)) return;
    setCompleted((previous) => new Set([...previous, active]));
    setActive((value) => Math.min(8, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markScenarioCompleted = (title: string) => {
    setCompletedScenarios((previous) => new Set([...previous, title]));
  };

  const navigate = (index: number) => {
    if (index > maxUnlocked) return;
    setActive(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="course-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => navigate(0)} aria-label="На начало курса">LEVITA</button>
        <div className="top-progress"><span>Пройдено</span><div><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
        <a className="pdf-link" href="/promoter-cheatsheet.pdf" target="_blank" rel="noreferrer">Шпаргалка PDF</a>
      </header>

      <aside className="course-sidebar">
        <div className="course-label"><span>Курс</span><strong>Промоутер LEVITA</strong><small>около 90 минут</small></div>
        <nav aria-label="Разделы курса">
          {modules.map((module, index) => {
            const locked = index > maxUnlocked;
            const done = completed.has(index);
            return (
              <button key={module.number} type="button" className={active === index ? "active" : ""} disabled={locked} onClick={() => navigate(index)}>
                <span>{done ? "✓" : module.number}</span><div><strong>{module.title}</strong><small>{locked && index === 8 ? "откроется после курса" : module.time}</small></div>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="course-main">
        <ModuleContent active={active} onScenarioAnswered={markScenarioCompleted} />
        {active < 8 && (
          <div className="module-navigation">
            <button type="button" className="button button-secondary" disabled={active === 0} onClick={() => navigate(active - 1)}>← Назад</button>
            <div className="module-next">
              {active === 6 && !difficultSituationsPassed && <p className="module-gate-note">Выбери правильный ответ во всех ситуациях, чтобы открыть следующий раздел.</p>}
              <button type="button" className="button button-primary" disabled={active === 6 && !difficultSituationsPassed} onClick={completeAndNext}>{active === 7 ? "Перейти к итоговому тесту" : "Раздел понятен — дальше"}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
