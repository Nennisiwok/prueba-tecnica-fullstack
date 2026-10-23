from rest_framework import mixins, viewsets

from races.api.serializers import RaceSerializer
from races.models import Race


class RaceViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
