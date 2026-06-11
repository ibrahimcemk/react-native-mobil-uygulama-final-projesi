FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Python
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends python3.11 python3.11-venv python3-pip \
    && apt-get clean -y

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean -y

# Install MongoDB tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends mongodb-tools \
    && apt-get clean -y

# Set Python 3.11 as default
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1 \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Install Python virtualenv
RUN pip3 install --no-cache-dir virtualenv

# Install Expo CLI globally
RUN npm install -g expo-cli

# Set default working directory
WORKDIR /workspace

# Install uvicorn for FastAPI
RUN pip3 install --no-cache-dir uvicorn[standard]

# Install EAS CLI
RUN npm install -g eas-cli

# Set default shell
SHELL ["/bin/bash", "-c"]
