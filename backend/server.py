from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_no: Optional[int] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Kişisel Bilgiler
    first_name: str
    last_name: str
    phone: str
    tc_no: Optional[str] = None
    email: Optional[str] = None
    is_international: bool = False
    country: Optional[str] = None
    
    # Kargo ve Adres
    province: str
    district: str
    address: str
    cargo_company: str
    
    # Ürün Bilgileri
    product_type: str
    base_selection: Optional[str] = None
    color: Optional[str] = None
    customization: Optional[str] = None
    base_text: Optional[str] = None
    
    # 2. Ürün Bilgileri
    has_second_product: bool = False
    second_product_type: Optional[str] = None
    second_base_selection: Optional[str] = None
    second_color: Optional[str] = None
    second_customization: Optional[str] = None
    second_base_text: Optional[str] = None
    
    # Ödeme Bilgileri
    payment_type: str
    amount: float
    gift_package: bool = False
    order_note: Optional[str] = None
    
    # Durum
    status: str = "Yeni Sipariş"

class OrderCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    tc_no: Optional[str] = None
    email: Optional[str] = None
    is_international: bool = False
    country: Optional[str] = None
    province: str
    district: str
    address: str
    cargo_company: str
    product_type: str
    base_selection: Optional[str] = None
    color: Optional[str] = None
    customization: Optional[str] = None
    base_text: Optional[str] = None
    has_second_product: bool = False
    second_product_type: Optional[str] = None
    second_base_selection: Optional[str] = None
    second_color: Optional[str] = None
    second_customization: Optional[str] = None
    second_base_text: Optional[str] = None
    payment_type: str
    amount: float
    gift_package: bool = False
    order_note: Optional[str] = None

class OrderUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    tc_no: Optional[str] = None
    email: Optional[str] = None
    is_international: Optional[bool] = None
    country: Optional[str] = None
    province: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    cargo_company: Optional[str] = None
    product_type: Optional[str] = None
    base_selection: Optional[str] = None
    color: Optional[str] = None
    customization: Optional[str] = None
    base_text: Optional[str] = None
    has_second_product: Optional[bool] = None
    second_product_type: Optional[str] = None
    second_base_selection: Optional[str] = None
    second_color: Optional[str] = None
    second_customization: Optional[str] = None
    second_base_text: Optional[str] = None
    payment_type: Optional[str] = None
    amount: Optional[float] = None
    gift_package: Optional[bool] = None
    order_note: Optional[str] = None
    status: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str


# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    role: str = "user"  # admin or user
    visible_columns: List[str] = Field(default_factory=list)  # Columns user can see in the table
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"
    visible_columns: Optional[List[str]] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    visible_columns: Optional[List[str]] = None

class LoginRequest(BaseModel):
    username: str
    password: str


# Available columns for visibility configuration
ALL_COLUMNS = [
    "order_no", "date", "name", "phone", "province", "payment_type", 
    "amount", "status", "cargo_company", "actions", "features", "order_note"
]


# Password hashing utilities
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


# Türkiye İl ve İlçe verileri - 81 İl (İstanbul en üstte, diğerleri alfabetik, ilçeler alfabetik)
TURKEY_PROVINCES = {
    "İstanbul": sorted(["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"]),
    "Adana": sorted(["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"]),
    "Adıyaman": sorted(["Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Merkez", "Samsat", "Sincik", "Tut"]),
    "Afyonkarahisar": sorted(["Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Merkez", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"]),
    "Ağrı": sorted(["Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Merkez", "Patnos", "Taşlıçay", "Tutak"]),
    "Aksaray": sorted(["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi"]),
    "Amasya": sorted(["Göynücek", "Gümüşhacıköy", "Hamamözü", "Merkez", "Merzifon", "Suluova", "Taşova"]),
    "Ankara": sorted(["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"]),
    "Antalya": sorted(["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"]),
    "Ardahan": sorted(["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"]),
    "Artvin": sorted(["Ardanuç", "Arhavi", "Borçka", "Hopa", "Merkez", "Murgul", "Şavşat", "Yusufeli"]),
    "Aydın": sorted(["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"]),
    "Balıkesir": sorted(["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"]),
    "Bartın": ["Merkez", "Amasra", "Kurucaşile", "Ulus"],
    "Batman": ["Merkez", "Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Sason"],
    "Bayburt": ["Merkez", "Aydıntepe", "Demirözü"],
    "Bilecik": ["Merkez", "Bozüyük", "Gölpazarı", "İnhisar", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
    "Bingöl": ["Merkez", "Adaklı", "Genç", "Karlıova", "Kiğı", "Solhan", "Yayladere", "Yedisu"],
    "Bitlis": ["Merkez", "Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Mutki", "Tatvan"],
    "Bolu": ["Merkez", "Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Mudurnu", "Seben", "Yeniçağa"],
    "Burdur": ["Merkez", "Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Tefenni", "Yeşilova"],
    "Bursa": ["Osmangazi", "Nilüfer", "Yıldırım", "Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Orhaneli", "Orhangazi", "Yenişehir"],
    "Çanakkale": ["Merkez", "Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Yenice"],
    "Çankırı": ["Merkez", "Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Orta", "Şabanözü", "Yapraklı"],
    "Çorum": ["Merkez", "Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
    "Denizli": ["Merkezefendi", "Pamukkale", "Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Sarayköy", "Serinhisar", "Tavas"],
    "Diyarbakır": ["Bağlar", "Kayapınar", "Sur", "Yenişehir", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kocaköy", "Kulp", "Lice", "Silvan"],
    "Düzce": ["Merkez", "Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Yığılca"],
    "Edirne": ["Merkez", "Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Süloğlu", "Uzunköprü"],
    "Elazığ": ["Merkez", "Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Palu", "Sivrice"],
    "Erzincan": ["Merkez", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
    "Erzurum": ["Yakutiye", "Palandöken", "Aziziye", "Aşkale", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere"],
    "Eskişehir": ["Odunpazarı", "Tepebaşı", "Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Sarıcakaya", "Seyitgazi", "Sivrihisar"],
    "Gaziantep": ["Şahinbey", "Şehitkamil", "Oğuzeli", "Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Yavuzeli"],
    "Giresun": ["Merkez", "Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
    "Gümüşhane": ["Merkez", "Kelkit", "Köse", "Kürtün", "Şiran", "Torul"],
    "Hakkari": ["Merkez", "Çukurca", "Şemdinli", "Yüksekova"],
    "Hatay": ["Antakya", "Defne", "Arsuz", "Altınözü", "Belen", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
    "Iğdır": ["Merkez", "Aralık", "Karakoyunlu", "Tuzluca"],
    "Isparta": ["Merkez", "Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
    "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Gaziemir", "Bayraklı", "Balçova", "Narlıdere", "Aliağa", "Bayındır", "Bergama", "Beydağ", "Çeşme", "Dikili", "Foça", "Karaburun", "Kemalpaşa", "Kınık", "Kiraz", "Menderes", "Menemen", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla", "Güzelbahçe", "Karabağlar"],
    "Kahramanmaraş": ["Dulkadiroğlu", "Onikişubat", "Afşin", "Andırın", "Çağlayancerit", "Ekinözü", "Elbistan", "Göksun", "Nurhak", "Pazarcık", "Türkoğlu"],
    "Karabük": ["Merkez", "Eflani", "Eskipazar", "Ovacık", "Safranbolu", "Yenice"],
    "Karaman": ["Merkez", "Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Sarıveliler"],
    "Kars": ["Merkez", "Akyaka", "Arpaçay", "Digor", "Kağızman", "Sarıkamış", "Selim", "Susuz"],
    "Kastamonu": ["Merkez", "Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Pınarbașı", "Seydiler", "Șenpazar", "Taşköprü", "Tosya"],
    "Kayseri": ["Melikgazi", "Kocasinan", "Talas", "Hacılar", "Akkışla", "Bünyan", "Develi", "Felahiye", "İncesu", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Tomarza", "Yahyalı", "Yeşilhisar"],
    "Kilis": ["Merkez", "Elbeyli", "Musabeyli", "Polateli"],
    "Kırıkkale": ["Merkez", "Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Sulakyurt", "Yahşihan"],
    "Kırklareli": ["Merkez", "Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Pehlivanköy", "Pınarhisar", "Vize"],
    "Kırşehir": ["Merkez", "Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Mucur"],
    "Kocaeli": ["İzmit", "Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
    "Konya": ["Meram", "Selçuklu", "Karatay", "Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Kulu", "Sarayönü", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
    "Kütahya": ["Merkez", "Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"],
    "Malatya": ["Battalgazi", "Yeşilyurt", "Akçadağ", "Arapgir", "Arguvan", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan"],
    "Manisa": ["Yunusemre", "Şehzadeler", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Turgutlu"],
    "Mardin": ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
    "Mersin": ["Akdeniz", "Mezitli", "Toroslar", "Yenişehir", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mut", "Silifke", "Tarsus"],
    "Muğla": ["Menteşe", "Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
    "Muş": ["Merkez", "Bulanık", "Hasköy", "Korkut", "Malazgirt", "Varto"],
    "Nevşehir": ["Merkez", "Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Ürgüp"],
    "Niğde": ["Merkez", "Altunhisar", "Bor", "Çamardı", "Çiftlik", "Ulukışla"],
    "Ordu": ["Altınordu", "Akkuş", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Perşembe", "Ulubey", "Ünye"],
    "Osmaniye": ["Merkez", "Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Sumbas", "Toprakkale"],
    "Rize": ["Merkez", "Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Pazar"],
    "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Söğütlü", "Taraklı"],
    "Samsun": ["İlkadım", "Atakum", "Canik", "Tekkeköy", "Alaçam", "Asarcık", "Ayvacık", "Bafra", "Çarşamba", "Havza", "Kavak", "Ladik", "Ondokuzmayıs", "Salıpazarı", "Terme", "Vezirköprü", "Yakakent"],
    "Şanlıurfa": ["Eyyübiye", "Haliliye", "Karaköprü", "Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Harran", "Hilvan", "Siverek", "Suruç", "Viranşehir"],
    "Siirt": ["Merkez", "Baykan", "Eruh", "Kurtalan", "Pervari", "Şirvan", "Tillo"],
    "Sinop": ["Merkez", "Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Saraydüzü", "Türkeli"],
    "Şırnak": ["Merkez", "Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Silopi", "Uludere"],
    "Sivas": ["Merkez", "Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
    "Tekirdağ": ["Süleymanpaşa", "Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Şarköy"],
    "Tokat": ["Merkez", "Almus", "Artova", "Başçiftlik", "Erbaa", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
    "Trabzon": ["Ortahisar", "Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Şalpazarı", "Sürmene", "Tonya", "Vakfıkebir", "Yomra"],
    "Tunceli": ["Merkez", "Çemişgezek", "Hozat", "Mazgirt", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
    "Uşak": ["Merkez", "Banaz", "Eşme", "Karahallı", "Sivaslı", "Ulubey"],
    "Van": ["İpekyolu", "Tuşba", "Edremit", "Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Erciş", "Gevaş", "Gürpınar", "Muradiye", "Özalp", "Saray"],
    "Yalova": ["Merkez", "Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Termal"],
    "Yozgat": ["Merkez", "Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Saraykent", "Sarıkaya", "Şefaatli", "Sorgun", "Yenifakılı", "Yerköy"],
    "Zonguldak": ["Merkez", "Alaplı", "Çaycuma", "Devrek", "Gökçebey", "Kilimli", "Kozlu"],
}

# Avrupa Ülkeleri
EUROPEAN_COUNTRIES = [
    "Almanya", "Fransa", "İtalya", "İspanya", "Hollanda", "Belçika", "Yunanistan",
    "Portekiz", "Avusturya", "İsviçre", "İsveç", "Norveç", "Danimarka", "Finlandiya",
    "Polonya", "Çekya", "Macaristan", "Romanya", "Bulgaristan", "Hırvatiya",
    "Sırbistan", "Arnavutluk", "Bosna Hersek", "Slovakya", "Slovenya", "Ukrayna",
    "İngiltere", "İrlanda", "İzlanda", "Lüksemburg"
]


@api_router.get("/")
async def root():
    return {"message": "Sipariş Yönetim Sistemi API"}

@api_router.get("/provinces")
async def get_provinces():
    # İstanbul en üstte, diğerleri alfabetik
    provinces_list = list(TURKEY_PROVINCES.keys())
    if "İstanbul" in provinces_list:
        provinces_list.remove("İstanbul")
        provinces_list = ["İstanbul"] + sorted(provinces_list)
    return {"provinces": provinces_list}

@api_router.get("/districts/{province}")
async def get_districts(province: str):
    if province in TURKEY_PROVINCES:
        return {"districts": TURKEY_PROVINCES[province]}
    return {"districts": []}

@api_router.get("/countries")
async def get_countries():
    return {"countries": EUROPEAN_COUNTRIES}

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    # Get the next order number
    last_order = await db.orders.find_one(sort=[("order_no", -1)])
    next_order_no = 1 if not last_order else (last_order.get("order_no", 0) + 1)
    
    order_dict = order_input.model_dump()
    order_obj = Order(**order_dict, order_no=next_order_no)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = order_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("order_no", -1).to_list(10000)
    
    # Convert ISO string timestamps back to datetime objects
    for order in orders:
        if isinstance(order['timestamp'], str):
            order['timestamp'] = datetime.fromisoformat(order['timestamp'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    
    if isinstance(order['timestamp'], str):
        order['timestamp'] = datetime.fromisoformat(order['timestamp'])
    
    return order

@api_router.put("/orders/{order_id}", response_model=Order)
async def update_order(order_id: str, order_update: OrderUpdate):
    # Get existing order
    existing_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not existing_order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    
    # Update only provided fields
    update_data = order_update.model_dump(exclude_unset=True)
    
    if update_data:
        await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    # Get updated order
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if isinstance(updated_order['timestamp'], str):
        updated_order['timestamp'] = datetime.fromisoformat(updated_order['timestamp'])
    
    return updated_order

@api_router.patch("/orders/{order_id}/status", response_model=Order)
async def update_order_status(order_id: str, status_update: StatusUpdate):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if isinstance(updated_order['timestamp'], str):
        updated_order['timestamp'] = datetime.fromisoformat(updated_order['timestamp'])
    
    return updated_order

@api_router.delete("/orders/{order_id}")
async def delete_order(order_id: str):
    result = await db.orders.delete_one({"id": order_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    
    return {"message": "Sipariş silindi"}


# ==================== Authentication Endpoints ====================

@api_router.post("/auth/login")
async def login(login_data: LoginRequest):
    """Login endpoint - verify username and password"""
    user = await db.users.find_one({"username": login_data.username}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")
    
    # Verify password
    if not verify_password(login_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")
    
    # Remove password from response
    user.pop('password', None)
    
    # Convert datetime to ISO string for response
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at']).isoformat()
    elif isinstance(user.get('created_at'), datetime):
        user['created_at'] = user['created_at'].isoformat()
    
    return user


# ==================== User Management Endpoints ====================

@api_router.get("/users", response_model=List[User])
async def get_users():
    """Get all users (without passwords)"""
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    
    # Convert datetime strings to datetime objects
    for user in users:
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return users

@api_router.post("/users", response_model=User)
async def create_user(user_input: UserCreate):
    """Create a new user"""
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_input.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu kullanıcı adı zaten kullanılıyor")
    
    # Hash password
    hashed_password = hash_password(user_input.password)
    
    # Create user object
    user_dict = user_input.model_dump(exclude={'password'})
    
    # Set default visible columns for new users if not provided
    if user_input.role == 'admin' or not user_input.visible_columns:
        user_dict['visible_columns'] = ALL_COLUMNS
    
    user_obj = User(**user_dict)
    
    # Prepare document for MongoDB
    doc = user_obj.model_dump()
    doc['password'] = hashed_password
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    return user_obj

@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user information"""
    # Get existing user
    existing_user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not existing_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    # Prepare update data
    update_data = user_update.model_dump(exclude_unset=True)
    
    # If password is being updated, hash it
    if 'password' in update_data and update_data['password']:
        update_data['password'] = hash_password(update_data['password'])
    else:
        update_data.pop('password', None)
    
    # If username is being updated, check if it's already taken
    if 'username' in update_data and update_data['username'] != existing_user['username']:
        username_exists = await db.users.find_one({"username": update_data['username']})
        if username_exists:
            raise HTTPException(status_code=400, detail="Bu kullanıcı adı zaten kullanılıyor")
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    # Get updated user
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if isinstance(updated_user.get('created_at'), str):
        updated_user['created_at'] = datetime.fromisoformat(updated_user['created_at'])
    
    return updated_user

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete a user"""
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return {"message": "Kullanıcı silindi"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_create_admin():
    """Create default admin user if not exists"""
    admin_exists = await db.users.find_one({"username": "admin"})
    if not admin_exists:
        admin_user = User(
            username="admin",
            role="admin",
            visible_columns=ALL_COLUMNS
        )
        doc = admin_user.model_dump()
        doc['password'] = hash_password("admin")
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        logger.info("Default admin user created (username: admin, password: admin)")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()