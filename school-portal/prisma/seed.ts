import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function ensureSubjectsForClass(classId: string, subjectNames: string[]) {
  const existing = await prisma.subject.findMany({ where: { classId } });
  const existingNames = new Set(existing.map((s) => s.name));
  const toCreate = subjectNames.filter((n) => !existingNames.has(n));
  if (toCreate.length > 0) {
    await prisma.subject.createMany({
      data: toCreate.map((name) => ({ name, classId })),
    });
  }
  return prisma.subject.findMany({ where: { classId } });
}

async function main() {
  // Get or create class and its subjects
  let classA = await prisma.class.findFirst({ where: { name: 'Grade 10', section: 'A' } });
  if (!classA) {
    classA = await prisma.class.create({ data: { name: 'Grade 10', section: 'A' } });
  }
  const subjects = await ensureSubjectsForClass(classA.id, ['Math', 'Science', 'History']);

  // Upsert user and student profile
  const user = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuv', // placeholder hashed password
      role: 'STUDENT',
    },
    include: { student: true },
  });

  let student = user.student;
  if (!student) {
    student = await prisma.student.create({
      data: {
        userId: user.id,
        fullName: 'Student One',
        classId: classA.id,
      },
    });
  }

  const studentId = student.id;

  // Ensure enrollment
  const existingEnrollment = await prisma.enrollment.findFirst({ where: { studentId, classId: classA.id } });
  if (!existingEnrollment) {
    await prisma.enrollment.create({ data: { studentId, classId: classA.id } });
  }

  // Add or update grades for a term
  for (const subject of subjects) {
    const existing = await prisma.grade.findFirst({
      where: { studentId, subjectId: subject.id, term: '2025-T1' },
    });
    if (!existing) {
      await prisma.grade.create({
        data: {
          studentId,
          subjectId: subject.id,
          score: Math.floor(Math.random() * 20) + 80,
          maxScore: 100,
          term: '2025-T1',
        },
      });
    }
  }

  // Add absences if not present
  const absences = [
    { date: new Date('2025-09-10'), reason: 'Sick', excused: true },
    { date: new Date('2025-09-22'), reason: 'Late', excused: false },
  ];
  for (const a of absences) {
    const exists = await prisma.absence.findFirst({ where: { studentId, date: a.date } });
    if (!exists) {
      await prisma.absence.create({ data: { studentId, ...a } });
    }
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
