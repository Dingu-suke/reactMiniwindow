import React, { useState, useEffect, useCallback } from 'react';

const AdaptiveResponsiveWindow = ({ children, title, initialPosition, initialSize, onClose }) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);

  const updateSizeAndPosition = useCallback(() => {
    const maxWidth = window.innerWidth - 20; // 20pxのマージンを確保
    const maxHeight = window.innerHeight - 20;
    
    setSize(prevSize => ({
      width: Math.min(prevSize.width, maxWidth),
      height: Math.min(prevSize.height, maxHeight)
    }));

    setPosition(prevPos => ({
      x: Math.min(Math.max(10, prevPos.x), window.innerWidth - size.width - 10),
      y: Math.min(Math.max(10, prevPos.y), window.innerHeight - size.height - 10)
    }));
  }, [size.width, size.height]);

  useEffect(() => {
    window.addEventListener('resize', updateSizeAndPosition);
    return () => window.removeEventListener('resize', updateSizeAndPosition);
  }, [updateSizeAndPosition]);

  useEffect(() => {
    updateSizeAndPosition();
  }, [updateSizeAndPosition]);

  const handleMouseDown = (e) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      setPosition({
        x: Math.min(Math.max(0, moveEvent.clientX - startX), window.innerWidth - size.width),
        y: Math.min(Math.max(0, moveEvent.clientY - startY), window.innerHeight - size.height)
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
      const newSize = { ...size };
      const newPosition = { ...position };

      if (direction.includes('e')) {
        newSize.width = Math.min(Math.max(200, startWidth + moveEvent.clientX - startX), window.innerWidth - position.x - 10);
      }
      if (direction.includes('s')) {
        newSize.height = Math.min(Math.max(200, startHeight + moveEvent.clientY - startY), window.innerHeight - position.y - 10);
      }
      if (direction.includes('w')) {
        const newWidth = Math.max(200, startWidth - (moveEvent.clientX - startX));
        newSize.width = Math.min(newWidth, startLeft + startWidth - 10);
        newPosition.x = startLeft + (startWidth - newSize.width);
      }
      if (direction.includes('n')) {
        const newHeight = Math.max(200, startHeight - (moveEvent.clientY - startY));
        newSize.height = Math.min(newHeight, startTop + startHeight - 10);
        newPosition.y = startTop + (startHeight - newSize.height);
      }

      setSize(newSize);
      setPosition(newPosition);
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
        overflow: 'hidden', // ウィンドウ内のコンテンツがはみ出ないようにする
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

export default AdaptiveResponsiveWindow;