# تحديث الدفع: PayPal و Moyasar

هذا الملف يشرح **فقط ما تغيّر** عمّا أُرسل لكم سابقًا (الـ API Contract القديم + ملف Moyasar).
باقي الـ endpoints والـ Authentication وسجل المعاملات كما هي.

---

## الملخص

| البوابة | هل يلزم تعديل في الفرونت؟ | ما المطلوب |
|---|---|---|
| **PayPal** | **نعم (مهم)** | استدعاء endpoint جديد في صفحة النجاح: `POST /wallet/paypal/capture` |
| **Moyasar** | **نعم (بسيط)** | في صفحة النجاح: تكرار السؤال عن حالة المعاملة (polling) بدل سؤال واحد |

---

## 1) PayPal

### ما الذي تغيّر؟
سابقًا كانت العملية تبقى `PENDING` حتى بعد أن يدفع المستخدم، لأن الباك اند كان ينتظر إشعارًا لا يصل أبدًا قبل تأكيد الدفع.
الآن **الفرونت هو الذي يؤكد الدفع** باستدعاء الـ endpoint الجديد في صفحة النجاح. (الـ webhook ما زال موجودًا كشبكة أمان في الباك اند فقط.)

> `POST /wallet/fund` و `redirectUrl`: **لم يتغيرا**.

### التدفق

```
1. POST /wallet/fund { amount, paymentMethod: "PAYPAL" }   ← كما كان
2. window.location = redirectUrl                           ← كما كان
3. المستخدم يوافق ← PayPal يحوّله إلى:
   /advertiser/wallet/payment/success?token=XXXX&PayerID=YYYY
4. (جديد) في صفحة النجاح: POST /wallet/paypal/capture { orderId: token }
```

### الطلب الجديد

```
POST /api/v1/wallet/paypal/capture
Authorization: Bearer <JWT>
```
```json
{ "orderId": "84X597012W6425428" }
```

`orderId` = قيمة `token` الموجودة في رابط صفحة النجاح (وليست `transactionId`).

### الردود

| الحالة | الرد | ماذا تفعلون |
|---|---|---|
| تم الدفع | `200` — `{ "data": { "transactionId": "...", "status": "COMPLETED" } }` | اعرضوا رسالة نجاح، وحدّثوا الرصيد بـ `GET /wallet` |
| الصفحة حُدّثت (Refresh) | `200` — نفس الرد مع `"alreadyCompleted": true` | نفس رسالة النجاح، الرصيد لا يتكرر |
| ما زال قيد المعالجة | `200` — `"status": "PENDING"` | اعرضوا "جاري المعالجة" وكرروا السؤال عن حالة المعاملة (انظر polling أدناه) |
| المستخدم لم يوافق على الدفع | `409` — `code: "CONFLICT"` | اعرضوا `message` وخيار "حاول مجددًا" |
| `orderId` غير موجود أو لمستخدم آخر | `404` — `NOT_FOUND` | رسالة خطأ |
| `orderId` مفقود | `400` — `VALIDATION_ERROR` | رسالة خطأ |

### مثال كود (صفحة النجاح)

```javascript
const params  = new URLSearchParams(window.location.search);
const orderId = params.get('token');

const res  = await fetch('/api/v1/wallet/paypal/capture', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ orderId }),
});
const json = await res.json();

if (res.ok && json.data.status === 'COMPLETED') {
  // نجاح: اعرض الرسالة وحدّث الرصيد (GET /wallet)
} else if (res.ok && json.data.status === 'PENDING') {
  // قيد المعالجة: استخدم pollTransaction(json.data.transactionId) (انظر Moyasar)
} else if (res.status === 409) {
  // لم تتم الموافقة على الدفع: اعرض json.message
} else {
  // خطأ عام
}
```

### ملاحظات
- الاستدعاء **آمن عند التكرار**. إذا كان عندكم React StrictMode وظهر الطلب مرتين في بيئة التطوير فلا مشكلة، لكن يفضل حارس بسيط (`useRef`) حتى لا يُرسل مرتين.
- **لا تستدعوا** `GET /wallet/transactions/:id` بقيمة `token`. هذا رقم طلب PayPal وليس رقم المعاملة (هذا كان سبب خطأ 500 السابق).
- صفحة الإلغاء (`.../payment/cancel`): لا تستدعوا شيئًا، فقط اعرضوا رسالة إلغاء.

---

## 2) Moyasar

### ما الذي تغيّر؟
- طلب الشحن والرد (`invoiceUrl`): **لم يتغيرا**.
- الفرق الوحيد: الرصيد يُضاف عندما يرسل Moyasar إشعارًا للباك اند، وهذا يحدث خلال **ثوانٍ** بعد عودة المستخدم، وليس لحظيًا. لذلك سؤال واحد عن الحالة في صفحة النجاح قد يرجع `PENDING` لأن الإشعار لم يصل بعد.

**المطلوب:** في صفحة النجاح كرّروا السؤال كل 3 ثوانٍ (حتى دقيقة تقريبًا).

### مثال كود (polling)

```javascript
const pollTransaction = async (transactionId, { intervalMs = 3000, maxTries = 20 } = {}) => {
  for (let i = 0; i < maxTries; i++) {
    const res  = await fetch(`/api/v1/wallet/transactions/${transactionId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();

    if (json.success && json.data.status === 'COMPLETED') return json.data;
    if (json.success && json.data.status === 'FAILED')    return json.data;

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null; // لم تكتمل خلال المهلة
};

// في صفحة /wallet/success
const transactionId = localStorage.getItem('pendingTransactionId');
const result = await pollTransaction(transactionId);

if (result?.status === 'COMPLETED') {
  localStorage.removeItem('pendingTransactionId');
  // اعرض رسالة نجاح وحدّث الرصيد (GET /wallet)
} else if (result?.status === 'FAILED') {
  // اعرض رسالة فشل
} else {
  // اعرض: "جاري معالجة الدفع، سيتحدث رصيدك خلال لحظات"
  // مع رابط لصفحة سجل المعاملات
}
```

### تصحيحات على الملف السابق الخاص بـ Moyasar
1. **صفحة الإلغاء (`/wallet/cancel`):** كان مكتوبًا أن المعاملة "ستصير FAILED تلقائيًا". **هذا غير صحيح.** المعاملة تبقى `PENDING`. اعرضوا رسالة إلغاء فقط، وامسحوا `pendingTransactionId`.
2. **لا تعتمدوا** على أي باراميتر يضيفه Moyasar في رابط صفحة النجاح. الحالة الحقيقية تؤخذ دائمًا من `GET /wallet/transactions/:id`.
3. رابط صفحة النجاح كان مكتوبًا في الملف السابق `https://https://...` (تكرار `https`). الرابط الصحيح بدون التكرار. (الباك اند يتأكد من الرابط المضبوط عنده.)
4. الـ `transactionId` ليس UUID بل **MongoDB ObjectId** (24 حرفًا). لا تتحققوا منه بصيغة UUID.

---

## 3) ما يشمل البوابتين

- **المبلغ:** رقم (أو نص رقمي) بين 10 و10000 وبخانتين عشريتين كحد أقصى.
- **كود خطأ جديد:** `409 CONFLICT`، اعرضوا `message` للمستخدم.
- **حالات المعاملة** التي يجب أن تتعامل معها الواجهة: `PENDING` (دفع غير مؤكد، وقد يبقى هكذا لو ترك المستخدم الدفع)، `UNDER_REVIEW`، `COMPLETED`، `FAILED`، `CANCELLED`.
- **أخطاء 500:** الرسالة دائمًا `"Server error"`.

---

## 4) قائمة اختبار سريعة للفرونت

**PayPal (sandbox)**
- [ ] ادفع بحساب buyer ← صفحة النجاح تعرض النجاح والرصيد زاد.
- [ ] حدّث (Refresh) صفحة النجاح ← لا يزيد الرصيد مرة ثانية.
- [ ] اضغط إلغاء في PayPal ← صفحة الإلغاء بدون أخطاء.

**Moyasar (sandbox)**
- [ ] ادفع ببطاقة اختبار ← صفحة النجاح تعرض "جاري المعالجة" ثم تتحول للنجاح.
- [ ] اضغط "رجوع" في صفحة Moyasar ← صفحة الإلغاء، والمعاملة تبقى `PENDING`.

---

## 5) لم يتغير

- شكل الطلب والرد لـ `POST /wallet/fund` (PayPal و Moyasar)
- الـ Authentication (نفس JWT)
- قائمة المعاملات وتفاصيل المعاملة (Moyasar يظهر بـ `paymentMethod: "MOYASAR"`)
- الـ Refund وميزانية الحملات
