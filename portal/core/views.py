from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse

from .forms import StudentSignupForm
from .models import Student, Grade, Absence


def signup_view(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = StudentSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = StudentSignupForm()

    return render(request, 'core/signup.html', {'form': form})


@login_required
def dashboard_view(request: HttpRequest) -> HttpResponse:
    try:
        student = request.user.student_profile
    except Student.DoesNotExist:
        return redirect('signup')

    grades = Grade.objects.filter(student=student).select_related('subject')
    absences_count = Absence.objects.filter(student=student).count()

    context = {
        'student': student,
        'grades': grades,
        'absences_count': absences_count,
    }
    return render(request, 'core/dashboard.html', context)
