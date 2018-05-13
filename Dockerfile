# Extends ubuntu:latest
# FROM ubuntu:latest
FROM node:latest

# Create a directory where our app will be placed
RUN mkdir /app

# Get all the in this repository
COPY ./ /app

# Installs global NPM dependencies
# RUN sudo npm install -g yo
# RUN sudo npm install -g nodemon
# RUN sudo npm install -g forever
# RUN sudo npm install -g glob-run
# RUN sudo npm install -g js-beautify

# Clone the generator code
WORKDIR /app

# Install blazeplate_generator
RUN npm install
RUN npm install -g @vue/cli
RUN npm install -g @vue/cli-init

# Serve the app
CMD ["node", "server.js"]
