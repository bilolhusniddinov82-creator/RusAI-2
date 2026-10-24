export interface LessonStep {
  id: string;
  type: "explanation" | "examples" | "vocabulary" | "exercise" | "speaking" | "test" | "results";
  title: string;
}

export interface LessonExercise {
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface LessonData {
  id: string;
  title: string;
  level: string;
  steps: LessonStep[];
  explanation: string;
  examples: { ru: string; note: string }[];
  vocabulary: { word: string; translation: string }[];
  exercise: LessonExercise;
  miniTest: LessonExercise[];
}

const STANDARD_STEPS: LessonStep[] = [
  { id: "s1", type: "explanation", title: "Объяснение" },
  { id: "s2", type: "examples", title: "Примеры" },
  { id: "s3", type: "vocabulary", title: "Слова" },
  { id: "s4", type: "exercise", title: "Упражнение" },
  { id: "s5", type: "speaking", title: "Разговор с AI" },
  { id: "s6", type: "test", title: "Мини-тест" },
  { id: "s7", type: "results", title: "Результат" },
];

export const LESSONS: LessonData[] = [
  {
    id: "past-tense-1",
    title: "Прошедшее время",
    level: "A2",
    steps: STANDARD_STEPS,
    explanation:
      "В русском языке прошедшее время образуется от инфинитива с помощью суффикса «-л» и согласуется по роду и числу с подлежащим: он читал, она читала, оно читало, они читали.",
    examples: [
      { ru: "Он был дома.", note: "мужской род" },
      { ru: "Она была дома.", note: "женский род" },
      { ru: "Мы были дома.", note: "множественное число" },
    ],
    vocabulary: [
      { word: "вчера", translation: "kecha" },
      { word: "ходил / ходила", translation: "bordi (yurdi)" },
      { word: "купил / купила", translation: "sotib oldi" },
    ],
    exercise: {
      prompt: "Я ___ в школу каждый день.",
      options: ["хожу", "ходил", "пойду"],
      correct: "хожу",
      explanation: "Действие регулярное и происходит в настоящем — используется настоящее время «хожу».",
    },
    miniTest: [
      {
        prompt: "Она ___ домой поздно вчера.",
        options: ["пришёл", "пришла", "придёт"],
        correct: "пришла",
        explanation: "«Она» — женский род, прошедшее время — «пришла».",
      },
      {
        prompt: "Вчера мы ___ в кино.",
        options: ["ходим", "ходили", "пойдём"],
        correct: "ходили",
        explanation: "«Вчера» указывает на прошедшее время и множественное число «мы» → «ходили».",
      },
    ],
  },
  {
    id: "accusative-case-1",
    title: "Винительный падеж",
    level: "A2",
    steps: STANDARD_STEPS,
    explanation:
      "Винительный падеж отвечает на вопросы «кого? что?» и обозначает прямой объект действия: я вижу (кого? что?) — друга, книгу.",
    examples: [
      { ru: "Я читаю книгу.", note: "неодушевлённое, ж.р." },
      { ru: "Я вижу друга.", note: "одушевлённое, м.р. — окончание -а" },
      { ru: "Она любит музыку.", note: "неодушевлённое, ж.р." },
    ],
    vocabulary: [
      { word: "книга", translation: "kitob" },
      { word: "друг", translation: "do'st" },
      { word: "музыка", translation: "musiqa" },
    ],
    exercise: {
      prompt: "Я вижу ___ (мой друг).",
      options: ["мой друг", "моего друга", "моему другу"],
      correct: "моего друга",
      explanation:
        "Одушевлённые существительные мужского рода в винительном падеже совпадают с родительным: друг → друга.",
    },
    miniTest: [
      {
        prompt: "Она читает ___ (интересная книга).",
        options: ["интересная книга", "интересную книгу", "интересной книге"],
        correct: "интересную книгу",
        explanation: "Винительный падеж женского рода: окончание -ая меняется на -ую.",
      },
      {
        prompt: "Мы смотрим ___ (новый фильм).",
        options: ["новый фильм", "нового фильма", "новым фильмом"],
        correct: "новый фильм",
        explanation: "Неодушевлённые существительные мужского рода в винительном падеже совпадают с именительным.",
      },
    ],
  },
  {
    id: "future-tense-1",
    title: "Будущее время",
    level: "B1",
    steps: STANDARD_STEPS,
    explanation:
      "Будущее время бывает простое (глаголы совершенного вида: сделаю, пойду) и сложное — «буду + инфинитив» несовершенного вида: буду делать, буду читать.",
    examples: [
      { ru: "Я пойду в магазин.", note: "простое будущее, сов. вид" },
      { ru: "Я буду читать книгу.", note: "сложное будущее, несов. вид" },
      { ru: "Завтра мы будем работать.", note: "сложное будущее" },
    ],
    vocabulary: [
      { word: "завтра", translation: "ertaga" },
      { word: "буду", translation: "bo'laman (yordamchi fe'l)" },
      { word: "скоро", translation: "tez orada" },
    ],
    exercise: {
      prompt: "Завтра я ___ домашнее задание.",
      options: ["делаю", "буду делать", "сделал"],
      correct: "буду делать",
      explanation: "Длительное/регулярное действие в будущем — сложное будущее время «буду + инфинитив».",
    },
    miniTest: [
      {
        prompt: "Через час она ___.",
        options: ["придёт", "приходит", "пришла"],
        correct: "придёт",
        explanation: "Однократное будущее действие — простое будущее совершенного вида «придёт».",
      },
      {
        prompt: "Мы ___ фильм весь вечер.",
        options: ["смотрим", "будем смотреть", "посмотрели"],
        correct: "будем смотреть",
        explanation: "Длительное действие в будущем — сложное будущее «будем смотреть».",
      },
    ],
  },
];

export function getLessonById(id: string): LessonData {
  return LESSONS.find((l) => l.id === id) ?? LESSONS[0];
}

export function getNextLessonId(id: string): string | null {
  const idx = LESSONS.findIndex((l) => l.id === id);
  if (idx === -1 || idx + 1 >= LESSONS.length) return null;
  return LESSONS[idx + 1].id;
}



export const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const LEVEL_NAMES: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Int.",
  C1: "Advanced",
  C2: "Mastery",
};

export interface RoadmapLevel {
  code: string;
  name: string;
  status: "done" | "current" | "locked";
  pct: number;
}

// Builds the level roadmap from the user's actual current level, instead of
// a hardcoded one — so the dashboard badge/card and the roadmap always
// agree on which level the user is on.
export function getRoadmap(currentLevel: string): RoadmapLevel[] {
  const currentIdx = Math.max(0, LEVEL_ORDER.indexOf(currentLevel as any));
  return LEVEL_ORDER.map((code, idx) => ({
    code,
    name: LEVEL_NAMES[code],
    status: idx < currentIdx ? "done" : idx === currentIdx ? "current" : "locked",
    pct: idx < currentIdx ? 100 : idx === currentIdx ? 60 : 0,
  }));
}

export const LISTENING_EXERCISE = {
  title: "В кафе",
  durationSec: 38,
  transcript:
    "— Здравствуйте! Что вы будете заказывать?\n— Здравствуйте! Один кофе с молоком и кусок яблочного пирога, пожалуйста.\n— Хорошо, а что-нибудь ещё?\n— Нет, спасибо, это всё.",
  question: "Что заказал посетитель?",
  options: ["Чай и торт", "Кофе с молоком и яблочный пирог", "Только кофе", "Сок и пирожное"],
  correct: "Кофе с молоком и яблочный пирог",
  explanation:
    "Посетитель говорит: «Один кофе с молоком и кусок яблочного пирога» — значит, он заказал именно это.",
};

export interface ReadingWord {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
}

export const READING_PASSAGE = {
  title: "Мой первый день в Москве",
  level: "A2",
  paragraphs: [
    "Вчера я прилетел в Москву. Это был мой первый визит в этот город.",
    "В аэропорту меня встретил друг, и мы поехали в центр на метро.",
    "Москва оказалась намного больше, чем я представлял — широкие улицы и высокие здания.",
    "Вечером мы гуляли по Красной площади и ели мороженое, хотя было прохладно.",
  ],
  highlighted: {
    "прилетел": { word: "прилетел", translation: "uchib keldi", pronunciation: "/prʲɪlʲɪˈtʲel/", example: "Он прилетел вчера вечером." },
    "встретил": { word: "встретил", translation: "kutib oldi / uchrashdi", pronunciation: "/ˈfstrʲetʲɪl/", example: "Друг встретил меня в аэропорту." },
    "оказалась": { word: "оказалась", translation: "chiqib qoldi (bo'lib chiqdi)", pronunciation: "/ɐkɐˈzaləsʲ/", example: "Погода оказалась холодной." },
    "прохладно": { word: "прохладно", translation: "salqin", pronunciation: "/prɐˈxladnə/", example: "Вечером на улице прохладно." },
  } as Record<string, ReadingWord>,
  questions: [
    {
      prompt: "На чём герой добрался до центра города?",
      options: ["На такси", "На метро", "Пешком"],
      correct: "На метро",
      explanation: "В тексте сказано: «мы поехали в центр на метро».",
    },
    {
      prompt: "Что герой делал вечером на Красной площади?",
      options: ["Фотографировал", "Ел мороженое", "Спал"],
      correct: "Ел мороженое",
      explanation: "В тексте сказано: «мы гуляли... и ели мороженое».",
    },
  ] as LessonExercise[],
};

export const PLACEMENT_TEST = [
  {
    prompt: "Выберите правильный вариант: Я ___ студент.",
    options: ["есть", "—", "быть"],
    correct: "—",
    skill: "grammar",
  },
  {
    prompt: "«Спасибо» означает:",
    options: ["Пожалуйста", "Thank you", "Извините"],
    correct: "Thank you",
    skill: "vocabulary",
  },
  {
    prompt: "Выберите правильную форму: Вчера она ___ книгу.",
    options: ["читает", "читала", "будет читать"],
    correct: "читала",
    skill: "grammar",
  },
  {
    prompt: "Прочитайте: «Кот спит на диване.» Где спит кот?",
    options: ["На столе", "На диване", "На полу"],
    correct: "На диване",
    skill: "reading",
  },
];
