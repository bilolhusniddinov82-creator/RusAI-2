// Vocabulary source, one entry per line: word | translation | example | example translation.

export const PART_3: Record<string, string> = {
  Emotions: `
Радость | quvonch | Её глаза светились от радости. | Uning ko'zlari quvonchdan porlardi.
Счастье | baxt | Счастье — быть рядом с семьёй. | Baxt — oila bilan birga bo'lish.
Счастливый | baxtli | Сегодня я очень счастливый. | Bugun men juda baxtliman.
Грустный | g'amgin | Почему ты такой грустный? | Nega bunchalik g'amginsan?
Весёлый | quvnoq | Мой брат очень весёлый человек. | Akam juda quvnoq odam.
Злой | jahldor | Он был злой после разговора. | Suhbatdan keyin u jahldor edi.
Страх | qo'rquv | Он победил свой страх. | U qo'rquvini yengdi.
Бояться | qo'rqmoq | Я боюсь собак. | Itlardan qo'rqaman.
Любить | sevmoq | Я люблю свою семью. | Oilamni sevaman.
Нравиться | yoqmoq | Мне нравится эта песня. | Menga bu qo'shiq yoqadi.
Улыбка | tabassum | У тебя красивая улыбка. | Tabassuming chiroyli.
Смеяться | kulmoq | Мы долго смеялись над шуткой. | Hazilga uzoq kuldik.
Плакать | yig'lamoq | Ребёнок плачет, потому что устал. | Bola charchagani uchun yig'layapti.
Устать | charchamoq | Я очень устал после работы. | Ishdan keyin juda charchadim.
Спокойный | xotirjam | Он всегда спокойный. | U doim xotirjam.
Нервничать | asabiylashmoq | Не нервничай, всё будет хорошо. | Asabiylashma, hammasi yaxshi bo'ladi.
Удивление | hayrat | К моему удивлению, он пришёл вовремя. | Hayratimga, u o'z vaqtida keldi.
Удивлённый | hayron | Почему у тебя такой удивлённый вид? | Nega bunchalik hayron ko'rinasan?
Скучно | zerikarli | Мне скучно дома. | Uyda zerikyapman.
Интересно | qiziqarli | Это очень интересно! | Bu juda qiziqarli!
Рад | xursand | Рад тебя видеть! | Seni ko'rganimdan xursandman!
Настроение | kayfiyat | У меня отличное настроение. | Kayfiyatim a'lo.
Чувство | his-tuyg'u | Это странное чувство. | Bu g'alati his.
Гордиться | faxrlanmoq | Родители гордятся сыном. | Ota-ona o'g'li bilan faxrlanadi.
Стыдно | uyat | Мне стыдно за свои слова. | So'zlarim uchun uyalaman.
Обида | xafagarchilik | Я не держу на тебя обиды. | Senga xafa emasman.
Обижаться | xafa bo'lmoq | Не обижайся на меня. | Mendan xafa bo'lma.
Волноваться | hayajonlanmoq / xavotirlanmoq | Мама волнуется, когда я опаздываю. | Kechiksam, onam xavotirlanadi.
Беспокоиться | tashvishlanmoq | Не беспокойся обо мне. | Men haqimda tashvishlanma.
Надежда | umid | Надежда умирает последней. | Umid eng oxirida o'ladi.
Мечта | orzu | Моя мечта — побывать в Москве. | Orzuim — Moskvada bo'lish.
Мечтать | orzu qilmoq | Он мечтает стать врачом. | U shifokor bo'lishni orzu qiladi.
Ревность | rashk | Ревность разрушает отношения. | Rashk munosabatlarni buzadi.
Зависть | hasad | Зависть — плохое чувство. | Hasad — yomon tuyg'u.
Благодарность | minnatdorlik | Примите мою благодарность. | Minnatdorligimni qabul qiling.
Одиночество | yolg'izlik | Он чувствовал одиночество в чужом городе. | U begona shaharda yolg'izlikni his qildi.
Скучать | sog'inmoq | Я скучаю по родному городу. | Ona shahrimni sog'indim.
Восторг | zavq | Дети были в восторге от цирка. | Bolalar sirkdan zavqlanishdi.
Разочарование | hafsalasi pir bo'lish | Фильм вызвал у меня разочарование. | Film hafsalamni pir qildi.
Злиться | jahli chiqmoq | Не злись, я пошутил. | Jahling chiqmasin, hazillashdim.
Сердиться | achchiqlanmoq | Отец сердится, когда я поздно прихожу. | Kech kelsam, otam achchiqlanadi.
Смелый | jasur | Он очень смелый мальчик. | U juda jasur bola.
Застенчивый | uyatchan | Она застенчивая и мало говорит. | U uyatchan va kam gapiradi.
Добрый | mehribon | Бабушка очень добрая. | Buvim juda mehribon.
Честный | halol | Он честный человек. | U halol odam.
Терпение | sabr | Учёба требует терпения. | O'qish sabr talab qiladi.
Сочувствие | hamdardlik | Спасибо за сочувствие. | Hamdardligingiz uchun rahmat.
Уверенность | ishonch | Ему не хватает уверенности. | Unga ishonch yetishmaydi.
Уверенный | ishonchli / amin | Я уверен, что ты справишься. | Uddalashingga aminman.
Раздражать | g'ashiga tegmoq | Меня раздражает шум. | Shovqin g'ashimga tegadi.
Тревога | xavotir | Перед экзаменом я чувствую тревогу. | Imtihon oldidan xavotir sezaman.
Облегчение | yengillik | Я вздохнул с облегчением. | Yengil nafas oldim.
Вдохновение | ilhom | Музыка даёт мне вдохновение. | Musiqa menga ilhom beradi.
Равнодушный | befarq | Он равнодушен к футболу. | U futbolga befarq.
Искренний | samimiy | Спасибо за искренние слова. | Samimiy so'zlaringiz uchun rahmat.
Сожалеть | afsuslanmoq | Я сожалею о том, что случилось. | Bo'lgan voqeadan afsusdaman.
Восхищаться | hayratlanmoq | Я восхищаюсь её талантом. | Uning iste'dodiga hayratlanaman.
Тоска | qayg'u / sog'inch | Осенью меня охватывает тоска. | Kuzda meni sog'inch qamrab oladi.
Ласка | erkalash | Ребёнку нужна ласка. | Bolaga erkalash kerak.
Счастливо | baxtli bo'l! (xayrlashuv) | Ну, счастливо тебе! | Xo'p, omon bo'l!
`,
  Time: `
Время | vaqt | Сколько сейчас времени? | Hozir soat necha?
Час | soat | Урок длится один час. | Dars bir soat davom etadi.
Минута | daqiqa | Подожди одну минуту. | Bir daqiqa kut.
Секунда | soniya | Это займёт всего секунду. | Bu bor-yo'g'i bir soniya oladi.
День | kun | Хорошего дня! | Kuningiz xayrli o'tsin!
Неделя | hafta | Я работаю пять дней в неделю. | Haftasiga besh kun ishlayman.
Месяц | oy | В следующем месяце я еду в отпуск. | Kelasi oy ta'tilga chiqaman.
Год | yil | С Новым годом! | Yangi yilingiz bilan!
Понедельник | dushanba | В понедельник начинается работа. | Dushanba kuni ish boshlanadi.
Вторник | seshanba | Во вторник у меня урок русского. | Seshanba kuni rus tili darsim bor.
Среда | chorshanba | Встретимся в среду. | Chorshanba kuni uchrashamiz.
Четверг | payshanba | В четверг я хожу в бассейн. | Payshanba kuni basseynga boraman.
Пятница | juma | В пятницу мы идём в кино. | Juma kuni kinoga boramiz.
Суббота | shanba | В субботу я отдыхаю. | Shanba kuni dam olaman.
Воскресенье | yakshanba | В воскресенье мы были у бабушки. | Yakshanba kuni buvimnikida bo'ldik.
Сейчас | hozir | Сейчас я занят. | Hozir bandman.
Потом | keyin | Сначала поешь, потом гуляй. | Avval ovqatlan, keyin sayr qil.
Рано | erta | Я встаю рано. | Men erta turaman.
Поздно | kech | Уже поздно, пора спать. | Allaqachon kech, uxlash vaqti.
Скоро | tez orada | Скоро лето! | Tez orada yoz!
Всегда | doim | Я всегда пью чай утром. | Ertalab doim choy ichaman.
Никогда | hech qachon | Я никогда не был в Париже. | Men hech qachon Parijda bo'lmaganman.
Часто | tez-tez | Я часто звоню родителям. | Ota-onamga tez-tez qo'ng'iroq qilaman.
Редко | kamdan-kam | Я редко смотрю телевизор. | Televizorni kamdan-kam ko'raman.
Уже | allaqachon | Я уже поел. | Allaqachon ovqatlandim.
Ещё | hali / yana | Он ещё спит. | U hali uxlayapti.
Часы | soat (asbob) | Мои часы спешат на пять минут. | Soatim besh daqiqa oldinda.
Полдень | tush payti | Встретимся в полдень. | Tush paytida uchrashamiz.
Полночь | yarim tun | Он вернулся домой в полночь. | U uyga yarim tunda qaytdi.
Выходные | dam olish kunlari | Что ты делаешь на выходных? | Dam olish kunlari nima qilasan?
Будний день | ish kuni | В будние дни я работаю. | Ish kunlari ishlayman.
Прошлое | o'tmish | Не думай о прошлом. | O'tmish haqida o'ylama.
Будущее | kelajak | Я думаю о будущем. | Kelajak haqida o'ylayman.
Настоящее | hozirgi zamon | Живи в настоящем. | Hozirgi kun bilan yasha.
Век | asr | Это здание построили в прошлом веке. | Bu bino o'tgan asrda qurilgan.
Десятилетие | o'n yillik | За десятилетие город сильно изменился. | O'n yil ichida shahar ancha o'zgardi.
Сутки | sutka | Магазин работает круглые сутки. | Do'kon kecha-kunduz ishlaydi.
Вовремя | o'z vaqtida | Поезд пришёл вовремя. | Poyezd o'z vaqtida keldi.
Заранее | oldindan | Купи билеты заранее. | Chiptalarni oldindan ol.
Недавно | yaqinda | Я недавно переехал. | Yaqinda ko'chib o'tdim.
Давно | ancha oldin / uzoq vaqt | Мы давно не виделись. | Ancha vaqt ko'rishmadik.
Сначала | avval | Сначала прочитай задание. | Avval topshiriqni o'qi.
Наконец | nihoyat | Наконец пришла весна. | Nihoyat bahor keldi.
Пока | hozircha / ...guncha | Пока ты спал, пришёл друг. | Sen uxlayotganingda do'st keldi.
Опаздывать | kechikmoq | Не опаздывай на урок. | Darsga kechikma.
Длиться | davom etmoq | Фильм длится два часа. | Film ikki soat davom etadi.
Срочно | shoshilinch | Мне срочно нужна помощь. | Menga shoshilinch yordam kerak.
Постоянно | doimiy ravishda | Он постоянно опаздывает. | U doim kechikadi.
Ежедневно | har kuni | Я занимаюсь ежедневно. | Har kuni shug'ullanaman.
Ежегодно | har yili | Фестиваль проходит ежегодно. | Festival har yili o'tkaziladi.
Период | davr | Это был трудный период. | Bu og'ir davr edi.
Эпоха | davr / epoxa | Это была эпоха великих открытий. | Bu buyuk kashfiyotlar davri edi.
Мгновение | lahza | Всё изменилось в одно мгновение. | Hammasi bir lahzada o'zgardi.
Сезон | mavsum | Сейчас сезон дождей. | Hozir yomg'ir mavsumi.
Расписание | jadval | Расписание изменилось. | Jadval o'zgardi.
Дата | sana | Какая сегодня дата? | Bugun qaysi sana?
Календарь | taqvim | Отметь дату в календаре. | Sanani taqvimda belgilab qo'y.
Заблаговременно | o'z vaqtida oldindan | Сообщите об отмене заблаговременно. | Bekor qilish haqida oldindan xabar bering.
Своевременно | o'z vaqtida | Важно своевременно платить за квартиру. | Kvartira uchun o'z vaqtida to'lash muhim.
Впоследствии | keyinchalik | Впоследствии он стал известным писателем. | Keyinchalik u mashhur yozuvchi bo'ldi.
`,
  Numbers: `
Один | bir | У меня один брат. | Mening bitta akam bor.
Два | ikki | Дайте два билета. | Ikkita chipta bering.
Три | uch | Я жду уже три часа. | Uch soatdan beri kutyapman.
Четыре | to'rt | В году четыре сезона. | Yilda to'rt fasl bor.
Пять | besh | Урок начинается через пять минут. | Dars besh daqiqadan keyin boshlanadi.
Шесть | olti | Я встаю в шесть часов. | Soat oltida turaman.
Семь | yetti | В неделе семь дней. | Haftada yetti kun bor.
Восемь | sakkiz | Мы работаем восемь часов в день. | Kuniga sakkiz soat ishlaymiz.
Девять | to'qqiz | Магазин открывается в девять. | Do'kon to'qqizda ochiladi.
Десять | o'n | Мне нужно десять яиц. | Menga o'nta tuxum kerak.
Одиннадцать | o'n bir | Моему сыну одиннадцать лет. | O'g'limga o'n bir yosh.
Двенадцать | o'n ikki | Обед в двенадцать часов. | Tushlik soat o'n ikkida.
Пятнадцать | o'n besh | Подожди пятнадцать минут. | O'n besh daqiqa kut.
Двадцать | yigirma | Мне двадцать лет. | Menga yigirma yosh.
Тридцать | o'ttiz | В месяце тридцать дней. | Oyda o'ttiz kun bor.
Сорок | qirq | Дорога заняла сорок минут. | Yo'l qirq daqiqa oldi.
Пятьдесят | ellik | Это стоит пятьдесят рублей. | Bu ellik rubl turadi.
Сто | yuz | В классе сто книг. | Sinfda yuzta kitob bor.
Тысяча | ming | Билет стоит тысячу рублей. | Chipta ming rubl turadi.
Миллион | million | В городе живёт три миллиона человек. | Shaharda uch million kishi yashaydi.
Первый | birinchi | Это мой первый урок. | Bu mening birinchi darsim.
Второй | ikkinchi | Я живу на втором этаже. | Ikkinchi qavatda yashayman.
Третий | uchinchi | Сегодня третье мая. | Bugun uchinchi may.
Последний | oxirgi | Это последний автобус. | Bu oxirgi avtobus.
Число | son / sana | Какое сегодня число? | Bugun nechanchi sana?
Номер | raqam | Какой у тебя номер телефона? | Telefon raqaming qanday?
Сколько | qancha / nechta | Сколько это стоит? | Bu qancha turadi?
Много | ko'p | У меня много друзей. | Do'stlarim ko'p.
Мало | kam | У нас мало времени. | Vaqtimiz kam.
Половина | yarim | Я съел половину торта. | Tortning yarmini yedim.
Пара | juft | Я купил пару носков. | Bir juft paypoq sotib oldim.
Двести | ikki yuz | Книга стоит двести рублей. | Kitob ikki yuz rubl turadi.
Пятьсот | besh yuz | До магазина пятьсот метров. | Do'konga besh yuz metr.
Ноль | nol | Счёт матча — ноль-ноль. | O'yin hisobi — nol-nol.
Десяток | o'ntalik | Купи десяток яиц. | O'nta tuxum ol.
Дюжина | o'n ikkitalik | В коробке дюжина пирожных. | Qutida o'n ikkita pirojniy bor.
Четверть | chorak | Сейчас четверть третьего. | Hozir soat ikkidan chorak o'tdi.
Процент | foiz | Цены выросли на десять процентов. | Narxlar o'n foizga oshdi.
Считать | sanamoq | Ребёнок умеет считать до ста. | Bola yuzgacha sanay oladi.
Сумма | summa | Какая общая сумма? | Umumiy summa qancha?
Цифра | raqam | Напиши эту цифру крупно. | Bu raqamni kattaroq yoz.
Сложение | qo'shish | Сложение — самое простое действие. | Qo'shish — eng oddiy amal.
Вычитание | ayirish | Дети учат вычитание. | Bolalar ayirishni o'rganyapti.
Умножение | ko'paytirish | Таблицу умножения нужно знать наизусть. | Ko'paytirish jadvalini yoddan bilish kerak.
Деление | bo'lish | Деление на ноль невозможно. | Nolga bo'lish mumkin emas.
Равно | teng | Два плюс два равно четырём. | Ikki qo'shuv ikki to'rtga teng.
Вдвое | ikki baravar | Цены выросли вдвое. | Narxlar ikki baravar oshdi.
Несколько | bir nechta | Я прочитал несколько книг. | Bir nechta kitob o'qidim.
Количество | miqdor | Количество студентов увеличилось. | Talabalar soni ko'paydi.
Среднее | o'rtacha | Средняя температура — двадцать градусов. | O'rtacha harorat — yigirma daraja.
Метр | metr | Высота дома — двадцать метров. | Uyning balandligi — yigirma metr.
Километр | kilometr | До города десять километров. | Shahargacha o'n kilometr.
Килограмм | kilogramm | Дайте килограмм яблок. | Bir kilogramm olma bering.
Литр | litr | Купи литр молока. | Bir litr sut ol.
Градус | daraja | Сегодня тридцать градусов тепла. | Bugun o'ttiz daraja issiq.
Вес | og'irlik | Вес чемодана — двадцать килограммов. | Chamadon og'irligi — yigirma kilogramm.
Возраст | yosh | Какой у тебя возраст? | Yoshing nechada?
Дробь | kasr | Сегодня мы решаем задачи с дробями. | Bugun kasrli masalalar yechamiz.
Бесконечность | cheksizlik | Вселенная кажется бесконечностью. | Koinot cheksizlikdek tuyuladi.
Приблизительно | taxminan | Приблизительно сто человек пришли на концерт. | Konsertga taxminan yuz kishi keldi.
`,
  Colors: `
Цвет | rang | Какой твой любимый цвет? | Sevimli ranging qaysi?
Красный | qizil | У меня красная машина. | Mening qizil mashinam bor.
Синий | ko'k | Небо синее. | Osmon ko'k.
Голубой | havorang | У неё голубые глаза. | Uning ko'zlari havorang.
Зелёный | yashil | Весной трава зелёная. | Bahorda o't yashil.
Жёлтый | sariq | Осенью листья жёлтые. | Kuzda barglar sariq.
Белый | oq | Зимой всё белое от снега. | Qishda hamma narsa qordan oppoq.
Чёрный | qora | Я ношу чёрное пальто. | Qora palto kiyaman.
Серый | kulrang | Сегодня серое небо. | Bugun osmon kulrang.
Коричневый | jigarrang | У него коричневые ботинки. | Uning jigarrang botinkasi bor.
Оранжевый | to'q sariq | Апельсин оранжевого цвета. | Apelsin to'q sariq rangda.
Розовый | pushti | Девочка в розовом платье. | Qizcha pushti ko'ylakda.
Фиолетовый | binafsha | Мне нравятся фиолетовые цветы. | Binafsha gullar menga yoqadi.
Светлый | och | Мне нравятся светлые комнаты. | Yorug' xonalar menga yoqadi.
Тёмный | to'q / qorong'i | В спальне тёмные шторы. | Yotoqxonada to'q rangli pardalar bor.
Яркий | yorqin | Она любит яркие цвета. | U yorqin ranglarni yaxshi ko'radi.
Разноцветный | rang-barang | Дети нарисовали разноцветную радугу. | Bolalar rang-barang kamalak chizishdi.
Золотой | oltin rang | У неё золотое кольцо. | Uning oltin uzugi bor.
Серебряный | kumush rang | Он получил серебряную медаль. | U kumush medal oldi.
Бежевый | bej | Я купил бежевый свитер. | Bej sviter sotib oldim.
Бордовый | to'q qizil | На ней бордовое платье. | U to'q qizil ko'ylakda.
Бирюзовый | firuza rang | Море было бирюзовым. | Dengiz firuza rangda edi.
Краска | bo'yoq | Нам нужна белая краска для стен. | Devorlar uchun oq bo'yoq kerak.
Красить | bo'yamoq | Папа красит забор. | Otam devorni bo'yayapti.
Рисовать | rasm chizmoq | Дочь любит рисовать красками. | Qizim bo'yoqlar bilan rasm chizishni yaxshi ko'radi.
Оттенок | tus | Этот оттенок синего очень красивый. | Ko'kning bu tusi juda chiroyli.
Бледный | rangpar | Ты сегодня бледный, ты болеешь? | Bugun rangparsan, kasalmisan?
Пёстрый | ola-bula | На рынке продают пёстрые ткани. | Bozorda ola-bula matolar sotiladi.
Прозрачный | shaffof | Вода в озере прозрачная. | Ko'ldagi suv shaffof.
Блестящий | yaltiroq | У неё блестящие волосы. | Uning sochlari yaltiroq.
Тусклый | xira | В комнате тусклый свет. | Xonada xira yorug'lik.
Однотонный | bir xil rangli | Я предпочитаю однотонные рубашки. | Bir xil rangli ko'ylaklarni afzal ko'raman.
Полосатый | yo'l-yo'l | У зебры полосатая шкура. | Zebraning terisi yo'l-yo'l.
Клетчатый | katak | Он носит клетчатую рубашку. | U katak ko'ylak kiyadi.
Покраснеть | qizarmoq | Она покраснела от смущения. | U uyalganidan qizarib ketdi.
Побледнеть | oqarib ketmoq | Он побледнел от страха. | U qo'rquvdan oqarib ketdi.
Загорелый | qoraygan (quyoshda) | После отпуска он загорелый. | Ta'tildan keyin u qorayib qolgan.
Седой | oqargan (soch) | У дедушки седые волосы. | Bobomning sochlari oqargan.
Рыжий | malla | У неё рыжие волосы. | Uning sochlari malla.
Светофор | svetofor | Переходи дорогу на зелёный свет светофора. | Yo'ldan svetoforning yashil chirog'ida o't.
Палитра | palitra | Художник смешивает краски на палитре. | Rassom bo'yoqlarni palitrada aralashtiradi.
Кисть | mo'yqalam | Возьми тонкую кисть. | Ingichka mo'yqalam ol.
Пятно | dog' | На рубашке пятно. | Ko'ylakda dog' bor.
Контраст | kontrast | Чёрное и белое — яркий контраст. | Qora va oq — yorqin kontrast.
Сочетаться | mos kelmoq | Эти цвета хорошо сочетаются. | Bu ranglar bir-biriga yaxshi mos keladi.
Выцвести | rangi o'chmoq | Футболка выцвела на солнце. | Futbolka quyoshda rangini yo'qotdi.
Малиновый | to'q pushti | Малиновый закат был прекрасен. | To'q pushti shafaq go'zal edi.
Изумрудный | zumrad rang | Трава была изумрудного цвета. | O'tlar zumrad rangida edi.
Лиловый | nafarmon | Сирень бывает лиловой. | Nastarin nafarmon rangda bo'ladi.
Пастельный | pastel | Детская комната в пастельных тонах. | Bolalar xonasi pastel ranglarda.
Тёмно-синий | to'q ko'k | Он надел тёмно-синий костюм. | U to'q ko'k kostyum kiydi.
Светло-зелёный | och yashil | Стены светло-зелёного цвета. | Devorlar och yashil rangda.
Чёрно-белый | oq-qora | Мы смотрели старый чёрно-белый фильм. | Eski oq-qora filmni ko'rdik.
Окраска | rang (tus berish) | У этой птицы яркая окраска. | Bu qushning rangi yorqin.
Цветной | rangli | Мне нужны цветные карандаши. | Menga rangli qalamlar kerak.
Белоснежный | oppoq | У неё белоснежная улыбка. | Uning tabassumi oppoq.
Черничный | ko'k-binafsha | Она купила черничный шарф. | U ko'k-binafsha sharf sotib oldi.
Персиковый | shaftoli rang | Персиковый цвет очень нежный. | Shaftoli rang juda nozik.
Песочный | qum rang | Он купил песочные брюки. | U qum rang shim sotib oldi.
Мятный | yalpiz rang | Мятный цвет сейчас в моде. | Yalpiz rangi hozir modada.
`,
};
