import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const AdminDashboard = () => {
  // 1. Seçilen Tarih için State (Varsayılan: Bugün)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const [stats, setStats] = useState({
    userCount: 0,
    vehicleCount: 0,
    spotCount: 0,
    emptySpots: 0,
    totalEarnings: 0,
    dailyEarnings: 0,
  });

  // 2. Tarih değişince verileri tekrar hesapla
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [usersRes, vehiclesRes, spotsRes, recordsRes] = await Promise.all([
        api.get("/users"),
        api.get("/vehicles"),
        api.get("/parking-spots"),
        api.get("/park-records"),
      ]);

      const spots = spotsRes.data;
      const records = recordsRes.data;
      const emptyCount = spots.filter((spot) => !spot.isOccupied).length;

      // --- PARA HESAPLAMA ---
      
      // A) Toplam Kazanç
      const totalIncome = records.reduce((sum, record) => {
        return sum + (Number(record.totalPrice) || 0);
      }, 0);

      // B) Seçilen Tarihteki Kazanç
      const dailyIncome = records
        .filter((record) => record.exitTime && record.exitTime.startsWith(selectedDate))
        .reduce((sum, record) => sum + (Number(record.totalPrice) || 0), 0);

      setStats({
        userCount: usersRes.data.length,
        vehicleCount: vehiclesRes.data.length,
        spotCount: spots.length,
        emptySpots: emptyCount,
        totalEarnings: totalIncome,
        dailyEarnings: dailyIncome,
      });

    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const StatCard = ({ title, count, color, icon, isMoney }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${isMoney ? "text-green-600" : "text-gray-800"}`}>
          {isMoney ? `${count} ₺` : count}
        </h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <MyNavbar />

      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Yönetim Paneli</h1>
            <p className="text-gray-500 mt-1">Sistemin genel durumu ve finansal raporlar.</p>
          </div>
          
          {/* TARİH SEÇİCİ */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-gray-500 text-sm font-bold pl-2">Tarih Seç:</span>
            <input 
              type="date" 
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        
        {/* FİNANSAL KARTLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <StatCard 
              title={`${selectedDate.split("-").reverse().join(".")} Tarihindeki Kazanç`} 
              count={stats.dailyEarnings} 
              color="bg-green-100 text-green-600" 
              icon="📆" 
              isMoney={true}
           />
           <StatCard 
              title="Toplam Kasa (Ciro)" 
              count={stats.totalEarnings} 
              color="bg-yellow-100 text-yellow-600" 
              icon="💰" 
              isMoney={true} 
           />
        </div>

        {/* GENEL İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Toplam Kullanıcı" count={stats.userCount} color="bg-blue-100 text-blue-600" icon="👥" />
          <StatCard title="Kayıtlı Araç" count={stats.vehicleCount} color="bg-indigo-100 text-indigo-600" icon="🚗" />
          <StatCard title="Toplam Park Yeri" count={stats.spotCount} color="bg-purple-100 text-purple-600" icon="🅿️" />
          <StatCard title="Boş Yer Sayısı" count={stats.emptySpots} color="bg-orange-100 text-orange-600" icon="✅" />
        </div>

        {/* Hızlı Erişim Kutusu Kaldırıldı ✅ */}

      </div>
    </div>
  );
};

export default AdminDashboard;