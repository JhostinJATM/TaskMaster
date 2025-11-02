# 📋 TaskMaster Pro - Gestor de Tareas

Una aplicación web monolítica y moderna para gestión de tareas, construida con Flask (backend) y HTML, CSS, JavaScript (frontend).

## ✨ Características

- ✅ **CRUD completo de tareas**: Crear, leer, actualizar y eliminar tareas
- 🎯 **Sistema de prioridades**: Clasifica tus tareas en alta, media y baja prioridad
- 🔍 **Búsqueda en tiempo real**: Encuentra tus tareas rápidamente
- 🎨 **Interfaz moderna y atractiva**: Diseño dark mode con animaciones suaves
- 📊 **Dashboard de estadísticas**: Visualiza el progreso de tus tareas
- 🔄 **Filtros inteligentes**: Filtra por estado (todas, pendientes, completadas) o prioridad
- 💾 **Persistencia de datos**: Las tareas se guardan en un archivo JSON
- 📱 **Diseño responsive**: Funciona perfectamente en cualquier dispositivo
- ⚡ **Interactividad fluida**: Notificaciones toast, modales y transiciones animadas

## 🛠️ Tecnologías Utilizadas

### Backend
- **Flask 3.0.0**: Framework web de Python
- **Python 3.x**: Lenguaje de programación del servidor

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes, animaciones y transiciones
- **JavaScript (Vanilla)**: Lógica de la aplicación e interacción con la API
- **Font Awesome**: Iconos vectoriales

### Arquitectura
- **Aplicación Monolítica**: Todo el código está en un único proyecto integrado
- **API RESTful**: Comunicación entre frontend y backend mediante endpoints REST
- **JSON Storage**: Almacenamiento simple en archivo JSON

## 📂 Estructura del Proyecto

```
Subida/
│
├── app.py                  # Servidor Flask y API REST
├── requirements.txt        # Dependencias de Python
├── tasks.json             # Base de datos (se crea automáticamente)
├── README.md              # Este archivo
│
├── static/
│   ├── css/
│   │   └── styles.css     # Estilos de la aplicación
│   └── js/
│       └── app.js         # Lógica del frontend
│
└── templates/
    └── index.html         # Página principal
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Python 3.7 o superior
- pip (gestor de paquetes de Python)

### Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
pip install -r requirements.txt
```

### Paso 2: Ejecutar la Aplicación

```powershell
python app.py
```

La aplicación estará disponible en: **http://localhost:5000**

### Paso 3: Usar la Aplicación

1. Abre tu navegador web
2. Ve a `http://localhost:5000`
3. ¡Comienza a gestionar tus tareas!

## 📖 Uso de la Aplicación

### Crear una Tarea
1. Rellena el formulario en la parte superior
2. Ingresa título (obligatorio), descripción (opcional) y selecciona la prioridad
3. Haz clic en "Agregar Tarea"

### Gestionar Tareas
- **Marcar como completada**: Haz clic en el botón verde con ✓
- **Editar tarea**: Haz clic en el botón azul con lápiz
- **Eliminar tarea**: Haz clic en el botón rojo con papelera

### Filtrar y Buscar
- Usa los botones de filtro para ver: Todas, Pendientes, Completadas o Alta Prioridad
- Escribe en el campo de búsqueda para encontrar tareas específicas

### Ver Estadísticas
El header muestra en tiempo real:
- Total de tareas
- Tareas completadas
- Tareas pendientes

## 🌐 API REST Endpoints

### Obtener todas las tareas
```
GET /api/tasks
```

### Crear nueva tarea
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "priority": "medium"
}
```

### Actualizar tarea
```
PUT /api/tasks/<task_id>
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "priority": "high",
  "completed": false
}
```

### Eliminar tarea
```
DELETE /api/tasks/<task_id>
```

### Alternar estado de completado
```
PATCH /api/tasks/<task_id>/toggle
```

### Obtener estadísticas
```
GET /api/stats
```

## 🎨 Características de Diseño

- **Tema Oscuro Moderno**: Colores vibrantes sobre fondo oscuro
- **Gradientes**: Efectos visuales atractivos en botones y títulos
- **Animaciones**: Transiciones suaves y efectos hover
- **Responsive**: Se adapta a móviles, tablets y escritorio
- **Iconos**: Font Awesome para una interfaz intuitiva
- **Notificaciones Toast**: Feedback visual inmediato

## 🔧 Personalización

### Cambiar Colores
Edita las variables CSS en `static/css/styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --success-color: #10b981;
    /* ... más colores */
}
```

### Cambiar Puerto
Edita `app.py` línea final:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🐛 Solución de Problemas

### Error: "Address already in use"
El puerto 5000 está ocupado. Cambia el puerto en `app.py` o detén el proceso que lo usa.

### Las tareas no persisten
Verifica que el archivo `tasks.json` tenga permisos de escritura.

### Errores de importación
Asegúrate de haber instalado todas las dependencias:
```powershell
pip install -r requirements.txt
```

## 📝 Notas de Desarrollo

- El modo `debug=True` está activado para desarrollo
- Para producción, cambia `debug=False` y usa un servidor WSGI como Gunicorn
- Los datos se almacenan en `tasks.json` (considera usar una base de datos para producción)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

## 👨‍💻 Autor

Desarrollado como proyecto de demostración de una aplicación web monolítica con Flask.

---

**¡Disfruta gestionando tus tareas con TaskMaster Pro!** 🚀
