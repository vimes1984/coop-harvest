# Contribuir a Growers' Collective ☘️

¡Gracias por tu interés en contribuir a **Growers' Collective**! Ya seas desarrollador, diseñador, redactor de contenido, agricultor o activista comunitario, tu ayuda es invaluable para construir una red cooperativa más justa y directa de la granja al consumidor.

> [!IMPORTANT]
> **ESTADO DE PRUEBA DE CONCEPTO (PoC)**  
> Este proyecto es actualmente un prototipo de desarrollo local y una Prueba de Concepto. Aún no tenemos usuarios activos ni transacciones en vivo. Todos los estilos de la base de código, los libros de contabilidad simulados y los datos de localización están diseñados para validar la arquitectura de un futuro piloto en vivo.

---

## 🗺️ Cómo Participar

Aceptamos contribuciones en muchas formas:
* **💻 Desarrollo**: Corregir errores, añadir funciones al frontend de React o al backend de Express, o mejorar el empaquetado nativo (Electron/Capacitor).
* **🎨 Diseño de UI/UX**: Mejorar los diseños responsivos para móviles/escritorio, diseñar paneles accesibles o crear gráficos.
* **✍️ Redacción de Contenido y Localización**: Crear historias para granjas irlandesas locales, traducir términos o refinar contenido educativo sobre soberanía alimentaria.
* **🚜 Difusión y Logística**: Diseñar plantillas de distribución comunitaria (por ejemplo, guías de recogida de la GAA, pautas para centros parroquiales).

---

## 🛠️ Configuración de Desarrollo Local

El proyecto está estructurado como un monorepositorio desacoplado que contiene un `/frontend` (React + TypeScript) y un `/backend` (Express + MongoDB).

### Requisitos Previos
* Node.js (se recomienda la versión 16.x o posterior)
* MongoDB (ya sea una instancia local o un [Clúster de MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gratuito)
* Git

### Configuración del Entorno Paso a Paso

1. **Hacer un Fork y Clonar el Repositorio**:
   ```bash
   git clone https://github.com/vimes1984/coop-harvest.git
   cd coop-harvest
   ```

2. **Configurar el Backend**:
   - Navega a `/backend`.
   - Copia `.env.example` a `.env` (o crea un nuevo archivo `.env`).
   - Configura tu `MONGO_URI` (por ejemplo, la cadena de conexión de Atlas) y el puerto deseado en `PORT` (por defecto es `5001`).
   - Instala las dependencias e inicia el servidor de desarrollo:
     ```bash
     npm install
     npm run dev
     ```
   - *Nota: Si MongoDB está conectado y vacío, el servidor sembrará automáticamente a los agricultores, productos y propuestas de gobernanza irlandeses simulados iniciales.*

3. **Configurar el Frontend**:
   - Navega a `/frontend`.
   - Instala las dependencias:
     ```bash
     npm install --ignore-scripts
     ```
   - Inicia el servidor de desarrollo de Vite:
     ```bash
     npm run dev
     ```
   - Abre tu navegador en [http://localhost:5173](http://localhost:5173).

---

## 🤝 Flujo de Trabajo de Contribución

Seguimos un modelo estándar de fork-and-pull (bifurcación y solicitud de extracción):

1. **Buscar un Problema**: Explora los problemas abiertos o abre uno nuevo para discutir una propuesta de función o un informe de error.
2. **Crear una Rama**: Crea una rama de función a partir de `main` nombrándola de forma descriptiva (por ejemplo, `feature/add-csa-calculator` o `bugfix/fix-checkout-total`).
3. **Confirmar tus Cambios (Commit)**:
   - Mantén los commits enfocados y escribe mensajes de commit claros y descriptivos.
   - Preservar el estado de esta base de código como una **Prueba de Concepto** es crítico. Asegúrate de que cualquier texto añadido encuadre claramente las distribuciones/operaciones como *proyecciones/modelos objetivo* para evitar inducir a error a los usuarios.
4. **Enviar una Solicitud de Extracción (Pull Request - PR)**:
   - Proporciona un resumen claro de tus cambios y haz referencia al número de problema.
   - Asegúrate de que tu código se compile correctamente (`npm run build` se ejecuta sin errores tanto en el backend como en el frontend).

---

## 🎨 Pautas de Código y Diseño

Para mantener la excelencia visual y técnica:
* **Tipado Fuerte**: Utiliza interfaces de TypeScript para todos los modelos de datos, propiedades de componentes (props) y respuestas de API. Evita usar `any`.
* **CSS Vanilla**: Estilizamos los componentes utilizando tokens CSS limpios y flexibles dentro de `/frontend/src/App.css` en lugar de frameworks de utilidades inflados. Mantén la paleta glassmorphic premium verde y tierra cálida.
* **Política de Cero Marcadores de Posición (Placeholders)**: No dejes comentarios `// TODO` inacabados ni diseños simulados rotos. Asegúrate de que exista un estado de respaldo simulado completamente funcional si el servidor de la base de datos está fuera de línea.

---

## 📜 Conducta Cooperativa

Como un proyecto impulsado por la comunidad centrado en la soberanía alimentaria, la agricultura ecológica y la gobernanza democrática, valoramos el respeto, la colaboración abierta y la inclusión. Por favor, apoya a los demás, colabora de forma transparente y respeta los diversos orígenes.

Si tienes alguna pregunta, ¡ponte en contacto abriendo un problema (issue) en GitHub!
