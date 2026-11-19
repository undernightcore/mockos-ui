"use client";

type TextInputProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  link?: string;
  onLinkClick?: () => void;
};

export default function TextInput({
  title,
  value,
  onChange,
  name,
  placeholder,
  helperText,
  error,
  link,
  onLinkClick,
}: TextInputProps) {
  const inputId = name ?? title;

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      <div className="flex justify-between">
        <span className="text-(--primary-color) text-[0.875rem]">{title}</span>
       {link && (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-[0.875rem] text-(--text-input-link) hover:underline"
            onClick={onLinkClick}
          >
            {link}
          </button>
        )} 
      </div>
      <input
        id={inputId}
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-sm border border-(--text-input-border) bg-(--text-input-background) px-4 py-2 text-(--primary-color) outline-none focus:ring-2 focus:ring-(--text-input-focus)"
      />
      {helperText && (
        <span className="text-sm text-(--muted-color)">{helperText}</span>
      )}
      {error && <span className="text-sm text-(--error-color)">{error}</span>}
    </label>
  );
}
