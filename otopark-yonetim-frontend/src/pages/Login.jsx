import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.get("/users");
      const users = response.data;
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/my-vehicles");
        }
      } else {
        setError("E-posta veya şifre hatalı!");
      }
    } catch (err) {
      setError("Sunucu ile bağlantı kurulamadı!");
    }
  };

  return (
    // Arka planı çok hafif gri/beyaz yaptık (bg-slate-50)
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🅿️</div>
          <h2 className="text-3xl font-bold text-gray-800">Hoş Geldiniz</h2>
          <p className="text-gray-500 mt-2">Otopark Yönetim Sistemi</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
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

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              placeholder="••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 transition-colors shadow-md hover:shadow-lg"
          >
            Giriş Yap
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">Hesabın yok mu? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
              Hemen Kayıt Ol
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;