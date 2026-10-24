// Vocabulary source, one entry per line: word | translation | example | example translation.
// Inside each category, entries go from A1 to B1 (see LEVEL_SPLITS in ../vocab-data.ts).

export const PART_1: Record<string, string> = {
  Travel: `
Путешествие | sayohat | Это путешествие я запомню надолго. | Bu sayohatni uzoq vaqt eslab qolaman.
Аэропорт | aeroport | Мы приехали в аэропорт за два часа до вылета. | Biz aeroportga uchishdan ikki soat oldin keldik.
Билет | chipta | Я купил билет на поезд до Самарканда. | Men Samarqandgacha poyezd chiptasini sotib oldim.
Гостиница | mehmonxona | Наша гостиница находится в центре города. | Mehmonxonamiz shahar markazida joylashgan.
Паспорт | pasport | Не забудь взять с собой паспорт. | Pasportingni olishni unutma.
Чемодан | chamadon | Мой чемодан очень тяжёлый. | Mening chamadonim juda og'ir.
Поезд | poyezd | Поезд отправляется в восемь утра. | Poyezd ertalab soat sakkizda jo'naydi.
Самолёт | samolyot | Самолёт приземлился вовремя. | Samolyot o'z vaqtida qo'ndi.
Автобус | avtobus | Я езжу на работу на автобусе. | Men ishga avtobusda boraman.
Такси | taksi | Давай возьмём такси до вокзала. | Keling, vokzalgacha taksi olaylik.
Вокзал | vokzal | Вокзал находится недалеко от гостиницы. | Vokzal mehmonxonadan uzoq emas.
Карта | xarita | Посмотри на карту, мы потерялись. | Xaritaga qara, biz adashib qoldik.
Улица | ko'cha | Я живу на этой улице. | Men shu ko'chada yashayman.
Город | shahar | Ташкент — большой и красивый город. | Toshkent katta va chiroyli shahar.
Страна | mamlakat | В какой стране ты родился? | Qaysi mamlakatda tug'ilgansan?
Море | dengiz | Летом мы поедем на море. | Yozda dengizga boramiz.
Отпуск | ta'til | В отпуске я много отдыхаю. | Ta'tilda ko'p dam olaman.
Турист | sayyoh | Летом в городе много туристов. | Yozda shaharda sayyohlar ko'p.
Дорога | yo'l | Дорога до деревни заняла три часа. | Qishloqqacha yo'l uch soat davom etdi.
Метро | metro | В Москве удобно ездить на метро. | Moskvada metroda yurish qulay.
Остановка | bekat | Я жду тебя на остановке. | Seni bekatda kutyapman.
Музей | muzey | В субботу мы ходили в музей. | Shanba kuni muzeyga bordik.
Фотография | surat | Я сделал красивую фотографию заката. | Quyosh botishining chiroyli suratini oldim.
Сувенир | esdalik sovg'asi | Я купил маме сувенир. | Onamga esdalik sovg'asi sotib oldim.
Рюкзак | ryukzak | В рюкзаке лежат вода и карта. | Ryukzakda suv va xarita bor.
Багаж | bagaj | Где можно получить багаж? | Bagajni qayerdan olsa bo'ladi?
Рейс | reys | Наш рейс задерживается на час. | Reysimiz bir soatga kechikyapti.
Посадка | samolyotga chiqish | Посадка на самолёт начнётся через десять минут. | Samolyotga chiqish o'n daqiqadan keyin boshlanadi.
Виза | viza | Для этой страны нужна виза. | Bu mamlakat uchun viza kerak.
Граница | chegara | Мы пересекли границу ночью. | Chegarani tunda kesib o'tdik.
Таможня | bojxona | На таможне проверили наш багаж. | Bojxonada bagajimizni tekshirishdi.
Бронирование | bron qilish | Бронирование номера можно сделать онлайн. | Xonani onlayn bron qilish mumkin.
Номер | mehmonxona xonasi | Наш номер на пятом этаже. | Xonamiz beshinchi qavatda.
Экскурсия | ekskursiya | Экскурсия по старому городу была интересной. | Eski shahar bo'ylab ekskursiya qiziqarli bo'ldi.
Гид | gid | Гид рассказал нам историю крепости. | Gid bizga qal'a tarixini aytib berdi.
Достопримечательность | diqqatga sazovor joy | Регистан — главная достопримечательность Самарканда. | Registon — Samarqandning asosiy diqqatga sazovor joyi.
Пляж | plyaj | Мы весь день лежали на пляже. | Kun bo'yi plyajda yotdik.
Палатка | chodir | Ночью мы спали в палатке. | Tunda chodirda uxladik.
Маршрут | yo'nalish | Мы заранее составили маршрут. | Yo'nalishni oldindan tuzib oldik.
Расписание | jadval | Посмотри расписание поездов. | Poyezdlar jadvaliga qara.
Пересадка | o'tish (transportda) | В Москве у нас пересадка. | Moskvada transport almashtiramiz.
Опоздать | kechikmoq | Быстрее, мы можем опоздать на поезд! | Tezroq, poyezdga kechikib qolishimiz mumkin!
Прибытие | yetib kelish | Время прибытия — шесть вечера. | Yetib kelish vaqti — kechki oltida.
Отправление | jo'nash | Отправление поезда через пять минут. | Poyezd jo'nashiga besh daqiqa qoldi.
Путеводитель | yo'lko'rsatkich kitob | В путеводителе есть список лучших кафе. | Yo'lko'rsatkichda eng yaxshi kafelar ro'yxati bor.
Валюта | valyuta | Где можно обменять валюту? | Valyutani qayerda almashtirsa bo'ladi?
Обмен | almashtirish | Пункт обмена валюты работает до восьми. | Valyuta almashtirish shoxobchasi sakkizgacha ishlaydi.
Поездка | safar | Поездка в горы была замечательной. | Tog'larga safar ajoyib bo'ldi.
Приключение | sarguzasht | Каждое путешествие — это новое приключение. | Har bir sayohat — yangi sarguzasht.
Попутчик | yo'ldosh | Мой попутчик оказался очень весёлым. | Yo'ldoshim juda quvnoq odam ekan.
Указатель | ko'rsatkich | Иди по указателю к выходу. | Chiqishga ko'rsatkich bo'yicha bor.
Пробка | tirbandlik | Мы час стояли в пробке. | Bir soat tirbandlikda turdik.
Регистрация | ro'yxatdan o'tish | Регистрация на рейс заканчивается через час. | Reysga ro'yxatdan o'tish bir soatdan keyin tugaydi.
Сопровождать | kuzatib bormoq | Гид будет сопровождать группу весь день. | Gid guruhni kun bo'yi kuzatib boradi.
Местный | mahalliy | Местные жители очень гостеприимные. | Mahalliy aholi juda mehmondo'st.
Заграница | chet el | Он впервые едет за границу. | U birinchi marta chet elga ketyapti.
Путёвка | yo'llanma | Мы купили путёвку на две недели. | Ikki haftalik yo'llanma sotib oldik.
Окрестности | atrof | Мы гуляли по окрестностям города. | Shahar atrofida sayr qildik.
Побережье | qirg'oq | На побережье много уютных отелей. | Qirg'oqda shinam mehmonxonalar ko'p.
Впечатление | taassurot | Поездка оставила яркие впечатления. | Safar yorqin taassurotlar qoldirdi.
`,
  Work: `
Работа | ish | Моя работа начинается в девять утра. | Ishim ertalab soat to'qqizda boshlanadi.
Коллега | hamkasb | Мой коллега помог мне с отчётом. | Hamkasbim hisobotda menga yordam berdi.
Зарплата | maosh | Зарплату платят два раза в месяц. | Maosh oyiga ikki marta to'lanadi.
Встреча | uchrashuv | У нас встреча в три часа. | Soat uchda uchrashuvimiz bor.
Офис | ofis | Наш офис находится на десятом этаже. | Ofisimiz o'ninchi qavatda.
Начальник | boshliq | Начальник похвалил нашу команду. | Boshliq jamoamizni maqtadi.
Задача | vazifa | Это сложная, но интересная задача. | Bu qiyin, lekin qiziqarli vazifa.
Профессия | kasb | Какая у тебя профессия? | Kasbing nima?
Врач | shifokor | Моя сестра работает врачом. | Opam shifokor bo'lib ishlaydi.
Инженер | muhandis | Отец работает инженером на заводе. | Otam zavodda muhandis bo'lib ishlaydi.
Водитель | haydovchi | Водитель автобуса был очень вежливым. | Avtobus haydovchisi juda xushmuomala edi.
Продавец | sotuvchi | Продавец помог мне выбрать телефон. | Sotuvchi telefon tanlashimga yordam berdi.
Повар | oshpaz | Повар готовит вкусный плов. | Oshpaz mazali palov tayyorlaydi.
Компания | kompaniya | Я работаю в большой компании. | Men katta kompaniyada ishlayman.
Проект | loyiha | Мы закончили проект вовремя. | Loyihani o'z vaqtida tugatdik.
Опыт | tajriba | У него большой опыт работы. | Uning ish tajribasi katta.
Резюме | rezyume | Отправь резюме на эту почту. | Rezyumeni shu pochtaga yubor.
Собеседование | suhbat (ishga) | Завтра у меня собеседование. | Ertaga ishga suhbatim bor.
Отчёт | hisobot | Мне нужно написать отчёт к пятнице. | Jumagacha hisobot yozishim kerak.
Перерыв | tanaffus | В час дня у нас перерыв на обед. | Kunduzi soat birda tushlik tanaffusimiz bor.
Выходной | dam olish kuni | Воскресенье — мой выходной. | Yakshanba — dam olish kunim.
Клиент | mijoz | Клиент остался доволен нашей работой. | Mijoz ishimizdan mamnun qoldi.
Договор | shartnoma | Мы подписали договор сегодня. | Bugun shartnomani imzoladik.
Должность | lavozim | Он получил новую должность. | U yangi lavozimga ega bo'ldi.
Сотрудник | xodim | В компании работает сто сотрудников. | Kompaniyada yuzta xodim ishlaydi.
Команда | jamoa | Наша команда работает очень дружно. | Jamoamiz juda ahil ishlaydi.
Срок | muddat | Срок сдачи проекта — понедельник. | Loyihani topshirish muddati — dushanba.
Совещание | majlis | Совещание перенесли на завтра. | Majlis ertaga ko'chirildi.
Карьера | martaba | Он сделал быструю карьеру. | U tez martaba qildi.
Обязанность | majburiyat | Это входит в мои обязанности. | Bu mening majburiyatlarimga kiradi.
Отдел | bo'lim | Я работаю в отделе продаж. | Men savdo bo'limida ishlayman.
Премия | mukofot puli | В конце года всем дали премию. | Yil oxirida hammaga mukofot puli berildi.
Увольнение | ishdan bo'shatish | Новость об увольнении всех удивила. | Ishdan bo'shatish haqidagi xabar hammani hayron qoldirdi.
Повышение | lavozim ko'tarilishi | Она получила повышение в этом месяце. | U shu oy lavozimga ko'tarildi.
Заявление | ariza | Напишите заявление на отпуск. | Ta'til uchun ariza yozing.
Смена | smena | Сегодня у меня ночная смена. | Bugun tungi smenam.
График | jadval | У меня гибкий график работы. | Ish jadvalim moslashuvchan.
Опоздание | kechikish | Начальник не любит опоздания. | Boshliq kechikishni yoqtirmaydi.
Коллектив | jamoa | В нашем коллективе хорошая атмосфера. | Jamoamizda yaxshi muhit bor.
Предприятие | korxona | Это предприятие выпускает мебель. | Bu korxona mebel ishlab chiqaradi.
Бухгалтер | buxgalter | Бухгалтер считает зарплату. | Buxgalter maoshni hisoblaydi.
Юрист | huquqshunos | Юрист проверил договор. | Huquqshunos shartnomani tekshirdi.
Программист | dasturchi | Мой брат работает программистом. | Akam dasturchi bo'lib ishlaydi.
Стажировка | amaliyot | Летом я прохожу стажировку в банке. | Yozda bankda amaliyot o'tayman.
Командировка | xizmat safari | На следующей неделе я еду в командировку. | Kelasi hafta xizmat safariga ketaman.
Удалённо | masofadan | Многие сейчас работают удалённо. | Hozir ko'pchilik masofadan ishlaydi.
Нагрузка | yuklama | В конце года большая нагрузка. | Yil oxirida yuklama katta.
Решение | qaror | Мы приняли важное решение. | Biz muhim qaror qabul qildik.
Ответственность | mas'uliyat | Он берёт ответственность на себя. | U mas'uliyatni o'z zimmasiga oladi.
Навык | ko'nikma | Коммуникация — важный навык. | Muloqot — muhim ko'nikma.
Руководитель | rahbar | Руководитель проекта собрал команду. | Loyiha rahbari jamoani yig'di.
Подчинённый | qo'l ostidagi xodim | Он хорошо относится к подчинённым. | U qo'l ostidagilarga yaxshi munosabatda.
Пенсия | nafaqa | Дедушка вышел на пенсию в прошлом году. | Bobom o'tgan yili nafaqaga chiqdi.
Безработица | ishsizlik | Безработица в городе снизилась. | Shahardagi ishsizlik kamaydi.
Вакансия | bo'sh ish o'rni | В компании открыта новая вакансия. | Kompaniyada yangi bo'sh ish o'rni ochildi.
Трудолюбивый | mehnatkash | Она очень трудолюбивый человек. | U juda mehnatkash inson.
Достижение | yutuq | Это большое достижение для нашей команды. | Bu jamoamiz uchun katta yutuq.
Цель | maqsad | Наша цель — стать лучшими. | Maqsadimiz — eng yaxshisi bo'lish.
Конкурент | raqobatchi | Конкуренты снизили цены. | Raqobatchilar narxlarni tushirishdi.
Квалификация | malaka | Для этой работы нужна высокая квалификация. | Bu ish uchun yuqori malaka kerak.
`,
  Everyday: `
Привет | salom | Привет, как дела? | Salom, ishlar qalay?
Спасибо | rahmat | Спасибо большое за помощь. | Yordamingiz uchun katta rahmat.
Пожалуйста | iltimos / marhamat | Дайте, пожалуйста, воды. | Iltimos, suv bering.
Извините | kechirasiz | Извините, где здесь метро? | Kechirasiz, bu yerda metro qayerda?
Да | ha | Да, я понимаю. | Ha, tushunaman.
Нет | yo'q | Нет, я не устал. | Yo'q, men charchamadim.
Дом | uy | Вечером я иду домой. | Kechqurun uyga boraman.
Время | vaqt | У меня мало времени. | Vaqtim kam.
Друг | do'st | Он мой лучший друг. | U mening eng yaqin do'stim.
Человек | odam | Это очень добрый человек. | Bu juda mehribon odam.
Имя | ism | Как твоё имя? | Isming nima?
Вопрос | savol | У меня есть вопрос. | Mening savolim bor.
Ответ | javob | Я не знаю ответа. | Javobini bilmayman.
Магазин | do'kon | Я иду в магазин за хлебом. | Non olgani do'konga boryapman.
Деньги | pul | У меня нет с собой денег. | Yonimda pul yo'q.
Телефон | telefon | Где мой телефон? | Telefonim qayerda?
Утро | ertalab | Каждое утро я пью чай. | Har kuni ertalab choy ichaman.
Вечер | kechqurun | Вечером мы смотрим фильм. | Kechqurun film ko'ramiz.
Ночь | tun | Спокойной ночи! | Xayrli tun!
Сегодня | bugun | Сегодня очень тёплый день. | Bugun juda iliq kun.
Завтра | ertaga | Завтра я пойду в университет. | Ertaga universitetga boraman.
Вчера | kecha | Вчера я был дома. | Kecha uyda edim.
Хорошо | yaxshi | Всё будет хорошо. | Hammasi yaxshi bo'ladi.
Плохо | yomon | Я сегодня плохо спал. | Bugun yomon uxladim.
Можно | mumkin | Можно открыть окно? | Derazani ochsam bo'ladimi?
Нужно | kerak | Мне нужно позвонить маме. | Onamga qo'ng'iroq qilishim kerak.
Понимать | tushunmoq | Я понимаю по-русски. | Men ruschani tushunaman.
Говорить | gapirmoq | Говорите, пожалуйста, медленнее. | Iltimos, sekinroq gapiring.
Знать | bilmoq | Я знаю этого человека. | Men bu odamni bilaman.
Хотеть | xohlamoq | Я хочу пить. | Ichgim kelyapti.
Идти | bormoq (piyoda) | Я иду в парк. | Men parkka ketyapman.
Жить | yashamoq | Я живу в Ташкенте. | Men Toshkentda yashayman.
Помогать | yordam bermoq | Я всегда помогаю друзьям. | Men doim do'stlarimga yordam beraman.
Ждать | kutmoq | Подожди меня пять минут. | Meni besh daqiqa kut.
Делать | qilmoq | Что ты делаешь сейчас? | Hozir nima qilyapsan?
Сосед | qo'shni | Мой сосед очень шумный. | Qo'shnim juda shovqinli.
Новость | yangilik | У меня хорошая новость! | Menda yaxshi yangilik bor!
Проблема | muammo | Это не проблема. | Bu muammo emas.
Помощь | yordam | Тебе нужна помощь? | Senga yordam kerakmi?
Идея | g'oya | Отличная идея! | Ajoyib g'oya!
Покупка | xarid | Мы сделали много покупок. | Ko'p xarid qildik.
Очередь | navbat | В магазине длинная очередь. | Do'konda uzun navbat.
Ключ | kalit | Я потерял ключи от дома. | Uy kalitlarimni yo'qotib qo'ydim.
Сумка | sumka | Твоя сумка на столе. | Sumkang stol ustida.
Подарок | sovg'a | Спасибо за подарок! | Sovg'a uchun rahmat!
Праздник | bayram | Новый год — мой любимый праздник. | Yangi yil — sevimli bayramim.
Привычка | odat | У меня есть привычка рано вставать. | Erta turish odatim bor.
Разговор | suhbat | У нас был долгий разговор. | Uzoq suhbatimiz bo'ldi.
Случай | voqea / holat | Со мной произошёл смешной случай. | Men bilan kulgili voqea yuz berdi.
Причина | sabab | Какая причина опоздания? | Kechikishning sababi nima?
Совет | maslahat | Дай мне совет, пожалуйста. | Iltimos, menga maslahat ber.
Обещание | va'da | Он всегда держит обещание. | U doim va'dasida turadi.
Решать | hal qilmoq | Мы решим эту проблему вместе. | Bu muammoni birga hal qilamiz.
Забывать | unutmoq | Я часто забываю зонт. | Soyabonni tez-tez unutaman.
Вспоминать | eslamoq | Я часто вспоминаю детство. | Bolaligimni tez-tez eslayman.
Надеяться | umid qilmoq | Надеюсь, ты придёшь. | Kelasan deb umid qilaman.
Удобный | qulay | Этот диван очень удобный. | Bu divan juda qulay.
Обычно | odatda | Обычно я встаю в семь. | Odatda soat yettida turaman.
Иногда | ba'zan | Иногда я гуляю в парке. | Ba'zan parkda sayr qilaman.
Наверное | ehtimol | Наверное, завтра будет дождь. | Ehtimol, ertaga yomg'ir yog'adi.
Конечно | albatta | Конечно, я помогу тебе. | Albatta, senga yordam beraman.
Вместе | birga | Давай поужинаем вместе. | Keling, birga kechki ovqat qilaylik.
Сразу | darhol | Я сразу понял, что случилось. | Nima bo'lganini darhol tushundim.
`,
  Food: `
Еда | ovqat | Эта еда очень вкусная. | Bu ovqat juda mazali.
Хлеб | non | Купи хлеб, пожалуйста. | Iltimos, non sotib ol.
Вода | suv | Дай мне стакан воды. | Menga bir stakan suv ber.
Ресторан | restoran | Мы поужинали в новом ресторане. | Yangi restoranda kechki ovqat qildik.
Чай | choy | Я пью зелёный чай без сахара. | Men shakarsiz ko'k choy ichaman.
Кофе | qahva | Утром я пью кофе. | Ertalab qahva ichaman.
Молоко | sut | Ребёнок пьёт молоко. | Bola sut ichyapti.
Мясо | go'sht | Я не ем много мяса. | Men ko'p go'sht yemayman.
Рыба | baliq | На ужин у нас рыба. | Kechki ovqatga baliq bor.
Курица | tovuq | Мама приготовила курицу с рисом. | Onam guruchli tovuq pishirdi.
Рис | guruch | Для плова нужен хороший рис. | Palov uchun yaxshi guruch kerak.
Яйцо | tuxum | На завтрак я ем два яйца. | Nonushtaga ikkita tuxum yeyman.
Сыр | pishloq | Я люблю бутерброды с сыром. | Pishloqli buterbrodlarni yaxshi ko'raman.
Масло | yog' / sariyog' | Добавь немного масла в кашу. | Bo'tqaga ozgina sariyog' qo'sh.
Сахар | shakar | Сколько сахара тебе положить? | Senga qancha shakar solay?
Соль | tuz | В супе мало соли. | Sho'rvada tuz kam.
Яблоко | olma | Это яблоко очень сладкое. | Bu olma juda shirin.
Фрукты | mevalar | Летом много свежих фруктов. | Yozda yangi mevalar ko'p.
Овощи | sabzavotlar | Овощи полезны для здоровья. | Sabzavotlar sog'liq uchun foydali.
Картошка | kartoshka | Я пожарил картошку. | Kartoshka qovurdim.
Помидор | pomidor | Нарежь помидоры для салата. | Salat uchun pomidor to'g'ra.
Огурец | bodring | Огурцы растут у нас в саду. | Bog'imizda bodring o'sadi.
Лук | piyoz | Без лука плов не приготовишь. | Piyozsiz palov qilib bo'lmaydi.
Суп | sho'rva | Бабушка варит вкусный суп. | Buvim mazali sho'rva pishiradi.
Салат | salat | Я заказал салат и сок. | Men salat va sharbat buyurtma qildim.
Сок | sharbat | Апельсиновый сок очень полезный. | Apelsin sharbati juda foydali.
Завтрак | nonushta | Завтрак — самая важная еда дня. | Nonushta — kunning eng muhim ovqati.
Обед | tushlik | Обед будет готов через час. | Tushlik bir soatdan keyin tayyor bo'ladi.
Ужин | kechki ovqat | Что у нас на ужин? | Kechki ovqatga nima bor?
Меню | menyu | Принесите, пожалуйста, меню. | Iltimos, menyuni olib keling.
Официант | ofitsiant | Официант принёс нам чай. | Ofitsiant bizga choy olib keldi.
Счёт | hisob (to'lov) | Можно счёт, пожалуйста? | Hisobni olsam bo'ladimi?
Тарелка | likopcha | Положи салат на тарелку. | Salatni likopchaga sol.
Ложка | qoshiq | Дай мне ложку для супа. | Sho'rva uchun menga qoshiq ber.
Вилка | sanchqi | Возьми вилку и нож. | Sanchqi va pichoq ol.
Нож | pichoq | Этот нож очень острый. | Bu pichoq juda o'tkir.
Чашка | piyola / chashka | Налей мне чашку чая. | Menga bir piyola choy quy.
Вкусный | mazali | Плов получился очень вкусным. | Palov juda mazali chiqdi.
Голодный | och | Я очень голодный после работы. | Ishdan keyin juda ochman.
Готовить | pishirmoq | Я люблю готовить по выходным. | Dam olish kunlari ovqat pishirishni yaxshi ko'raman.
Пить | ichmoq | Нужно пить много воды. | Ko'p suv ichish kerak.
Есть | yemoq | Я ем кашу на завтрак. | Nonushtaga bo'tqa yeyman.
Рецепт | retsept | Дай мне рецепт этого торта. | Menga bu tortning retseptini ber.
Торт | tort | На день рождения мы купили торт. | Tug'ilgan kunga tort sotib oldik.
Печенье | pechenye | Дети любят шоколадное печенье. | Bolalar shokoladli pechenyeni yaxshi ko'radi.
Мёд | asal | Чай с мёдом помогает при простуде. | Asalli choy shamollashda yordam beradi.
Каша | bo'tqa | Утром я ем овсяную кашу. | Ertalab suli bo'tqasi yeyman.
Специи | ziravorlar | В плов добавляют много специй. | Palovga ko'p ziravor qo'shiladi.
Острый | achchiq | Я не люблю слишком острую еду. | Juda achchiq ovqatni yoqtirmayman.
Сладкий | shirin | Этот виноград очень сладкий. | Bu uzum juda shirin.
Солёный | sho'r | Суп получился слишком солёным. | Sho'rva juda sho'r bo'lib qoldi.
Жарить | qovurmoq | Мама жарит рыбу на ужин. | Onam kechki ovqatga baliq qovuryapti.
Варить | qaynatmoq | Я варю макароны десять минут. | Makaronni o'n daqiqa qaynataman.
Порция | porsiya | Мне, пожалуйста, большую порцию. | Menga, iltimos, katta porsiya.
Блюдо | taom | Плов — национальное блюдо Узбекистана. | Palov — O'zbekistonning milliy taomi.
Аппетит | ishtaha | Приятного аппетита! | Yoqimli ishtaha!
Диета | parhez | Я сейчас на диете. | Hozir parhezdaman.
Продукты | oziq-ovqat | Я купил продукты на неделю. | Bir haftalik oziq-ovqat sotib oldim.
Свежий | yangi (uzilgan) | На рынке продают свежие овощи. | Bozorda yangi sabzavotlar sotiladi.
Ингредиенты | masalliqlar | Все ингредиенты есть в холодильнике. | Barcha masalliqlar muzlatgichda bor.
Вегетарианец | vegetarian | Мой друг вегетарианец, он не ест мясо. | Do'stim vegetarian, u go'sht yemaydi.
Пробовать | tatib ko'rmoq | Попробуй этот суп, он очень вкусный. | Bu sho'rvani tatib ko'r, juda mazali.
`,
  Family: `
Семья | oila | Моя семья живёт в Ташкенте. | Oilam Toshkentda yashaydi.
Мама | ona | Моя мама работает учителем. | Onam o'qituvchi bo'lib ishlaydi.
Папа | ota | Папа читает газету. | Otam gazeta o'qiyapti.
Брат | aka / uka | Мой брат учится в университете. | Akam universitetda o'qiydi.
Сестра | opa / singil | Моя сестра хорошо поёт. | Singlim yaxshi qo'shiq aytadi.
Дети | bolalar | У них двое детей. | Ularning ikki farzandi bor.
Сын | o'g'il | Их сын учится в школе. | Ularning o'g'li maktabda o'qiydi.
Дочь | qiz (farzand) | Моя дочь любит рисовать. | Qizim rasm chizishni yaxshi ko'radi.
Бабушка | buvi | Бабушка печёт вкусные пироги. | Buvim mazali pirog pishiradi.
Дедушка | bobo | Дедушка рассказывает интересные истории. | Bobom qiziqarli hikoyalar aytib beradi.
Муж | er | Её муж работает врачом. | Uning eri shifokor bo'lib ishlaydi.
Жена | xotin / rafiqa | Моя жена отлично готовит. | Rafiqam ajoyib ovqat pishiradi.
Родители | ota-ona | Мои родители живут в деревне. | Ota-onam qishloqda yashaydi.
Ребёнок | bola | Ребёнок спит в своей комнате. | Bola o'z xonasida uxlayapti.
Дядя | amaki / tog'a | Мой дядя живёт в Москве. | Amakim Moskvada yashaydi.
Тётя | amma / xola | Тётя приехала к нам в гости. | Xolam bizga mehmonga keldi.
Внук | nabira (o'g'il) | Бабушка гуляет с внуком. | Buvim nabirasi bilan sayr qilyapti.
Внучка | nabira (qiz) | Внучка помогает дедушке в саду. | Nabira bobosiga bog'da yordam beradi.
Родственники | qarindoshlar | На праздник пришли все родственники. | Bayramga barcha qarindoshlar keldi.
Свадьба | to'y | Свадьба будет в августе. | To'y avgustda bo'ladi.
Любовь | sevgi | Любовь — самое важное в жизни. | Sevgi — hayotdagi eng muhim narsa.
Близнецы | egizaklar | Мои братья — близнецы. | Akalarim — egizaklar.
Двоюродный брат | amakivachcha / xolavachcha | Мой двоюродный брат живёт в Бухаре. | Amakivachcham Buxoroda yashaydi.
Племянник | jiyan | Мой племянник ходит в детский сад. | Jiyanim bolalar bog'chasiga boradi.
Семейный | oilaviy | Мы любим семейные праздники. | Biz oilaviy bayramlarni yaxshi ko'ramiz.
Жених | kuyov | Жених подарил невесте цветы. | Kuyov kelinga gul sovg'a qildi.
Невеста | kelin | Невеста была в красивом платье. | Kelin chiroyli ko'ylakda edi.
Свекровь | qaynona (erning onasi) | Свекровь научила её готовить плов. | Qaynonasi unga palov pishirishni o'rgatdi.
Тёща | qaynona (xotinning onasi) | Тёща приехала к нам на выходные. | Qaynonam dam olish kunlariga bizga keldi.
Поколение | avlod | Три поколения живут в одном доме. | Bir uyda uch avlod yashaydi.
Воспитывать | tarbiyalamoq | Родители воспитывают детей с любовью. | Ota-onalar bolalarni mehr bilan tarbiyalaydi.
Расти | o'smoq | Дети быстро растут. | Bolalar tez o'sadi.
Похож | o'xshash | Сын очень похож на отца. | O'g'il otasiga juda o'xshaydi.
Старший | katta (yoshda) | Мой старший брат уже работает. | Katta akam allaqachon ishlaydi.
Младший | kichik (yoshda) | Младшая сестра ещё учится в школе. | Kichik singlim hali maktabda o'qiydi.
Единственный | yagona | Он единственный ребёнок в семье. | U oiladagi yagona farzand.
Заботиться | g'amxo'rlik qilmoq | Дети заботятся о пожилых родителях. | Farzandlar keksa ota-onasiga g'amxo'rlik qiladi.
Уважать | hurmat qilmoq | В нашей семье уважают старших. | Oilamizda kattalarni hurmat qilishadi.
Ссориться | urishmoq | Брат и сестра иногда ссорятся. | Aka-singil ba'zan urishib qolishadi.
Мириться | yarashmoq | Они быстро помирились. | Ular tez yarashib olishdi.
Развод | ajrashish | Развод — это всегда тяжело. | Ajrashish doim og'ir.
Брак | nikoh | Они в браке уже десять лет. | Ular o'n yildan beri nikohda.
Годовщина | yillik | Сегодня годовщина свадьбы родителей. | Bugun ota-onamning to'y yilligi.
Наследство | meros | Дом достался ему в наследство. | Uy unga meros bo'lib qoldi.
Предок | ajdod | Мои предки жили в Хиве. | Ajdodlarim Xivada yashagan.
Усыновить | asrab olmoq | Они усыновили ребёнка. | Ular bola asrab olishdi.
Беременная | homilador | Моя сестра беременна. | Opam homilador.
Рождение | tug'ilish | Рождение сына — большая радость. | O'g'ilning tug'ilishi — katta quvonch.
Детство | bolalik | Детство я провёл в деревне. | Bolaligim qishloqda o'tgan.
Юность | yoshlik | В юности он много путешествовал. | Yoshligida u ko'p sayohat qilgan.
Пожилой | keksa | Помогите пожилому человеку перейти дорогу. | Keksa odamga yo'ldan o'tishga yordam bering.
Гостеприимство | mehmondo'stlik | Узбекское гостеприимство известно во всём мире. | O'zbek mehmondo'stligi butun dunyoga mashhur.
Традиция | an'ana | В нашей семье есть хорошая традиция. | Oilamizda yaxshi an'ana bor.
Доверие | ishonch | В семье важно доверие. | Oilada ishonch muhim.
Поддержка | qo'llab-quvvatlash | Спасибо за поддержку! | Qo'llab-quvvatlaganingiz uchun rahmat!
Ласковый | mehribon | Бабушка всегда была ласковой. | Buvim doim mehribon edi.
Строгий | qattiqqo'l | Отец был строгим, но справедливым. | Otam qattiqqo'l, lekin adolatli edi.
Послушный | itoatkor | Это очень послушный ребёнок. | Bu juda itoatkor bola.
Скучать | sog'inmoq | Я очень скучаю по маме. | Onamni juda sog'indim.
`,
};
