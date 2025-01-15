# Stage 1: Build backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src
COPY ["ProiectPWEB_MU/ProiectPWEB_MU.csproj", "./"]
RUN dotnet restore "./ProiectPWEB_MU.csproj"
COPY . .
WORKDIR "/src/ProiectPWEB_MU"
RUN dotnet publish "ProiectPWEB_MU.csproj" -c Release -o /app/publish

# Stage 2: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY ./ClientApp/package*.json ./
RUN npm install
COPY ./ClientApp ./
RUN npm run build

# Stage 3: Create final image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=backend-build /app/publish ./backend
COPY --from=frontend-build /app/build ./frontend

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true

# Expose port
EXPOSE 80

# Start the backend
ENTRYPOINT ["dotnet", "backend/ProiectPWEB_MU.dll"]
