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

  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    const handleMouseMove = (moveEvent) => {
      if (direction.includes('e')) {
        setSize(prev => ({ ...prev, width: Math.max(200, startWidth + moveEvent.clientX - startX) }));
      }
      if (direction.includes('s')) {
        setSize(prev => ({ ...prev, height: Math.max(200, startHeight + moveEvent.clientY - startY) }));
      }
      if (direction.includes('w')) {
        const newWidth = Math.max(200, startWidth - (moveEvent.clientX - startX));
        setSize(prev => ({ ...prev, width: newWidth }));
        setPosition(prev => ({ ...prev, x: startLeft + (startWidth - newWidth) }));
      }
      if (direction.includes('n')) {
        const newHeight = Math.max(200, startHeight - (moveEvent.clientY - startY));
        setSize(prev => ({ ...prev, height: newHeight }));
        setPosition(prev => ({ ...prev, y: startTop + (startHeight - newHeight) }));
      }
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

      {/* リサイズハンドル */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '5px', cursor: 'n-resize'}} onMouseDown={(e) => handleResize(e, 'n')} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', cursor: 's-resize'}} onMouseDown={(e) => handleResize(e, 's')} />
      <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, width: '5px', cursor: 'w-resize'}} onMouseDown={(e) => handleResize(e, 'w')} />
      <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, width: '5px', cursor: 'e-resize'}} onMouseDown={(e) => handleResize(e, 'e')} />
      <div style={{position: 'absolute', top: 0, left: 0, width: '5px', height: '5px', cursor: 'nw-resize'}} onMouseDown={(e) => handleResize(e, 'nw')} />
      <div style={{position: 'absolute', top: 0, right: 0, width: '5px', height: '5px', cursor: 'ne-resize'}} onMouseDown={(e) => handleResize(e, 'ne')} />
      <div style={{position: 'absolute', bottom: 0, left: 0, width: '5px', height: '5px', cursor: 'sw-resize'}} onMouseDown={(e) => handleResize(e, 'sw')} />
      <div style={{position: 'absolute', bottom: 0, right: 0, width: '5px', height: '5px', cursor: 'se-resize'}} onMouseDown={(e) => handleResize(e, 'se')} />
    </div>
  );
};

export default SimpleResponsiveWindow;