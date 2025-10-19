from typing import Any
from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

from .models import Student, Classroom


class StudentSignupForm(UserCreationForm):
    first_name = forms.CharField(label='الاسم', max_length=150, required=False)
    last_name = forms.CharField(label='اللقب', max_length=150, required=False)
    student_id = forms.CharField(label='رقم الطالب', max_length=30)
    classroom = forms.ModelChoiceField(label='الصف', queryset=Classroom.objects.all(), required=False)

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ('username',)
        labels = {
            'username': 'اسم المستخدم',
        }

    def save(self, commit: bool = True) -> Any:
        user = super().save(commit=False)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        if commit:
            user.save()
        # Create student profile
        Student.objects.create(
            user=user,
            student_id=self.cleaned_data['student_id'],
            classroom=self.cleaned_data.get('classroom'),
        )
        return user
