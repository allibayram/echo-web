import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    tr: {
        translation: {
            "app": {
                "title": "EcoGrade Broker",
                "description": "Dünyanın ilk %100 Laboratuvar kontrollü ve rezerv garantili Sanayi Borsası. İşletmelerin off-grade hammaddelerini likiditeye dönüştürüyor ve tedarikçilerle doğrudan bağlıyoruz.",
                "lab": "Bağımsız Laboratuvar Onaylı",
                "escrow": "%100 Güvenli Escrow",
                "login": "Giriş Yap",
                "register": "Kayıt Ol",
                "panel": "Panel",
                "logout": "Çıkış",
                "sell": "Sat",
                "buy": "Al",
                "home": "Ana Sayfa",
                "promo": "Tanıtım"
            },
            "home": {
                "heroTitle": "Küresel Plastik Ticaret Ağı",
                "heroSubtitle": "Üretim fazlanızı anında likit değere dönüştürün veya EcoGrade Exper Güvencesiyle garantili hammadde alın.",
                "discoverMarket": "Piyasayı Keşfet",
                "boardTitle": "Endüstriyel İşlem Tahtası",
                "boardSubtitle": "Tüm onaylı üretim fazlaları ve off-grade stoklar.",
                "addListing": "Reçine İlanı Ekle",
                "quickBuy": "Hızlı Satın Al",
                "filtering": "Detaylı Filtreleme",
                "materialClass": "Malzeme Sınıfı",
                "polymerType": "Polimer Tipi",
                "mfiLabel": "MFI (Akış İndeksi)",
                "trustLayer": "Güvence Katmanı",
                "lotsFound": "lot bulundu",
                "sortBy": "Sırala",
                "refPrice": "Referans Fiyat",
                "makeOffer": "Teklif Ver",
                "escrowGuarantee": "%100 Escrow Güvencesi"
            },
            "footer": {
                "aboutTitle": "EcoGrade Broker",
                "legalTitle": "Yasal Bilgiler",
                "contactTitle": "İletişim",
                "distanceSales": "Mesafeli Satış Sözleşmesi",
                "kvkk": "Kullanıcı Aydınlatma Metni (KVKK)",
                "privacy": "Gizlilik & Güvenlik Politikası"
            }
        }
    },
    en: {
        translation: {
            "app": {
                "title": "EcoGrade Broker",
                "description": "World's first 100% Lab controlled and reserve-backed B2B Industrial Exchange. We transform off-grade raw materials into liquid assets and connect them directly with suppliers.",
                "lab": "Independent Lab Verified",
                "escrow": "100% Secure Escrow",
                "login": "Login",
                "register": "Register",
                "panel": "Dashboard",
                "logout": "Logout",
                "sell": "Sell",
                "buy": "Buy",
                "home": "Home",
                "promo": "Promo"
            },
            "home": {
                "heroTitle": "Global Plastics Trading Network",
                "heroSubtitle": "Instantly convert your production surplus into liquid value or purchase guaranteed raw materials with EcoGrade Expert Assurance.",
                "discoverMarket": "Explore Market",
                "boardTitle": "Industrial Trading Board",
                "boardSubtitle": "All verified production surplus and off-grade stocks.",
                "addListing": "Add Resin Listing",
                "quickBuy": "Quick Purchase",
                "filtering": "Advanced Filtering",
                "materialClass": "Material Class",
                "polymerType": "Polymer Type",
                "mfiLabel": "MFI (Flow Index)",
                "trustLayer": "Trust Layer",
                "lotsFound": "lots found",
                "sortBy": "Sort",
                "refPrice": "Reference Price",
                "makeOffer": "Make Offer",
                "escrowGuarantee": "100% Escrow Guarantee"
            },
            "footer": {
                "aboutTitle": "EcoGrade Broker",
                "legalTitle": "Legal Information",
                "contactTitle": "Contact",
                "distanceSales": "Distance Sales Agreement",
                "kvkk": "Data Protection Notice (GDPR)",
                "privacy": "Privacy & Security Policy"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "tr",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
