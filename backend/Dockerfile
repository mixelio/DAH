FROM python:3.13-alpine

LABEL maintainer="pzkpw31@gmail.com"

WORKDIR /app/

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD python manage.py makemigrations &&  \
    python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    gunicorn -b 0.0.0.0:8080 backend.wsgi:application
