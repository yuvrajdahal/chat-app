const Button = ({ variant = "none", children, className = "", ...props }) => {
  const variants = {
    normal: "btn-normal",
    none: "",
  };
  const classType = variants[variant];
  return (
    <button className={`${classType} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;
