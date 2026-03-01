import os
from flask import Flask
from dotenv import load_dotenv

from app.blueprint import register_routing
from app.db import mongo
from app.extention import cors
from app.utils.logging import configure_logging

# Load biến môi trường từ .env hoặc .env.local
# Ưu tiên .env.local nếu có
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
else:
    load_dotenv()

def create_app(settings_module=None):
    app = Flask(__name__)

    # Nếu có settings_module thì load từ đó
    if settings_module:
        app.config.from_object(settings_module)

    # Đảm bảo MONGO_URI được set
    if not app.config.get("MONGO_URI"):
        mongo_uri_env = os.getenv("MONGO_URI")
        if mongo_uri_env:
            app.config["MONGO_URI"] = mongo_uri_env
        else:
            raise ValueError("❌ MONGO_URI chưa được cấu hình. Vui lòng set trong .env hoặc settings module.")

    # Khởi tạo các extension
    mongo.init_app(app)
    cors.init_app(app, supports_credentials=True, resources={r"*": {"origins": "*"}})

    # Cấu hình logging
    configure_logging(app)

    # Đăng ký blueprint
    register_routing(app)

    return app


# Lấy settings_module từ biến môi trường
settings_module = os.getenv("APP_SETTINGS_MODULE")

# Tạo app Flask
app = create_app(settings_module)
