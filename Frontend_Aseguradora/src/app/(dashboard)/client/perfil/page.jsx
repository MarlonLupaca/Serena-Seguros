'use client';

import { useState } from 'react';
import Toast from './Toast';
import ModalContrasena from './ModalContrasena';
import SeccionDatosPersonales from './SeccionDatosPersonales';
import SeccionContactoEmergencia from './SeccionContactoEmergencia';
import SeccionBeneficiarios from './SeccionBeneficiarios';
import SeccionPreferencias from './SeccionPreferencias';
import SeccionSeguridad from './SeccionSeguridad';

export default function ModuloPerfil() {
  const [toast, setToast] = useState(null);
  const [modalContrasena, setModalContrasena] = useState(false);

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      {/* Header */}
      <div className="">
        <div className="px-8 py-5">
          <div>
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-text leading-tight">Mi perfil</h1>
                  <p className="text-sm text-text-soft mt-0.5">
                    Gestiona tu información personal y preferencias de cuenta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-8">
        <div className="flex flex-col gap-5">
          <SeccionDatosPersonales onGuardar={mostrarToast} />
          <SeccionContactoEmergencia onGuardar={mostrarToast} />
          <SeccionBeneficiarios onGuardar={mostrarToast} />
          <SeccionPreferencias onGuardar={mostrarToast} />
          <SeccionSeguridad onAbrirContrasena={() => setModalContrasena(true)} />
        </div>
      </div>

      {/* Modal contraseña */}
      {modalContrasena && (
        <ModalContrasena
          onClose={() => setModalContrasena(false)}
          onGuardar={() => {
            setModalContrasena(false);
            mostrarToast('Contraseña actualizada correctamente.');
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
