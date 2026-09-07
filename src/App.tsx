import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BouquetBuilder } from './views/BouquetBuilder';
import { BouquetViewer } from './views/BouquetViewer';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BouquetBuilder />} />
        <Route path="/view" element={<BouquetViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;