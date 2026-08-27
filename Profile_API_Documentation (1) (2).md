# Profile API Documentation

Base URL (Development): `http://localhost:5000`

---

## 📋 ملخص سريع (Quick Reference)

| Method | Endpoint | الوصف | يحتاج توكن؟ |
|---|---|---|---|
| `GET` | `/api/v1/profile` | جلب بيانات البروفايل الحالي | ✅ |
| `PUT` | `/api/v1/profile` | تعديل بيانات البروفايل (نص و/أو صورة) | ✅ |

> ℹ️ endpoints تسجيل الدخول/التسجيل (`/api/auth/...`) موثقة بملف منفصل من قبل المسؤول عن جزء الـ Auth.

---

## المصادقة (Authentication)

كل الـ endpoints تحت لازم Header التالي بكل طلب:

```
Authorization: Bearer <token>
```

التوكن بيوصلكم من endpoints الـ Auth (تسجيل دخول). بدون توكن صحيح، أي طلب بيرجع:

```json
// 401 Unauthorized
{
  "message": "Not authorized, no token provided"
}
```

---

## 1. جلب بيانات البروفايل

يرجع بيانات المستخدم الحالي (المسجل دخوله عبر التوكن).

**`GET /api/v1/profile`**

### Headers
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token>` |

### Response — نجاح (200)
```json
{
  "success": true,
  "user": {
    "_id": "6a7c2c18ff6908c892b60053",
    "fullName": "Ahmad Khalil",
    "username": "ahmad_khalil99",
    "email": "test@example.com",
    "role": "CLIPPER",
    "profilePicture": "default-avatar.png",
    "phoneCountryCode": "+970",
    "phoneNumber": "599123456",
    "country": "PS",
    "city": "Ramallah",
    "interests": ["TECHNOLOGY", "HEALTH"],
    "dateOfBirth": "1998-05-20T00:00:00.000Z",
    "bio": "مطور Backend شغوف بالتعلم المستمر.",
    "isVerified": true,
    "createdAt": "2026-08-12T08:17:28.481Z",
    "updatedAt": "2026-08-12T08:50:26.222Z"
  }
}
```

### Response — بدون توكن أو توكن غلط (401)
```json
{
  "message": "Not authorized, no token provided"
}
```

---

## 2. تعديل بيانات البروفايل

بيعدل الحقول المرسلة بس — أي حقل ما يترسل بيضل متل ما هو محفوظ.

**`PUT /api/v1/profile`**

### Headers
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token>` |

### الحقول القابلة للتعديل

| الحقل | النوع | إلزامي؟ | الشروط |
|---|---|---|---|
| `fullName` | String | لأ | 2-50 حرف، حروف عربي/إنجليزي بس (يسمح بمسافة، شرطة `-`، فاصلة عليا `'`، نقطة `.`) |
| `username` | String | لأ | 3-20 حرف، حروف إنجليزي وأرقام و underscore بس (`_`). **لازم يكون فريد** — ما فيه مستخدمين اثنين بنفس الـ username. بينحفظ دايمًا بحروف صغيرة (lowercase) بغض النظر كيف انبعت |
| `country` | String | لأ | بلد السكن — كود دولة بصيغة ISO 3166-1 alpha-2 (مثلاً `PS`, `JO`, `US`...). **مستقل تمامًا عن رقم الهاتف** |
| `phoneCountryCode` | String | لأ (إلزامي لو بعتّوا `phoneNumber`) | مقدمة الاتصال الدولي، لازم تبلش بـ `+` وبعدها 1-4 أرقام (مثلاً `+970`, `+962`, `+1`) |
| `phoneNumber` | String | لأ | لازم يترسل مع `phoneCountryCode` بنفس الطلب، ولازم يكون رقم صحيح لتلك المقدمة بالتحديد. **الرقم المحلي بس، بدون المقدمة** |
| `city` | String | لأ | 2-50 حرف، حروف عربي/إنجليزي بس |
| `profilePicture` | String (URL) **أو** File | لأ | إما رابط صورة صحيح (JSON)، أو ملف صورة فعلي (form-data) — مش الاثنين مع بعض |
| `interests` | Array of String | لأ | مصفوفة من القيم المسموحة بس (شوف الجدول تحت). فيها تكون فاضية `[]`، فيها وحدة، أو أكتر، أو الست كلهم |
| `dateOfBirth` | String (تاريخ) | لأ | صيغة `YYYY-MM-DD`، لازم يكون تاريخ حقيقي، مش بالمستقبل، والعمر الناتج **13 سنة فأكتر** |
| `bio` | String | لأ | نص حر، حد أقصى **300 حرف** |

⚠️ **مهم:** `country` (بلد السكن) و `phoneCountryCode` (مقدمة الهاتف) **حقلين منفصلين كليًا** — المستخدم ممكن يكون ساكن بدولة ورقم هاتفه من دولة تانية. ما تفترضوا إنهم لازم يتطابقوا.

### القيم المسموحة لحقل `interests`

| القيمة (بترسل هيك بالـ API) | المعنى بالعربي |
|---|---|
| `LIFESTYLE` | نمط الحياة |
| `TECHNOLOGY` | التكنولوجيا |
| `EDUCATION` | التعليم |
| `ENTERTAINMENT` | الترفيه |
| `FINANCE` | المالية |
| `HEALTH` | الصحة |

⚠️ أي قيمة مش من هالست بترجع خطأ فاليديشن (400).

⚠️ **مهم:** `interests` بتتحدث **باستبدال كامل**، مش إضافة. يعني لو المستخدم عنده `["TECHNOLOGY", "HEALTH"]` وبعتوا `["FINANCE"]`، النتيجة النهائية بتصير `["FINANCE"]` بس (مش الثلاثة مع بعض). فلو بدكم تضيفوا اهتمام واحد لقائمة موجودة، لازم تبعتوا القائمة الكاملة (القديمة + الجديد).

⚠️ **حقول ممنوع تعديلها من هالـ endpoint** (لأسباب أمان): `email`, `role`, `password`, `isVerified`

---

### الحالة أ) تعديل بيانات نصية فقط (بدون صورة)

**Body → JSON**
```json
{
  "fullName": "Ahmad Khalil",
  "username": "ahmad_khalil99",
  "country": "PS",
  "phoneCountryCode": "+970",
  "phoneNumber": "599123456",
  "city": "Ramallah",
  "interests": ["TECHNOLOGY", "HEALTH"],
  "dateOfBirth": "1998-05-20",
  "bio": "مطور Backend شغوف بالتعلم المستمر."
}
```

### الحالة ب) تعديل مع رفع صورة من الجهاز

**Body → form-data** (Content-Type: `multipart/form-data`)

| Key | Type | Value |
|---|---|---|
| `fullName` | Text | Ahmad Khalil |
| `profilePicture` | **File** | (اختيار ملف صورة) |

**شروط الصورة:**
- الأنواع المسموحة: `jpeg`, `jpg`, `png`, `webp`
- الحجم الأقصى: **5MB**

### Response — نجاح (200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "6a7c2c18ff6908c892b60053",
    "fullName": "Ahmad Khalil",
    "username": "ahmad_khalil99",
    "email": "test@example.com",
    "role": "CLIPPER",
    "profilePicture": "/uploads/profile-pictures/6a7c2c18ff-1719999999999.jpg",
    "phoneCountryCode": "+970",
    "phoneNumber": "599123456",
    "country": "PS",
    "city": "Ramallah",
    "interests": ["TECHNOLOGY", "HEALTH"],
    "dateOfBirth": "1998-05-20T00:00:00.000Z",
    "bio": "مطور Backend شغوف بالتعلم المستمر."
  }
}
```

> ملاحظة: لو الصورة اترفعت كملف، `profilePicture` بيرجع كـ **مسار نسبي** (مش رابط كامل). لعرضها بالفرونت إند، لازم تضيفوا الـ base URL قبلها:
> ```
> http://localhost:5000/uploads/profile-pictures/6a7c2c18ff-1719999999999.jpg
> ```

### Response — خطأ فاليديشن (400)
```json
{
  "success": false,
  "errors": [
    { "field": "phoneNumber", "message": "Phone number is not valid for the given country code (+970)" },
    { "field": "phoneCountryCode", "message": "Country code must start with + followed by 1 to 4 digits (e.g. +970)" },
    { "field": "fullName", "message": "Full name must contain letters only" },
    { "field": "username", "message": "This username is already taken" },
    { "field": "interests", "message": "Invalid interests: SPORTS" },
    { "field": "dateOfBirth", "message": "User must be at least 13 years old" },
    { "field": "bio", "message": "Bio must not exceed 300 characters" }
  ]
}
```
*(هالمثال يجمع كل أنواع الأخطاء الممكنة سوا للتوضيح بس — بالواقع بترجع بس الأخطاء يلي فعليًا صارت بالطلب)*

### Response — بدون توكن (401)
```json
{
  "message": "Not authorized, no token provided"
}
```

---

## ملاحظات مهمة للفرونت إند

1. **رقم الهاتف والمقدمة مرتبطين ببعض** — لازم ترسلوهم مع بعض بنفس الطلب دايمًا لو بدكم تعدلوا أي منهم (حتى لو بس الرقم تغيّر، ابعتوا المقدمة الحالية معه). **هاد الحقل مستقل عن `country`** (بلد السكن).

2. **الأخطاء بترجع كمصفوفة** — ممكن يكون فيه أكتر من خطأ بنفس الوقت، لازم تعرضوهم كلهم للمستخدم مش بس أول وحدة.

3. **الصورة: رابط أو ملف، مش الاثنين** — لو بعتوا الاثنين بنفس الطلب بالغلط، الملف المرفوع بياخد الأولوية.

4. **تاريخ الميلاد** — لازم تبعتوه بصيغة `YYYY-MM-DD` (مثلاً `1998-05-20`). النظام بيتحقق تلقائيًا إنو مش بالمستقبل وإنو العمر 13 سنة فأكتر.

5. **البايو** — عداد حرف بالفرونت إند (300 حرف حد أقصى) بيحسّن تجربة المستخدم، بس التحقق الفعلي دايمًا بيصير بالسيرفر.

6. **اسم المستخدم (username)** — فحص التفرد بيصير بالسيرفر مباشرة (real-time لحظة الإرسال، مش قبله). لو بدكم تجربة أفضل للمستخدم، ممكن تعملوا استدعاء منفصل يتحقق من توفر الاسم أثناء الكتابة (debounced check) — احكوا معي لو بدكم هيك endpoint إضافي.

7. **حالياً الـ Base URL محلي** (`localhost:5000`) — لما ينرفع المشروع (deployment)، هالرابط رح يتغير، وقتها هحدثلكم الملف.

---

*آخر تحديث: حسب الكود المختبر والمجرب فعليًا (35 اختبار آلي ناجح + تجربة يدوية) — كل الأمثلة فوق حقيقية.*