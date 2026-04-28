import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
def test_login(client, etudiant):
    url = reverse('token_obtain_pair')
    response = client.post(url, {'email': 'etudiant@ibam.bf', 'password': 'Test1234!'})
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
