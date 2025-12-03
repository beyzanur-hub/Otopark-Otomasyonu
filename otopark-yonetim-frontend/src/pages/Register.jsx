import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Button, Card, Label, TextInput } from "flowbite-react";
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
      // Rol göndermiyoruz, çünkü Backend otomatik 'customer' yapıyor.
      await api.post("/users", {
        fullName: fullName,
        email: email,
        password: password,
      });

      // Başarılı olursa
      alert("Kayıt Başarılı! 🎉 Giriş yapabilirsiniz.");
      navigate("/"); // Login sayfasına at
    } catch (err) {
      // Hata olursa (Örn: Bu mail zaten kayıtlıysa)
      console.error(err);
      if (err.response && err.response.data.message) {
        setError("Hata: " + err.response.data.message);
      } else {
        setError("Kayıt olurken bir sorun oluştu.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Aramıza Katıl 🚀
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          
          {/* Ad Soyad Girişi */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fullname" value="Adınız Soyadınız" />
            </div>
            <TextInput
              id="fullname"
              placeholder="Ahmet Yılmaz"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* E-posta Girişi */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="E-posta Adresi" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="isim@sirket.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Şifre Girişi */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Şifre" />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Hata Mesajı Alanı */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Kayıt Ol Butonu */}
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Kayıt Ol
          </Button>

          {/* Login'e Dönüş Linki */}
          <div className="text-center mt-2 text-sm text-gray-500">
            Zaten hesabın var mı?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Giriş Yap
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;