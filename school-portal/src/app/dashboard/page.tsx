import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="p-6 text-center">يجب تسجيل الدخول للوصول إلى هذه الصفحة.</div>
    );
  }

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: {
        include: {
          class: true,
          grades: { include: { subject: true } },
          absences: true,
        },
      },
    },
  });

  const student = user?.student;
  if (!student) {
    return <div className="p-6 text-center">لا توجد بيانات طالب.</div>;
  }

  const totalAbsences = student.absences.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">مرحباً، {student.fullName}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">الصف</div>
          <div className="text-lg font-semibold">{student.class.name} - {student.class.section}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">عدد الغيابات</div>
          <div className="text-lg font-semibold">{totalAbsences}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">الفصل الدراسي</div>
          <div className="text-lg font-semibold">2025-T1</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">العلامات</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {student.grades.map((g) => (
            <div key={g.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">المادة</div>
                <div className="font-medium">{g.subject.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">العلامة</div>
                <div className="font-semibold">{g.score} / {g.maxScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
