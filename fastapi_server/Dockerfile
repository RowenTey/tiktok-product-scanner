FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9


COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ./src /app/src

ENV PYTHONPATH=/app

EXPOSE 8000

WORKDIR /app

CMD python src/main.py