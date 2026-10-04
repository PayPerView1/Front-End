## إشعار فريق الفرونت اند — إضافة Moyasar

---

### ملخص التغييرات

أُضيفت بوابة دفع جديدة **Moyasar** إلى endpoint شحن المحفظة الموجود. لا يوجد endpoint جديد — فقط قيمة جديدة لـ `paymentMethod` وتدفق مختلف قليلاً.

---

### 1. `POST /api/v1/wallet/fund` — تغيير في الـ Request

أُضيفت قيمة جديدة لـ `paymentMethod`:

```json
{
  "amount": 100,
  "paymentMethod": "MOYASAR"
}
```

**القيم المتاحة الآن:**
| paymentMethod | الوصف |
|---|---|
| `PAYPAL` | كما كان — يرجع `redirectUrl` |
| `BANK_TRANSFER` | كما كان — يرجع `bankDetails` |
| `MOYASAR` | جديد — يرجع `invoiceUrl` |

---

### 2. Response عند اختيار Moyasar

```json
{
  "success": true,
  "data": {
    "transactionId": "uuid",
    "paymentMethod": "MOYASAR",
    "grossAmount": 100.00,
    "commissionRate": 0.025,
    "commission": 2.50,
    "netAmount": 97.50,
    "currency": "USD",
    "status": "PENDING",
    "invoiceUrl": "https://moyasar.com/invoice/xxx"
  }
}
```

---

### 3. ما يجب فعله في الفرونت

**الخطوة 1 — إرسال الطلب:**
```javascript
const response = await fetch('/api/v1/wallet/fund', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 100,
    paymentMethod: 'MOYASAR'
  })
});

const data = await response.json();
```

**الخطوة 2 — توجيه المستخدم لصفحة الدفع:**
```javascript
if (data.success) {
  // احفظ transactionId للمتابعة لاحقاً
  localStorage.setItem('pendingTransactionId', data.data.transactionId);

  // حوّل المستخدم لصفحة Moyasar
  window.location.href = data.data.invoiceUrl;
}
```

**الخطوة 3 — صفحة النجاح (`/wallet/success`):**

بعد إتمام الدفع، Moyasar يحوّل المستخدم لهذا الرابط تلقائياً:
```
https://https://front-end-git-develop-jebrilabeds-projects.vercel.app/wallet/success
```

في هذه الصفحة تحقق من حالة الـ transaction:
```javascript
const transactionId = localStorage.getItem('pendingTransactionId');

const response = await fetch(`/api/v1/wallet/transactions/${transactionId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();

if (data.data.status === 'COMPLETED') {
  // أظهر رسالة نجاح + الرصيد الجديد
} else {
  // أظهر "جاري المعالجة..."
  // الـ webhook سيحدّث الرصيد تلقائياً في الخلفية
}
```

**الخطوة 4 — صفحة الإلغاء (`/wallet/cancel`):**

إذا ضغط المستخدم "رجوع" في صفحة Moyasar:
```javascript
// أظهر رسالة "تم إلغاء عملية الدفع"
// الـ transaction سيبقى بحالة PENDING ثم FAILED تلقائياً
localStorage.removeItem('pendingTransactionId');
```


---

### 4. لا يوجد تغيير في

- باقي الـ endpoints — كلها كما هي
- طريقة الـ Authentication — نفس الـ JWT
- صفحة سجل المعاملات — Moyasar يظهر تلقائياً كـ `paymentMethod: "MOYASAR"`
- صفحة تفاصيل المعاملة — نفس الـ endpoint
========================================================================
========================================================================

###  التغييرات الجديدة الأخرى

---

### 1. فلترة سجل المعاملات الكاملة
**التعديل:** 
`GET /api/v1/wallet/transactions` أصبح يقبل فلاتر إضافية:

| Parameter | جديد؟ |
|---|---|
| `type` | كان موجوداً |
| `status` | كان موجوداً |
| `paymentMethod` | **جديد** |
| `dateFrom` | **جديد** |
| `dateTo` | **جديد** |
| `search` | **جديد** (يبحث في referenceId و description) |

نفس الفلاتر تعمل على `GET /api/v1/wallet/transactions/export` أيضاً و كمان export/pdf

---

### 2. رسوم الاسترداد
**التعديل:** 
 **response**  `POST /api/v1/wallet/refund` أصبح يحتوي على:

```json
{
  "amount": 500.00,
  "fee": 12.50,
  "netAmount": 487.50
}
```

**حالياً:** `fee = 0`  — لكن الحقل موجود، لا تتجاهلوه في الـ UI.

---

### 3. تصدير PDF
**التعديل:** endpoint جديد:

```
GET /api/v1/wallet/transactions/export/pdf
```

يقبل نفس فلاتر `export` الموجود. يرجع ملف PDF مباشرة.

```javascript
// مثال
const response = await fetch('/api/v1/wallet/transactions/export/pdf', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
// افتح أو حمّل الملف
```

---

### 4. Moyasar
**التعديل:** موثق في الإشعار السابق — إضافة `paymentMethod: "MOYASAR"` + معالجة `invoiceUrl`.

---

### ملخص ما يحتاج تعديلاً في الفرونت

| # | التعديل | ما يحتاجه الفرونت |
|---|---|---|
| 1 | فلترة المعاملات | إضافة 4 فلاتر جديدة في الـ UI |
| 2 | رسوم الاسترداد | عرض `fee` و `netAmount` في شاشة الاسترداد |
| 3 | تصدير PDF | زر PDF جديد بجانب زر Excel |
| 4 | Moyasar | خيار دفع جديد + معالجة `invoiceUrl` |