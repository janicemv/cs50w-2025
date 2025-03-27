from django.urls import path
from . import views # . = this directory

urlpatterns = [
    path("", views.index, name="index"),
]