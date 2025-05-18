FROM python:3.10-slim

WORKDIR /app

# COPY scripts /scripts
# COPY data /data

RUN pip install pymongo
