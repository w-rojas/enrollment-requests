// FormularioEnrolamiento.js
// Componente funcional en React con hooks, CSS embebido y validaciones.
// - La sección "Colaboradores a Enrolar" ahora parte colapsada.
// - Al presionar "Agregar Colaborador" se crea y muestra el primer formulario.
// - Se reemplazan todas las menciones de "persona" por "colaborador".
// - Botón "Agregar Colaborador" se deshabilita al llegar a 20 colaboradores.
//
// Copia este archivo en tu proyecto e impórtalo en tu App:
// import FormularioEnrolamiento from "./FormularioEnrolamiento";
// <FormularioEnrolamiento />

import React, { useEffect, useMemo, useState } from "react";

export default function FormularioEnrolamiento() {
  // -----------------------------
  // Estado: Datos del Solicitante
  // -----------------------------
  const [solicitante, setSolicitante] = useState({
    nombre: "",
    empresa: "",
    correo: "",
  });

  // -----------------------------
  // Estado: Colaboradores a Enrolar (dinámico)
  // - AHORA comienza VACÍO para partir colapsado.
  // - Al agregar, se crea el primer colaborador y se despliega la sección.
  // -----------------------------
  const emptyColab = (id) => ({
    id,
    n_tag: "",
    nombres: "",
    apellidos: "",
    empresa: "",
    rut: "",
    pasaporte: "",
    sap: "",
    gerencia: "",
    superIntendencia: "",
    unidad: "",
    descripcionCargo: "",
    n_contrato: "",
  });

  const [colaboradores, setColaboradores] = useState([]);
  const [seccionAbierta, setSeccionAbierta] = useState(false); // controla el colapso/expandir

  // -----------------------------
  // Estado: Archivo (Carga masiva)
  // -----------------------------
  const [archivo, setArchivo] = useState(null);

  // -----------------------------
  // Reglas de Validación (regex y helpers)
  // -----------------------------
  const rgxEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rgxAlpha = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;
  const rgxAlnum = /^[A-Za-z0-9]+$/;
  const rgxNumeric = /^[0-9]+$/;

  // Validaciones de solicitante
  const validSolicitante = useMemo(() => {
    const nombreOk = solicitante.nombre.trim().length > 0;
    const empresaOk = solicitante.empresa.trim().length > 0;
    const correoOk = rgxEmail.test(solicitante.correo.trim());
    return { nombreOk, empresaOk, correoOk, all: nombreOk && empresaOk && correoOk };
  }, [solicitante]);

  // Validación por colaborador (campos obligatorios + formatos/longitudes)
  const validateColab = (c) => {
    const errors = {};

    if (!c.n_tag || c.n_tag.length !== 13 || !rgxAlnum.test(c.n_tag)) {
      errors.n_tag = "Debe ser alfanumérico de 13 caracteres.";
    }
    if (!c.nombres || c.nombres.trim().length === 0 || c.nombres.trim().length > 50 || !rgxAlpha.test(c.nombres.trim())) {
      errors.nombres = "Sólo letras (máx. 50).";
    }
    if (!c.apellidos || c.apellidos.trim().length === 0 || c.apellidos.trim().length > 50 || !rgxAlpha.test(c.apellidos.trim())) {
      errors.apellidos = "Sólo letras (máx. 50).";
    }
    if (!c.empresa || c.empresa.trim().length === 0 || c.empresa.trim().length > 50 || !rgxAlpha.test(c.empresa.trim())) {
      errors.empresa = "Sólo letras (máx. 50).";
    }
    if (!c.descripcionCargo || c.descripcionCargo.trim().length === 0 || c.descripcionCargo.trim().length > 50 || !rgxAlpha.test(c.descripcionCargo.trim())) {
      errors.descripcionCargo = "Sólo letras (máx. 50).";
    }

    if (c.rut && (c.rut.length > 12 || !/^[A-Za-z0-9\-\.]+$/.test(c.rut))) {
      errors.rut = "Hasta 12 caracteres (alfanum., puede incluir '-' y '.').";
    }
    if (c.pasaporte && (c.pasaporte.length > 50 || !/^[A-Za-z0-9\-]+$/.test(c.pasaporte))) {
      errors.pasaporte = "Hasta 50 caracteres alfanuméricos.";
    }
    if (c.sap && (!rgxNumeric.test(c.sap) || c.sap.length > 10)) {
      errors.sap = "Sólo números (máx. 10).";
    }
    if (c.gerencia && (c.gerencia.trim().length > 50 || !rgxAlpha.test(c.gerencia.trim()))) {
      errors.gerencia = "Sólo letras (máx. 50).";
    }
    if (c.superIntendencia && (c.superIntendencia.trim().length > 50 || !rgxAlpha.test(c.superIntendencia.trim()))) {
      errors.superIntendencia = "Sólo letras (máx. 50).";
    }
    if (c.unidad && (c.unidad.trim().length > 50 || !rgxAlpha.test(c.unidad.trim()))) {
      errors.unidad = "Sólo letras (máx. 50).";
    }
    if (c.n_contrato && (!rgxNumeric.test(c.n_contrato) || c.n_contrato.length > 12)) {
      errors.n_contrato = "Sólo números (máx. 12).";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Estado de errores por colaborador (para mostrar mensajes)
  const [errores, setErrores] = useState({}); // { [id]: { campo: mensaje } }

  useEffect(() => {
    const next = {};
    colaboradores.forEach((c) => {
      const { errors } = validateColab(c);
      if (Object.keys(errors).length > 0) next[c.id] = errors;
    });
    setErrores(next);
  }, [colaboradores]);

  // --------------------------------------
  // Habilitación del botón "Enviar Solicitud"
  // 1) Solicitante OK + >=1 colaborador válido
  // 2) Solicitante OK + archivo seleccionado
  // --------------------------------------
  const hasAtLeastOneValidColab = useMemo(
    () => colaboradores.some((c) => validateColab(c).isValid),
    [colaboradores]
  );

  const canSubmit = useMemo(() => {
    if (!validSolicitante.all) return false;
    if (archivo) return true;
    return hasAtLeastOneValidColab;
  }, [validSolicitante, archivo, hasAtLeastOneValidColab]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleSolicitanteChange = (e) => {
    const { name, value } = e.target;
    setSolicitante((prev) => ({ ...prev, [name]: value }));
  };

  const handleColabChange = (id, field, value) => {
    setColaboradores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addColab = () => {
    if (colaboradores.length >= 20) return;
    const nextId = colaboradores.length
      ? colaboradores.reduce((acc, c) => Math.max(acc, c.id), 0) + 1
      : 1;
    setColaboradores((prev) => [...prev, emptyColab(nextId)]);
    setSeccionAbierta(true); // al agregar, abrimos (desplegamos) la sección
  };

  const removeColab = (id) => {
    setColaboradores((prev) => prev.filter((c) => c.id !== id));
    setErrores((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Si no quedan colaboradores, volvemos a colapsar visualmente la sección
    setTimeout(() => {
      setSeccionAbierta((wasOpen) => (colaboradores.length - 1 > 0 ? wasOpen : false));
    }, 0);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setArchivo(file);
  };

  // -----------------------------
  // Envío simulado
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const colaboradoresValidos = colaboradores
      .filter((c) => validateColab(c).isValid)
      .map((c) => ({
        id: c.id,
        n_tag: c.n_tag,
        nombres: c.nombres,
        apellidos: c.apellidos,
        empresa: c.empresa,
        rut: c.rut || null,
        pasaporte: c.pasaporte || null,
        sap: c.sap || null,
        gerencia: c.gerencia || null,
        superIntendencia: c.superIntendencia || null,
        unidad: c.unidad || null,
        descripcionCargo: c.descripcionCargo,
        n_contrato: c.n_contrato || null,
      }));

    const payload = {
      solicitante: solicitante.nombre.trim(),
      empresaSolicitante: solicitante.empresa.trim(),
      correoSolicitante: solicitante.correo.trim(),
      enrolados: colaboradoresValidos,
      archivoCargado: archivo ? archivo.name : null,
    };

    console.log(payload); // Único objeto JSON
    alert("Solicitud preparada. Revisa la consola del navegador (F12).");
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="enrolamiento-wrapper">
      {/* CSS embebido */}
      <style>{css}</style>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <h1>Enrolamiento de Colaboradores</h1>

        {/* 1) Datos del Solicitante */}
        <section className="section">
          <h2>Datos del Solicitante</h2>
          <div className="grid">
            <div className="field">
              <label>Solicitante<span className="req">*</span></label>
              <input
                type="text"
                name="nombre"
                value={solicitante.nombre}
                onChange={handleSolicitanteChange}
                placeholder="Nombre del solicitante"
                required
              />
            </div>

            <div className="field">
              <label>Empresa del Solicitante<span className="req">*</span></label>
              <input
                type="text"
                name="empresa"
                value={solicitante.empresa}
                onChange={handleSolicitanteChange}
                placeholder="Empresa"
                required
              />
            </div>

            <div className="field full">
              <label>Correo Electrónico del Solicitante<span className="req">*</span></label>
              <input
                type="email"
                name="correo"
                value={solicitante.correo}
                onChange={handleSolicitanteChange}
                placeholder="email@ejemplo.com"
                required
              />
              {!validSolicitante.correoOk && solicitante.correo !== "" && (
                <p className="error">Ingresa un correo válido.</p>
              )}
            </div>
          </div>
        </section>

        {/* 2) Colaboradores a Enrolar (Dinámico, colapsable) */}
        <section className="section">
          <div className="section-header">
            <h2>Colaboradores a Enrolar</h2>
            <button
              type="button"
              className="btn-primary"
              onClick={addColab}
              disabled={colaboradores.length >= 20}
              title={colaboradores.length >= 20 ? "Máximo 20 colaboradores" : (colaboradores.length ? "Agregar Otro Colaborador" : "Agregar Colaborador")}
            >
              {colaboradores.length ? "Agregar Otro Colaborador" : "Agregar Colaborador"}
            </button>
          </div>

          {/* Estado colapsado: mientras no haya colaboradores, no se muestran formularios */}
          {!seccionAbierta && colaboradores.length === 0 && (
            <p className="hint">
              Esta sección está colapsada. Presiona <strong>“Agregar Colaborador”</strong> para iniciar el formulario.
            </p>
          )}

          {/* Desplegado sólo si hay colaboradores o se forzó apertura */}
          {seccionAbierta && colaboradores.length > 0 && colaboradores.map((c, idx) => {
            const err = errores[c.id] || {};
            const indexLabel = `Colaborador ${idx + 1}`;
            return (
              <fieldset key={c.id} className="person-block">
                <legend>{indexLabel}</legend>

                {/* Botón eliminar para cada bloque */}
                <div className="person-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => removeColab(c.id)}
                    disabled={colaboradores.length === 0}
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="grid">
                  <div className="field">
                    <label>N° TAG<span className="req">*</span></label>
                    <input
                      type="text"
                      value={c.n_tag}
                      onChange={(e) =>
                        handleColabChange(c.id, "n_tag", e.target.value.toUpperCase().slice(0, 13))
                      }
                      placeholder="Alfanumérico (13)"
                      maxLength={13}
                      required
                    />
                    {err.n_tag && <p className="error">{err.n_tag}</p>}
                  </div>

                  <div className="field">
                    <label>Nombres<span className="req">*</span></label>
                    <input
                      type="text"
                      value={c.nombres}
                      onChange={(e) =>
                        handleColabChange(c.id, "nombres", e.target.value.slice(0, 50))
                      }
                      placeholder="Sólo letras (máx. 50)"
                      maxLength={50}
                      required
                    />
                    {err.nombres && <p className="error">{err.nombres}</p>}
                  </div>

                  <div className="field">
                    <label>Apellidos<span className="req">*</span></label>
                    <input
                      type="text"
                      value={c.apellidos}
                      onChange={(e) =>
                        handleColabChange(c.id, "apellidos", e.target.value.slice(0, 50))
                      }
                      placeholder="Sólo letras (máx. 50)"
                      maxLength={50}
                      required
                    />
                    {err.apellidos && <p className="error">{err.apellidos}</p>}
                  </div>

                  <div className="field">
                    <label>Empresa<span className="req">*</span></label>
                    <input
                      type="text"
                      value={c.empresa}
                      onChange={(e) =>
                        handleColabChange(c.id, "empresa", e.target.value.slice(0, 50))
                      }
                      placeholder="Sólo letras (máx. 50)"
                      maxLength={50}
                      required
                    />
                    {err.empresa && <p className="error">{err.empresa}</p>}
                  </div>

                  <div className="field">
                    <label>RUT</label>
                    <input
                      type="text"
                      value={c.rut}
                      onChange={(e) =>
                        handleColabChange(c.id, "rut", e.target.value.slice(0, 12))
                      }
                      placeholder="Opcional (máx. 12)"
                      maxLength={12}
                    />
                    {err.rut && <p className="error">{err.rut}</p>}
                  </div>

                  <div className="field">
                    <label>Pasaporte</label>
                    <input
                      type="text"
                      value={c.pasaporte}
                      onChange={(e) =>
                        handleColabChange(c.id, "pasaporte", e.target.value.slice(0, 50))
                      }
                      placeholder="Opcional (máx. 50)"
                      maxLength={50}
                    />
                    {err.pasaporte && <p className="error">{err.pasaporte}</p>}
                  </div>

                  <div className="field">
                    <label>SAP</label>
                    <input
                      type="text"
                      value={c.sap}
                      onChange={(e) =>
                        handleColabChange(
                          c.id,
                          "sap",
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="Numérico (máx. 10)"
                      inputMode="numeric"
                      maxLength={10}
                    />
                    {err.sap && <p className="error">{err.sap}</p>}
                  </div>

                  <div className="field">
                    <label>Gerencia</label>
                    <input
                      type="text"
                      value={c.gerencia}
                      onChange={(e) =>
                        handleColabChange(c.id, "gerencia", e.target.value.slice(0, 50))
                      }
                      placeholder="Opcional (máx. 50)"
                      maxLength={50}
                    />
                    {err.gerencia && <p className="error">{err.gerencia}</p>}
                  </div>

                  <div className="field">
                    <label>Super Intendencia</label>
                    <input
                      type="text"
                      value={c.superIntendencia}
                      onChange={(e) =>
                        handleColabChange(
                          c.id,
                          "superIntendencia",
                          e.target.value.slice(0, 50)
                        )
                      }
                      placeholder="Opcional (máx. 50)"
                      maxLength={50}
                    />
                    {err.superIntendencia && <p className="error">{err.superIntendencia}</p>}
                  </div>

                  <div className="field">
                    <label>Unidad</label>
                    <input
                      type="text"
                      value={c.unidad}
                      onChange={(e) =>
                        handleColabChange(c.id, "unidad", e.target.value.slice(0, 50))
                      }
                      placeholder="Opcional (máx. 50)"
                      maxLength={50}
                    />
                    {err.unidad && <p className="error">{err.unidad}</p>}
                  </div>

                  <div className="field">
                    <label>Descripción de Cargo<span className="req">*</span></label>
                    <input
                      type="text"
                      value={c.descripcionCargo}
                      onChange={(e) =>
                        handleColabChange(
                          c.id,
                          "descripcionCargo",
                          e.target.value.slice(0, 50)
                        )
                      }
                      placeholder="Sólo letras (máx. 50)"
                      maxLength={50}
                      required
                    />
                    {err.descripcionCargo && <p className="error">{err.descripcionCargo}</p>}
                  </div>

                  <div className="field">
                    <label>N° Contrato</label>
                    <input
                      type="text"
                      value={c.n_contrato}
                      onChange={(e) =>
                        handleColabChange(
                          c.id,
                          "n_contrato",
                          e.target.value.replace(/\D/g, "").slice(0, 12)
                        )
                      }
                      placeholder="Numérico (máx. 12)"
                      inputMode="numeric"
                      maxLength={12}
                    />
                    {err.n_contrato && <p className="error">{err.n_contrato}</p>}
                  </div>
                </div>
              </fieldset>
            );
          })}
        </section>

        {/* 3) Opción de Carga Masiva (Excel) */}
        <section className="section">
          <h2>Carga Masiva (Excel)</h2>
          <p className="hint">
            Alternativamente, si no desea ingresar los datos manualmente, cargue el archivo aquí.
          </p>
          <a href="#" className="download-link">⬇️ Descargar plantilla</a>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
          {archivo && (
            <p className="file-ok">
              Archivo seleccionado: <strong>{archivo.name}</strong>
            </p>
          )}
        </section>

        {/* Botón principal de envío */}
        <div className="footer">
          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            Enviar Solicitud
          </button>
          {!validSolicitante.all && (
            <p className="error-inline">
              Completa los campos del Solicitante con un correo válido.
            </p>
          )}
          {validSolicitante.all && !archivo && !hasAtLeastOneValidColab && (
            <p className="error-inline">
              Agrega al menos un colaborador con campos obligatorios o selecciona un archivo.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

// -----------------------------
// CSS embebido (simple y moderno)
// -----------------------------
const css = `
.enrolamiento-wrapper {
  background: #344050;
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Inter', 'Roboto', sans-serif;
}

.card {
  width: 100%;
  max-width: 800px;
  background: #FFFFFF;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #333333;
}

h2 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333333;
}

.section {
  padding: 1rem 0 1.25rem;
  border-top: 1px solid #D0D5DD;
}

.section:first-of-type {
  border-top: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
}

.field {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
}

.field.full {
  grid-column: span 12;
}

label {
  font-size: 0.9rem;
  color: #333333;
  margin-bottom: 6px;
  font-weight: 500;
}

.req {
  color: #C62828;
  margin-left: 4px;
}

input[type="text"],
input[type="email"],
input[type="file"] {
  background: #FFFFFF;
  border: 1px solid #D0D5DD;
  color: #333333;
  border-radius: 6px;
  padding: 8px 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="file"]:focus {
  border-color: #4B9CE2;
  box-shadow: 0 0 0 3px rgba(75,156,226,0.15);
  outline: none;
}

.hint {
  color: #555555;
  margin-bottom: 10px;
}

.file-ok {
  margin-top: 8px;
  background: #E6F4EA;
  color: #2E7D32;
  padding: 4px 8px;
  border-radius: 4px;
}

.person-block {
  position: relative;
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #D0D5DD;
  border-radius: 8px;
  background: #FFFFFF;
}

.person-block legend {
  padding: 0 8px;
  font-weight: 600;
  color: #333333;
}

.person-actions {
  position: absolute;
  top: 12px;
  right: 12px;
}

.btn-primary,
.btn-secondary {
  appearance: none;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
  font-weight: 500;
}

.btn-primary {
  background: #F7B500;
  color: #333333;
}

.btn-primary:hover {
  background: #E0A400;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #E5E7EB;
  color: #333333;
}

.btn-secondary:hover {
  background: #D5D9DD;
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #4B9CE2;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.download-link:hover {
  text-decoration: underline;
}

.error {
  background: #FDECEA;
  color: #C62828;
  font-size: 0.8rem;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 4px;
}

.error-inline {
  background: #FDECEA;
  color: #C62828;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.success {
  background: #E6F4EA;
  color: #2E7D32;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.footer {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #D0D5DD;
}

@media (max-width: 900px) {
  .field { grid-column: span 6; }
}

@media (max-width: 600px) {
  .field, .field.full { grid-column: span 12; }
}
`;
