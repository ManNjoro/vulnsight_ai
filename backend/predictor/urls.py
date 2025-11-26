from django.urls import path
from django.urls.conf import include
from rest_framework_nested import routers
from . import views

# router = routers.DefaultRouter()
# router.register('predictions', views.prediction_results.as_view(), basename='predictions')

urlpatterns = [
    path('predictions/', views.PredictionResultsView.as_view(), name='predictions'),
    path("results/", views.PredictionListView.as_view(), name="results-list"),
    path("dashboard/summary/", views.DashboardSummaryView.as_view(), name="dashboard-summary"),

]