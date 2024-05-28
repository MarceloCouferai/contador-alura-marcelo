const btnAddTarefa = document.querySelector('.app__button--add-task');
const formAddTarefa = document.querySelector('.app__form-add-task');

const textArea = document.querySelector('.app__form-textarea');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let litarefaSelecionada = null;

const ulTarefas = document.querySelector('.app__section-task-list');

const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnremoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTudo = document.querySelector('#btn-remover-todas');


function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function addTarefa(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path> 
    </svg>
    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    button.onclick = () => {
       // debugger;
        const novaDescricao = prompt('Qual o novo nome da tarefa?');
       // console.log('Nova descricao da tarefa: ', novaDescricao);
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    
 
    const imagemBtn = document.createElement('img');
    imagemBtn.setAttribute('src', '/imagens/edit.png')

    button.append(imagemBtn);

    li.append(svg);
    li.append(paragrafo);
    li.append(button);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
        document.querySelectorAll('.app__section-task-list-item-active').forEach(
            elemento =>{
                elemento.classList.remove('app__section-task-list-item-active');
            }
        )
        if (tarefaSelecionada == tarefa) {
            paragrafoDescricaoTarefa.textContent = '';
            tarefaSelecionada = null;
            litarefaSelecionada = null;
            return;
        }
        tarefaSelecionada = tarefa;
        litarefaSelecionada = li;
        paragrafoDescricaoTarefa.textContent = tarefa.descricao;
        li.classList.add('app__section-task-list-item-active');
    }
}

    return li;
}

btnAddTarefa.addEventListener('click', () => {
    formAddTarefa.classList.toggle('hidden');
})

formAddTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = addTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = '';
    formAddTarefa.classList.add('hidden');
})

tarefas.forEach(tarefa => {
    const elementoTarefa = addTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});



//evento finalizado
document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && litarefaSelecionada) {
        litarefaSelecionada.classList.remove('app__section-task-list-item-active');
        litarefaSelecionada.classList.add('app__section-task-list-item-complete');
        litarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {  
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnremoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTudo.onclick = () => removerTarefas(false);