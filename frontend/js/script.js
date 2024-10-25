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
    "gold",
    "tomato",
    "mediumseagreen",
    "slateblue",
    "orange",
    "mediumvioletred",
    "lightcoral",
    "steelblue"
];

const user = { id: "", name: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message--self");
    div.innerHTML = content;
    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);
    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

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
// Emojis de reações
const reactions = ['😂', '😢', '❤️', '👍', '😎'];

// Função para criar o ícone de reações
function createReactionIcon(messageDiv) {
    const reactionIcon = document.createElement('span');
    reactionIcon.className = 'fa-regular fa-face-smile';
    reactionIcon.style.position = 'absolute'; // Posicionado fora da mensagem
    reactionIcon.style.right = '-20px'; // Ajusta a posição ao lado da mensagem
    reactionIcon.style.top = '50%';
    reactionIcon.style.transform = 'translateY(-50%)';
    reactionIcon.style.fontSize = '20px';
    reactionIcon.style.cursor = 'pointer';
    reactionIcon.style.display = 'none'; // Inicialmente escondido

    // Cria a lista de reações
    const reactionList = document.createElement('div');
    reactionList.className = 'reaction-list';
    reactionList.style.position = 'absolute';
    reactionList.style.display = 'none'; // Inicialmente escondido
    reactionList.style.backgroundColor = '#fff';
    reactionList.style.border = '1px solid #ccc';
    reactionList.style.padding = '5px';
    reactionList.style.zIndex = '1000';
    reactionList.style.borderRadius = '0px, 5px, 5px, 5px';
    reactionList.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    reactionList.style.top = 'calc(50% + 10px)'; // Ajusta a posição logo abaixo do ícone
    reactionList.style.right = '0'; // Alinha ao ícone
    reactionList.style.transform = 'translateX(-100px)'; // Move 100px para a esquerda
    reactionList.style.width = '210px'; // Defina uma largura fixa para cobrir as reações

    

    reactions.forEach(reaction => {
        const emoji = document.createElement('span');
        emoji.textContent = reaction;
        emoji.className = 'reaction-emoji';
        emoji.style.fontSize = '20px';
        emoji.style.cursor = 'pointer';
        emoji.style.marginRight = '5px';

        // Evento de clique no emoji
        emoji.addEventListener('click', () => {
            handleReactionClick(emoji);
            reactionList.style.display = 'none'; // Esconde a lista após a seleção
        });

        reactionList.appendChild(emoji);
    });

    // Mostra a lista de reações ao clicar no ícone
    reactionIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita fechar a lista ao clicar no ícone
        reactionList.style.display = reactionList.style.display === 'flex' ? 'none' : 'flex';
    });

    // Anexa o ícone de reações e a lista fora do bloco da mensagem
    messageDiv.appendChild(reactionIcon);
    messageDiv.appendChild(reactionList);
    
    // Fechar a lista ao clicar fora dela
    document.addEventListener('click', (event) => {
        if (!reactionList.contains(event.target) && reactionList.style.display === 'flex') {
            reactionList.style.display = 'none';
        }
    });

    return reactionIcon;
}

// Função para lidar com o clique na reação
function handleReactionClick(selectedEmoji) {
    const messageDiv = selectedEmoji.closest('.message-container');
    const existingReaction = messageDiv.querySelector('.reaction-display');
    const selectedReaction = selectedEmoji.textContent; // Captura o emoji que foi clicado

    // Verifica se a reação selecionada já está na mensagem
    if (existingReaction && existingReaction.textContent === selectedReaction) {
        existingReaction.remove(); // Remove a reação existente se for a mesma
    } else {
        // Remove a reação existente se houver
        if (existingReaction) {
            existingReaction.remove();
        }

        // Adiciona a nova reação
        const chosenReactionEmoji = selectedEmoji.cloneNode(true);
        chosenReactionEmoji.classList.add('reaction-display');
        messageDiv.appendChild(chosenReactionEmoji);
    }
}


// Função para anexar reações a uma mensagem
function attachReactionsToMessage(messageDiv) {
    const reactionIcon = createReactionIcon(messageDiv);
    messageDiv.classList.add('message-container');
    messageDiv.style.position = 'relative'; // Para manter o ícone e a lista dentro da caixa de mensagem

    // Mostra o ícone de reações ao passar o mouse sobre a mensagem
    messageDiv.addEventListener('mouseenter', () => {
        reactionIcon.style.display = 'inline'; // Mostra o ícone ao passar o mouse
    });

    messageDiv.addEventListener('mouseleave', () => {
        if (document.querySelector('.reaction-list').style.display !== 'flex') {
            reactionIcon.style.display = 'none'; // Esconde o ícone se a lista não estiver visível
        }
    });
}

// Função para adicionar uma nova mensagem
function addMessage(content, sender) {
    const chatMessages = document.querySelector('.chat__messages');

    // Cria a nova div da mensagem
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'self' ? 'message--self' : 'message--other');

    // Se for uma mensagem de outro usuário, adicionar o nome do remetente
    if (sender !== 'self') {
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message--sender';
        senderSpan.style.color = 'darkkhaki';
        senderSpan.textContent = sender;
        messageDiv.appendChild(senderSpan);
    }

    messageDiv.appendChild(document.createTextNode(content));

    // Anexa a nova mensagem à seção de mensagens
    chatMessages.appendChild(messageDiv);

    // Anexa reações à nova mensagem
    attachReactionsToMessage(messageDiv);
}

// Observa a adição de novas mensagens dinamicamente
const observer = new MutationObserver(() => {
    const messageDivs = document.querySelectorAll('.chat__messages .message--other');
    messageDivs.forEach(messageDiv => {
        if (!messageDiv.classList.contains('message-container')) {
            attachReactionsToMessage(messageDiv);
        }
    });
});

// Configura o observer para observar alterações no DOM
observer.observe(document.querySelector('.chat__messages'), { childList: true, subtree: true });
