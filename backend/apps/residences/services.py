from .models import Residence, ResidenceImage


class ResidenceService:
    @staticmethod
    def get_landlord_residences(user):
        return Residence.objects.filter(landlord=user)

    @staticmethod
    def add_image(residence, image, is_primary=False):
        if is_primary:
            ResidenceImage.objects.filter(residence=residence).update(is_primary=False)
        return ResidenceImage.objects.create(
            residence=residence, image=image, is_primary=is_primary
        )

    @staticmethod
    def delete_image(image_id, user):
        image = ResidenceImage.objects.select_related('residence').get(id=image_id)
        if image.residence.landlord != user:
            raise PermissionError('Not authorized')
        image.delete()
