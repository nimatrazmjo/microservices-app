# Stage 1: Build
FROM python:3.13-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Run
FROM python:3.13-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PYTHONPATH=/app
ENV PATH=/root/.local/bin:$PATH
ENV PORT=8000

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]