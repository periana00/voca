FROM python:3.8.13-alpine3.16

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . app/
WORKDIR /app

ENV FLASK_APP=flask_app
ENV FLASK_DEBUG=1

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]