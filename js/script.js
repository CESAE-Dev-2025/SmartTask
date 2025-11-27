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
const appTexts = [
    { selector: "h1", en: "Task Manager", pt: "Gestor de Tarefas" },
    {
        selector: "#statistics > :nth-child(1) p",
        en: "Active Tasks",
        pt: "Tarefas Activas",
    },
    {
        selector: "#statistics > :nth-child(2) p",
        en: "Completed Tasks",
        pt: "Tarefas Completadas",
    },
    {
        selector: "#addTaskForm input",
        en: "Add a new task...",
        pt: "Adicione nova tarefa...",
    },
    { selector: "#addTaskForm button span", en: "Add", pt: "Adicionar" },
    {
        selector: "#filterButtons button:nth-of-type(1)",
        en: "All",
        pt: "Todas",
    },
    {
        selector: "#filterButtons button:nth-of-type(2)",
        en: "Active",
        pt: "Activas",
    },
    {
        selector: "#filterButtons button:nth-of-type(3)",
        en: "Completed",
        pt: "Completadas",
    },
    {
        selector: "#emptyState p",
        en: "No tasks yet. Add one to get started!",
        pt: "Sem tarefas. Adicione uma para iniciar!",
    },
];

for (item of appTexts) {
    let currentElement = document.querySelector(item.selector);
    let localeText = selectedLocale == "en-US" ? item.en : item.pt;

    if (currentElement.tagName.toLowerCase() === "input") {
        currentElement.setAttribute("placeholder", localeText);
    } else {
        currentElement.textContent = localeText;
    }
}
// ---------------------------------- Theme -----------------------------------
const themeToggle = document.getElementById("themeToggle");

// ----------------------------------- Date -----------------------------------
let currentDateTime = document.getElementById("currentDateTime");
const hourOptions = { hour: "2-digit", minute: "2-digit" };
const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

// ---------------------------------- Tasks -----------------------------------
let taskList = document.getElementById("taskList");
let tasks = [
    { id: 1, text: "Complete project documentation", completed: false },
    { id: 2, text: "Review pull requests", completed: true },
    { id: 3, text: "Update task management system", completed: false },
];
let currentId = 4;
let activeCount = document.getElementById("activeCount");
let completedCount = document.getElementById("completedCount");

const addTaskForm = document.getElementById("addTaskForm");
let taskItem = `
    <div class="card mb-2 task-item" data-task-id="" data-completed="false">
        <div class="card-body d-flex align-items-center gap-3">
            <input type="checkbox" class="form-check-input mt-0 task-checkbox"/>
            <span class="flex-grow-1 task-text"></span>
            <div class="task-actions">
                <button class="btn btn-sm btn-outline-secondary me-1 edit-btn" aria-label="Edit task">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" aria-label="Delete task">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    </div>`;
// ----------------------------------------------------------------------------

// ---------------------------------- Filter ----------------------------------
const filterButtons = document.getElementById("filterButtons");

// ----------------------------------------------------------------------------

// ------------------------------------------------------------------ Functions
function toggleCheckbox() {
    this.parentElement.parentElement.setAttribute(
        "data-completed",
        this.checked
    );

    if (this.checked) {
        this.nextElementSibling.classList.add(
            "text-decoration-line-through",
            "text-muted"
        );
    } else {
        this.nextElementSibling.classList.remove(
            "text-decoration-line-through",
            "text-muted"
        );
    }
    updateStatistics();
}

function renderTask(itemToRender) {
    let newItem = new DOMParser().parseFromString(taskItem, "text/html").body
        .firstElementChild;

    newItem.setAttribute("data-task-id", itemToRender.id);
    newItem.querySelector(".task-text").textContent = itemToRender.text;
    newItem.setAttribute("data-completed", itemToRender.completed);

    if (itemToRender.completed) {
        newItem.querySelector(".task-checkbox").checked = true;
        newItem
            .querySelector(".task-text")
            .classList.add("text-decoration-line-through", "text-muted");
    }

    newItem
        .querySelector(".task-checkbox")
        .addEventListener("change", toggleCheckbox);

    taskList.appendChild(newItem);
}

tasks.forEach((task) => renderTask(task));

function newTask(e) {
    e.preventDefault();

    let formData = new FormData(e.target);
    renderTask({
        id: currentId,
        text: formData.get("task-item"),
        completed: false,
    });
}

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
    let taskCount = tasks.length;
    let activeTasks = 0,
        completedTasks = 0;
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

function handleFilterBtnClasses(filterBtn) {
    clearFilterBtnClasses();
    filterBtn.classList.remove("btn-outline-primary");
    filterBtn.classList.add("btn-primary");
    filterBtn.classList.add("active");
}

function filterTasks() {
    handleFilterBtnClasses(this);

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

addTaskForm.addEventListener("submit", newTask);
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
