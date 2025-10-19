from django.db import models
from django.conf import settings


class Classroom(models.Model):
    name = models.CharField(max_length=100)
    grade_level = models.PositiveIntegerField(help_text="الصف الدراسي", null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name}{f' - صف {self.grade_level}' if self.grade_level else ''}"


class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name


class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    student_id = models.CharField(max_length=30, unique=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")
    date_of_birth = models.DateField(null=True, blank=True)
    guardian_phone = models.CharField(max_length=20, blank=True)

    def __str__(self) -> str:
        return f"{self.user.get_full_name() or self.user.username} ({self.student_id})"


class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="grades")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="grades")
    score = models.DecimalField(max_digits=5, decimal_places=2)
    term = models.CharField(max_length=50, blank=True, help_text="الفصل/التقييم")
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.student} - {self.subject}: {self.score}"


class Absence(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="absences")
    date = models.DateField()
    excused = models.BooleanField(default=False)
    reason = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"غياب {self.student} بتاريخ {self.date}"
