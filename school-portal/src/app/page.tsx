export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">بوابة المدرسة الحديثة</h1>
        <p className="mt-4 text-gray-600">سجل دخولك للاطلاع على العلامات والغيابات</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-900" href="/login">تسجيل الدخول</a>
          <a className="px-5 py-2.5 rounded-lg border hover:bg-gray-100" href="/register">إنشاء حساب</a>
        </div>
      </div>
    </div>
  );
}
