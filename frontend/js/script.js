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
