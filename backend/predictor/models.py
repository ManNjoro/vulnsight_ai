from django.db import models

class PredictionResult(models.Model):
    cve_id = models.CharField(max_length=50)
    prediction = models.IntegerField()
    risk_probability = models.FloatField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # metadata for auditing
    original_filename = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.cve_id} - {self.prediction}"
