// Получаем элементы DOM
const playerList = document.getElementById('playerList');
const searchInput = document.getElementById('searchInput');

// Загружаем данные из JSON и отображаем игроков
let playersData = [];

// Определяем цвета ролей
const roleColors = {
    1: '#ffa82d', // Основатель
    2: '#ff505a', // Администратор
    3: '#008be2', // Разработчик
    4: '#4efffe', // Модератор
    5: '#1acd6c', // Спонсор
    6: '#bbff9f', // Донатер
    7: '#1FFF1F' // Этот человек пытался разблокировать ваш телефон

};

// Определение ролей для сортировки
const rolePriority = {
    1: 0, // Основатель (самый высокий приоритет)
    2: 1, // Администратор
    3: 2, // Разработчик
    4: 3, // Модератор
    5: 5, // Спонсор
    6: 6,  // Донатер
    7: 4, // Этот человек разблокировал ваш телефон
    0: 999 // Игроки без роли (самый низкий приоритет)
};

// Загружаем игроков
fetch('players.json')
    .then(response => response.json())
    .then((data) => {
        playersData = data; // Сохраняем данные для последующего поиска
        sortAndRenderPlayers(playersData); // Сортируем и рендерим список
    });

// Функция сортировки и рендеринга игроков
function sortAndRenderPlayers(players) {
    const sortedPlayers = sortPlayers(players);
    renderPlayers(sortedPlayers);
}

// Сортировка по ролям и алфавиту
function sortPlayers(players) {
    return players.sort((a, b) => {
        // Используем 0 для отсутствующей роли
        const roleA = rolePriority[a.role] !== undefined ? rolePriority[a.role] : rolePriority[0];
        const roleB = rolePriority[b.role] !== undefined ? rolePriority[b.role] : rolePriority[0];
        
        // Сравнение по роли (чем меньше значение, тем выше приоритет)
        if (roleA !== roleB) {
            return roleA - roleB;
        }

        // Если роли одинаковы, сортируем по алфавиту
        return a.nickname.localeCompare(b.nickname);
    });
}


// Отображаем игроков
function renderPlayers(players) {
    playerList.innerHTML = ''; // Очищаем список перед рендером

    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'player-item';
        const playerColor = roleColors[player.role] || ''; // Назначаем цвет для игрока

        li.innerHTML = `
            <img src="https://visage.surgeplay.com/face/96/${player.uuid}.png?no=ears&y=250" alt="${player.nickname}">
            <span style="color: ${playerColor}">${player.nickname}</span>
        `;

        // Добавляем обработчик клика для копирования ника игрока
        li.addEventListener('click', () => {
            copyToClipboard(player.nickname);
            showNotification(`${player.nickname} скопирован`);
        });

        playerList.appendChild(li);

        // Используем задержку для плавного появления элементов
        setTimeout(() => {
            li.classList.add('visible');
        }, index * 50); // Задержка между элементами
    });
}

// Фильтрация списка игроков по запросу
searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    const filteredPlayers = playersData.filter(player => 
        player.nickname.toLowerCase().includes(filter)
    );

    sortAndRenderPlayers(filteredPlayers); // Перерисовываем список с отфильтрованными игроками
});

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Делаем задержку перед появлением анимации
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 1500);
    }, 3000);
}

// Копирование ника игрока в буфер обмена
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
