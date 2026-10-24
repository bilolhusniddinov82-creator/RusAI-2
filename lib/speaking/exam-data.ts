// Question bank for the speaking exam simulator. The structure mirrors the
// classic three-part oral exam: short interview questions, a monologue on a
// cue card (with preparation time), then a discussion that goes deeper.

export interface CueCard {
  topic: string;
  points: string[];
}

export interface ExamSet {
  id: string;
  part1: string[];
  part2: CueCard;
  part3: string[];
}

export const EXAM_TIMING = {
  part1Answer: 30, // seconds per interview answer
  part2Prep: 60,
  part2Talk: 120,
  part3Answer: 45,
  // How long the learner can be silent (after saying something) before the
  // examiner assumes the answer is finished and moves on.
  silenceMs: 3500,
};

export const EXAMINER_LINES = {
  welcome:
    "Здравствуйте! Меня зовут Анна, я ваш экзаменатор. Сегодня у нас устная часть экзамена. Она состоит из трёх частей. Давайте начнём.",
  part1Intro: "Часть первая. Я задам вам несколько вопросов о вас.",
  part2Intro:
    "Спасибо. Переходим ко второй части. Вот ваша карточка. У вас есть одна минута на подготовку, потом вы будете говорить до двух минут.",
  part2Start: "Время подготовки закончилось. Пожалуйста, начинайте.",
  part3Intro: "Спасибо. Теперь третья часть. Давайте обсудим эту тему подробнее.",
  finish: "Спасибо! Экзамен окончен. Сейчас я подготовлю вашу оценку.",
  // Short neutral acknowledgements between questions, like a real examiner.
  acks: ["Спасибо.", "Хорошо.", "Понятно.", "Интересно.", "Хорошо, спасибо."],
};

export const EXAM_SETS: ExamSet[] = [
  {
    id: "home-city",
    part1: [
      "Как вас зовут и откуда вы?",
      "Расскажите о своём родном городе. Что вам в нём нравится?",
      "Вы работаете или учитесь?",
      "Что вы обычно делаете в выходные?",
    ],
    part2: {
      topic: "Расскажите о месте, которое вы любите посещать.",
      points: ["Где находится это место", "Как часто вы там бываете", "Что вы там делаете", "Почему оно вам нравится"],
    },
    part3: [
      "Почему люди любят путешествовать?",
      "Как изменились города за последние двадцать лет?",
      "Где лучше жить — в большом городе или в деревне? Почему?",
    ],
  },
  {
    id: "food-friends",
    part1: [
      "Как вас зовут? Чем вы занимаетесь?",
      "Какую еду вы любите больше всего?",
      "Вы любите готовить? Почему?",
      "Как часто вы встречаетесь с друзьями?",
    ],
    part2: {
      topic: "Расскажите о близком друге.",
      points: ["Как вы познакомились", "Как давно вы дружите", "Что вы делаете вместе", "Почему этот человек важен для вас"],
    },
    part3: [
      "Что такое настоящая дружба, по-вашему?",
      "Как интернет изменил общение между людьми?",
      "Легче ли детям находить друзей, чем взрослым?",
    ],
  },
  {
    id: "learning",
    part1: [
      "Представьтесь, пожалуйста. Откуда вы?",
      "Почему вы изучаете русский язык?",
      "Сколько времени в день вы учите русский?",
      "Какие у вас хобби?",
    ],
    part2: {
      topic: "Расскажите о навыке, которому вы научились.",
      points: ["Что это за навык", "Когда и как вы ему научились", "Было ли это трудно", "Как этот навык помогает вам сейчас"],
    },
    part3: [
      "Почему важно учить иностранные языки?",
      "Какие навыки будут нужны людям в будущем?",
      "Что лучше — учиться самостоятельно или с преподавателем?",
    ],
  },
];

export function pickExamSet(): ExamSet {
  return EXAM_SETS[Math.floor(Math.random() * EXAM_SETS.length)];
}
