import { AIContext, AIProvider, ChatMessage, TutorReply } from "./types";

// The Demo AI Provider gives realistic, rule-based Russian-tutor responses
// so the whole product works with zero API keys configured. This is what
// ships by default; see lib/ai/provider.ts for the real-LLM path (a real
// LLM understands genuinely open-ended input — this rule-based version
// covers the common cases well but isn't a substitute for that).

const GREETINGS: { test: RegExp; replies: string[] }[] = [
  {
    // `\b` doesn't treat Cyrillic as word characters, so use a lookahead.
    test: /^\s*(привет|здравствуй|здравствуйте|добрый день|доброе утро|добрый вечер|хай|hi|hello)(?![а-яёa-z])/i,
    replies: [
      "Привет! Рад тебя слышать 👋 Как прошёл твой день?",
      "Привет-привет! Как у тебя дела сегодня?",
      "Здравствуй! Рад тебя видеть. Расскажи, как настроение?",
    ],
  },
  {
    test: /как\s+дела|как\s+ты|как\s+жизнь|как\s+настроение/i,
    replies: [
      "У меня всё отлично, спасибо! А у тебя как дела?",
      "Спасибо, хорошо! А как твои дела?",
    ],
  },
  {
    test: /спасибо/i,
    replies: [
      "Пожалуйста! Продолжим?",
      "Не за что! Готов продолжить разговор?",
    ],
  },
  {
    test: /пока|до свидания|увидимся/i,
    replies: [
      "До встречи! Было приятно поговорить.",
      "Пока! Возвращайся ещё попрактиковаться.",
    ],
  },
];

// Common grammar mistakes → an explicit "here's the mistake, here's the fix,
// here's why" explanation, rather than a vague correction.
const PATTERNS: { test: RegExp; before: string; after: string; note: string }[] = [
  {
    test: /я\s+вчера\s+ходил/i,
    before: "Я вчера ходил",
    after: "Вчера я ходил",
    note: "Обстоятельство времени («вчера») обычно ставится в начало предложения.",
  },
  {
    test: /нравится.*очень\.?$/i,
    before: "очень",
    after: "очень нравится",
    note: "Наречие степени «очень» обычно ставится перед глаголом, а не в конце.",
  },
  {
    test: /хочу\s+идти/i,
    before: "хочу идти",
    after: "хочу пойти",
    note: "Для одного конкретного действия в будущем используется глагол совершенного вида — «пойти».",
  },
  {
    test: /был\s+дома.*она|она.*был\s+дома/i,
    before: "она был дома",
    after: "она была дома",
    note: "Глагол в прошедшем времени согласуется по роду с подлежащим: он был, она была, оно было.",
  },
];

// Keyword-aware replies so the conversation actually reacts to what was
// said, instead of always looping back to the same generic question.
const KEYWORD_REPLIES: { test: RegExp; replies: string[] }[] = [
  { test: /футбол/i, replies: [
    "Здорово! А как часто ты играешь в футбол?",
    "Класс! На какой позиции ты обычно играешь?",
    "Футбол — это отлично! Ты играешь в команде или просто для себя?",
  ] },
  { test: /работ/i, replies: [
    "Интересно! А кем ты работаешь?",
    "Расскажи, чем ты занимаешься на работе.",
  ] },
  { test: /друз/i, replies: [
    "Хорошо, когда рядом есть друзья! Что вы обычно делаете вместе?",
    "А как давно вы дружите?",
  ] },
  { test: /потому что/i, replies: [
    "Отлично! Ты правильно использовал союз причины «потому что».",
    "Хорошо! Это делает предложение более естественным.",
  ] },
  { test: /кино|фильм/i, replies: [
    "А какой фильм ты смотрел последний раз?",
    "Здорово! Ты любишь ходить в кино или смотришь дома?",
  ] },
  { test: /учёб|университет|школ/i, replies: [
    "А что ты изучаешь?",
    "Расскажи немного о своей учёбе.",
  ] },
  { test: /книг|читал|читала|читаю/i, replies: [
    "Здорово! А какую книгу ты читал? О чём она?",
    "Чтение — отличная привычка! Ты читаешь на русском или на родном языке?",
  ] },
  { test: /музык|песн|слушал/i, replies: [
    "А какую музыку ты любишь?",
    "Ты слушаешь русские песни? Это очень помогает учить язык.",
  ] },
  { test: /спорт|бег|зал|трениров/i, replies: [
    "Молодец! Каким спортом ты занимаешься?",
    "Как часто ты тренируешься?",
  ] },
  { test: /путешеств|поездк|ездил|ездила|поехал/i, replies: [
    "Как интересно! Куда ты ездил?",
    "А в какой стране ты мечтаешь побывать?",
  ] },
  { test: /погод/i, replies: [
    "А какая погода у тебя сегодня?",
    "Хорошая погода поднимает настроение, правда?",
  ] },
  { test: /сем[ьи]/i, replies: [
    "Расскажи немного о своей семье.",
    "А у тебя большая семья?",
  ] },
  { test: /(?<![а-яё])(еда|ем|ел|ела|обед|ужин|завтрак)/i, replies: [
    "Звучит вкусно! А что ты обычно готовишь дома?",
    "А какая у тебя любимая еда?",
  ] },
];

// Neutral acknowledgements that fit any statement; a question is appended
// after them so the reply always responds AND keeps the dialogue going.
const ACKS = ["Понятно.", "Интересно!", "Ясно, спасибо, что рассказал.", "Хорошо сказано!", "Понимаю тебя."];

// Short coaching nudges for very short answers (one or two words).
const SHORT_ANSWER_NUDGES = [
  "Попробуй ответить полным предложением — так ты быстрее заговоришь.",
  "Скажи чуть больше: добавь причину со словом «потому что».",
];

// "ничего", "ничем", "не знаю", "нет"… — the learner can't (or doesn't want
// to) answer. Moving on to an unrelated question doesn't help; showing how
// to answer THIS question does.
const STUCK = /^(ничего|ничем|никак|никто|никого|нигде|никуда|никогда|не знаю|незнаю|без понятия|нет|не хочу|не помню|хз|всё равно|все равно)[\s.!?]*$/i;

// "Как дела?" → "ничего" means "fine", not "nothing".
const ASKED_HOW = /как\s+(у\s+тебя\s+)?(дела|прош[её]л|настроение)|как\s+(ты\s+)?себя\s+чувству/i;

// A model sentence for the tutor's last question, so the learner can copy the
// pattern and fill in their own words.
const SENTENCE_STARTERS: { topic: RegExp; frame: string; sample: string }[] = [
  { topic: /радует|нравится|любишь/i, frame: "Меня радует …", sample: "Меня радует музыка и прогулки с друзьями." },
  { topic: /увлекаешься|хобби|свободное время/i, frame: "Я увлекаюсь …", sample: "Я увлекаюсь футболом и люблю смотреть фильмы." },
  { topic: /учить русский|изучаешь русский|почему ты решил/i, frame: "Я учу русский, потому что …", sample: "Я учу русский, потому что хочу работать в России." },
  { topic: /откуда ты/i, frame: "Я из …", sample: "Я из Узбекистана, из Ташкента." },
  { topic: /выходн/i, frame: "На выходных я обычно …", sample: "На выходных я обычно отдыхаю дома и гуляю в парке." },
  { topic: /зовут|имя/i, frame: "Меня зовут …", sample: "Меня зовут Алишер." },
  { topic: /делал|прош[её]л.*день|сегодня/i, frame: "Сегодня я …", sample: "Сегодня я работал, а вечером смотрел фильм." },
  { topic: /работал или учился|работаешь|учишься|чем ты занимаешься/i, frame: "Я работаю / учусь …", sample: "Я учусь в университете на втором курсе." },
  { topic: /отдохнуть|помогает/i, frame: "Мне помогает …", sample: "Мне помогает сон и прогулка на свежем воздухе." },
  { topic: /планы/i, frame: "Вечером я хочу …", sample: "Вечером я хочу отдохнуть и почитать книгу." },
];

// Easy one-word questions for a learner who is tired of open questions, each
// with the full sentence the one-word answer slots into.
const EASY_QUESTIONS: { q: string; full: (a: string) => string }[] = [
  { q: "Какой твой любимый цвет?", full: (a) => `Мой любимый цвет — ${a}.` },
  { q: "Ты любишь чай или кофе?", full: (a) => `Я люблю ${a}.` },
  { q: "Сейчас утро, день или вечер?", full: (a) => `Сейчас ${a}.` },
  { q: "Ты любишь кошек или собак?", full: (a) => `Я люблю ${a}.` },
  { q: "Какое у тебя любимое время года?", full: (a) => `Моё любимое время года — ${a}.` },
];
const EASY_INTRO =
  "Кажется, сейчас не очень хочется разговаривать — это нормально. " +
  "Давай сделаем проще: я задаю лёгкий вопрос, а ты отвечаешь одним-двумя словами.";

function nextEasyQuestion(history: ChatMessage[]) {
  return pickFrom(unused(EASY_QUESTIONS.map((e) => e.q), history));
}

// The tutor's last real question — our own help messages contain none.
function lastRealQuestion(history: ChatMessage[]) {
  return [...history].reverse().find((m) => m.role === "assistant" && m.content.includes("?"))?.content ?? "";
}

function stuckReply(text: string, history: ChatMessage[], lastAssistant: string): string | null {
  const answer = text.trim();

  // A short answer to an easy question: praise it and show the full sentence.
  const easy = EASY_QUESTIONS.find((e) => lastAssistant.trim().endsWith(e.q));
  if (easy && !STUCK.test(answer) && answer.split(/\s+/).length <= 3) {
    const word = answer.replace(/[.!?]+$/, "").toLowerCase();
    return `Отлично! Полным предложением: «${easy.full(word)}» Повтори его вслух. А теперь: ${nextEasyQuestion(history)}`;
  }

  if (!STUCK.test(answer)) return null;
  if (/^(ничего|нормально)/i.test(answer) && ASKED_HOW.test(lastAssistant)) return null;

  // Already in easy mode: just offer another easy question, no lecture.
  if (lastAssistant.includes(EASY_INTRO) || EASY_QUESTIONS.some((e) => lastAssistant.trim().endsWith(e.q))) {
    return `Хорошо, тогда другой вопрос: ${nextEasyQuestion(history)}`;
  }

  // Several "не знаю / нет" in a row: the learner is tired — make it easy.
  const recentUser = history.filter((m) => m.role === "user").slice(-3);
  const stuckStreak = recentUser.filter((m) => STUCK.test(m.content.trim())).length;
  const alreadyHelped = !lastAssistant.includes("?");
  if (stuckStreak >= 3 || alreadyHelped) {
    return `${EASY_INTRO} ${nextEasyQuestion(history)}`;
  }

  const starter = SENTENCE_STARTERS.find((s) => s.topic.test(lastRealQuestion(history)));
  const comfort = /^(ничего|ничем|никак)/i.test(text.trim())
    ? "Понимаю, иногда так бывает."
    : "Ничего страшного!";
  if (starter) {
    return `${comfort} Давай я помогу. Можно ответить по образцу: «${starter.frame}». Например: «${starter.sample}» Теперь попробуй сам — своими словами.`;
  }
  return `${comfort} Давай попробуем по-другому. ${nextEasyQuestion(history)}`;
}

// Learner says they are busy / short on time.
const BUSY = /(?<![а-яё])(занят|занята|заняты|нет времени|много дел|некогда)(?![а-яё])/i;

// Learners often type in Uzbek or English (Latin script) instead of Russian.
// Instead of a generic follow-up that ignores what they said, show the
// Russian equivalent and invite them to say it in Russian.
const LATIN_PHRASES: { test: RegExp; ru: string; next: string }[] = [
  { test: /\b(as+alomu? ?alaykum|salom|salam|assalom)\b/i, ru: "Привет! / Здравствуйте!", next: "Привет! Как дела?" },
  { test: /\b(qalay|qalesan|qalaysiz|yaxshimisiz|ishlar qalay|how are you)\b/i, ru: "Как дела?", next: "Привет! Как у тебя дела?" },
  { test: /\b(nima gap|nima gaplar|what'?s up)\b/i, ru: "Что нового?", next: "Привет! Что нового?" },
  { test: /\b(rahmat|raxmat|thanks?|thank you)\b/i, ru: "Спасибо!", next: "Спасибо! Всё хорошо." },
  { test: /\b(xayr|hayr|bye|goodbye|ko'rishguncha)\b/i, ru: "До свидания! / Пока!", next: "Пока! До завтра!" },
  { test: /\b(ismim|mening ismim|my name is)\b/i, ru: "Меня зовут …", next: "Меня зовут … Я из Узбекистана." },
  { test: /\b(yaxshi|zo'r|good|fine)\b/i, ru: "Хорошо / Отлично", next: "У меня всё хорошо, спасибо!" },
  { test: /^\s*(ha|yes)\s*[.!]?\s*$/i, ru: "Да", next: "Да, конечно!" },
  { test: /^\s*(yo'q|yoq|no)\s*[.!]?\s*$/i, ru: "Нет", next: "Нет, спасибо." },
  { test: /\b(hello|hi|hey)\b/i, ru: "Привет!", next: "Привет! Как дела?" },
];

function latinReply(text: string): string | null {
  // Any Cyrillic means the learner is already writing Russian.
  if (/[а-яё]/i.test(text) || !/[a-z]/i.test(text)) return null;
  const hit = LATIN_PHRASES.find((p) => p.test.test(text));
  if (hit) {
    return (
      `Ты написал «${text.trim()}» латиницей. По-русски это: «${hit.ru}»\n\n` +
      `Попробуй написать по-русски, например:\n«${hit.next}»`
    );
  }
  return (
    `Я пока понимаю только русский 🙂 Ты написал «${text.trim()}».\n\n` +
    "Попробуй сказать это по-русски кириллицей. Например:\n«Привет! Меня зовут … Я учу русский язык.»"
  );
}

function pickFrom(pool: string[], exclude?: string): string {
  const options = exclude ? pool.filter((r) => r !== exclude) : pool;
  const list = options.length ? options : pool;
  return list[Math.floor(Math.random() * list.length)];
}

// How the learner says they feel — acknowledged before anything else, so
// "хорошо, а у тебя?" gets "Рад слышать!" instead of a random follow-up.
const MOODS: { test: RegExp; replies: string[]; questions?: string[] }[] = [
  { test: /(?<![а-яё])(отлично|прекрасно|замечательно|супер|классно|здорово)(?![а-яё])/i, replies: ["Как здорово это слышать!", "Отлично! Я очень рад."] },
  { test: /(?<![а-яё])(хорошо|неплохо|нормально|норм|ничего)(?![а-яё])/i, replies: ["Рад слышать!", "Хорошо, что всё в порядке."] },
  { test: /(?<![а-яё])(плохо|ужасно|так себе|грустно|устал|устала)(?![а-яё])/i, replies: ["Ой, мне жаль. Надеюсь, завтра будет лучше.", "Сочувствую. Бывают такие дни."], questions: ["Что помогает тебе отдохнуть после тяжёлого дня?", "А что тебя обычно радует?"] },
];

// Questions the learner asks the tutor itself. Answering them is what makes
// the dialogue feel like a real conversation instead of an interrogation.
const ABOUT_ME: { test: RegExp; replies: string[]; questions?: string[] }[] = [
  {
    // "Как ты себя чувствуешь?", "как дела?", "как у тебя дела?", "как настроение?" — anywhere in the message.
    test: /как\s+(ты|вы)\s+себя|как\s+(у\s+тебя\s+|у\s+вас\s+|твои\s+|ваши\s+)?дела|как\s+(ты|вы)\s*[?!.]*\s*$|как\s+(твоё\s+|твое\s+)?настроение|как\s+жизнь/i,
    replies: [
      "Спасибо, я чувствую себя отлично!",
      "Спасибо, что спросил! У меня всё хорошо, я рад с тобой поговорить.",
      "У меня всё замечательно, спасибо!",
    ],
    questions: ["А ты как себя чувствуешь?", "А как у тебя дела?", "А какое у тебя сегодня настроение?"],
  },
  { test: /как\s+тебя\s+зовут|тво[ёе]\s+имя/i, replies: ["Меня зовут RusAI, я твой репетитор русского языка."] },
  { test: /откуда\s+ты|где\s+ты\s+живёшь|где\s+ты\s+живешь/i, replies: ["Я живу в интернете, но очень люблю Москву и Санкт-Петербург."] },
  { test: /ты\s+(бот|робот|человек|ии)/i, replies: ["Я искусственный интеллект, но разговаривать со мной можно как с другом."] },
  { test: /что\s+ты\s+(любишь|делаешь)|чем\s+ты\s+занимаешься/i, replies: ["Я люблю разговаривать с учениками и помогать им говорить по-русски увереннее."] },
];

// Answers to "а ты?"-style counter-questions, picked by what the tutor asked last.
const SELF_BY_TOPIC: { topic: RegExp; reply: string }[] = [
  { topic: /день/i, reply: "Мой день прошёл отлично — я весь день разговаривал с учениками, это очень интересно." },
  { topic: /выходн/i, reply: "На выходных я читал русские сказки и слушал музыку." },
  { topic: /дела|настроение/i, reply: "У меня всё отлично, спасибо, что спросил!" },
  { topic: /еда|готов/i, reply: "Я очень люблю борщ и пельмени, хотя попробовать их, к сожалению, не могу." },
  { topic: /фильм|кино/i, reply: "Мне нравится старый советский фильм «Ирония судьбы»." },
];
const COUNTER_QUESTION = /(?<![а-яё])(а|и)\s+(ты|тебя|у\s+тебя|твой|твоя|тво[её]|твои|вы|у\s+вас|ваш)(?![а-яё])|(?<![а-яё])ты\s+как(?![а-яё])|как\s+у\s+тебя/i;

// Follow-up questions that move the conversation forward, grouped by what
// the tutor asked before so they stay on topic.
const FOLLOWUPS_BY_TOPIC: { topic: RegExp; questions: string[] }[] = [
  { topic: /день|сегодня/i, questions: ["А что интересного ты сегодня делал?", "Что было самым приятным за сегодня?", "Ты сегодня работал или учился?"] },
  { topic: /выходн/i, questions: ["Куда ты любишь ходить на выходных?", "С кем ты обычно проводишь выходные?"] },
  { topic: /дела|настроение/i, questions: ["Что тебя сегодня порадовало?", "Какие у тебя планы на вечер?"] },
];

// Get-to-know-you questions for when the current topic has no follow-ups of its own.
const GENERAL_QUESTIONS = [
  "А как тебя зовут?",
  "А откуда ты?",
  "Чем ты увлекаешься в свободное время?",
  "Почему ты решил учить русский язык?",
  "А как ты обычно проводишь выходные?",
];

function lastQuestion(history: ChatMessage[]) {
  return [...history].reverse().find((m) => m.role === "assistant")?.content ?? "";
}

function unused(pool: string[], history: ChatMessage[]) {
  const said = history.filter((m) => m.role === "assistant").map((m) => m.content).join("\n");
  const fresh = pool.filter((q) => !said.includes(q));
  return fresh.length ? fresh : pool;
}

function pickReply(userText: string, history: ChatMessage[]): string {
  const lastAssistant = lastQuestion(history);
  const text = userText.trim();

  const greeting = GREETINGS[0].test.exec(text);
  if (greeting && !text.slice(greeting[0].length).replace(/[\s,!.?]+/g, "")) {
    return pickFrom(GREETINGS[0].replies, lastAssistant);
  }
  // "привет, как ты?" gets a greeting AND an answer to the rest of the message.
  return (greeting ? "Привет! " : "") + replyBody(text, history, lastAssistant);
}

function replyBody(text: string, history: ChatMessage[], lastAssistant: string): string {
  const stuck = stuckReply(text, history, lastAssistant);
  if (stuck) return stuck;

  const parts: string[] = [];
  const mood = MOODS.find((m) => m.test.test(text));
  if (mood) parts.push(pickFrom(mood.replies));

  const aboutMe = ABOUT_ME.find((q) => q.test.test(text));
  if (aboutMe) {
    parts.push(pickFrom(aboutMe.replies));
  } else if (COUNTER_QUESTION.test(text)) {
    const self = SELF_BY_TOPIC.find((s) => s.topic.test(lastAssistant) || s.topic.test(text));
    parts.push(self?.reply ?? "У меня всё хорошо, спасибо, что спросил!");
  }

  // An open question we have no specific answer for: give an opinion and
  // turn it back to the learner, so they keep speaking.
  if (!parts.length && (/\?\s*$/.test(text) || /^(как ты думаешь|как думаешь|а ты как думаешь|почему|зачем)/i.test(text))) {
    const opinion = /думаешь|считаешь|кажется/i.test(text)
      ? "Мне кажется, да — но с практикой всё становится проще."
      : "Хороший вопрос!";
    return `${opinion} ${pickFrom(unused(["А ты сам как думаешь?", "А какое у тебя мнение?", "Расскажи, почему ты так спрашиваешь?"], history))}`;
  }

  if (!parts.length && BUSY.test(text)) {
    parts.push("Понимаю, когда много дел, бывает непросто.");
    return parts.concat(pickFrom(unused(["Чем ты сейчас занимаешься?", "Это работа или учёба?"], history))).join(" ");
  }

  if (!parts.length) {
    const kw = KEYWORD_REPLIES.find((k) => k.test.test(text));
    if (kw) return pickFrom(unused(kw.replies, history), lastAssistant);
    parts.push(text.split(/\s+/).length <= 2 ? "Понятно." : pickFrom(ACKS));
    if (text.split(/\s+/).length <= 2) parts.push(pickFrom(unused(SHORT_ANSWER_NUDGES, history)));
  }

  // Always hand the turn back with a fresh, on-topic question.
  const group = FOLLOWUPS_BY_TOPIC.find((f) => f.topic.test(lastAssistant) || f.topic.test(text));
  const kw = KEYWORD_REPLIES.find((k) => k.test.test(text));
  // A story in the past tense ("я ходил…", "мы смотрели…") invites "and then?".
  const toldStory = /(?<![а-яё])[а-яё]{2,}(?:ал|ял|ил|ел|ла|ли)(?![а-яё])/i.test(text);
  const pool =
    aboutMe?.questions ??
    kw?.replies ??
    mood?.questions ??
    (toldStory ? ["Тебе понравилось?", "А что было потом?", "С кем ты был?"] : group?.questions ?? GENERAL_QUESTIONS);
  parts.push(pickFrom(unused(pool, history)));
  return parts.join(" ");
}

// Frequent spelling mistakes of Russian learners. Each rule matches inside a
// single word, so endings («чуствую», «чуствуешь», «чуство») are all caught.
const SPELLING: { re: RegExp; fix: string; note: string }[] = [
  { re: /чуств/g, fix: "чувств", note: "В словах «чувство», «чувствовать» буква «в» не слышна, но пишется." },
  { re: /здраств/g, fix: "здравств", note: "В слове «здравствуй» пишется непроизносимая «в»: здраВствуй." },
  { re: /^сдесь$/g, fix: "здесь", note: "Правильно пишется «здесь» — через «з»." },
  { re: /^извени/g, fix: "извини", note: "«Извините» пишется через «и»: изв-И-ните." },
  { re: /^пожалуст(а|о)$|^пожалуйсто$/g, fix: "пожалуйста", note: "Правильно: «пожалуйста» — с «й» и на конце «а»." },
  { re: /^щас$/g, fix: "сейчас", note: "«Щас» — разговорное сокращение, на письме лучше «сейчас»." },
  { re: /^сёдня$|^седня$|^севодня$/g, fix: "сегодня", note: "Правильно пишется «сегодня» (читается [сиво́дня])." },
  { re: /^ево$/g, fix: "его", note: "Пишется «его», хотя произносится [ево́]." },
  { re: /^чё$|^че$/g, fix: "что", note: "«Чё» — очень разговорное, правильно: «что»." },
  { re: /^тока$/g, fix: "только", note: "Правильно: «только»." },
  { re: /^ваще$/g, fix: "вообще", note: "Правильно: «вообще»." },
  { re: /грусн/g, fix: "грустн", note: "«Грустный» — от слова «грусть», поэтому пишется «т»." },
  { re: /интерестн/g, fix: "интересн", note: "«Интересный» пишется без «т»: от слова «интерес»." },
  { re: /^ихний|^ихн/g, fix: "их", note: "Литературная форма — «их» (их дом, их книга)." },
  { re: /^пол(\s|-)?часа$/g, fix: "полчаса", note: "«Полчаса» пишется слитно." },
  { re: /жы/g, fix: "жи", note: "Правило: ЖИ-ШИ пиши с буквой «и»." },
  { re: /шы/g, fix: "ши", note: "Правило: ЖИ-ШИ пиши с буквой «и»." },
  { re: /([чщ])я/g, fix: "$1а", note: "Правило: ЧА-ЩА пиши с буквой «а»." },
  { re: /([чщ])ю/g, fix: "$1у", note: "Правило: ЧУ-ЩУ пиши с буквой «у»." },
];

interface SpellFix {
  before: string;
  after: string;
  note: string;
}

export function findSpellingMistakes(text: string): SpellFix[] {
  const fixes: SpellFix[] = [];
  for (const raw of text.match(/[а-яё]+/gi) ?? []) {
    const lower = raw.toLowerCase();
    let fixed = lower;
    let note = "";
    for (const rule of SPELLING) {
      const next = fixed.replace(rule.re, rule.fix);
      if (next !== fixed) {
        fixed = next;
        note ||= rule.note;
      }
    }
    if (fixed !== lower && !fixes.some((f) => f.before === lower)) {
      // Keep the learner's capitalisation on the first letter.
      const after = raw[0] === raw[0].toUpperCase() ? fixed[0].toUpperCase() + fixed.slice(1) : fixed;
      fixes.push({ before: raw, after, note });
    }
  }
  return fixes;
}

export class DemoAIProvider implements AIProvider {
  async chat(messages: ChatMessage[], _context: AIContext): Promise<TutorReply> {
    const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const latin = latinReply(last);
    if (latin) {
      await new Promise((r) => setTimeout(r, 400));
      return { reply: latin };
    }

    const match = PATTERNS.find((p) => p.test.test(last));
    if (match) {
      const corrected = last.replace(new RegExp(match.before, "i"), match.after);
      return {
        // Explicit "there IS a mistake, here's the fix, here's why" —
        // not just a vague rephrasing.
        reply:
          `Есть небольшая ошибка. Ты сказал:\n«${last}»\n\n` +
          `Правильно так:\n«${corrected}»\n\n` +
          `Почему: ${match.note}`,
        correction: match,
      };
    }

    // Simulate small network latency so the UI's typing indicator feels real.
    await new Promise((r) => setTimeout(r, 400));
    // Understand the message as the learner meant it («грусно» → «грустно»),
    // then point the mistakes out — like a tutor who corrects without
    // stopping the dialogue.
    const typos = findSpellingMistakes(last);
    const understood = typos.reduce((t, f) => t.split(f.before).join(f.after), last);
    const reply = pickReply(understood, messages);
    if (typos.length) {
      const list = typos.map((t) => `«${t.before}» → «${t.after}»`).join(", ");
      const notes = [...new Set(typos.map((t) => t.note))].join(" ");
      return {
        reply: `Маленькая поправка: ${list}. ${notes}\n\n${reply}`,
        correction: { before: typos[0].before, after: typos[0].after, note: typos[0].note },
      };
    }
    return { reply };
  }
}
