import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Giriş ve Kayıt Sayfaları
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Sayfaları
import AdminDashboard from "./pages/AdminDashboard";
import AdminSpots from "./pages/AdminSpots";
import AdminTariffs from "./pages/AdminTariffs";

// Müşteri Sayfaları
import MyVehicles from "./pages/MyVehicles";
import CustomerMap from "./pages/CustomerMap";
import MyParkings from "./pages/MyParkings"; // <-- Son eklediğimiz sayfa

function App() {
  return (
    <Router>
      <Routes>
        {/* --- HERKESE AÇIK SAYFALAR --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- ADMIN SAYFALARI --- */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-spots" element={<AdminSpots />} />
        <Route path="/admin-tariffs" element={<AdminTariffs />} />
        
        {/* --- MÜŞTERİ SAYFALARI --- */}
        <Route path="/my-vehicles" element={<MyVehicles />} />
        <Route path="/parking-map" element={<CustomerMap />} />
        <Route path="/my-parkings" element={<MyParkings />} />
      </Routes>
    </Router>
  );
}

export default App;