from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "shpargalka-promoutera-levita.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

GRAPHITE = colors.HexColor("#101A25")
GOLD = colors.HexColor("#EEC95C")
GOLD_SOFT = colors.HexColor("#F8EAB8")
PAPER = colors.HexColor("#F8F6F1")
MUTED = colors.HexColor("#5D6670")
WHITE = colors.white
LINE = colors.HexColor("#D7D6D1")

font_dir = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("LevitaText", str(font_dir / "arial.ttf")))
pdfmetrics.registerFont(TTFont("LevitaTextBold", str(font_dir / "arialbd.ttf")))

styles = getSampleStyleSheet()
title = ParagraphStyle(
    "TitleLevita",
    parent=styles["Title"],
    fontName="LevitaTextBold",
    fontSize=29,
    leading=32,
    textColor=GRAPHITE,
    alignment=TA_LEFT,
    spaceAfter=6 * mm,
)
subtitle = ParagraphStyle(
    "SubtitleLevita",
    parent=styles["Normal"],
    fontName="LevitaText",
    fontSize=10.5,
    leading=15,
    textColor=MUTED,
    spaceAfter=5 * mm,
)
section = ParagraphStyle(
    "SectionLevita",
    parent=styles["Heading2"],
    fontName="LevitaTextBold",
    fontSize=15,
    leading=18,
    textColor=GRAPHITE,
    spaceBefore=3 * mm,
    spaceAfter=2.5 * mm,
)
body = ParagraphStyle(
    "BodyLevita",
    parent=styles["BodyText"],
    fontName="LevitaText",
    fontSize=9.2,
    leading=13.2,
    textColor=GRAPHITE,
)
body_small = ParagraphStyle(
    "BodySmallLevita",
    parent=body,
    fontSize=8.2,
    leading=11.5,
)
body_white = ParagraphStyle(
    "BodyWhiteLevita",
    parent=body,
    textColor=WHITE,
)
card_title = ParagraphStyle(
    "CardTitleLevita",
    parent=body,
    fontName="LevitaTextBold",
    fontSize=9.2,
    leading=12,
    spaceAfter=1.5 * mm,
)
eyebrow = ParagraphStyle(
    "EyebrowLevita",
    parent=body,
    fontName="LevitaTextBold",
    fontSize=7.5,
    leading=9,
    textColor=colors.HexColor("#9A7615"),
    uppercase=True,
    spaceAfter=1.5 * mm,
)
center = ParagraphStyle(
    "CenterLevita",
    parent=body,
    alignment=TA_CENTER,
)


def p(text, style=body):
    return Paragraph(text, style)


def card(title_text, text, background=WHITE, width=55 * mm, text_style=body_small):
    table = Table(
        [[p(title_text, card_title)], [p(text, text_style)]],
        colWidths=[width],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("TOPPADDING", (0, 0), (-1, 0), 3.5 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 0),
                ("TOPPADDING", (0, 1), (-1, 1), 1 * mm),
                ("BOTTOMPADDING", (0, 1), (-1, 1), 3.5 * mm),
            ]
        )
    )
    return table


def compact_card(title_text, text, background=WHITE, width=56 * mm):
    compact = ParagraphStyle(
        "CompactCardLevita",
        parent=body_small,
        fontSize=6.7,
        leading=8.2,
    )
    table = Table(
        [[p(f"<b>{title_text}:</b> {text}", compact)]],
        colWidths=[width],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 2.2 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2.2 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 1.2 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.2 * mm),
            ]
        )
    )
    return table


def numbered_rows(items):
    rows = []
    for index, (heading, text) in enumerate(items, start=1):
        rows.append(
            [
                p(f"<b>{index:02d}</b>", center),
                p(f"<b>{heading}</b><br/>{text}", body),
            ]
        )
    table = Table(rows, colWidths=[13 * mm, 160 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("BACKGROUND", (0, 0), (0, -1), GOLD_SOFT),
                ("LEFTPADDING", (0, 0), (-1, -1), 3.2 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3.2 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 2.8 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.8 * mm),
            ]
        )
    )
    return table


def banner(label, text):
    table = Table(
        [[p(label, ParagraphStyle("BannerLabel", parent=eyebrow, textColor=GOLD)), p(text, body_white)]],
        colWidths=[35 * mm, 138 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GRAPHITE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
            ]
        )
    )
    return table


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(WHITE)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(GRAPHITE)
    canvas.rect(0, height - 14 * mm, width, 14 * mm, fill=1, stroke=0)
    canvas.setFont("LevitaTextBold", 12)
    canvas.setFillColor(WHITE)
    canvas.drawString(17 * mm, height - 9.2 * mm, "LEVITA")
    canvas.setFont("LevitaText", 7.5)
    canvas.setFillColor(GOLD)
    canvas.drawRightString(width - 17 * mm, height - 9 * mm, "ОБУЧЕНИЕ ПРОМОУТЕРА")
    canvas.setStrokeColor(LINE)
    canvas.line(17 * mm, 13 * mm, width - 17 * mm, 13 * mm)
    canvas.setFont("LevitaText", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(17 * mm, 8.5 * mm, "Короткая памятка для смены")
    canvas.drawRightString(width - 17 * mm, 8.5 * mm, f"{doc.page}")
    if doc.page == 3:
        canvas.setFont("LevitaText", 6.2)
        canvas.setFillColor(GRAPHITE)
        canvas.drawCentredString(
            width / 2,
            16.8 * mm,
            "Данные: не копируй из VK/MAX-бота и SMS  •  Безопасность: отойди и напиши куратору  •  Тест: 27/30, две попытки",
        )
    canvas.restoreState()


doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=22 * mm,
    bottomMargin=18 * mm,
    title="Шпаргалка промоутера LEVITA",
    author="LEVITA",
)

story = [
    p("Шпаргалка промоутера", title),
    p("Коротко повтори правила перед сменой. Твоя задача - заинтересовать, помочь понять, что такое LEVITA, и подсказать следующий этап, а не продавать абонемент.", subtitle),
]

fact_cards = Table(
    [[
        card("25+", "Девушки и женщины примерно от 25 лет и старше.", GOLD_SOFT),
        card("2 занятия", "Бесплатных групповых по сертификату.", WHITE),
        card("2-3 часа", "Обычная продолжительность смены по слоту в чате.", WHITE),
    ]],
    colWidths=[58 * mm] * 3,
)
fact_cards.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm)]))
story += [fact_cards, Spacer(1, 5 * mm), p("Обычный разговор", section)]
story += [banner("КАК ОПЛАЧИВАЕТСЯ РАБОТА", "Оплата идёт отдельно за контакт, которому удалось дозвониться и который понимает, что такое LEVITA и почему ему звонят. Отдельная оплата - за посещение этим клиентом пробного занятия.")]
story.append(numbered_rows([
    ("Выбери момент", "Не подходи на переходе, у дороги, во время звонка или когда человек явно спешит."),
    ("Поздоровайся", "Подойди немного сбоку и не перекрывай путь: «Здравствуйте! Можно один короткий вопрос?»"),
    ("Узнай интерес", "Спроси о фитнесе, растяжке, пилатесе или танцах. Слушай ответ, не читай заученный текст."),
    ("Коротко расскажи", "LEVITA - женский фитнес-клуб с активными и спокойными направлениями. По этому сертификату для Вас - 2 бесплатных групповых занятия."),
    ("Предложи следующий шаг", "Если клиентке удобно, покажи личный QR: VK-бот - один из способов самостоятельной записи."),
]))
story += [Spacer(1, 4 * mm), p("Два удобных начала", section)]

scripts = Table([[ 
    card("Прямо", "«Здравствуйте! Можно полминуты? Я представляю женский фитнес-клуб LEVITA. Вам было бы интересно попробовать новое направление тренировок?»", WHITE, 85 * mm, body_small),
    card("Через вопрос", "«Здравствуйте! Можно один короткий вопрос про спорт? Вы раньше занимались фитнесом, растяжкой или танцами?»", WHITE, 85 * mm, body_small),
]], colWidths=[87 * mm] * 2)
scripts.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm)]))
story += [scripts, Spacer(1, 4 * mm), banner("ОДИН ОТКАЗ", "«Понимаю. Хорошего дня!» - и контакт закончен. Не спорь, не иди следом и не навязывай листовку."), PageBreak()]

story += [
    p("Социальный опрос", title),
    p("Честно назови себя и LEVITA. Скажи, что это около двух минут и пять коротких вопросов. На листе отмечай только варианты ответов - без имени, телефона и других персональных данных.", subtitle),
    banner("ФРАЗА ДЛЯ СТАРТА", "«Здравствуйте! Меня зовут ..., я представляю женский фитнес-клуб LEVITA. Мы проводим короткий опрос о спорте - около двух минут и пять коротких вопросов. Можно?»"),
    Spacer(1, 4 * mm),
    p("Пять вопросов", section),
    numbered_rows([
        ("Регулярность", "Получается ли у вас сейчас регулярно заниматься спортом? Регулярно / иногда / сейчас не занимаюсь."),
        ("Формат", "Что вам ближе? Активные тренировки / мягкий фитнес / растяжка и танцы / пока не знаю."),
        ("Что важно", "Атмосфера / помощь тренера / удобное расписание / разнообразие."),
        ("Что мешает", "Время / сложно выбрать формат / неуверенность / ничего."),
        ("Готовность", "Хотели бы получить сертификат на 2 бесплатных групповых занятия и попробовать подходящее направление в ближайшее время? Да / возможно / нет."),
    ]),
    Spacer(1, 4 * mm),
]

survey_cards = Table([[ 
    card("Есть интерес", "«Спасибо! Ваши ответы очень ценны для нас. За прохождение опроса мы дарим вам сертификат на 2 бесплатных групповых занятия! Давайте сразу запишемся? Вы можете записаться через наш официальный бот в VK или MAX, оставить свои контакты через СМС и с вами свяжется администратор, или взять наш сертификат на 2 групповых занятия и записаться позже, когда вам будет удобно»", GOLD_SOFT, 85 * mm),
    card("Интереса нет", "«Спасибо за ответы. Хорошего дня!» Не отдавай листовку и не проси открыть бот.", WHITE, 85 * mm),
]], colWidths=[87 * mm] * 2)
survey_cards.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm)]))
story += [survey_cards, Spacer(1, 4 * mm), banner("НЕ СКРЫВАЙ LEVITA", "Соцопрос - это способ начать разговор, а не притвориться независимым исследованием. Сразу назови клуб и длительность."), PageBreak()]

story += [
    p("Четыре способа оставить заявку", title),
    p("Выбирай способ по ситуации: клиентка может записаться сразу, сделать это позже, отправить готовое SMS или оставить контакты в официальном MAX-боте LEVITA. Личные QR-коды выдают тебе на весь период работы с LEVITA.", subtitle),
    p("Запись через VK-бот", section),
    numbered_rows([
        ("Покажи свой QR", "Держи код ровно. Не используй QR другого промоутера: личная ссылка связывает заявку с тобой."),
        ("Откройте бота", "Клиентка нажимает «Записаться» в официальном VK-боте LEVITA."),
        ("Выберите студию", "Клиентка сама выбирает Мачуги, 4 или Ставропольскую, 174/1. Если ей удобнее другой адрес, это уточняет администратор."),
        ("Завершите запись", "Подсказывай, куда нажать, но не забирай телефон и не читай данные. Простого сканирования QR недостаточно."),
    ]),
    Spacer(1, 4 * mm),
]

leaflet_cards = Table([[ 
    card("Листовку дать", "Есть интерес, вопросы о клубе, желание попробовать или записаться позже.", GOLD_SOFT, 85 * mm),
    card("Листовку не давать", "Человек отказался, проходит мимо или не относится к целевой аудитории.", WHITE, 85 * mm),
]], colWidths=[87 * mm] * 2)
leaflet_cards.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm)]))
story += [p("Листовка - только после интереса", section), leaflet_cards, Spacer(1, 4 * mm)]

story += [
    p("Четыре способа заявки: выбор по ситуации", section),
    p("1. Листовка - если клиентка хочет взять информацию с собой и вернуться позже. 2. Официальный VK-бот - если ей удобно записаться самостоятельно сейчас. 3. Личный SMS-скриншот - если ей проще отправить готовое сообщение администратору. 4. Официальный MAX-бот - если ей удобнее оставить контакты в MAX.", body),
    Spacer(1, 2 * mm),
    p("Адреса в Краснодаре", section),
    p("Наши основные студии:<br/>ул. им. В. Н. Мачуги, 4<br/>ул. Ставропольская, 174/1<br/><br/>Другие адреса LEVITA сети в Краснодаре можно предложить, если клиентке там удобнее, но направление заявки уточняет администратор:<br/>ул. Красная, 139<br/>ул. Кореновская, 2<br/>ул. им. П. Метальникова, 42<br/>ул. Мира, 1<br/>ул. 1 Мая, 196/1", body),
    Spacer(1, 3 * mm),
    banner("ЛИЧНЫЕ QR-КОДЫ", "Для SMS и MAX-бота у тебя будут личные QR-коды. Покажи нужный код клиентке, помоги открыть официальный канал и не вводи данные за неё. Не проси назвать номер вслух, не забирай телефон, не фотографируй экран и не переписывай данные. QR-коды выдают тебе на весь период работы."),
    Spacer(1, 4 * mm),
    p("Как рассчитывается выплата", section),
    p("150 ₽ - за человека, которому дозвонились и который понимает, что такое LEVITA и почему ему звонят. Ещё 350 ₽ - за посещение этим клиентом пробного занятия. После первой смены выплата приходит сразу, день в день; дальше выплаты идут по понедельникам и четвергам, чтобы клиентка успела прийти на пробное.", body),
]

answers = [
    [p("«Сколько стоят занятия?»", card_title), p("«Актуальные варианты и условия подробно объяснит администратор».", body_small)],
    [p("«Я уже занимаюсь»", card_title), p("«Здорово! Если захотите попробовать новое направление, для Вас есть сертификат на 2 бесплатных групповых занятия».", body_small)],
    [p("«Я слишком взрослая»", card_title), p("«В LEVITA занимаются женщины разного возраста, а тренер поможет начать комфортно».", body_small)],
    [p("Плохая погода", card_title), p("Зайди в студию, согрейся, выпей чай и сообщи куратору, где находишься.", body_small)],
]
answers_table = Table(answers, colWidths=[55 * mm, 118 * mm])
answers_table.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), .6, LINE), ("INNERGRID", (0, 0), (-1, -1), .35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (0, -1), PAPER), ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm), ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm)]))
story += [p("Короткие ответы", section), answers_table, Spacer(1, 4 * mm), banner("ИТОГОВЫЙ ТЕСТ", "30 вопросов, минимум 27 правильных и без ошибок в критических правилах. Две попытки. Скриншот результата отправь куратору.")]

doc.build(story, onFirstPage=page_decor, onLaterPages=page_decor)
print(OUTPUT)
