# Cuaderno AR

Cuaderno AR es una aplicación web de Realidad Aumentada (AR) diseñada para extender cuadernos físicos de notas con contenido digital. Los usuarios pueden escanear marcadores impresos en sus cuadernos para visualizar textos interactivos, imágenes holográficas y enlaces diretamente sobre las páginas.

## Características

*   **Autenticación de Usuarios:** Sistema de registro y login seguro basado en JSON Web Tokens (JWT) y encriptación bcrypt, con gestión de Roles (Usuario y Administrador).
*   **Gestión de Cuadernos:** Vinculación de cuadernos físicos con cuentas digitales usando identificadores y contraseñas numéricas únicas generadas de forma automática.
*   **Soporte de Marcadores AR:** Soporte para marcadores tipo "Barcode" en 3x3 manejados por AR.js, que se asocian de 10 en 10 por defecto al momento de registrar un nuevo cuaderno.
*   **Información Multimedia Continua:** Asignación de información dinámica (Textos, Imágenes, Videos, Modelos 3D y Enlaces) a cada marcador específico de forma activa, además del soporte y trazabilidad de los borrados lógicos.
*   **Fácil Integración A-Frame + AR.js:** Renderización potente en el navegador del cliente sin necesidad de aplicaciones externas instaladas, totalmente gestionada mediante HTML5 y APIs REST del Backend.

## Estructura de Tecnologías

*   **Backend:** Node.js, Express.js.
*   **Base de Datos:** MySQL gestionado a través el ORM `Sequelize` que incluye soporte nativo de Migraciones Estructurales con `{ alter: true }`.
*   **Frontend:** HTML5, CSS Nativo (Vanilla CSS), JavaScript en Vanilla (DOM Manipulation) junto al uso de `Fetch API`.
*   **AR Engine:** A-Frame y AR.js.
*   **Pruebas Automáticas:** Jest y Supertest para pruebas HTTP e Integración (TDD API Validation).

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de ejecutar el proyecto:

1.  [Node.js](https://nodejs.org/) (versión v14.x o superior recomendada).
2.  Un motor de Base de Datos MySQL (por ejemplo, a través de XAMPP, WAMP o tu servicio local preferido).

## Instalación

1.  **Clona el repositorio**
    ```bash
    git clone https://github.com/TU_USUARIO/CuadernoAr.git
    cd CuadernoAr
    ```

2.  **Instala las dependencias necesarias**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno (.env)**
    Crea un archivo local con el nombre `.env` en el directorio principal (`/CuadernoAr`) y personalízalo acorde a tus credenciales locales de la base de datos de la siguiente manera:
    ```env
    PORT=3000
    DB_NAME=cuadernoar_db
    DB_USER=root
    DB_PASS=
    DB_HOST=localhost
    JWT_SECRET=tu_clave_secreta_super_segura
    ```

4.  **Iniciar el entorno MySQL**
    Asegúrate de haber creado la base de datos `cuadernoar_db` en tu motor MySQL antes del próximo paso. No hace falta configurar las tablas, Sequelize se encargará de esto automáticamente la primera vez.

5.  **Ejecución del Servidor**

    Para un modo de desarrollo (con autorecarga al modificar archivos mediante Nodemon):
    ```bash
    npm run dev
    ```
    Para iniciar el servidor normalmente de producción:
    ```bash
    npm start
    ```

6.  **Acceso a la Plataforma**
    Una vez el servidor esté operando y muestre el mensaje "Base de datos conectada exitosamente", dirígete en cualquier navegador a `http://localhost:3000` para comenzar.

## Scripts Adicionales

*   **Test de Sistema:** `npm test` ejecutará el conjunto completo de pruebas configurado por Jest para las validaciones de las transacciones REST de API.
