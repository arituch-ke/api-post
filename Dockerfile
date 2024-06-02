# ------- builder Image --------
FROM node:20 as builder

# run yarn install
WORKDIR /app
COPY . .
RUN yarn install --production --no-optional \
  && cp -r node_modules node_modules_prod \
  && yarn install \
  && yarn build \
  && rm -rf src test .husky .npmrc migrations seeders node_modules \
  && mv node_modules_prod node_modules

# ------- Final Image --------
FROM node:20-slim
ENV NODE_ENV production
ENV PORT 8088

EXPOSE 8088
WORKDIR /app

COPY --from=builder /app .

CMD ["node","."]