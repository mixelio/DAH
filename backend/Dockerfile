FROM python:3.12-alpine3.19

LABEL maintainer="pzkpw31@gmail.com"

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings.prod
ENV PGDATABASE=railway
ENV PGHOST=postgres.railway.internal
ENV PGPASSWORD=PIMqEDIkaehgCTKSkufXxkifBXgEryop
ENV PGPORT=5432
ENV PGUSER=postgres
ENV STRIPE_SECRET_KEY=sk_test_51Q2wgyGRVZqdEvS6LJEvgNXIL8ct6Cf0Q81A0LwZqvKBqiDAlB9fjNkOYWfsyxDlol1q1fgLdsgLcKpkxPtdGdGX00hEZohmL1
ENV DJANGO_SECRET_KEY=s8aj0dX4ZNV2tE1w5LORCkF7pMY9H6AbqPiG3JWxUTmfvdKoh4lcnBQEy7gz21r

WORKDIR /app/

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
