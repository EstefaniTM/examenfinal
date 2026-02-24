from django.db import models

class Vehicle(models.Model):
    plate = models.CharField(max_length=20)
    brand = models.CharField(max_length=40)
    daily_rate = models.DecimalField(
        max_digits=10,  # total de dígitos
        decimal_places=2,  # decimales
        default=0
    )
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.plate} {self.brand} ({self.daily_rate})"

class Estado(models.TextChoices):
        RESERVED = "reservado", "Reservado"
        ACTIVE = "activado", "Activado"
        CLOSED = "cerrado", "Cerrado"
        CANCELLED = "cancelado", "Cancelado"

class Rental(models.Model):
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name="rentals")
    customer_name = models.CharField(max_length=40)
    total = models.IntegerField(
        null=True, blank=True,
        default=0)
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.RESERVED
    )

    def __str__(self):
        return f"{self.vehicle_id.plate} {self.customer_name} ({self.total}) - {self.status}"