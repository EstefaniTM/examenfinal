from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, RentalViewSet
from .feel_log_views import feel_log_list_create, feel_log_detail
from .rental_event_views import rental_event_list_create, rental_event_detail

router = DefaultRouter()
router.register(r"vehicles", VehicleViewSet, basename="vehicles")
router.register(r"rentals", RentalViewSet, basename="rentals")

urlpatterns = [
    # Mongo
    path("feel-logs/", feel_log_list_create),
    path("feel-logs//", feel_log_detail),
    path("rental-events/", rental_event_list_create),
    path("rental-events//", rental_event_detail),
]

urlpatterns += router.urls