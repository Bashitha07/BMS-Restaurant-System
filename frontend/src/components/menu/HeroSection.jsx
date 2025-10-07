import React from 'react'
import PropTypes from 'prop-types'

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage,
  className = '' 
}) => {
  return (
    <div 
      className={`relative bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 px-4 ${className}`}
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(234, 88, 12, 0.8), rgba(234, 88, 12, 0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string,
  className: PropTypes.string,
}

export default HeroSection