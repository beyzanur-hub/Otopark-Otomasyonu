import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const MyParkings = () => {
  const [activeRecords, setActiveRecords] = useState([]);
  const [pastRecords, setPastRecords] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      // 1. Tüm kayıtları ve benim araçlarımı çekiyoruz
      const [recordsRes, vehiclesRes] = await Promise.all([
        api.get("/park-records"),
        api.get("/vehicles"),
      ]);

      // 2. Sadece BENİM araçlarıma ait kayıtları buluyoruz
      // (Gerçek projede backend'de filtrelenir ama burada JS ile yapıyoruz)
      const myVehicleIds = vehiclesRes.data
        .filter((v) => v.user.id === user.id)
        .map((v) => v.id);

      const myRecords = recordsRes.data.filter((r) => 
        myVehicleIds.includes(r.vehicle.id)
      );

      // 3. Aktif (Hala içeride) ve Geçmiş (Çıkmış) olarak ayırıyoruz
      setActiveRecords(myRecords.filter((r) => r.exitTime === null));
      setPastRecords(myRecords.filter((r) => r.exitTime !== null));

    } catch (error) {
      console.error("Veriler çekilemedi", error);
    }
  };

  const handleCheckout = async (id) => {
    if (window.confirm("Çıkış yapmak ve ücreti hesaplamak istiyor musunuz?")) {
      try {
        const res = await api.patch(`/park-records/checkout/${id}`);
        
        // Ödeme Tutarını Gösteren Şık Bir Mesaj
        alert(`✅ Çıkış Başarılı!\n\n💰 Toplam Tutar: ${res.data.totalPrice} TL\n⏱️ Çıkış Saati: ${new Date(res.data.exitTime).toLocaleString()}`);
        
        fetchRecords(); // Listeyi güncelle
      } catch (error) {
        alert("❌ Çıkış yapılırken hata oluştu: " + error.response?.data?.message);
      }
    }
  };

  // Tarih formatlamak için yardımcı fonksiyon
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("tr-TR");
  };

  return (
    <div className="min-h-screen bg-white">
      <MyNavbar />

      <div className="container mx-auto px-4 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Park İşlemlerim</h1>

        {/* --- BÖLÜM 1: AKTİF PARKLAR (Şu an içeridekiler) --- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <span>⏳</span> Şu An Otoparkta Olan Araçlarım
          </h2>
          
          {activeRecords.length === 0 ? (
            <p className="text-gray-400 bg-gray-50 p-4 rounded-lg">Şu an otoparkta aracınız yok.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRecords.map((record) => (
                <div key={record.id} className="bg-white border-2 border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    AKTİF
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 font-mono">{record.vehicle.plateNumber}</h3>
                      <p className="text-gray-500 text-sm">{record.vehicle.model}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-3xl">🅿️</span>
                      <span className="font-bold text-blue-800">{record.parkingSpot.spotName}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p>🕒 <b>Giriş:</b> {formatDate(record.entryTime)}</p>
                    <p>🏷️ <b>Tarife:</b> {record.tariffs.map(t=>t.name).join(", ")}</p>
                  </div>

                  <button 
                    onClick={() => handleCheckout(record.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>💸</span> Çıkış Yap ve Öde
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- BÖLÜM 2: GEÇMİŞ PARKLAR (Bitmiş işlemler) --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
            <span>📜</span> Geçmiş İşlemler
          </h2>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-100">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Plaka</th>
                  <th className="px-6 py-3">Yer</th>
                  <th className="px-6 py-3">Giriş</th>
                  <th className="px-6 py-3">Çıkış</th>
                  <th className="px-6 py-3">Ödenen Tutar</th>
                </tr>
              </thead>
              <tbody>
                {pastRecords.map((record) => (
                  <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{record.vehicle.plateNumber}</td>
                    <td className="px-6 py-4">{record.parkingSpot.spotName}</td>
                    <td className="px-6 py-4">{formatDate(record.entryTime)}</td>
                    <td className="px-6 py-4">{formatDate(record.exitTime)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">
                        {record.totalPrice} TL
                      </span>
                    </td>
                  </tr>
                ))}
                {pastRecords.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-4">Henüz geçmiş kayıt yok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyParkings;