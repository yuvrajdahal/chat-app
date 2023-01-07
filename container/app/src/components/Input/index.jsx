const Input = ({ variant = "none", className = "", ...props }) => {
  const variants = {
    outline: "input-outline",
    checkbox: "input-checkbox",
    normal: "input-normal",
    none: "",
  };
  let classType = variants[variant];
  return <input className={`${classType} ${className}`} {...props} />;
};
export default Input;
