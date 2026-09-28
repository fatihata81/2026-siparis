import os
from copy import deepcopy

import pytest
import requests
from dotenv import load_dotenv


load_dotenv("/app/frontend/.env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="session")
def api_base_url():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is missing")
    return BASE_URL.rstrip("/") + "/api"


@pytest.fixture(scope="session")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def temp_order_ids(api_client, api_base_url):
    created_ids = []
    yield created_ids
    for order_id in created_ids:
        api_client.delete(f"{api_base_url}/orders/{order_id}", timeout=20)


def _create_order_payload(payment_type: str, suffix: str):
    return {
        "first_name": f"TEMP_Payment_{suffix}",
        "last_name": "Tester",
        "phone": "905551112233",
        "tc_no": "",
        "email": "",
        "is_international": False,
        "country": "",
        "province": "İstanbul",
        "district": "Kadıköy",
        "address": "TEMP test address",
        "cargo_company": "DHL",
        "product_type": "LED Lamba",
        "base_selection": "Dikdörtgen",
        "color": "Mavi",
        "customization": "TEMP custom text",
        "base_text": "TEMP base",
        "has_second_product": True,
        "second_product_type": "Kupa Bardak",
        "second_base_selection": "",
        "second_color": "",
        "second_customization": "TEMP second customization",
        "second_base_text": "",
        "payment_type": payment_type,
        "amount": 550.0,
        "gift_package": True,
        "order_note": "TEMP note",
    }


# Orders API payment persistence and non-payment field stability checks
class TestPaymentPersistenceAPI:
    def test_existing_orders_1_and_2_have_non_empty_payment_type(self, api_client, api_base_url):
        response = api_client.get(f"{api_base_url}/orders", timeout=20)
        assert response.status_code == 200
        orders = response.json()
        order1 = next((o for o in orders if o.get("order_no") == 1), None)
        order2 = next((o for o in orders if o.get("order_no") == 2), None)

        if not order1 or not order2:
            pytest.skip("order_no #1 or #2 not present in current environment")

        assert isinstance(order1.get("payment_type"), str) and order1["payment_type"].strip() != ""
        assert isinstance(order2.get("payment_type"), str) and order2["payment_type"].strip() != ""

    @pytest.mark.parametrize("payment_type", ["Kapıda Ödeme", "Havale", "Web", "Web Kapıda Ödeme"])
    def test_create_update_unrelated_field_preserves_payment_and_fields(
        self, api_client, api_base_url, temp_order_ids, payment_type
    ):
        payload = _create_order_payload(payment_type, payment_type.replace(" ", "_"))

        create_response = api_client.post(f"{api_base_url}/orders", json=payload, timeout=20)
        assert create_response.status_code == 200
        created = create_response.json()
        order_id = created["id"]
        temp_order_ids.append(order_id)
        assert created["payment_type"] == payment_type

        before_response = api_client.get(f"{api_base_url}/orders/{order_id}", timeout=20)
        assert before_response.status_code == 200
        before = before_response.json()

        update_payload = {
            "amount": 551.0,
            "order_note": f"TEMP note updated for {payment_type}",
        }
        put_response = api_client.put(f"{api_base_url}/orders/{order_id}", json=update_payload, timeout=20)
        assert put_response.status_code == 200
        put_data = put_response.json()
        assert put_data["payment_type"] == payment_type
        assert put_data["amount"] == 551.0

        after_response = api_client.get(f"{api_base_url}/orders/{order_id}", timeout=20)
        assert after_response.status_code == 200
        after = after_response.json()

        assert after["payment_type"] == payment_type
        assert after["amount"] == 551.0
        assert after["order_note"] == f"TEMP note updated for {payment_type}"

        unchanged_fields = [
            "base_selection",
            "district",
            "color",
            "customization",
            "second_product_type",
            "second_customization",
            "gift_package",
            "phone",
            "has_second_product",
            "province",
            "address",
            "cargo_company",
        ]
        for field in unchanged_fields:
            assert after[field] == before[field]

    def test_intentional_payment_change_persists_after_reopen(self, api_client, api_base_url, temp_order_ids):
        initial_payload = _create_order_payload("Havale", "change_flow")
        create_response = api_client.post(f"{api_base_url}/orders", json=initial_payload, timeout=20)
        assert create_response.status_code == 200
        created = create_response.json()
        order_id = created["id"]
        temp_order_ids.append(order_id)

        change_response = api_client.put(
            f"{api_base_url}/orders/{order_id}",
            json={"payment_type": "Web Kapıda Ödeme"},
            timeout=20,
        )
        assert change_response.status_code == 200
        changed = change_response.json()
        assert changed["payment_type"] == "Web Kapıda Ödeme"

        reopen_response = api_client.get(f"{api_base_url}/orders/{order_id}", timeout=20)
        assert reopen_response.status_code == 200
        reopened = reopen_response.json()
        assert reopened["payment_type"] == "Web Kapıda Ödeme"
