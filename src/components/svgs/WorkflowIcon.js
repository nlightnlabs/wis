const WorkflowIcon = ({fillColor, fillOpacity}) => {

    const style = {
        height: "100%",
        width: "100%"
      }

    return (
        <svg 
            viewBox = "0 0 75 75"
            width="75" 
            height="75" 
            xmlns="http://www.w3.org/2000/svg" 
            overflow="hidden"
            style={style}
            >
                <g transform="translate(-408 -300)"><g>
                    
                    <path 
                        d="M468.75 354.795C468.75 358.937 465.392 362.295 461.25 362.295 457.108 362.295 453.75 358.937 453.75 354.795 453.75 350.653 457.108 347.295 461.25 347.295 465.392 347.295 468.75 350.653 468.75 354.795Z" 
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                    
                    <path 
                        d="M433.5 318.045C433.5 322.187 430.142 325.545 426 325.545 421.858 325.545 418.5 322.187 418.5 318.045 418.5 313.903 421.858 310.545 426 310.545 430.142 310.545 433.5 313.903 433.5 318.045Z"
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                    
                    <path 
                        d="M461.25 326.28 453.008 318.038 461.25 310.065 469.492 318.038 461.25 326.28Z" 
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                    
                    <path 
                        d="M418.5 347.25 433.5 347.25 433.5 362.25 418.5 362.25Z" 
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                    
                    <path 
                        d="M450.652 353.295 439.5 353.295 441 351.795C441.514 351.281 441.514 350.449 441 349.935 440.486 349.421 439.654 349.421 439.14 349.935L435.203 353.872C434.96 354.122 434.823 354.455 434.82 354.802 434.821 355.151 434.959 355.484 435.203 355.732L439.14 359.67C439.656 360.184 440.49 360.182 441.004 359.666 441.517 359.151 441.516 358.316 441 357.802L439.5 356.302 450.652 356.302Z" 
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                    
                    <path 
                        d="M451.163 317.078 447.225 313.14C446.711 312.628 445.88 312.63 445.369 313.144 444.857 313.657 444.859 314.488 445.372 315L446.872 316.5 436.5 316.5 436.5 319.5 446.88 319.5 445.38 321C444.862 321.509 444.856 322.342 445.365 322.86 445.874 323.378 446.707 323.384 447.225 322.875L451.163 318.938C451.673 318.423 451.673 317.592 451.163 317.078Z" 
                        fill={fillColor? fillColor : "white"} 
                        fillRule="nonzero" 
                        fillOpacity={fillOpacity ? fillOpacity: "1"}
                    />
                        
                    <path d="M466.14 339.645C465.625 339.134 464.795 339.134 464.28 339.645L462.78 341.145 462.78 329.25 459.75 329.25 459.75 341.16 458.25 339.66C457.736 339.148 456.905 339.15 456.394 339.664 455.882 340.177 455.884 341.008 456.397 341.52L460.327 345.457C460.842 345.968 461.673 345.968 462.188 345.457L466.125 341.52C466.647 341.011 466.657 340.175 466.148 339.653 466.146 339.651 466.143 339.648 466.14 339.645Z" 
                         fill={fillColor? fillColor : "white"} 
                         fillRule="nonzero" 
                         fillOpacity={fillOpacity ? fillOpacity: "1"}   
                    />
                    
                </g></g>
        </svg> 
    )
  }
  
  export default WorkflowIcon