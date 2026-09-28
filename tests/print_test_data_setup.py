import json
import os
from pathlib import Path
import requests


def _load_backend_url_from_frontend_env():
    env_path = Path("/app/frontend/.env")
    if not env_path.exists():
        raise RuntimeError("frontend/.env not found")
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            value = line.split("=", 1)[1].strip()
            if not value:
                raise RuntimeError("REACT_APP_BACKEND_URL is empty in frontend/.env")
            return value.rstrip("/")
    raise RuntimeError("REACT_APP_BACKEND_URL not found in frontend/.env")


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").strip().rstrip("/") or _load_backend_url_from_frontend_env()
API_URL = f"{BASE_URL}/api"
OUTPUT_PATH = "/app/test_reports/print_temp_orders.json"


def create_order(payload):
    response = requests.post(f"{API_URL}/orders", json=payload, timeout=30)
    response.raise_for_status()
    return response.json()


def main():
    # Two-product order with long realistic address and Turkish/multiline note
    order_two_product = {
        "first_name": "TEST_Print",
        "last_name": "IkiUrun",
        "phone": "905551112233",
        "tc_no": None,
        "email": "test.print@example.com",
        "is_international": False,
        "country": None,
        "province": "İstanbul",
        "district": "Kadıköy",
        "address": "TEST Mahallesi Uzun Sokak No:123 Daire:45 Kat:6 Blok:B İstanbul Türkiye Ayrıntılı adres satırı yazdırma testi",
        "cargo_company": "DHL",
        "product_type": "LED Lamba",
        "base_selection": "Ahşap",
        "color": "Beyaz",
        "customization": "Ürün 1 yazısı",
        "base_text": "Altlık 1",
        "has_second_product": True,
        "second_product_type": "Papatya Buketi",
        "second_base_selection": "Metal",
        "second_color": "Kırmızı",
        "second_customization": "Ürün 2 yazısı",
        "second_base_text": "Altlık 2",
        "payment_type": "Havale",
        "amount": 1299.9,
        "gift_package": True,
        "order_note": "Merhaba\nTürkçe karakter testi: ğüşiöç İĞÜŞÖÇ\nUzun not satırı testi için buradayız."
    }

    # Single product with second_* fields populated but has_second_product=false
    order_single_product = {
        "first_name": "TEST_Print",
        "last_name": "TekUrun",
        "phone": "905559998877",
        "tc_no": None,
        "email": None,
        "is_international": False,
        "country": None,
        "province": "İstanbul",
        "district": "Üsküdar",
        "address": "TEST kısa adres",
        "cargo_company": "Aras",
        "product_type": "Çiçek",
        "base_selection": None,
        "color": None,
        "customization": "",
        "base_text": None,
        "has_second_product": False,
        "second_product_type": "Asla görünmemeli",
        "second_base_selection": "Asla görünmemeli",
        "second_color": "Asla görünmemeli",
        "second_customization": "Asla görünmemeli",
        "second_base_text": "Asla görünmemeli",
        "payment_type": "Nakit",
        "amount": 250,
        "gift_package": False,
        "order_note": "   "
    }

    # Very long unbroken note text expected to overflow and trigger toast
    long_unbroken = "X" * 2200
    order_overflow_note = {
        "first_name": "TEST_Print",
        "last_name": "Overflow",
        "phone": "905550001122",
        "tc_no": None,
        "email": None,
        "is_international": False,
        "country": None,
        "province": "İstanbul",
        "district": "Beşiktaş",
        "address": "TEST overflow address",
        "cargo_company": "MNG",
        "product_type": "LED Lamba",
        "base_selection": "Ahşap",
        "color": "Mavi",
        "customization": "Overflow",
        "base_text": "Overflow",
        "has_second_product": False,
        "second_product_type": None,
        "second_base_selection": None,
        "second_color": None,
        "second_customization": None,
        "second_base_text": None,
        "payment_type": "Kart",
        "amount": 999,
        "gift_package": False,
        "order_note": long_unbroken
    }

    created = {
        "two_product": create_order(order_two_product),
        "single_product": create_order(order_single_product),
        "overflow_note": create_order(order_overflow_note),
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(created, f, ensure_ascii=False, indent=2)

    print(json.dumps({"created_order_nos": {k: v.get("order_no") for k, v in created.items()}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
