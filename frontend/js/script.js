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

// reactions
// Cria o ícone
const reactionIcon = document.createElement('i');
reactionIcon.className = 'fa-regular fa-face-smile';
reactionIcon.id = 'reactionButton';

// Adiciona o ícone à div da mensagem
const messageDiv = document.querySelector('.message--other');
messageDiv.appendChild(reactionIcon);



// teste
// Função para criar o ícone de reações
function createReactionButton() {
    const reactionIcon = document.createElement('i');
    reactionIcon.className = 'fa-regular fa-face-smile';
    reactionIcon.id = 'reactionButton';
    return reactionIcon;
}

// Função para criar a lista de reações
function createReactionList() {
    const reactionList = document.createElement('div');
    reactionList.className = 'reaction-list';

    // Ícones de reações
    const reactions = ['fa-face-smile', 'fa-face-frown', 'fa-heart', 'fa-thumbs-up', 'fa-thumbs-down'];
    reactions.forEach(reaction => {
        const icon = document.createElement('i');
        icon.className = `fa-regular ${reaction} reaction-icon`; // Adiciona a nova classe reaction-icon
        
        // Adiciona evento de clique ao ícone de reação
        icon.addEventListener('click', () => {
            handleReactionClick(icon, reactionList);
        });

        reactionList.appendChild(icon);
    });

    return reactionList;
}

// Função para lidar com o clique na reação
function handleReactionClick(selectedIcon, reactionList) {
    const messageDiv = selectedIcon.closest('.message-container');
    const existingReaction = messageDiv.querySelector('.reaction-display');

    // Remove a classe 'selected-reaction' de todos os ícones da lista
    const allIcons = reactionList.querySelectorAll('.reaction-icon');
    allIcons.forEach(icon => {
        icon.classList.remove('selected-reaction');
    });

    // Verifica se a reação atual é a mesma que a existente
    if (existingReaction) {
        // Se for a mesma reação, remove a reação
        if (existingReaction.classList.contains(selectedIcon.classList[1])) {
            existingReaction.remove();
            selectedIcon.classList.remove('selected-reaction'); // Remove a classe de seleção do ícone na lista
            reactionList.style.display = 'none'; // Esconde a lista
            return; // Sai da função
        } else {
            // Se não for a mesma, remove a reação anterior
            existingReaction.remove();
        }
    }

    // Adiciona a classe para indicar a reação selecionada apenas ao ícone da lista
    selectedIcon.classList.add('selected-reaction');

    // Clone do ícone selecionado (sem a classe `selected-reaction`)
    const chosenReactionIcon = selectedIcon.cloneNode(true); 
    chosenReactionIcon.classList.remove('selected-reaction'); // Remove a classe para o ícone na mensagem
    chosenReactionIcon.classList.add('reaction-display'); // Adiciona a classe de exibição da reação
    messageDiv.appendChild(chosenReactionIcon); // Adiciona o ícone da reação escolhida na mensagem

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
