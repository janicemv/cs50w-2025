from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
import json

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

def newPost(request):
    if request.method =="POST":
        content = request.POST['content']
        user = User.objects.get(pk=request.user.id)
        post = Post(content=content, user=user)
        post.save()

        return HttpResponseRedirect(reverse("index"))

    
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

@login_required
def edit_post(request, post_id):
    if request.method == "POST":
        try:
            post = Post.objects.get(pk=post_id, user=request.user)
        except Post.DoesNotExist:
            return JsonResponse({"success": False, "error": "Post not found."}, status=404)

        data = json.loads(request.body)
        post.content = data.get("content", post.content)
        post.save()

        return JsonResponse({"success": True})
    
    return JsonResponse({"success": False, "error": "Not allowed"}, status=405)

def follow(request, user_id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    userToFollow = get_object_or_404(User, pk=user_id)

    if request.user == userToFollow:
        return JsonResponse({"error": "You cannot follow yourself."}, status=400)
    
    isFollowing = Follow.objects.filter(follower=request.user, followed=userToFollow).exists()

    if isFollowing:
        Follow.objects.filter(follower=request.user, followed=userToFollow).delete()
        action= "unfollowed"
    else:
        Follow.objects.create(follower=request.user, followed=userToFollow)
        action= "followed"
    
    followers_count = Follow.objects.filter(followed=userToFollow).count()

    return JsonResponse({
        "success": True,
        "action": action,
        "followersCount": followers_count,
        "isFollowing": isFollowing
    })

def following(request):
    currentUser = User.objects.get(pk=request.user.id)
    following = Follow.objects.filter(follower=currentUser)

    allPosts = Post.objects.filter(user__in=following.values_list('followed', flat=True)).order_by("id").reverse()
    

    paginator = Paginator(allPosts, 10)
    pageNumber = request.GET.get('page')
    pagePosts = paginator.get_page(pageNumber)

    return render(request, "network/following.html", {
        "allPosts": allPosts,
        "pagePosts": pagePosts
    })

# PAREI AQUI
def like(request, post_id):
    return

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

