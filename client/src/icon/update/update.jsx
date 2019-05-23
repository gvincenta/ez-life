import React from "react";

const SVG = ({
    style = {},
    fill = "#42778c",
    width = "100%",
    className = "",
    viewBox = "0 0 32 32"
}) => (
    <svg
        width={width}
        style={style}
        height={width}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={`svg-icon ${className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <path
            fill={fill}
            d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM11.086 22.086l2.829 2.829 8.914-8.914-8.914-8.914-2.828 2.828 6.086 6.086z"
        />
    </svg>
);

export default SVG;
