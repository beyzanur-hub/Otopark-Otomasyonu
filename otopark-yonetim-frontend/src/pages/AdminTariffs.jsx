import { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import api from "../services/api";

const AdminTariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      const res = await api.get("/tariffs");
      setTariffs(res.data);
    } catch (error) {
      console.error("Tarifeler çekilemedi", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      await api.post("/tariffs", { 
        name: name, 
        pricePerHour: Number(price) 
      });
      setName("");
      setPrice("");
      fetchTariffs();
      alert("✅ Tarife başarıyla eklendi!");
    } catch (error) {
      alert("❌ Hata oluştu!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu tarifeyi silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/tariffs/${id}`);
        fetchTariffs();
      } catch (error) {
        alert("❌ Silinemedi.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MyNavbar />
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 max-w-screen-xl">
        
        {/* --- SOL TARA: TARİFE EKLEME FORMU --- */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💵</span>
              <h5 className="text-xl font-bold text-gray-800">Yeni Tarife Ekle</h5>
            </div>
            
            <form onSubmit={handleAdd} className="flex flex-col gap-5">
              
              {/* Tarife Adı */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tarife Adı
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="Örn: Haftasonu"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Saatlik Ücret */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Saatlik Ücret (TL)
                </label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  placeholder="50"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              {/* BUTON RENGİNİ BURADA DEĞİŞTİRDİK (MAVİ YAPTIK) */}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 transition-colors shadow-md hover:shadow-lg mt-2"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* --- SAĞ TARAF: TARİFE LİSTESİ --- */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
               <h5 className="text-lg font-bold text-gray-800">Mevcut Tarifeler</h5>
            </div>
            
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Tarife Adı</th>
                    <th scope="col" className="px-6 py-4">Saatlik Ücret</th>
                    <th scope="col" className="px-6 py-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        Henüz hiç tarife eklenmemiş.
                      </td>
                    </tr>
                  ) : (
                    tariffs.map((t) => (
                      <tr key={t.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-400">#{t.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {t.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-200">
                             {t.pricePerHour} TL
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-3 py-2 transition-colors"
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

export default AdminTariffs;