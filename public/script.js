const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

// Função para salvar os contatos no localStorage
function saveContacts(contacts) {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Função para carregar os contatos do localStorage
function loadContacts() {
    fetch('http://localhost:3000/contacts')
        .then(response => response.json())
        .then(contacts => renderContactList(contacts))
        .catch(error => console.error('Erro:', error));
}


// Função para adicionar um novo contato
function addContact(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadContacts();
        contactForm.reset();
    })
    .catch(error => console.error('Erro:', error));
}


// Função para remover um contato
// Função para remover um contato
/*function removeContact(event) {
    const id = event.target.dataset.id;

    fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        // Remover o contato da lista na interface antes de recarregar
        const li = event.target.closest('li');
        li.remove();  // Remove o item da lista
        loadContacts(); // Recarrega os contatos após remoção
    })
    .catch(error => console.error('Erro:', error));
}*/



// Função para renderizar a lista de contatos
function renderContactList(contacts) {
    // Limpar a lista de contatos atual na interface
    contactList.innerHTML = '';

    // Renderizar cada contato na lista
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${contact.name}</strong><br>${contact.email}<br>${contact.phone}</span>
            <button onclick="removeContact(event)">Remover</button>
        `;
        contactList.appendChild(li);
    });
}

// Adicionando o evento de envio do formulário
if (contactForm) {
    contactForm.addEventListener('submit', addContact);
}

// Carregar e renderizar os contatos ao iniciar a página
if (document.getElementById('contact-list')) {
    const contacts = loadContacts();
    renderContactList(contacts);
}

// Evento para o botão "Ver Todos os Contatos" na página principal
const viewAllButton = document.getElementById('view-all-button');
if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
        window.location.href = 'contatos.html';
    });
}
