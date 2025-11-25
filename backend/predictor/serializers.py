from rest_framework import serializers

class PredictionResultsSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        """
        Validate uploaded file extension and size.
        Allows only .csv and .xlsx for robustness.
        """
        allowed_extensions = ['.csv', '.xlsx']
        file_name = value.name.lower()

        if not any(file_name.endswith(ext) for ext in allowed_extensions):
            raise serializers.ValidationError(
                "Invalid file format. Only .csv and .xlsx files are allowed."
            )

        # Optional: Limit file size (e.g., 5MB)
        max_size_mb = 20
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"File size too large. Maximum allowed size is {max_size_mb} MB."
            )

        return value

    class Meta:
        fields = ['file']
