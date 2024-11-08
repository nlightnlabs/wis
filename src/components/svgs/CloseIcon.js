const CloseIcon = ({fillColor, fillOpacity}) => {

    const style = {
        height: "100%",
        width: "100%"
      }
      
  return (
    <svg 
        viewBox="0 0 98 97"
        width="98" 
        height="97" 
        xmlns="http://www.w3.org/2000/svg" 
        overflow="hidden"
        style={style}
        >
            <g transform="translate(-426 -597)"><g><g><g><g>
            <path d="M510.4 619.1 501.9 610.6 475 637.5 448.1 610.6 439.6 619.1 466.5 646 439.6 672.9 448.1 681.4 475 654.5 501.9 681.4 510.4 672.9 483.5 646Z" 
                 fill={fillColor? fillColor : "white"} 
                 fillRule="nonzero" 
                 fillOpacity={fillOpacity ? fillOpacity: "1"}
        />
        </g></g></g></g></g>
    </svg>
  )
}

export default CloseIcon