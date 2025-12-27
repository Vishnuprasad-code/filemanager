FROM python:3.9

# Set the working directory in the container
WORKDIR /app/backend

# Copy the requirements file to install dependencies
COPY ./requirements.txt ./

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

EXPOSE 5000


CMD ["gunicorn", "-b", ":5000", "app:app"]