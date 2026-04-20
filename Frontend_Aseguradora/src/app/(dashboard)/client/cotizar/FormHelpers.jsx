import { useState } from 'react';
import { MdInfo } from 'react-icons/md';

export const inputCls =
  'w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors';

export function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-text-soft hover:text-primary transition-colors"
      >
        <MdInfo size={15} />
      </button>
      {show && (
        <span className="absolute left-5 -top-1 z-20 w-48 bg-text text-text-inverse text-xs rounded-xl px-3 py-2 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

export function Field({ label, tooltip, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}
