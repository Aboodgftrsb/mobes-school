from django.contrib import admin

from .models import Classroom, Subject, Student, Grade, Absence


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ("name", "grade_level")


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_id", "user", "classroom")
    search_fields = ("student_id", "user__username", "user__first_name", "user__last_name")
    list_filter = ("classroom",)


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("student", "subject", "score", "term", "date")
    list_filter = ("subject", "term")


@admin.register(Absence)
class AbsenceAdmin(admin.ModelAdmin):
    list_display = ("student", "date", "excused")
    list_filter = ("excused",)
