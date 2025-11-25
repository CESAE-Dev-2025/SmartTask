/******************************************************************************
              Projeto Final 1: “Gestor de Tarefas Inteligente”:
                                Leandro Gabriel
******************************************************************************/
/*
Data de entrega: até 3a (2/11) à noite
Data da apresentação: dia 5/11 de manhã


Sistema completo de gestão de tarefas com as seguintes funcionalidades:
  - Adicionar tarefas via formulário    
  - Marcar tarefas como concluídas      
  - Editar e remover tarefas      
  - Contar tarefas ativas/concluídas    
  - Filtros (Todas / Ativas / Concluídas)     
  - Personalização de tema (claro/escuro)     
  - Mostra hora/data atual
  - Conectar com uma APi à vossa escolha e mostrar dados (por exemplo tempo)
    https://motivational-spark-api.vercel.app/api/
    Ex: GET https://motivational-spark-api.vercel.app/api/quotes/random
    Response:
    {
        "author": "Zat Rana",
        "quote": "There is no such thing as fairness, and dwelling on it creates despair."
    }

Entrega através de zip com o vosso nome ou link para o GitHub.

Avaliação:
  - Realização das funcionalidades propostas e defesa: 17v
  - Criatividade e Extras (funcionalidades): 2v
  - Boas práticas de programação e organização de código (1v)

Nota: a nota dos items anteriores só é validada com a explicação da mesma (apresentação do trabalho).

O projecto e sua defesa vale 50% da nota (outros 50% participação em aula e tarefas intermédias)
*/

// ------------------------------------------------------------------ Variables
// TODO: Adicionar opção de idioma ("pt-PT")
let selectedLocale = "en-US";

// ---------------------------------- Theme -----------------------------------
const themeToggle = document.getElementById("themeToggle");

// ----------------------------------- Date -----------------------------------
let currentDateTime = document.getElementById("currentDateTime");
const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};
const hourOptions = { hour: "2-digit", minute: "2-digit" };

// -------------------------------- Statistics --------------------------------
const taskList = document.getElementById("taskList");
let activeCount = document.getElementById("activeCount");
let completedCount = document.getElementById("completedCount");
let activeTasks = 0;
let completedTasks = 0;
// ----------------------------------------------------------------------------

// ---------------------------------- Filter ----------------------------------
const filterButtons = document.getElementById("filterButtons");

// ----------------------------------------------------------------------------

// ------------------------------------------------------------------ Functions
function updateDateTime() {
    let currentDate = new Date();

    // Apenas para legibilidade do código
    let date = currentDate.toLocaleDateString(selectedLocale, dateOptions);
    let hour = currentDate.toLocaleTimeString(selectedLocale, hourOptions);

    currentDateTime.textContent = `${date} • ${hour}`;
}

updateDateTime();
setInterval(updateDateTime, 3600);

function updateStatistics() {
    let taskCount = taskList.children.length;
    if (taskCount > 0) {
        for (task of taskList.children) {
            if (task.getAttribute("data-completed") == "true") {
                completedTasks++;
            } else {
                activeTasks++;
            }
        }
    }
    activeCount.textContent = activeTasks;
    completedCount.textContent = completedTasks;
}
updateStatistics();

function clearFilterBtnClasses() {
    for (const filter of filterButtons.children) {
        filter.classList.add("btn-outline-primary");
        filter.classList.remove("btn-primary");
        filter.classList.remove("active");
    }
}

function handleFilterBtnClasses() {
    clearFilterBtnClasses();
    this.classList.remove("btn-outline-primary");
    this.classList.add("btn-primary");
    this.classList.add("active");
}

function filterTasks() {
    handleFilterBtnClasses();

    // TODO: Atualizar lista de tarefas
    switch (this.getAttribute("data-filter")) {
        case "all":
            console.log("Remove filter");
            break;
        case "active":
            console.log("Show only active tasks");
            break;
        case "completed":
            console.log("Show only completed tasks");
            break;
    }
}
// ----------------------------------------------------------------------------

// ------------------------------------------------------------ Event Listeners
themeToggle.addEventListener("click", () => {
    let currentTheme = document.body.getAttribute("data-bs-theme");
    if (currentTheme == "dark") {
        document.body.setAttribute("data-bs-theme", "light");
    } else {
        document.body.setAttribute("data-bs-theme", "dark");
    }
});

for (const filter of filterButtons.children) {
    filter.addEventListener("click", filterTasks);
}
// ----------------------------------------------------------------------------

// 3. Add Task
// document.getElementById('addTaskForm').addEventListener('submit', function(e) {
//   e.preventDefault();
//   // Get input value, create new task element, append to #taskList
// });

// 4. Task Checkbox (Complete/Uncomplete)
// Add event listeners to .task-checkbox elements
// Toggle completed state and update styling

// 5. Edit Task
// Add event listeners to .edit-btn elements
// Replace task text with input field for editing

// 6. Delete Task
// Add event listeners to .delete-btn elements
// Remove task from DOM

// 7. Filter Tasks
// Add event listeners to filter buttons
// Show/hide tasks based on data-completed attribute

// 8. Update Counters
// function updateCounters() {
//   // Count tasks and update #activeCount and #completedCount
// }
