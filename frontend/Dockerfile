FROM node:22-alpine

WORKDIR /app

# Copy package files (including yarn.lock for consistency)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

RUN yarn global add serve

# Start the application
CMD ["yarn", "production"]