// ===== Estado de la aplicación =====
let currentFilter = 'all';
let searchQuery = '';
let editingTaskId = null;

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    updateStats();
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Formulario de nueva tarea
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    // Formulario de edición
    document.getElementById('editTaskForm').addEventListener('submit', handleEditSubmit);
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Cerrar modal al hacer click fuera
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeEditModal();
        }
    });
}

// ===== API Calls =====
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
        updateStats();
    } catch (error) {
        showToast('Error al cargar las tareas', 'error');
        console.error('Error:', error);
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            showToast('✅ Tarea creada exitosamente', 'success');
            loadTasks();
            return true;
        }
    } catch (error) {
        showToast('❌ Error al crear la tarea', 'error');
        console.error('Error:', error);
    }
    return false;
}

async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            showToast('✅ Tarea actualizada exitosamente', 'success');
            loadTasks();
            return true;
        }
    } catch (error) {
        showToast('❌ Error al actualizar la tarea', 'error');
        console.error('Error:', error);
    }
    return false;
}

async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('🗑️ Tarea eliminada', 'success');
            loadTasks();
        }
    } catch (error) {
        showToast('❌ Error al eliminar la tarea', 'error');
        console.error('Error:', error);
    }
}

async function toggleTaskComplete(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH'
        });
        
        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        showToast('❌ Error al actualizar la tarea', 'error');
        console.error('Error:', error);
    }
}

async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('pendingTasks').textContent = stats.pending;
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}

// ===== Handlers =====
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!title) {
        showToast('⚠️ El título es requerido', 'error');
        return;
    }
    
    const taskData = {
        title,
        description,
        priority
    };
    
    const success = await createTask(taskData);
    
    if (success) {
        // Limpiar formulario
        document.getElementById('taskForm').reset();
    }
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const taskId = editingTaskId;
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const priority = document.getElementById('editTaskPriority').value;
    
    if (!title) {
        showToast('⚠️ El título es requerido', 'error');
        return;
    }
    
    const taskData = {
        title,
        description,
        priority
    };
    
    const success = await updateTask(taskId, taskData);
    
    if (success) {
        closeEditModal();
    }
}

function handleFilterClick(e) {
    const filterBtn = e.currentTarget;
    const filter = filterBtn.dataset.filter;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    filterBtn.classList.add('active');
    
    currentFilter = filter;
    loadTasks();
}

function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    loadTasks();
}

// ===== Render Functions =====
function renderTasks(tasks) {
    // Filtrar tareas
    let filteredTasks = filterTasks(tasks);
    
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-info">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">
                            ${getPriorityIcon(task.priority)} ${getPriorityText(task.priority)}
                        </span>
                        <span>
                            <i class="fas fa-calendar-alt"></i>
                            ${formatDate(task.created_at)}
                        </span>
                        ${task.completed ? '<span><i class="fas fa-check-circle"></i> Completada</span>' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn btn-complete" onclick="toggleTaskComplete(${task.id})" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="task-btn btn-edit" onclick="openEditModal(${task.id})" title="Editar tarea">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn btn-delete" onclick="deleteTask(${task.id})" title="Eliminar tarea">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterTasks(tasks) {
    let filtered = tasks;
    
    // Aplicar filtro
    switch (currentFilter) {
        case 'pending':
            filtered = filtered.filter(task => !task.completed);
            break;
        case 'completed':
            filtered = filtered.filter(task => task.completed);
            break;
        case 'high':
            filtered = filtered.filter(task => task.priority === 'high');
            break;
    }
    
    // Aplicar búsqueda
    if (searchQuery) {
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchQuery) ||
            task.description.toLowerCase().includes(searchQuery)
        );
    }
    
    // Ordenar: pendientes primero, luego por prioridad
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return filtered;
}

// ===== Modal Functions =====
async function openEditModal(taskId) {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            editingTaskId = taskId;
            document.getElementById('editTaskId').value = taskId;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description;
            document.getElementById('editTaskPriority').value = task.priority;
            
            document.getElementById('editModal').classList.add('show');
        }
    } catch (error) {
        showToast('❌ Error al cargar la tarea', 'error');
        console.error('Error:', error);
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    editingTaskId = null;
}

// ===== Utility Functions =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Hoy';
    } else if (diffDays === 1) {
        return 'Ayer';
    } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
    } else {
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }
}

function getPriorityIcon(priority) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    return icons[priority] || '⚪';
}

function getPriorityText(priority) {
    const texts = {
        high: 'Alta',
        medium: 'Media',
        low: 'Baja'
    };
    return texts[priority] || priority;
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Escape para cerrar modal
    if (e.key === 'Escape') {
        closeEditModal();
    }
});
