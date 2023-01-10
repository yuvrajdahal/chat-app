import { classNames } from "../../lib/utils";

const Text = ({ variant = "none", placeholderClassName = "", className = "", as = "div", isLoading = false, children, ...rest }) => {
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
                : <div className={classNames("h-4 bg-placeholder",
                    placeholderClassName
                )}></div >
            }
        </>
    );
}
export default Text;