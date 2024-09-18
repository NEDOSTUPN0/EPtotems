const playerList = document.getElementById('playerList');
const searchInput = document.getElementById('searchInput');

let playersData = [];

const roleColors = {
    1: '#ffa82d', // Основатель
    2: '#ff505a', // Администратор
    3: '#008be2', // Разработчик
    4: '#4efffe', // Модератор
    5: '#1acd6c', // Спонсор
    6: '#bbff9f', // Донатер
    7: '#1FFF1F' // Этот человек пытался разблокировать ваш телефон

};

const rolePriority = {
    1: 0, // Основатель
    2: 1, // Администратор
    3: 2, // Разработчик
    4: 3, // Модератор
    5: 5, // Спонсор
    6: 6,  // Донатер
    7: 4, // Этот человек разблокировал ваш телефон
    0: 999 // Игроки без роли
};

fetch('players.json')
    .then(response => response.json())
    .then((data) => {
        playersData = data;
        sortAndRenderPlayers(playersData);
    });

function sortAndRenderPlayers(players) {
    const sortedPlayers = sortPlayers(players);
    renderPlayers(sortedPlayers);
}

function sortPlayers(players) {
    return players.sort((a, b) => {
        const roleA = rolePriority[a.role] !== undefined ? rolePriority[a.role] : rolePriority[0];
        const roleB = rolePriority[b.role] !== undefined ? rolePriority[b.role] : rolePriority[0];
        
        if (roleA !== roleB) {
            return roleA - roleB;
        }

        return a.nickname.localeCompare(b.nickname);
    });
}


function renderPlayers(players) {
    playerList.innerHTML = '';

    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'player-item';
        const playerColor = roleColors[player.role] || '';

        li.innerHTML = `
            <img src="https://visage.surgeplay.com/face/96/${player.uuid}.png?no=ears&y=250" alt="${player.nickname}">
            <span style="color: ${playerColor}">${player.nickname}</span>
        `;

        li.addEventListener('click', () => {
            copyToClipboard(player.nickname);
            showNotification(`${player.nickname} скопирован`);
        });

        playerList.appendChild(li);

        setTimeout(() => {
            li.classList.add('visible');
        }, index * 50);
    });
}

searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    const filteredPlayers = playersData.filter(player => 
        player.nickname.toLowerCase().includes(filter)
    );

    sortAndRenderPlayers(filteredPlayers);
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 1500);
    }, 3000);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
