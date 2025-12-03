import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  
  // Şu an giriş yapmış kullanıcıyı alıyoruz
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      // Backend tüm araçları döndürüyor, biz sadece bu kullanıcıya ait olanları filtreliyoruz
      // (Gerçek projede backend'de filtreleme yapılır ama bu proje için bu yöntem uygundur)
      const myCars = res.data.filter((v) => v.user && v.user.id === user.id);
      setVehicles(myCars);
    } catch (error) {
      console.error("Araçlar çekilemedi", error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!plate || !model) return;

    try {
      await api.post("/vehicles", {
        plateNumber: plate,
        model: model,
        userId: user.id, // Aracı bu kullanıcıya bağlıyoruz
      });
      setPlate("");
      setModel("");
      fetchMyVehicles();
      alert("✅ Araç garajınıza eklendi!");
    } catch (error) {
      alert("❌ Hata oluştu! Plaka daha önce eklenmiş olabilir.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Aracı garajdan çıkarmak istediğinize emin misiniz?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchMyVehicles();
      } catch (error) {
        alert("❌ Silinemedi.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MyNavbar />

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 max-w-screen-xl">
        
        {/* --- SOL TARA: ARAÇ EKLEME FORMU --- */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🚘</span>
              <h5 className="text-xl font-bold text-gray-800">Yeni Araç Ekle</h5>
            </div>

            <form onSubmit={handleAddVehicle} className="flex flex-col gap-5">
              
              {/* Plaka Girişi */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Plaka
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 uppercase font-mono tracking-wider"
                  placeholder="34 ABC 123"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>

              {/* Model Girişi */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Marka / Model
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="Örn: Fiat Egea"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 transition-colors shadow-md hover:shadow-lg mt-2"
              >
                Garaja Ekle
              </button>
            </form>
          </div>
        </div>

        {/* --- SAĞ TARA: ARAÇ LİSTESİ (KART GÖRÜNÜMÜ) --- */}
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <h5 className="text-2xl font-bold text-gray-800">Garajım</h5>
            <p className="text-gray-500">Sisteme kayıtlı araçlarınızı buradan yönetebilirsiniz.</p>
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-10 text-center">
              <span className="text-4xl block mb-4">🅿️</span>
              <h3 className="text-lg font-medium text-blue-900">Henüz hiç aracınız yok.</h3>
              <p className="text-blue-700 mt-2">Sol taraftaki formu kullanarak ilk aracınızı ekleyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center relative overflow-hidden group">
                  
                  {/* Dekoratif Arka Plan Çizgisi */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

                  <div>
                    {/* Plaka (Plaka gibi görünsün diye font-mono yaptık) */}
                    <div className="bg-gray-100 border-2 border-gray-800 rounded px-3 py-1 inline-block mb-3">
                      <span className="font-mono font-bold text-gray-900 tracking-widest">
                        {v.plateNumber}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      {v.model}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Araç ID: #{v.id}</p>
                  </div>

                  {/* Silme Butonu */}
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-3 rounded-full transition-colors"
                    title="Aracı Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyVehicles;