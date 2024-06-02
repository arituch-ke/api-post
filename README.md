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
