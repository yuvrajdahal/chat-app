const Text = ({ variant = "none", className = "", as = "div", isLoading = false, children, ...rest }) => {
    const variants = {
        primary: "text-primary",
        none: "",
    };
    const Component = as;
    const classType = variants[variant];

    return (
        <>
            {isLoading === false ?
                <Component className={`${classType} ${className}`}{...rest}>
                    {children}
                </Component >
                : <div className="h-4 bg-placeholder"></div >
            }
        </>
    );
}
export default Text;