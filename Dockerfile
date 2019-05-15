FROM node:8

# Create app directory
#WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

ADD package.json /tmp/package.json
RUN cd /tmp && npm  --production
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

#COPY package*.json ./
#COPY node_modules ./
#RUN cd /usr/src/app; npm install --production

# Bundle app source
WORKDIR /usr/src/app
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
