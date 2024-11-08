import React from 'react'

const AngleArrowIcon = ({fillColor, fillOpacity}) => {

  const style = {
    height: "100%",
    width: "100%"
  }

  return (
    <svg 
      viewBox="0 0 73 74"
      width="73" 
      height="74" 
      xmlns="http://www.w3.org/2000/svg" 
      overflow="hidden"
      style = {style}
      >
        <g transform="translate(-636 -10)"><g><g><g><g>
          <path 
            d="M685.282 46.9948 664.094 68.1868 660.912 65.0052 678.919 46.9948 660.913 28.9888 664.094 25.8072 685.282 46.9948Z" 
            fill={fillColor? fillColor : "white"} 
            fillRule="nonzero" 
            fillOpacity={fillOpacity? fillOpacity: "1"}
          />
      </g></g></g></g></g></svg>
  )
}

export default AngleArrowIcon