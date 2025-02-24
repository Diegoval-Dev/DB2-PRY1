import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Suppliers from "./pages/Suppliers";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/suppliers">Proveedores</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Routes>
    </div>
  );
}

export default App;
