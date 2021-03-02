# this includes the build for both api and app

FROM node:alpine as build

WORKDIR /src/api

# build express api
COPY api/package.json .

RUN npm install

COPY api .

RUN npm run build

RUN npm prune --production
RUN rm -rf src
RUN rm -rf tsconfig.json


# build vue app with vite
WORKDIR /src/app

COPY app/package.json .

RUN npm install

COPY app .

RUN npm run vite:build

RUN rm -rf public/index.html
RUN cp -r public ../api/public/.


# production container
FROM node:alpine as prod

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

WORKDIR /app

COPY --from=build /src/api .

CMD ["node", "dist/index.js"]
