import { MdCheckCircle, MdClose } from 'react-icons/md';

export default function Toast({ mensaje, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-sm font-medium animate-bounce-once">
      <MdCheckCircle size={18} />
      {mensaje}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <MdClose size={15} />
      </button>
    </div>
  );
}
