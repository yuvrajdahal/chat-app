import { Component, useRef } from "react";

const FileInput = ({ as, ...rest }) => {
    const fileRef = useRef(null);
    const Compnent = as;
    function handleClick() {
        fileRef.current.click();
    }

    return (
        <>
            <Compnent onClick={handleClick} />
            <input
                {...rest}
                type="file"
                ref={fileRef}
                className=" hidden"
            />
        </>
    );
}
export default FileInput;