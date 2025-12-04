import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Backend bağlantımız

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Backend'e veriyi gönderiyoruz
      await api.post("/users", {
        fullName: fullName,
        email: email,
        password: password,
      });

      // Başarılı olursa
      alert("🎉 Kayıt Başarılı! Giriş yapabilirsiniz.");
      navigate("/"); // Login sayfasına at
    } catch (err) {
      // Hata olursa
      console.error(err);
      if (err.response && err.response.data.message) {
        setError("Hata: " + err.response.data.message);
      } else {
        setError("Kayıt olurken bir sorun oluştu.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        
        {/* LOGO ve BAŞLIK */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800">Aramıza Katıl</h2>
          <p className="text-gray-500 mt-2">Hemen hesabını oluştur, otoparkı yönet!</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          
          {/* AD SOYAD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Adınız Soyadınız</label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="Ahmet Yılmaz"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* E-POSTA */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">E-posta Adresi</label>
            <input
              type="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="ornek@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ŞİFRE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Şifre Belirleyin</label>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">Şifreniz en az 6 karakter olmalıdır.</p>
          </div>

          {/* HATA MESAJI */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* KAYIT OL BUTONU */}
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 transition-colors shadow-md hover:shadow-lg mt-2"
          >
            Hesap Oluştur
          </button>

          {/* LOGIN'E DÖNÜŞ */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">Zaten hesabın var mı? </span>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;