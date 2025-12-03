import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const AdminSpots = () => {
  const [spots, setSpots] = useState([]);
  const [newSpotName, setNewSpotName] = useState("");

  // Sayfa açılınca listeyi çek
  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await api.get("/parking-spots");
      setSpots(res.data);
    } catch (error) {
      console.error("Yerler çekilemedi", error);
    }
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();
    if (!newSpotName) return;

    try {
      await api.post("/parking-spots", {
        spotName: newSpotName,
        isOccupied: false,
      });
      setNewSpotName(""); // Kutuyu temizle
      fetchSpots(); // Listeyi güncelle
      alert("✅ Yeni yer başarıyla eklendi!");
    } catch (error) {
      alert("❌ Hata oluştu! Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu otopark yerini silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/parking-spots/${id}`);
        fetchSpots();
      } catch (error) {
        alert("❌ Silinemedi.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MyNavbar />
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* --- SOL TARA: YER EKLEME FORMU --- */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h5 className="text-xl font-bold text-gray-900 mb-4">Yeni Yer Ekle</h5>
            <form onSubmit={handleAddSpot} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Yer Adı / Numarası
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Örn: C-5"
                  required
                  value={newSpotName}
                  onChange={(e) => setNewSpotName(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* --- SAĞ TARAF: TABLO LİSTESİ --- */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h5 className="text-xl font-bold text-gray-900 mb-4">Mevcut Otopark Yerleri</h5>
            
            <div className="relative overflow-x-auto shadow-sm sm:rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Yer Adı</th>
                    <th scope="col" className="px-6 py-3">Durum</th>
                    <th scope="col" className="px-6 py-3">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {spots.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center">Hiç kayıt bulunamadı.</td>
                    </tr>
                  ) : (
                    spots.map((spot) => (
                      <tr key={spot.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{spot.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {spot.spotName}
                        </td>
                        <td className="px-6 py-4">
                          {spot.isOccupied ? (
                            <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-red-400">
                              DOLU 🔴
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">
                              BOŞ 🟢
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(spot.id)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSpots;