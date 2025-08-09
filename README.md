# Formulario de Enrolamiento

Un formulario React completo para el enrolamiento de personas con funcionalidades de ingreso manual y carga masiva desde archivos Excel.

## Características

- **Datos del Solicitante**: Campos obligatorios para identificar al solicitante
- **Enrolamiento Dinámico**: Agregar hasta 20 personas con validación de campos
- **Carga Masiva**: Opción para cargar datos desde archivos Excel (.xlsx, .xls)
- **Validación Inteligente**: Habilitación condicional del envío según datos ingresados
- **Interfaz Moderna**: Diseño responsivo con CSS profesional

## Estructura del Proyecto

```
enrollment-form/
├── FormularioEnrolamiento.js    # Componente principal del formulario
└── README.md                    # Este archivo
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- React 16.8+ (para hooks)

## Instalación y Despliegue

### Opción 1: Integración en Proyecto React Existente

1. **Copiar el componente**:
   ```bash
   # Copia FormularioEnrolamiento.js a tu proyecto
   cp FormularioEnrolamiento.js /ruta/a/tu/proyecto/src/components/
   ```

2. **Importar y usar en tu aplicación**:
   ```jsx
   // En tu App.js o el componente padre
   import FormularioEnrolamiento from './components/FormularioEnrolamiento';

   function App() {
     return (
       <div className="App">
         <FormularioEnrolamiento />
       </div>
     );
   }
   ```

### Opción 2: Crear Nueva Aplicación React

1. **Crear nueva aplicación**:
   ```bash
   npx create-react-app enrollment-form-app
   cd enrollment-form-app
   ```

2. **Reemplazar el contenido de App.js**:
   ```jsx
   import React from 'react';
   import FormularioEnrolamiento from './FormularioEnrolamiento';

   function App() {
     return (
       <div className="App">
         <FormularioEnrolamiento />
       </div>
     );
   }

   export default App;
   ```

3. **Copiar el componente**:
   ```bash
   # Copia FormularioEnrolamiento.js a src/
   cp ../FormularioEnrolamiento.js src/
   ```

4. **Iniciar la aplicación**:
   ```bash
   npm start
   ```

### Opción 3: Despliegue con Vite (Recomendado para desarrollo rápido)

1. **Crear proyecto con Vite**:
   ```bash
   npm create vite@latest enrollment-form-vite -- --template react
   cd enrollment-form-vite
   npm install
   ```

2. **Configurar el componente**:
   ```bash
   # Copia el componente a src/
   cp ../FormularioEnrolamiento.js src/
   ```

3. **Actualizar src/App.jsx**:
   ```jsx
   import FormularioEnrolamiento from './FormularioEnrolamiento'

   function App() {
     return <FormularioEnrolamiento />
   }

   export default App
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## Despliegue en Producción

### Netlify

1. **Build del proyecto**:
   ```bash
   npm run build
   ```

2. **Desplegar en Netlify**:
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli
   
   # Desplegar
   netlify deploy --prod --dir=build
   ```

### Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Desplegar**:
   ```bash
   vercel --prod
   ```

### GitHub Pages

1. **Instalar gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Agregar scripts en package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     },
     "homepage": "https://tu-usuario.github.io/enrollment-form"
   }
   ```

3. **Desplegar**:
   ```bash
   npm run deploy
   ```

## Uso del Formulario

### Funcionalidades Principales

1. **Datos del Solicitante**: Complete los campos obligatorios
2. **Agregar Personas**: Use "Agregar Otra Persona" (máximo 20)
3. **Eliminar Personas**: Click en "Eliminar" (mínimo 1 persona)
4. **Carga Masiva**: Seleccione archivo Excel como alternativa
5. **Envío**: El botón se habilita automáticamente cuando los datos son válidos

### Validaciones

- **Campos Obligatorios**: Marcados con asterisco rojo (*)
- **Límites de Caracteres**: Según especificaciones por campo
- **Tipos de Datos**: Alfabético, numérico, alfanumérico según campo
- **Archivos**: Solo acepta .xlsx y .xls

### Salida de Datos

El formulario genera un JSON en la consola del navegador con la estructura:

```json
{
  "solicitante": "Nombre del solicitante",
  "empresaSolicitante": "Nombre de la empresa",
  "enrolados": [...],
  "archivoCargado": {...}
}
```

## Personalización

### Modificar Estilos

Los estilos están definidos en el objeto `estilos` dentro del componente. Para personalizar:

1. Modifique los valores en el objeto `estilos`
2. O extraiga a un archivo CSS separado
3. O use una librería de estilos como Styled Components

### Agregar Validaciones

Para validaciones adicionales, modifique las funciones:
- `validarPersona()`
- `validarAlMenosUnaPersona()`
- Los handlers `onChange` de cada campo

## Solución de Problemas

### Error: "Module not found"
Asegúrese de que la ruta de importación sea correcta.

### El botón "Enviar" no se habilita
Verifique que:
- Los campos del solicitante estén completos
- Al menos una persona tenga todos los campos obligatorios O
- Se haya seleccionado un archivo Excel

### Estilos no se muestran correctamente
Verifique que no haya conflictos con CSS global de su aplicación.

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - vea el archivo LICENSE para detalles.