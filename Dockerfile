# Extends ubuntu:latest
# FROM ubuntu:latest
# FROM vcatechnology/linux-mint
# Create image based on the official Node image from the dockerhub
# FROM node:latest
# FROM outrigger/yeoman
# FROM qak87/jdk-node-yarn-yeoman
# FROM estebanmatias92/yeoman
FROM ejahn/yeoman
USER yeoman

# Create a directory where our app will be placed
RUN sudo mkdir -p /home/yeoman/app/server

# Get all the in this repository
COPY ./ /home/yeoman/app/server

# Installs global NPM dependencies
# RUN sudo npm install -g yo
RUN sudo npm install -g nodemon
RUN sudo npm install -g forever
RUN sudo npm install -g glob-run
RUN sudo npm install -g js-beautify

# Clone the generator code
WORKDIR /home/yeoman/app
RUN sudo git clone https://github.com/Blazeplate/blazeplate_generator.git

# Install blazeplate_generator
WORKDIR /home/yeoman/app/blazeplate_generator
RUN sudo npm install
RUN sudo npm link

# Change to the app directory
# Install app dependecies
WORKDIR /home/yeoman/app/server
RUN sudo npm install
RUN sudo npm link generator-blazeplate

# Reinstall yeoman
RUN sudo npm install -g yo

# Use latest node
RUN sudo nvm install 10.0.0

# yeoman owns everything
RUN sudo chown -R yeoman /home/yeoman

# Serve the app
# CMD ["sudo", "node", "server.js"]
CMD ["node", "server.js"]
