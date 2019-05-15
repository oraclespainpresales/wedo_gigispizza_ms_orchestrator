FROM node:8

# Create app directory
#WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
COPY package*.json /usr/src/app
#COPY node_modules ./
RUN cd /usr/src/app; npm install --production
#RUN npm install
# Bundle app source
#COPY . .
COPY . /usr/src/app
EXPOSE 8080
CMD [ "npm", "start" ]
