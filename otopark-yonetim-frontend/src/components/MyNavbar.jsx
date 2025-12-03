import { useNavigate, useLocation } from "react-router-dom";

const MyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Giriş yapan kullanıcı bilgisini al
  const user = JSON.parse(localStorage.getItem("user"));

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem("user"); // Hafızayı temizle
    navigate("/"); // Login sayfasına at
  };

  // Link stilini belirleyen fonksiyon (Aktif olan link mavi ve altı çizgili olur)
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `block py-2 pr-4 pl-3 lg:p-0 font-medium transition-colors duration-200 ${
      isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 mb-8 sticky top-0 z-50">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
        
        {/* --- 1. LOGO KISMI --- */}
        {/* Logoya tıklayınca Admin ise Dashboard'a, Müşteri ise Haritaya gider */}
        <div 
          className="flex items-center cursor-pointer gap-2" 
          onClick={() => navigate(user?.role === 'admin' ? '/admin-dashboard' : '/parking-map')}
        >
          <span className="text-2xl">🅿️</span>
          <span className="self-center text-xl font-bold whitespace-nowrap text-gray-800 tracking-tight">
            Otopark<span className="text-blue-600">Sistemi</span>
          </span>
        </div>

        {/* --- 2. SAĞ TARAF (Kullanıcı Adı ve Çıkış) --- */}
        <div className="flex items-center lg:order-2 gap-4">
          {user && (
            <span className="text-gray-500 text-sm hidden md:block">
              Hoşgeldin, <b className="text-gray-800">{user.fullName}</b>
            </span>
          )}
          
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all"
          >
            Çıkış
          </button>
        </div>

        {/* --- 3. ORTA MENÜ LİNKLERİ --- */}
        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            
            {/* --- ADMIN MENÜSÜ --- */}
            {user && user.role === "admin" && (
              <>
                <li>
                  <button onClick={() => navigate("/admin-dashboard")} className={getLinkClass("/admin-dashboard")}>
                    Ana Panel
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/admin-spots")} className={getLinkClass("/admin-spots")}>
                    Otopark Yerleri
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/admin-tariffs")} className={getLinkClass("/admin-tariffs")}>
                    Tarifeler
                  </button>
                </li>
              </>
            )}

            {/* --- MÜŞTERİ MENÜSÜ --- */}
            {user && user.role !== "admin" && (
               <>
                 <li>
                   <button onClick={() => navigate("/parking-map")} className={getLinkClass("/parking-map")}>
                     Otopark Durumu
                   </button>
                 </li>
                 <li>
                   <button onClick={() => navigate("/my-vehicles")} className={getLinkClass("/my-vehicles")}>
                     Araçlarım
                   </button>
                 </li>
                 <li>
                   <button onClick={() => navigate("/my-parkings")} className={getLinkClass("/my-parkings")}>
                     Parklarım & Ödeme
                   </button>
                 </li>
               </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;