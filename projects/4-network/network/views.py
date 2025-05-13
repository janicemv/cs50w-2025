from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User, Post, Follow


def index(request):
    allPosts = Post.objects.all().order_by("id").reverse()

    paginator = Paginator(allPosts, 10)
    pageNumber = request.GET.get('page')
    pagePosts = paginator.get_page(pageNumber)

    return render(request, "network/index.html", {
        "allPosts": allPosts,
        "pagePosts": pagePosts
    })


def profile(request, user_id):
    user = User.objects.get(pk=user_id)
    userPosts = Post.objects.filter(user=user).order_by("id").reverse()

    follower = Follow.objects.filter(follower=user)
    followed = Follow.objects.filter(followed=user)

    isFollowing = False

    if request.user.is_authenticated:
        isFollowing = Follow.objects.filter(follower=request.user, followed=user).exists()


    paginator = Paginator(userPosts, 10)
    pageNumber = request.GET.get('page')
    pagePosts = paginator.get_page(pageNumber)

    return render(request, "network/profile.html", {
        "userPosts": userPosts,
        "pagePosts": pagePosts,
        "username": user.username,
        "follower": follower,
        "followed": followed,
        "isFollowing": isFollowing,
        "userProfile": user
    })

# PAREI AQUI - CONSERTAR FOLLOW E UNFOLLOW
def follow(request):
    userToFollowInfo = request.POST['userToFollow']
    print("userToFollowInfo:", userToFollowInfo)
    loggedUser = User.objects.get(pk=request.user.id)
    userToFollow = User.objects.get(username=userToFollowInfo)
    f = Follow(follower=loggedUser, followed=userToFollow)
    f.save()
    user_id = userToFollow.id
    
    return HttpResponseRedirect(reverse(profile, kwargs={'user_id': user_id}))


def unfollow(request):
    userToFollowInfo = request.POST['userToFollow']
    loggedUser = User.objects.get(pk=request.user.id)
    userToFollow = User.objects.get(username=userToFollowInfo)
    f = Follow.objects.get(follower=loggedUser, followed=userToFollow)
    f.delete()
    user_id = userToFollow.id
    
    return HttpResponseRedirect(reverse(profile, kwargs={'user_id': user_id}))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def newPost(request):
    if request.method =="POST":
        content = request.POST['content']
        user = User.objects.get(pk=request.user.id)
        post = Post(content=content, user=user)
        post.save()

        return HttpResponseRedirect(reverse("index"))