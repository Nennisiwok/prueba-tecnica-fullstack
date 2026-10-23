from rest_framework.routers import DefaultRouter

from races.api.views import RaceViewSet

router = DefaultRouter()
router.register("races", RaceViewSet)

urlpatterns = router.urls
