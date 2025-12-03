import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const CustomerMap = () => {
  const [spots, setSpots] = useState([]);
  const [myVehicles, setMyVehicles] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  
  // Seçilenler
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedTariff, setSelectedTariff] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Tüm verileri çek (Yerler, Araçlar, Tarifeler)
      const [spotsRes, vehiclesRes, tariffsRes] = await Promise.all([
        api.get("/parking-spots"),
        api.get("/vehicles"),
        api.get("/tariffs"),
      ]);

      setSpots(spotsRes.data);
      setTariffs(tariffsRes.data);

      // Sadece bu kullanıcının araçlarını filtrele
      const myCars = vehiclesRes.data.filter(v => v.user && v.user.id === user.id);
      setMyVehicles(myCars);

    } catch (error) {
      console.error("Veriler yüklenemedi", error);
    }
  };

  const handlePark = async () => {
    if (!selectedSpot || !selectedVehicle || !selectedTariff) {
      alert("⚠️ Lütfen Yer, Araç ve Tarife seçiniz!");
      return;
    }

    try {
      await api.post("/park-records/entry", {
        vehicleId: Number(selectedVehicle),
        parkingSpotId: selectedSpot.id,
        tariffIds: [Number(selectedTariff)], // Backend array istiyor
      });
      
      alert("✅ Park işlemi başarılı! Aracınız yerleştirildi.");
      setSelectedSpot(null); // Seçimi temizle
      fetchData(); // Haritayı güncelle (Kırmızı olsun)
    } catch (error) {
      alert("❌ Hata: " + (error.response?.data?.message || "İşlem yapılamadı"));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MyNavbar />

      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col lg:flex-row gap-8">
        
        {/* --- SOL TARAF: OTOPARK HARİTASI --- */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>🅿️</span> Otopark Durumu
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => !spot.isOccupied && setSelectedSpot(spot)}
                  className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-32
                    ${spot.isOccupied 
                      ? "bg-red-50 border-red-200 opacity-80 cursor-not-allowed" 
                      : selectedSpot?.id === spot.id 
                        ? "bg-blue-50 border-blue-500 shadow-md scale-105 ring-2 ring-blue-200" 
                        : "bg-green-50 border-green-200 hover:border-green-400 hover:shadow-sm"
                    }
                  `}
                >
                  <span className={`text-2xl font-bold ${spot.isOccupied ? "text-red-600" : "text-gray-700"}`}>
                    {spot.spotName}
                  </span>
                  
                  <span className={`text-xs font-bold px-2 py-1 rounded mt-2 ${spot.isOccupied ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {spot.isOccupied ? "DOLU" : "BOŞ"}
                  </span>

                  {/* Araba İkonu (Sadece Doluysa Göster) */}
                  {spot.isOccupied && <span className="absolute bottom-2 right-2 text-2xl">🚗</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SAĞ TARAF: PARK İŞLEM PANELİ --- */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Park Etme İşlemi
            </h3>

            {!selectedSpot ? (
              <div className="text-center py-10 text-gray-400">
                <span className="text-4xl block mb-2">👈</span>
                Lütfen haritadan <b>BOŞ (Yeşil)</b> bir yer seçin.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 text-center font-bold">
                  Seçilen Yer: {selectedSpot.spotName}
                </div>

                {/* ARAÇ SEÇİMİ */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Hangi Aracınız?</label>
                  <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                  >
                    <option value="">Araç Seçiniz...</option>
                    {myVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plateNumber} - {v.model}</option>
                    ))}
                  </select>
                  {myVehicles.length === 0 && <p className="text-xs text-red-500 mt-1">Kayıtlı aracınız yok!</p>}
                </div>

                {/* TARİFE SEÇİMİ */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Tarife Seçimi</label>
                  <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={selectedTariff}
                    onChange={(e) => setSelectedTariff(e.target.value)}
                  >
                    <option value="">Tarife Seçiniz...</option>
                    {tariffs.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.pricePerHour} TL/Saat)</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handlePark}
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-lg px-5 py-3 transition-colors shadow-md mt-2"
                >
                  PARK ET ✅
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerMap;