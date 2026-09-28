# Sipariş Yönetim Sistemi

## İlk talep ve mimari
Türkçe, modern bir sipariş yönetimi uygulaması: React + FastAPI + MongoDB.
Sipariş oluşturma/düzenleme, koşullu ürün alanları, en fazla iki ürün, durum takibi,
filtreleme, 10×10 cm sipariş etiketi ve 8×5 cm hediye notu çıktısı.
Kullanıcı girişi, admin yönetimi ve kullanıcıya özel tablo sütunları mevcut.
Backend `/app/backend/server.py`; frontend `/app/frontend/src`.
API adresi frontend `.env` içindeki REACT_APP_BACKEND_URL; veritabanı backend
`.env` içindeki MONGO_URL ve DB_NAME. Kimlik bilgileri `test_credentials.md` içinde.

## Güncel kullanıcı talebi — 2026-09-28
- Yeni öncelik: “siparişi düzenleye girdiğimde, ödeme tipi bilgisi sıfırlanıyor”.
  Kullanıcı yalnızca ödeme tipi düzeltmesini onayladı; diğer işleyişler değişmeyecek.
- Aynı 10×10 cm etikette iki ürün için ayrı “Ürün 1” ve “Ürün 2” bölümleri.
- Her ürünün kendi tür, altlık, renk, yazı ve altlık yazısı gösterilecek.
- Müşteri, telefon, kargo/adres, ödeme ve toplam tek kez gösterilecek.
- Hediye notu boş sayfa sorunu giderilecek, mevcut kart görseli korunacak.

## Tamamlanan değişiklikler — 2026-09-28
- PrintLabel yeniden düzenlendi: ikinci ürün, ürün sayısı, tam adres, ayrı detaylar.
- PrintNote: arka plan yerine yerel resim; not metni ayrı siyah metin katmanı.
- PrintJob + print.css: body seviyesinde yazdırma alanı, diğer sayfa öğelerini
  yerleşimden kaldırma, seçime göre geçerli @page ölçüsü, font/görsel bekleme,
  afterprint sonrası temizleme ve metin sığdırma. Çok uzun metni kesmek yerine uyarı.
- Notu olmayan/yalnızca boşluk olan siparişte not yazdırma düğmesi gizli.
- Eski hatalı ortak `8cm 5cm landscape` kuralı ve 100ms zamanlayıcıları kaldırıldı.
- Önceki plan onayı sırasında kod denetimini engelleyen yinelenen İstanbul anahtarı kaldırıldı (F601 kontrolü geçti).
- Test raporunda bulunan mobil tablo taşması giderildi: 1280px altında etiketli,
  iki sütunlu sipariş satırları; yazdırma/diğer işlemler görünür kaldı. Başlık
  düğmeleri sarılıyor. Sonner bildirim kutusunun mobil genişliği düzeltildi.
- Yeni çıktı alanları, uyarılar ve yazdırma düğmelerine data-testid eklendi.
- Ödeme tipi sıfırlanması düzeltildi (yalnızca `OrderForm.js` uygulama kodu değişti):
  form açılışında kayıtlı ödeme tipi alınır ve Select her zaman kontrollü string olur.
  Radix gizli native select'in boş açılış olayları artık kayıtlı seçimleri silemez.
  Ortak seçim/metin/telefon güncellemeleri önceki state üzerinden birleşir; böylece
  renk/altlık gibi diğer değerler de korunur. Gerçek il değişikliği hâlâ ilçeyi sıfırlar.
  Yeni siparişte ödeme otomatik seçilmez; mevcut seçenekler ve iş kuralları değişmedi.

## Test durumu
- Önceki oturum: backend kullanıcı CRUD ve giriş testleri başarılı; kullanıcı arayüzü kullanıcı tarafından onaylı.
- Bu oturum: mevcut #2 siparişte iki ürün olduğu ve eski etiketin yalnızca ilk ürünü kullandığı doğrulandı.
- Test agent raporu: `/app/test_reports/iteration_1.json`.
- PDF doğrulamaları: `/app/test_reports/pdf_validation.json`; tek sayfalık 10×10 cm
  etiket ve 8×5 cm not, her iki ürüne ait farklı detaylar, tek ürün senaryosu,
  ikinci ürün kapalıyken eski alanların gizlenmesi, boş not düğmesinin gizlenmesi.
- Not metni ve kart görseli arka plan baskısı kapalıyken PDF'de mevcut. Görsel
  yüklenemediğinde metin basılmaya devam ediyor. Aşırı uzun metin için kesme yerine uyarı.
- Sonrasında mobil tablo ve bildirim düzeltmeleri masaüstü 1920×800 ve mobil
  390×844 üzerinde kontrol edildi; uzun bölünmeyen metinlerle OVERFLOW [].
- Son mobil akış testi: not → etiket → not, her istekte tek print çağrısı;
  afterprint sonrası alan temizlendi; uzun not uyarısı doğru testID ile göründü.
- Ara self-testlerde iki afterprint zaman aşımı görüldü. Olay izleme ve son
  üçlü ardışık testte tekrar etmedi; kanıtlanmamış StrictMode/AuthContext önerisi
  uygulanmadı, giriş kodu değişmedi. Tekrarlanırsa tarayıcı olay iziyle araştırılmalı.
- `yarn build` başarılı. Test siparişleri silindi; yalnızca gerçek #1 ve #2 kaldı.
- Fiziksel yazıcı/kağıt hizalama kontrolü kullanıcıda.
- Hiçbir API MOCKED değil.
- Ödeme düzeltmesi testleri: iteration_2 ilk ödeme kontrolü başarılı ama renk
  kaybından kaydetme engeli buldu; ortak handler düzeltildi. iteration_3 tüm dört
  ödeme tipinde gerçek arayüz düzenle–kaydet–yeniden aç, diğer alanların korunması,
  kasıtlı ödeme değişikliği, iptal, siparişler arası geçiş ve il/ilçe akışını doğruladı.
- iteration_4 yeni sipariş ödeme placeholder/ödeme olmadan kayıt engeli/seçip
  oluşturma/yeniden düzenlemede koruma testlerini tamamladı. Bu kapsamda açık hata yok.
- Yeni sipariş düğmesi için iteration_3'teki HIGH bulgu geçici giriş bildiriminin
  zorlanmış test tıklamasını yakalamasından kaynaklandı; iteration_4 ile uygulama
  hatası olmadığı doğrulandı. Testler üst menü tıklamasından önce bildirimi beklemeli.
- Backend pytest6/6 başarılı (`backend/tests/test_payment_persistence.py`),
  masaüstü1920×800 ve mobil390×844 ödeme bölümü kontrolleri taşmasız; derleme başarılı.
- Ödeme testlerinin geçici kayıtları temizlendi. Gerçek sipariş içerikleri değiştirilmedi.

## Öncelikli işler
- Güncel talep tamamlandı: Etiket ve boş not düzeltmeleri test agent ile doğrulandı.
- P0: Açık ödeme tipi hatası kalmadı; kullanıcı doğrulaması bekleniyor.
- P1 (önceki): Kullanıcı yönetimi/sütun görünürlüğü için kapsamlı frontend E2E.
- P1: Kullanıcının fiziksel yazıcıda örnek çıktı kontrolü.
- P2: Kullanıcı isterse uygulama içi yazdırma önizlemesi.