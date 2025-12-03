---
marp: true
theme: edera-v2
paginate: true
---

<!-- _class: title -->

# Getting Started with Docker

## A practical introduction for developers

Sarah Johnson | DevOps Conference 2025 | December 15, 2025

---

<!-- _class: content -->

# What We'll Cover

- Understanding containers and why they matter
- Installing and setting up Docker
- Creating your first container
- Best practices for Docker in development

---

<!-- _class: content -->

# Why Docker Matters

Modern software development faces complexity challenges:

- **Problem:** "It works on my machine" syndrome
- **Impact:** Wasted time debugging environment differences
- **Solution:** Containers provide consistent, portable environments

Docker makes development predictable and deployment reliable.

---

<!-- _class: content -->

# What is a Container?

A lightweight, standalone package that includes:

- Application code
- Runtime environment
- System libraries
- Dependencies
- Configuration files

**Think of it as:** A shipping container for your software!

---

<!-- _class: two-columns -->

# Virtual Machines vs Containers

## Virtual Machines

- Full OS per application
- Gigabytes in size
- Minutes to start
- Higher resource usage
- Complete isolation

## Containers

- Shared OS kernel
- Megabytes in size
- Seconds to start
- Efficient resource use
- Process-level isolation

---

<!-- _class: content -->

# Installing Docker

Docker Desktop is available for all platforms:

1. Download from docker.com/get-started
2. Run the installer
3. Verify installation:

```bash
docker --version
# Output: Docker version 24.0.0

docker run hello-world
# Pulls and runs a test container
```

---

<!-- _class: content -->

# Your First Container

Let's run a simple web server:

```bash
# Pull the nginx image
docker pull nginx:latest

# Run the container
docker run -d -p 8080:80 --name my-web-server nginx

# Check it's running
docker ps

# Visit http://localhost:8080 in your browser
```

---

<!-- _class: content -->

# Understanding Docker Images

An image is a template for creating containers:

- **Base images:** nginx, python, node, ubuntu
- **Custom images:** Built with Dockerfile
- **Layers:** Images are built in efficient layers
- **Registries:** Docker Hub stores public images

```bash
# Search for images
docker search python

# List local images
docker images
```

---

<!-- _class: content -->

# Creating a Dockerfile

Build custom images with a Dockerfile:

```dockerfile
# Start from a base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Define the command to run
CMD ["python", "app.py"]
```

---

<!-- _class: content -->

# Building Your Image

```bash
# Build the image
docker build -t my-python-app:1.0 .

# The -t flag tags your image with a name and version
# The . specifies the build context (current directory)

# Run your custom container
docker run -d -p 5000:5000 my-python-app:1.0
```

---

<!-- _class: content -->

# Essential Docker Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `docker ps` | List running containers | `docker ps -a` (all) |
| `docker stop` | Stop a container | `docker stop my-web-server` |
| `docker rm` | Remove a container | `docker rm my-web-server` |
| `docker logs` | View container logs | `docker logs my-web-server` |
| `docker exec` | Run command in container | `docker exec -it my-web-server bash` |

---

<!-- _class: dark -->

# Docker Compose

For multi-container applications

Define your entire stack in `docker-compose.yml`

Start everything with one command

```bash
docker-compose up
```

---

<!-- _class: content -->

# Docker Compose Example

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

<!-- _class: content -->

# Best Practices

1. **Use official base images** - More secure and maintained
2. **Keep images small** - Use alpine variants when possible
3. **Don't run as root** - Create user in Dockerfile
4. **Use .dockerignore** - Exclude unnecessary files
5. **Tag your images** - Use meaningful version tags

---

<!-- _class: content -->

# Development Workflow

```bash
# 1. Write your Dockerfile
vim Dockerfile

# 2. Build your image
docker build -t myapp:dev .

# 3. Run and test
docker run -p 8080:8080 myapp:dev

# 4. Make changes, rebuild
# Docker caches layers for speed!

# 5. Push to registry when ready
docker push myregistry.com/myapp:1.0
```

---

<!-- _class: content -->

# Common Pitfalls to Avoid

- ❌ Not using volumes for persistent data
- ❌ Exposing sensitive data in images
- ❌ Running unnecessary services in containers
- ❌ Not cleaning up unused images and containers
- ❌ Hardcoding configuration (use env vars!)

---

<!-- _class: content -->

# Key Takeaways

1. **Containers solve real problems** - Consistent environments across development and production
2. **Docker is approachable** - Start with simple containers, grow into complex orchestration
3. **Best practices matter** - Security, efficiency, and maintainability from day one

---

<!-- _class: content -->

# Resources

- Official Docker Documentation: <https://docs.docker.com>
- Docker Hub: <https://hub.docker.com>
- Play with Docker (free playground): <https://labs.play-with-docker.com>
- Docker Compose reference: <https://docs.docker.com/compose>

---

<!-- _class: title -->

# Thank You

## Questions?

Sarah Johnson
<sarah.johnson@example.com>
@sarahjdev on Twitter
<https://github.com/sarahjohnson>
