"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import (
    UserViewSet,
    RolViewSet,
    PermisoViewSet,
    RolPermisoViewSet,
    UsuarioRolViewSet,
    BitacoraViewSet,
    ClienteViewSet,
    get_user_permissions,
    registrar_bitacora,
    get_user_info,
    logout_user,
    dashboard_stats,
    change_password,
    forgot_password,
    reset_password,
    user_profile,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r"usuarios", UserViewSet)
router.register(r"roles", RolViewSet)
router.register(r"permisos", PermisoViewSet)
router.register(r"roles-permisos", RolPermisoViewSet)
router.register(r"usuarios-roles", UsuarioRolViewSet)
router.register(r"bitacora", BitacoraViewSet)
router.register(r"clientes", ClienteViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/permisos-usuario/", get_user_permissions, name="permisos_usuario"),
    path("api/registrar-bitacora/", registrar_bitacora, name="registrar_bitacora"),
    path("api/user-info/", get_user_info, name="user_info"),
    path("api/logout/", logout_user, name="logout"),
    path("api/dashboard/stats/", dashboard_stats, name="dashboard_stats"),
    path("api/change-password/", change_password, name="change_password"),
    path("api/forgot-password/", forgot_password, name="forgot_password"),
    path("api/reset-password/", reset_password, name="reset_password"),
    path("api/profile/", user_profile, name="user_profile"),
]
