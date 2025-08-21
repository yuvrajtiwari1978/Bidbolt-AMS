import React from 'react';
// import Spline from '@splinetool/react-spline';

const SplineBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/*
      <Spline 
        scene="https://prod.spline.design/76d3a78d-dc15-4fee-a0b4-a7a46ac6a2c4/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      */}
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
    </div>
  );
};

export default SplineBackground;