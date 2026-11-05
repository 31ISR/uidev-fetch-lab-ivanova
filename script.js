const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/manhwas?populate=*`
const API_TOKEN = '60c2c808cf8f23c5e8f50299b523c0850ce4c1de5388f36b10b08815be4293ab9dedd210a07c0f7032f9b34e10a232d052ab822ad6264c52ae09f6cee39e7434c798638487915433281403deb8a03c0c2780a68fc5776a3009caffd4aa2890cec19f0d5ccaded1b41a7c70b4e1cae5861d92b0d73181a170530c2491cdff1a00'

const statusEl = document.querySelector('#status')
const cardsEl = document.querySelector('#cards')

function createCard(item) {
    const { Title, Annotation, Episides, Release, Cover, Read, Scenarist, Genre } = item

    const imageUrl = Cover
        ? `${BASE_URL}${Cover[0].url}`
        : 'https://via.placeholder.com/300x200?text=No+image'

    return `
        <article class="card">
          <img class="card__image" src="${imageUrl}" alt="${Title}" />
          <div class="card__body">
            ${Release ? `<p class="card__text">${Release}</p>` : ``}
            <h2 class="card__title">${Title}</h2>
            <p class="card__text">${Episides}</p>
            <p class="card__text">${Genre}</p>
            <p class="card__text">${Annotation}</p>
            <div class="card__footer">
                <span class="card__price">${Scenarist}</span>
                <span class="read ${Read ? 'read--yes': 'read--no'}">${Read ? 'Прочитано': 'Не прочитано'}</span>
            </div>
          </div>
        </article>
    `
}
async function loadCards() {
    try {
        statusEl.textContent = 'Загрузка...'

        // 1. Делаем запрос
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        // 2. Проверяем статус вручную (fetch сам не бросает ошибку на 403/404/500)
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        // 3. Читаем JSON
        const result = await response.json()

        // 4. Достаём массив записей
        const items = result.data

        if (items.length === 0) {
            statusEl.textContent = 'Записей пока нет'
            cardsEl.innerHTML = ''
            return
        }

        // 5. map: каждая запись -> строка HTML. join(''): склеиваем в одну строку
        cardsEl.innerHTML = items.map(createCard).join('')
        statusEl.textContent = ''
    } catch (error) {
        console.error(error)
        cardsEl.innerHTML = ''
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`
        statusEl.classList.add('status--error')
    }
}

loadCards()

