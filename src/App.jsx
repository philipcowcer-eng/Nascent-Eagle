import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import WrappedView from './components/WrappedView';
import { ShoppingCart } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);

  const handleDataLoaded = (newData) => {
    setData(newData);
  };

  const handleReset = () => {
    setData(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-400 selection:text-black">
      {!data && (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Amazon Wrapped
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Drag and drop your Amazon Order History Report (CSV) to see your spending insights.
            </p>
          </div>

          <FileUpload onDataLoaded={handleDataLoaded} />

          <p className="mt-12 text-sm text-gray-600 max-w-md text-center">
            <span className="font-bold text-gray-500">Privacy Note:</span> Your data is processed 100% locally in your browser.
            No files are uploaded to any server. You can disconnect your internet and it will still work.
          </p>
        </div>
      )}

      {data && (
        <WrappedView data={data} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
