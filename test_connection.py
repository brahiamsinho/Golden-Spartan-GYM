#!/usr/bin/env python3
"""
Script para probar la conexión entre frontend y backend
"""

import requests
import json


def test_backend_connection():
    """Probar conexion al backend"""
    print("Probando conexion al backend...")

    try:
        # Probar endpoint de token
        response = requests.post(
            "http://localhost:8000/api/token/",
            json={"username": "admin", "password": "admin"},
            headers={"Content-Type": "application/json"},
        )

        if response.status_code == 200:
            print("OK - Backend funcionando correctamente")
            token_data = response.json()
            print(f"   Token obtenido: {token_data['access'][:20]}...")
            return token_data["access"]
        else:
            print(f"ERROR - Backend: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None

    except Exception as e:
        print(f"ERROR - Conectando al backend: {e}")
        return None


def test_cors_headers():
    """Probar headers CORS"""
    print("\nProbando headers CORS...")

    try:
        # Simular peticion desde frontend
        response = requests.options(
            "http://localhost:8000/api/token/",
            headers={
                "Origin": "http://localhost:5174",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )

        print(f"   Status OPTIONS: {response.status_code}")

        # Verificar headers CORS
        cors_headers = {
            "Access-Control-Allow-Origin": response.headers.get(
                "Access-Control-Allow-Origin"
            ),
            "Access-Control-Allow-Methods": response.headers.get(
                "Access-Control-Allow-Methods"
            ),
            "Access-Control-Allow-Headers": response.headers.get(
                "Access-Control-Allow-Headers"
            ),
        }

        print("   Headers CORS:")
        for header, value in cors_headers.items():
            if value:
                print(f"     {header}: {value}")
            else:
                print(f"     {header}: No encontrado")

        return response.status_code == 200

    except Exception as e:
        print(f"ERROR - Probando CORS: {e}")
        return False


def test_api_with_token(token):
    """Probar API con token"""
    if not token:
        return False

    print("\nProbando API con token...")

    try:
        response = requests.get(
            "http://localhost:8000/api/usuarios/",
            headers={
                "Authorization": f"Bearer {token}",
                "Origin": "http://localhost:5174",
            },
        )

        if response.status_code == 200:
            print("OK - API de usuarios funcionando")
            users = response.json()
            print(f"   Usuarios encontrados: {len(users)}")
            for user in users:
                print(
                    f"     - {user.get('username', 'N/A')} ({user.get('email', 'N/A')})"
                )
            return True
        else:
            print(f"ERROR - API: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return False

    except Exception as e:
        print(f"ERROR - Probando API: {e}")
        return False


def main():
    print("Golden Spartan GYM - Test de Conexion")
    print("=" * 50)

    # Probar backend
    token = test_backend_connection()

    # Probar CORS
    cors_ok = test_cors_headers()

    # Probar API con token
    api_ok = test_api_with_token(token)

    print("\n" + "=" * 50)
    print("RESUMEN:")
    print(f"   Backend: {'OK' if token else 'ERROR'}")
    print(f"   CORS: {'OK' if cors_ok else 'ERROR'}")
    print(f"   API: {'OK' if api_ok else 'ERROR'}")

    if token and cors_ok and api_ok:
        print("\nTodo funcionando correctamente!")
        print("   El frontend deberia poder conectarse sin problemas.")
    else:
        print("\nHay problemas que necesitan ser resueltos.")
        if not token:
            print("   - Verificar que el backend este ejecutandose")
        if not cors_ok:
            print("   - Verificar configuracion CORS en settings.py")
        if not api_ok:
            print("   - Verificar autenticacion JWT")


if __name__ == "__main__":
    main()
