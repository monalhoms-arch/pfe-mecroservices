# 🚀 Evolution Manager & WhatsApp Gateway Setup Guide (Evolution API v2)

## English / العربية

**This folder contains everything to run real WhatsApp gateway & auto-send messages from "خدمتي" system.**

هذا المجلد يحتوي على كل ما تحتاجه لتشغيل بوابة واتساب حقيقية وإرسال الرسائل آلياً من نظام "خدمتي".

## 🛠️ خطوات التشغيل

### 1. Start Services (Docker) / تشغيل الخدمات

**English:** Install Docker Desktop (https://www.docker.com/products/docker-desktop/), start it, then run:
```bash
cd evolution-gate
docker compose up -d
```

**Check status:** `docker compose ps` or `docker compose logs evolution_api`

**العربية:** تأكد من تثبيت **Docker Desktop** وتشغيله، ثم:
```bash
cd evolution-gate
docker compose up -d
```
تحقق: `docker compose ps` أو `docker compose logs evolution_api`

### 2. Access Evolution Manager / الوصول للمدير

**English:** Open browser: http://localhost:8080  
**Login first:**  
- Server URL: `http://localhost:8080`  
- API Key Global: `my_evolution_token_123`  
Then go to `/manager`.

**العربية:** افتح المتصفح: http://localhost:8080  
**تسجيل الدخول:**  
- Server URL: `http://localhost:8080`  
- API Key Global: `my_evolution_token_123`  
ثم `/manager`.

### 3. إنشاء نسخة (Instance) وربط الهاتف
*   قم بإنشاء instance جديدة وسمها: `main_instance`.
*   سيظهر لك **QR Code**؛ قم بمسحه من هاتفك (واتساب > الأجهزة المرتبطة > ربط جهاز).
*   بمجرد نجاح الربط، سيصبح هاتفك هو "المرسل" الرسمي للنظام.

## 🔗 الربط مع مشروعك

**API Key source:** evolution-gate/docker-compose.yml (AUTHENTICATION_API_KEY=my_evolution_token_123)

**Integration:** Matches whatsapp/config.py EVOLUTION_API_URL & INSTANCE_NAME=main_instance. Update token if changed.

**العربية:** المفتاح من docker-compose.yml. يطابق إعدادات whatsapp/config.py.

## ✅ الاختبار النهائي
اذهب إلى لوحة التحكم (Dashboard) > تبويب **Marketplace** > فعل مفتاح **"الإرسال الآلي"** > اضغط على أي عامل.
ستجد أن الرسالة وصلت لهاتفه آلياً وبدون فتح أي نافذة!

---
> [!TIP]  
> **Demo tip:** Ensure Docker running & phone online for live QR scan demo.  
> **العربية:** في يوم المناقشة، تأكد من أن Docker يعمل وهاتفك متصل لتجربة مبهرة.

> [!NOTE]  
> Stop: `docker compose down`. Volumes persist postgres data.
