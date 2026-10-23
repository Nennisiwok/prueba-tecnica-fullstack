from django.db import models


class Race(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "name"]

    def __str__(self):
        return f"{self.name} ({self.date:%d/%m/%Y})"
