import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity'; 

// @Entity: Bu sınıfın veritabanında bir tablo olacağını belirtir.
// 'users': Veritabanındaki tablonun adı 'users' olacaktır.
@Entity('users')
export class User {
  
  // @PrimaryGeneratedColumn: Benzersiz ID (PK). 
  // Her yeni kullanıcıda otomatik artar (1, 2, 3...).
  @PrimaryGeneratedColumn()
  id: number;

  // @Column: Standart bir sütun.
  @Column()
  fullName: string;

  // unique: true -> Aynı e-posta ile ikinci kez kayıt olunamaz.
  @Column({ unique: true })
  email: string;

  // Şifreler burada tutulur.
  @Column()
  password: string;

  // default: 'customer' -> Kayıt olan herkes varsayılan olarak 'Müşteri' olur.
  // Admin yapmak istersen veritabanından elle değiştirebilirsin.
  @Column({ default: 'customer' })
  role: string;

  // --- İLİŞKİ TANIMI (Bire-Çok) ---
  // Bir Kullanıcının (User) birden çok Aracı (Vehicle) olabilir.
  // (vehicle: Vehicle) -> TypeScript hatasını çözen kısım burasıdır. Türü elle belirttik.
  @OneToMany(() => Vehicle, (vehicle: Vehicle) => vehicle.user)
  vehicles: Vehicle[];
}