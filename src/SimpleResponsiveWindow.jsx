import React, { useState, useEffect, useCallback } from 'react';

const SimpleResponsiveWindow = ({ children, title, initialPosition, initialSize, onClose }) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);

  const updatePosition = useCallback(() => {
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    setPosition(prev => ({
      x: Math.min(Math.max(0, prev.x), maxX),
      y: Math.min(Math.max(0, prev.y), maxY)
    }));
  }, [size]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  const handleMouseDown = (e) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: '10px',
          backgroundColor: '#f0f0f0',
          cursor: 'move',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <button onClick={onClose} style={{float: 'right'}}>×</button>
      </div>
      <div style={{padding: '10px', height: 'calc(100% - 40px)', overflow: 'auto'}}>
        {children}
      </div>
    </div>
  );
};

export default SimpleResponsiveWindow;