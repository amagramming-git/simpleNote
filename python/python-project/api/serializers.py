from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'username': {'required': True},
                        'password': {'write_only': True, 'required': True, 'min_length': 8}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'body', 'user', 'created_at', 'updated_at']
        extra_kwargs = {'user': {'read_only': True}}


class NoteFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(allow_blank=True, allow_null=True)
    body = serializers.CharField(allow_blank=True, allow_null=True)
    user = serializers.CharField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

