# pull the Node.js Docker image
FROM node:10.23.2-alpine3.10

# maintainer
LABEL maintainer="felixonta@gmail.com"

# install angular-cli
RUN npm install -g @angular/cli@6.1.2

# create the directory inside the container
WORKDIR /opt/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY src ./src
COPY angular.json .
COPY tsconfig.json .

# our app is running on port 4200 within the container, so need to expose it
EXPOSE 4200

# the command that starts our app
CMD ["ng", "serve", "--host", "0.0.0.0"]