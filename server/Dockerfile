FROM oven/bun:1

RUN apt update && apt install -y curl

#Install dependencies server
COPY package.json /tmp/package.json
RUN cd /tmp && bun install && mkdir -p /opt/app/ && cp -a /tmp/node_modules /opt/app

#Copy contents 
WORKDIR /opt/app
COPY . /opt/app/
RUN cd client && bun install && bun run build

CMD ["bun", "run", "start"]
