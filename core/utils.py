from rest_framework.response import Response
from rest_framework import status


class CustomResponse:
    """
    Utility class for standardized API responses.
    Format: {
        "success": true/false,
        "message": "...",
        "data": {...},
        "errors": null/{}
    }
    """
    
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        """
        Return a success response.
        
        Args:
            data: The response data (default: None)
            message: Success message (default: "Success")
            status_code: HTTP status code (default: 200)
        """
        return Response({
            "success": True,
            "message": message,
            "data": data,
            "errors": None
        }, status=status_code)
    
    @staticmethod
    def error(errors=None, message="Error", status_code=status.HTTP_400_BAD_REQUEST):
        """
        Return an error response.
        
        Args:
            errors: Error details (default: None)
            message: Error message (default: "Error")
            status_code: HTTP status code (default: 400)
        """
        return Response({
            "success": False,
            "message": message,
            "data": None,
            "errors": errors
        }, status=status_code)
    
    @staticmethod
    def created(data=None, message="Resource created successfully"):
        """Return a 201 Created response."""
        return CustomResponse.success(
            data=data,
            message=message,
            status_code=status.HTTP_201_CREATED
        )
    
    @staticmethod
    def not_found(message="Resource not found", errors=None):
        """Return a 404 Not Found response."""
        return CustomResponse.error(
            errors=errors,
            message=message,
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    @staticmethod
    def no_content(message="Resource deleted successfully"):
        """Return a 204 No Content response with custom format."""
        return Response({
            "success": True,
            "message": message,
            "data": None,
            "errors": None
        }, status=status.HTTP_204_NO_CONTENT)

