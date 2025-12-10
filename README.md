# 🚗 Bulut Tabanlı Otopark Yönetim Sistemi

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, **tam kapsamlı ve bulut tabanlı bir Otopark Otomasyon Sistemidir**.  
Kullanıcılar araçlarını kaydedip otopark durumunu canlı izleyebilirken, yöneticiler gelir takibi ve tarife yönetimi yapabilmektedir.  
Sistem rol tabanlıdır ve **Admin** ile **Customer** olmak üzere iki farklı kullanıcı türü içerir.

---

## 🔗 Canlı Demo Linkleri

Proje aktif olarak bulut sunucularında yayınlanmaktadır:

| Platform | Link |
|---------|------|
| **Frontend (Web Sitesi)** | https://otopark-frontend.vercel.app |
| **Backend (API & Swagger)** | https://otopark-backend.onrender.com |
| **GitHub Deposu** | https://github.com/beyzanur-hub/Otopark-Otomasyonu |

---

## 🛠️ Kullanılan Teknolojiler

Proje, **Clean Architecture** prensipleriyle modüler bir yapıda geliştirilmiştir.

| Alan | Teknoloji | Açıklama |
|------|-----------|----------|
| **Backend** | NestJS | Ölçeklenebilir Node.js framework |
| **Dil** | TypeScript | Tip güvenliği sağlar |
| **Veritabanı** | PostgreSQL | İlişkisel veritabanı |
| **ORM** | TypeORM | Veritabanı işlemleri |
| **Frontend** | React.js | Kullanıcı arayüzü |
| **Tasarım** | Tailwind CSS | Modern, responsive UI |
| **API Dokümanı** | Swagger | Otomatik API testi |
| **Deployment** | Render & Vercel | Bulut dağıtımı |

---

## 🌟 Proje Özellikleri

Sistem iki ana rol içerir:

---

### 👮‍♂️ Admin (Yönetici) Özellikleri
- **Dashboard:** Toplam kullanıcı, araç, doluluk oranı, günlük/toplam kazanç.
- **Otopark Yönetimi:** Park yerleri ekleme (A-1, B-5 vb.) ve silme.
- **Tarife Yönetimi:** Standart, VIP vb. saatlik ücretlerin belirlenmesi.
- **Geçmiş Kayıtlar:** Tüm giriş–çıkış hareketlerini görüntüleme.

---

### 🚗 Customer (Müşteri) Özellikleri
- **Kayıt ve Giriş:** Güvenli üyelik sistemi.
- **Garajım:** Araç ekleme, düzenleme, listeleme.
- **Canlı Harita:** Dolu/boş otopark alanlarını görme.
- **Park Etme:** Boş yere tıklayarak aracı park etme (*Check-in*).
- **Çıkış ve Ödeme:** Tarife ve süreye göre otomatik ücret hesaplaması (*Check-out*).

---

## 🗄️ Veritabanı Yapısı (ER Diyagramı)

Proje 5 ana tabloya sahiptir:

- **Users:** Kullanıcı bilgileri ve rolleri  
- **Vehicles:** Araç bilgileri  
  *İlişki: User — 1:N → Vehicles*
- **ParkingSpots:** Park yeri bilgisi ve doluluk durumu  
- **Tariffs:** Ücretlendirme türleri  
- **ParkRecords:** Giriş–çıkış ve ücret hesaplamaları  
  *İlişki: Araç (N-1), Park yeri (N-1), Tarife (N-M)*

---

## 🚀 Kurulum (Localhost)

Aşağıdaki adımları izleyerek projeyi kendi bilgisayarınızda çalıştırabilirsiniz:

---

### 1️⃣ Projeyi Klonlayın

```bash
git clone https://github.com/beyzanur-hub/Otopark-Otomasyonu.git
cd Otopark-Otomasyonu
```

---

### 2️⃣ Backend (Sunucu) Kurulumu
Terminalde backend klasörüne geçiş yapın ve gerekli paketleri yükleyin:
```bash
cd otopark-yonetim-backend  
npm install
```
Veritabanı Ayarları (.env): Backend klasörünün içinde .env dosyası oluşturun ve PostgreSQL bilgilerinizi girin:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sifreniz
DB_DATABASE=otopark_db
```
--

Ayarlar tamamsa sunucuyu başlatın:
```bash
npm run start:dev
```
Backend şu adreste çalışacaktır: http://localhost:3000
API Dokümantasyonu (Swagger): http://localhost:3000/api

---

### 3️⃣ Frontend (Arayüz) Kurulumu
Yeni bir terminal penceresi açın, frontend klasörüne gidin ve projeyi başlatın:
```bash
cd otopark-yonetim-frontend 
npm install
npm start
```
Web arayüzü şu adreste açılacaktır: http://localhost:3000 


---
