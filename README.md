# Project management server

## Setting up locally

### Clone the repo

```
git clone https://github.com/Ayush8085/project-management-server.git
```

### Third-party services needed

**MongoDB URL** - For database connection. </br>
**Cloudinary** - For storing the image file. _(Alternative - use the upload folder locally to work as an image CDN)_

### Environment variables

Rename `.env.example` to `.env`

```
MONGO_URI=mongodb://localhost:27017/ProjectManagement
PORT=5000
ACCESS_TOKEN_SECRET=access-token-secret
REFRESH_TOKEN_SECRET=refresh-token-secret
NODE_ENV="dev"

# Cloudinary details
CLOUDIANRY_CLOUD_NAME=
CLOUDIANRY_API_KEY=
CLOUDIANRY_API_SECRET=
```

### Install dependencies and run server

```
cd '.\Project management server\'
npm i
npm run dev
```
