# syntax=docker/dockerfile:1

# -------------------------
# Base image
# -------------------------
  ARG RUBY_VERSION=3.4.2
  FROM ruby:$RUBY_VERSION-slim AS base
  
  # Set working directory
  WORKDIR /rails
  
  # Install system dependencies
  RUN apt-get update -qq && \
        apt-get install --no-install-recommends -y \
          curl \
          libjemalloc2 \
          libvips-dev \
          build-essential \
          git \
          libyaml-dev \
          pkg-config \
          python3 \
          && rm -rf /var/lib/apt/lists/*
  
  # Install Node.js LTS + npm + Yarn 1
  RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
      apt-get install -y nodejs && \
      npm install -g yarn@1.22.19 && \
      rm -rf /var/lib/apt/lists/*
  
  # Set Rails environment
  ENV RAILS_ENV=production \
      BUNDLE_DEPLOYMENT=1 \
      BUNDLE_PATH=/usr/local/bundle \
      BUNDLE_WITHOUT=development \
      SECRET_KEY_BASE=dummykey123    
  
  # -------------------------
  # Build stage
  # -------------------------
  FROM base AS build
  
  # Copy gemfiles and install gems
  COPY Gemfile Gemfile.lock ./
  RUN bundle install && \
      rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
      bundle exec bootsnap precompile --gemfile
  
  # Copy app code
  COPY . .
  
  # Precompile bootsnap

  COPY package.json yarn.lock ./
  RUN bundle exec bootsnap precompile app/ lib/
  RUN yarn install --frozen-lockfile
  RUN bin/rails tailwindcss:build
  RUN bin/vite build
  
  # -------------------------
  # Final image
  # -------------------------
  FROM base
  
  # Copy built gems and app from build stage
  COPY --from=build /usr/local/bundle /usr/local/bundle
  COPY --from=build /rails /rails
  
  # Create non-root user
  RUN groupadd --system --gid 1000 rails && \
      useradd --uid 1000 --gid 1000 --create-home --shell /bin/bash rails && \
      chown -R rails:rails db log storage tmp
  
  USER 1000:1000
  
  WORKDIR /rails
  
  # Entrypoint and default command
  ENTRYPOINT ["/rails/bin/docker-entrypoint"]
  EXPOSE 80
  CMD ["bin/rails", "server", "-b", "0.0.0.0"]
  