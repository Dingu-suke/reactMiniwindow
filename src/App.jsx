import React, { useState } from 'react';
import SimpleResponsiveWindow from './SimpleResponsiveWindow';

const App = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsWindowOpen(true)}>ウィンドウを開く</button>
      {isWindowOpen && (
        <SimpleResponsiveWindow
          title="サンプルウィンドウ"
          initialPosition={{ x: 100, y: 100 }}
          initialSize={{ width: 400, height: 300 }}
          onClose={() => setIsWindowOpen(false)}
        >
          <p>ここにウィンドウの内容を記述します。</p>
        </SimpleResponsiveWindow>
      )}
    </div>
  );
};

export default App;