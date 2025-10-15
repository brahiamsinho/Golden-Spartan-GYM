"""
Validadores de contraseña personalizados para Golden Spartan Gym
"""
import re
from difflib import SequenceMatcher
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomUserAttributeSimilarityValidator:
    """
    Validador personalizado para similitud con atributos del usuario
    """
    def __init__(self, user_attributes=('username', 'first_name', 'last_name', 'email'), max_similarity=0.7):
        self.user_attributes = user_attributes
        self.max_similarity = max_similarity

    def validate(self, password, user=None):
        if not user:
            return

        for attribute_name in self.user_attributes:
            value = getattr(user, attribute_name, None)
            if not value or len(value) < 3:
                continue
                
            value_parts = re.split(r'\W+', value) + [value]
            for value_part in value_parts:
                similarity = SequenceMatcher(
                    a=password.lower(), 
                    b=value_part.lower()
                ).quick_ratio()
                
                if similarity >= self.max_similarity:
                    raise ValidationError(
                        f"⚠️ La contraseña es muy similar a tu {self._get_field_name(attribute_name)}. "
                        f"Por seguridad, usa una contraseña más diferente.",
                        code='password_too_similar'
                    )

    def _get_field_name(self, attribute):
        field_names = {
            'username': 'nombre de usuario',
            'first_name': 'nombre',
            'last_name': 'apellido',
            'email': 'correo electrónico'
        }
        return field_names.get(attribute, attribute)

    def get_help_text(self):
        return "Tu contraseña no puede ser muy similar a tu información personal."


class CustomMinimumLengthValidator:
    """
    Validador personalizado de longitud mínima
    """
    def __init__(self, min_length=8):
        self.min_length = min_length

    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError(
                f"🔒 Tu contraseña debe tener al menos {self.min_length} caracteres. "
                f"Actualmente tiene {len(password)}.",
                code='password_too_short',
                params={'min_length': self.min_length}
            )

    def get_help_text(self):
        return f"Tu contraseña debe contener al menos {self.min_length} caracteres."


class CustomCommonPasswordValidator:
    """
    Validador personalizado para contraseñas comunes
    """
    def __init__(self):
        # Lista de contraseñas comunes específicas para gimnasios
        self.common_passwords = {
            'password', 'password123', '123456', '123456789', 'qwerty', 
            'abc123', 'password1', 'admin', 'admin123', 'gimnasio', 
            'gym123', 'fitness', 'spartan', 'golden', 'deporte',
            '12345678', '111111', '000000', 'iloveyou', 'welcome',
            'monkey', 'dragon', 'master', 'superman', 'batman'
        }

    def validate(self, password, user=None):
        if password.lower() in self.common_passwords:
            raise ValidationError(
                "🚫 Esta contraseña es muy común y fácil de adivinar. "
                "Elige una contraseña más única y segura.",
                code='password_too_common'
            )

    def get_help_text(self):
        return "Tu contraseña no puede ser una contraseña comúnmente utilizada."


class CustomNumericPasswordValidator:
    """
    Validador personalizado para contraseñas solo numéricas
    """
    def validate(self, password, user=None):
        if password.isdigit():
            raise ValidationError(
                "🔢 Tu contraseña no puede ser solo números. "
                "Incluye letras y/o símbolos para mayor seguridad.",
                code='password_entirely_numeric'
            )

    def get_help_text(self):
        return "Tu contraseña no puede ser completamente numérica."


class GymPasswordValidator:
    """
    Validador específico para el gimnasio con reglas adicionales
    """
    def validate(self, password, user=None):
        errors = []
        
        # Debe tener al menos una letra
        if not re.search(r'[a-zA-Z]', password):
            errors.append("🔤 Debe contener al menos una letra")
            
        # Debe tener al menos un número
        if not re.search(r'\d', password):
            errors.append("🔢 Debe contener al menos un número")
            
        # Verificar caracteres especiales (opcional pero recomendado)
        if len(password) >= 10 and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("⚡ Para contraseñas largas, se recomienda incluir símbolos (!@#$%^&*)")
            
        if errors:
            raise ValidationError(
                f"💪 Para mantener tu cuenta del gimnasio segura:\n" + 
                "\n".join(f"• {error}" for error in errors),
                code='gym_password_requirements'
            )

    def get_help_text(self):
        return (
            "Para mantener tu cuenta segura en Golden Spartan Gym, "
            "tu contraseña debe contener letras y números."
        )