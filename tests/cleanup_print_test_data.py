import os
from pathlib import Path
import requests


def _load_backend_url_from_frontend_env():
    env_path = Path("/app/frontend/.env")
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            value = line.split("=", 1)[1].strip()
            if value:
                return value.rstrip("/")
    raise RuntimeError("REACT_APP_BACKEND_URL not found")


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").strip().rstrip("/") or _load_backend_url_from_frontend_env()
API_URL = f"{BASE_URL}/api"


def main():
    response = requests.get(f"{API_URL}/orders", timeout=30)
    response.raise_for_status()
    orders = response.json()

    targets = [o for o in orders if o.get("first_name") == "TEST_Print"]
    print(f"Found {len(targets)} temporary orders")

    for order in targets:
        oid = order.get("id")
        order_no = order.get("order_no")
        if not oid:
            continue
        del_res = requests.delete(f"{API_URL}/orders/{oid}", timeout=30)
        print(f"delete order_no={order_no} status={del_res.status_code}")


if __name__ == "__main__":
    main()
