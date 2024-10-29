const DatabaseIcon = ({fillColor, fillOpacity}) => {

    const style = {
        height: "100%",
        width: "100%"
      }
      
  return (
    <svg 
        viewBox ="0 0 74 74"
        width="74" 
        height="74" 
        xmlns="http://www.w3.org/2000/svg" 
        style = {style}
        overflow="hidden">
            <g transform="translate(-238 -94)"><g><g><g><g>
                <path d="M275 104 275 104 243.5 134 246.875 136.85 275 110.15 303.125 136.85 306.5 134Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            />
            <path
                d="M252.5 135.725 252.5 158 270.5 158 270.5 139.25 279.5 139.25 279.5 158 297.5 158 297.5 135.725 275 114.35 252.5 135.725Z" 
                fill={fillColor? fillColor : "white"} 
                fillRule="nonzero" 
                fillOpacity={fillOpacity ? fillOpacity: "1"}
            /></g></g></g></g></g>
    </svg>
  )
}

export default DatabaseIcon