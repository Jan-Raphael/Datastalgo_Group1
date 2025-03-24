# Generated by Django 5.1.1 on 2025-03-21 03:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('tags', models.CharField(max_length=255)),
                ('contentType', models.IntegerField(choices=[(0, 'Free'), (1, 'Subscription'), (2, 'Premium')], default=0)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('downvotes', models.ManyToManyField(blank=True, related_name='downvoted_posts', to=settings.AUTH_USER_MODEL)),
                ('upvotes', models.ManyToManyField(blank=True, related_name='upvoted_posts', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
