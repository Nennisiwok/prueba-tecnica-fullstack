from rest_framework import serializers

from races.models import Race


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ["id", "name", "date", "location", "created_at"]
        read_only_fields = ["created_at"]
