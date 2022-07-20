FROM python:3.8-alpine3.16

WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]