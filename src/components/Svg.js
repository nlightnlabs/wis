import React, {Suspense} from 'react';

const Svg = ({ iconName, height, width, fillColor, fillOpacity, hoveredColor, isHovered, cursor}) => {

  const SvgImage = React.lazy(() => import(`./svgs/${iconName}.js`));

  const IconStyle={
    height: height !=null? height : "50px",
    width:  width !=null? width: "50px",
    cursor: cursor !=null? cursor : "pointer" ,
    transition: "0.5s ease"
  }

  return (
    <div className="flex items-center justify-center" style={IconStyle}>
      <Suspense>
        <SvgImage 
           fillColor = {fillColor}
           fillOpacity = {fillOpacity}
           hoveredColor = {hoveredColor}
           isHovered = {isHovered}
        />
      </Suspense>
    </div>
  )
};

export default Svg;





