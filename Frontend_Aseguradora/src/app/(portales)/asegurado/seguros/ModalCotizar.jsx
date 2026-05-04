import React from 'react';
import Cotizar from './cotizar/Cotizar';
import { AiFillCloseCircle } from 'react-icons/ai';

const ModalCotizar = ({ toggle, settoggle }) => {
  return (
    <div className="fixed h-screen top-0 left-0 z-100 w-screen bg-bg-soft text-white">
      <AiFillCloseCircle
        className="absolute top-7 text-text/40 right-7 text-[2.5rem] transition-all cursor-pointer hover:scale-103"
        onClick={() => {
          settoggle(!toggle);
        }}
      />

      <Cotizar />
    </div>
  );
};

export default ModalCotizar;
