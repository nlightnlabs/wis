const DatabaseIcon = ({fillColor, fillOpacity}) => {

    const style = {
        height: "100%",
        width: "100%"
      }
      
  return (
    <svg 
        viewBox='0 0 74 74'
        width="74" 
        height="74" 
        xmlns="http://www.w3.org/2000/svg" 
        overflow="hidden"
        style={style}
        >
            <g 
            transform="translate(-534 -274)">
            <g><g><g><g>
            
            <path 
                d="M592 288.5C592 291.814 582.598 294.5 571 294.5 559.402 294.5 550 291.814 550 288.5 550 285.186 559.402 282.5 571 282.5 582.598 282.5 592 285.186 592 288.5Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            />
                
            <path 
                d="M586 303.5C585.1 303.5 584.5 302.9 584.5 302 584.5 301.1 585.1 300.5 586 300.5 586.9 300.5 587.5 301.1 587.5 302 587.5 302.9 586.9 303.5 586 303.5ZM571 297.5C559.45 297.5 550 294.8 550 291.5L550 303.5C550 306.8 559.45 309.5 571 309.5 582.55 309.5 592 306.8 592 303.5L592 291.5C592 294.8 582.55 297.5 571 297.5Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            />
                
            <path 
                d="M586 318.5C585.1 318.5 584.5 317.9 584.5 317 584.5 316.1 585.1 315.5 586 315.5 586.9 315.5 587.5 316.1 587.5 317 587.5 317.9 586.9 318.5 586 318.5ZM571 312.5C559.45 312.5 550 309.8 550 306.5L550 318.5C550 321.8 559.45 324.5 571 324.5 582.55 324.5 592 321.8 592 318.5L592 306.5C592 309.8 582.55 312.5 571 312.5Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            />
            
            <path 
                d="M586 333.5C585.1 333.5 584.5 332.9 584.5 332 584.5 331.1 585.1 330.5 586 330.5 586.9 330.5 587.5 331.1 587.5 332 587.5 332.9 586.9 333.5 586 333.5ZM571 327.5C559.45 327.5 550 324.8 550 321.5L550 333.5C550 336.8 559.45 339.5 571 339.5 582.55 339.5 592 336.8 592 333.5L592 321.5C592 324.8 582.55 327.5 571 327.5Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            />
            
            </g></g></g></g></g></svg>
  )
}

export default DatabaseIcon