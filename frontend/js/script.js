// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://zapgram.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)

// temas
document.getElementById('themeToggle').addEventListener('click', function() {
    // Alternar a classe 'dark-mode' no body para mudar o tema
    document.body.classList.toggle('dark-mode');

    // Alternar a visibilidade dos ícones de sol e lua
    const sunIcon = document.querySelector('.sun');
    const moonIcon = document.querySelector('.moon');

    if (document.body.classList.contains('dark-mode')) {
        // Quando o tema escuro está ativo, mostrar o ícone de lua e esconder o de sol
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        // Quando o tema claro está ativo, mostrar o ícone de sol e esconder o de lua
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
});
// Responsividade
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active'); // Alterna a classe 'active' no menu
    });
});

// Função para selecionar emoji e inseri-lo no campo de texto
function selectEmoji(emoji) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value += emoji; // Adiciona o emoji ao valor do input
    closeEmojiList(); // Fecha a lista de emojis
}

// Função para fechar a lista de emojis
function closeEmojiList() {
    const emojiToggle = document.getElementById('emoji-toggle');
    emojiToggle.checked = false; // Desmarca o checkbox
}

// Fecha a lista de emojis se o usuário clicar fora dela
document.addEventListener('click', function(event) {
    const emojiContainer = document.querySelector('.emoji-container');
    const emojiList = document.querySelector('.emoji-list');

    // Verifica se o clique foi fora do emojiContainer e da emojiList
    if (!emojiContainer.contains(event.target) && !emojiList.contains(event.target)) {
        closeEmojiList();
    }
});
// reactions
// Cria o ícone
const reactionIcon = document.createElement('i');
reactionIcon.className = 'fa-regular fa-face-smile';
reactionIcon.id = 'reactionButton';
// Adiciona o ícone à div da mensagem
const messageDiv = document.querySelector('.message--other');
messageDiv.appendChild(reactionIcon);
// teste
// Substituindo as classes FontAwesome por emojis reais
const reactions = ['😂', '😢', '❤️', '👍', '👎'];
// Função para criar o botão de reações (usando FontAwesome)
function createReactionButton() {
    const reactionIcon = document.createElement('i');
    reactionIcon.classList.add('fa-regular', 'fa-face-smile'); // Adiciona as classes FontAwesome
    reactionIcon.id = 'reactionButton';
    reactionIcon.style.cursor = 'pointer'; // Define como clicável
    return reactionIcon;
}
// Função para criar a lista de reações (com emojis)
function createReactionList() {
    const reactionList = document.createElement('div');
    reactionList.className = 'reaction-list';
    reactionList.style.padding = '5px';
    // Emojis de reações
    reactions.forEach(reaction => {
        const emoji = document.createElement('span');
        emoji.textContent = reaction; // Define o emoji
        emoji.className = 'reaction-icon';
        emoji.style.fontSize = '20px';
        emoji.style.bottom = '-15px';
        emoji.style.cursor = 'pointer';
        // Adiciona evento de clique ao emoji de reação
        emoji.addEventListener('click', () => {
            handleReactionClick(emoji, reactionList);
        });
        reactionList.appendChild(emoji);
    });
    return reactionList;
}
// Função para lidar com o clique na reação
function handleReactionClick(selectedEmoji, reactionList) {
    const messageDiv = selectedEmoji.closest('.message-container');
    const existingReaction = messageDiv.querySelector('.reaction-display');
    // Remove a classe 'selected-reaction' de todos os emojis da lista
    const allEmojis = reactionList.querySelectorAll('.reaction-icon');
    allEmojis.forEach(emoji => {
        emoji.classList.remove('selected-reaction');
    });
    // Verifica se a reação atual é a mesma que a existente
    if (existingReaction) {
        // Se for a mesma reação, remove a reação
        if (existingReaction.textContent === selectedEmoji.textContent) {
            existingReaction.remove();
            selectedEmoji.classList.remove('selected-reaction'); // Remove a classe de seleção
            reactionList.style.display = 'none'; // Esconde a lista
            return; // Sai da função
        } else {
            // Se não for a mesma, remove a reação anterior
            existingReaction.remove();
        }
    }
    // Adiciona a classe para indicar a reação selecionada
    selectedEmoji.classList.add('selected-reaction');
    // Clone do emoji selecionado
    const chosenReactionEmoji = selectedEmoji.cloneNode(true);
    chosenReactionEmoji.classList.remove('selected-reaction'); // Remove a classe para o emoji na mensagem
    chosenReactionEmoji.classList.add('reaction-display'); // Adiciona a classe de exibição da reação
    messageDiv.appendChild(chosenReactionEmoji); // Adiciona o emoji da reação escolhida na mensagem
    // Esconde a lista de reações após a escolha
    reactionList.style.display = 'none';
}
// Função para anexar a lista de reações a uma mensagem
function attachReactionsToMessage(messageDiv) {
    // Cria o botão de reações e a lista
    const reactionIcon = createReactionButton();
    const reactionList = createReactionList();
    // Adiciona o ícone à mensagem
    messageDiv.appendChild(reactionIcon);
    
    // Posiciona a lista de reações dentro da mensagem
    messageDiv.appendChild(reactionList);
    // Exibe ou esconde a lista ao clicar no ícone de reações
    reactionIcon.addEventListener('click', function(e) {
        // Alterna a visibilidade da lista de reações
        reactionList.style.display = reactionList.style.display === 'flex' ? 'none' : 'flex';
    });
    // Esconde a lista ao clicar fora dela
    document.addEventListener('click', function(e) {
        if (!reactionIcon.contains(e.target) && !reactionList.contains(e.target)) {
            reactionList.style.display = 'none';
        }
    });
}
// Seleciona todas as mensagens com a classe 'message--other'
const messageDivs = document.querySelectorAll('.message--other');
// Itera sobre todas as mensagens e adiciona a funcionalidade de reações
messageDivs.forEach(messageDiv => {
    messageDiv.classList.add('message-container'); // Adiciona a classe para o posicionamento correto
    attachReactionsToMessage(messageDiv); // Chama a função para anexar o botão de reações e a lista
});
