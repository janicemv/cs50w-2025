from django.urls import path
from . import views # . = this directory

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:name>", views.greet, name="greet"),
    path("janice", views.janice, name="janice"),
]