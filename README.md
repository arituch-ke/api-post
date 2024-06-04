# API Setup Guide

This guide provides step-by-step instructions on how to set up and run the API locally using Yarn and within a Docker container using Docker Compose.

## Prerequisites

Before you start, ensure you have the following installed:

- Node.js (preferably the latest LTS version)
- Yarn package manager
- Docker Desktop for running containers
- Postman
	- link for collection API https://drive.google.com/drive/folders/1VX01vSMJiUBvzsxPQoBPN-5oszBtIf_r?usp=sharing

## Local Development

### Install Dependencies

First, install all necessary dependencies for the project. Open your terminal and run the following command in the root directory of your project:

bash

> Copy code

    yarn install

> Copy code

    yarn dev

### Setup Environment Variables

Setting up environment variables is crucial for managing settings and configurations that should not be hardcoded in your source code, such as JWT_SECRET etc. Here’s how to set them up:

1. **Duplicate the example environment file**: Start by duplicating the `.env.example` file in your project directory. This file usually contains all the necessary environment variables with placeholder values or comments on what each variable is used for. In your terminal, run:

    ```bash
    cp .env.example .env
    ```

    This command creates a copy of `.env.example` and names the copy `.env`, which will be your active environment file.

2. **Edit the `.env` file**: Open the `.env` file in your preferred text editor. Replace the placeholder values with your specific configurations. For instance:

    - `NODE_ENV=development`
    - `HOST=0.0.0.0`
    - `PORT=your_port`
    - `API_BASE_PATH=your_base_path`
    - `HTTP_DEFAULT_CACHE_CONTROL="no-store, no-cache"`
    - `JWT_SECRET=your_jwt_secret`
    - `LOG_LEVEL=debug`
    - `DB_HOST=your_db_host`
    - `DB_PORT=5432`
    - `DB_USERNAME=your_db_user`
    - `DB_PASSWORD=your_db_pass`
    - `DB_TIMEZONE=+07:00`
    - `DB_LOG_QUERY=false`
    - `DB_PREFIX=your_db_name`


This command reads the `package.json` file and installs all the dependencies listed under `dependencies` and `devDependencies`.

### Run Unit Tests

To ensure that your setup is correct and all functionalities are working as expected, run the unit tests with:

bash

> Copy code

    yarn test

This command will execute all tests defined in your project, typically configured in the `jest.config.js` or similar configuration files, depending on the testing framework used.

## Running API via Docker Compose

Docker Compose allows you to define and run multi-container Docker applications. Here, we’ll use it to build and run our API in a Docker environment.

### Starting the Services

Ensure Docker Desktop is running, then deploy your services using Docker Compose with the following command:

bash

> Copy code

    docker compose up -d

- `docker compose up`: Builds, (re)creates, starts, and attaches to containers for a service.
- `-d`: Detaches and runs the containers in the background.

This command reads the `docker-compose.yml` file from your project directory, builds the Docker image for the API (if it doesn't exist), and starts the containers defined in the `docker-compose.yml` file.

### Checking the Container Status

After starting the containers, you can check the status of the containers by running:

bash

> Copy code

    docker compose ps

This command lists all containers that are running under the Docker Compose configuration in the current directory.

### Stopping the Services

When you’re done, you can stop and remove the containers, networks, and volumes set up by Docker Compose using:

bash

> Copy code

    docker compose down

This will stop all running containers and clean up any resources that were used during the session.
