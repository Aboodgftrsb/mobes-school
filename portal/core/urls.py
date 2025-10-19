from django.urls import path
from django.contrib.auth import views as auth_views

from .views import dashboard_view, signup_view

urlpatterns = [
    path('', dashboard_view, name='dashboard'),
    path('signup/', signup_view, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='core/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]
