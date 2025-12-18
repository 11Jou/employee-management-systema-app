FROM python:3.12.6-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .
CMD ["sh", "-c","python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
