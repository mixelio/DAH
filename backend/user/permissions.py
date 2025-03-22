from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request


class IsOwnerAdminOrReadOnly(BasePermission):
    """
    Read permission for everyone, but write,
    update, or delete permissions only for the owner.
    """

    def has_object_permission(
        self, request: Request, view: object, obj: object
    ) -> bool:
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        return obj.user == request.user
