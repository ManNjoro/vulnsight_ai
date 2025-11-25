from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PredictionResultsSerializer

# Create your views here.

from .utils import parse_uploaded_file

class PredictionResultsView(APIView):
    serializer_class = PredictionResultsSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            uploaded_file = serializer.validated_data["file"]

            # Parse file
            df = parse_uploaded_file(uploaded_file)

            # (Optional) Next Step → Run predictions
            # preds = model.predict(df)

            return Response(
                {"rows_received": len(df),
                 "success": "File parsed successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
