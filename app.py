from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

# Archivo para almacenar las tareas
TASKS_FILE = 'tasks.json'

# Inicializar el archivo de tareas si no existe
if not os.path.exists(TASKS_FILE):
    with open(TASKS_FILE, 'w') as f:
        json.dump([], f)

def load_tasks():
    """Cargar tareas desde el archivo JSON"""
    try:
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_tasks(tasks):
    """Guardar tareas en el archivo JSON"""
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

@app.route('/')
def index():
    """Ruta principal que renderiza la página principal"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Obtener todas las tareas"""
    tasks = load_tasks()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Crear una nueva tarea"""
    data = request.get_json()
    tasks = load_tasks()
    
    # Generar ID único
    task_id = max([task['id'] for task in tasks], default=0) + 1
    
    new_task = {
        'id': task_id,
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'priority': data.get('priority', 'medium'),
        'completed': False,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    
    tasks.append(new_task)
    save_tasks(tasks)
    
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Actualizar una tarea existente"""
    data = request.get_json()
    tasks = load_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            task['title'] = data.get('title', task['title'])
            task['description'] = data.get('description', task['description'])
            task['priority'] = data.get('priority', task['priority'])
            task['completed'] = data.get('completed', task['completed'])
            task['updated_at'] = datetime.now().isoformat()
            save_tasks(tasks)
            return jsonify(task)
    
    return jsonify({'error': 'Tarea no encontrada'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Eliminar una tarea"""
    tasks = load_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'message': 'Tarea eliminada'}), 200

@app.route('/api/tasks/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task(task_id):
    """Alternar el estado de completado de una tarea"""
    tasks = load_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            task['updated_at'] = datetime.now().isoformat()
            save_tasks(tasks)
            return jsonify(task)
    
    return jsonify({'error': 'Tarea no encontrada'}), 404

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Obtener estadísticas de las tareas"""
    tasks = load_tasks()
    
    total = len(tasks)
    completed = len([t for t in tasks if t['completed']])
    pending = total - completed
    
    by_priority = {
        'high': len([t for t in tasks if t['priority'] == 'high']),
        'medium': len([t for t in tasks if t['priority'] == 'medium']),
        'low': len([t for t in tasks if t['priority'] == 'low'])
    }
    
    return jsonify({
        'total': total,
        'completed': completed,
        'pending': pending,
        'by_priority': by_priority
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
