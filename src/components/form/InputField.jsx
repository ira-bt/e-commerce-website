// src/components/form/InputField.jsx
// Purpose: Reusable form input with Formik support

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`form-input ${error && touched ? "has-error" : ""}`}
      />

      {error && touched && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
}
