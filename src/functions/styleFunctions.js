export function getSyleProp(className, property) {
    // Create a temporary element
    const tempElement = document.createElement("div");
    tempElement.className = className;
    document.body.appendChild(tempElement);

    // Get computed styles
    const classStyle = getComputedStyle(tempElement);
    const style = classStyle[property]; // Or any other CSS property

    // Remove the temporary element
    document.body.removeChild(tempElement);

    return style;
}


export function getColor(className) {
    // Create a temporary element
    const tempElement = document.createElement("div");
    tempElement.className = className;
    document.body.appendChild(tempElement);

    // Get computed styles
    const classStyle = getComputedStyle(tempElement);
    const style = classStyle.color; // Or any other CSS property

    // Remove the temporary element
    document.body.removeChild(tempElement);

    return style;
}


export function getFontSize(className) {
    // Create a temporary element
    const tempElement = document.createElement("div");
    tempElement.className = className;
    document.body.appendChild(tempElement);

    // Get computed styles
    const classStyle = getComputedStyle(tempElement);
    const style = classStyle.fontSize; // Or any other CSS property

    // Remove the temporary element
    document.body.removeChild(tempElement);

    return style;
}

