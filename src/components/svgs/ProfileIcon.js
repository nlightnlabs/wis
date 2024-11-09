const ProfileIcon = ({fillColor, fillOpacity}) => {

    const style = {
        height: "100%",
        width: "100%"
      }

    return (
        <svg 
            viewBox = "0 0 74 73"
            width="74" 
            height="73"  
            xmlns="http://www.w3.org/2000/svg"
            overflow="hidden"
            style={style}
            >
            <g transform="translate(-438 -97)"><g><g><g>
            <g>
                <path 
                    d="M487 120.5C487 127.127 481.627 132.5 475 132.5 468.373 132.5 463 127.127 463 120.5 463 113.873 468.373 108.5 475 108.5 481.627 108.5 487 113.873 487 120.5Z" 
                    fill={fillColor? fillColor : "white"} 
                    fillRule="nonzero" 
                    fillOpacity={fillOpacity ? fillOpacity: "1"}
                />
                <path 
                    d="M499 159.5 499 147.5C499 145.7 498.1 143.9 496.6 142.7 493.3 140 489.1 138.2 484.9 137 481.9 136.1 478.6 135.5 475 135.5 471.7 135.5 468.4 136.1 465.1 137 460.9 138.2 456.7 140.3 453.4 142.7 451.9 143.9 451 145.7 451 147.5L451 159.5 499 159.5Z" 
                    fill={fillColor? fillColor : "white"} 
                    fillRule="nonzero" 
                    fillOpacity={fillOpacity ? fillOpacity: "1"}
                />
            </g></g></g></g></g>
        </svg>
    )
  }
  
  export default ProfileIcon