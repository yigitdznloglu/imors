# imörs: Immersive Music Experience App

**imörs** (pronounced *“immerse”*) is a web application that offers a unique, immersive music experience through audio-reactive visualizations. Users can upload an MP3 file to generate an MP4 video that visually syncs with the music. Choose from various pre-trained models to create captivating visualizations, including maps, drawings, and more.

## Prerequisites

To run **imörs**, ensure the following software and services are installed and configured on your machine:

### 1. Node.js (v20.15.0)

Download and install Node.js from the official website:

[Node.js Prebuilt Installer](https://nodejs.org/en/download/prebuilt-installer)

### 2. MongoDB

Download and install MongoDB to set up a database:

[Download MongoDB](https://www.mongodb.com/try/download/community)

### 3. Anaconda3 (2024.06)

Download and install Anaconda3 to manage Python environments:

[Anaconda Download](https://www.anaconda.com/download)

### 4. Redis

**imörs** requires a Redis instance running on your local machine. To install and run Redis using Docker, follow these steps:

1. Install Docker Desktop:

   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. Pull and run the Redis Docker image:

   ```bash
   docker pull redis
   docker run --name redis-container -p 6379:6379 -d redis
   ```

### 5. Firebase Storage Bucket

**imörs** uses Firebase for storing generated video files. To set up Firebase, follow these steps:

1. Create a Firebase project and enable Cloud Storage:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one.
   - Navigate to the **Storage** section and set up a new storage bucket.

2. Generate a Firebase service account key:
   - Go to **Project Settings** > **Service Accounts**.
   - Click **Generate New Private Key** and save the JSON file to your project directory.

3. Configure Firebase in your project:

   Add the following code snippet along with your-service-account-credentials.json firebase-config.js to initialize Firebase Admin SDK:

   ```javascript
   const admin = require("firebase-admin");

   const serviceAccount = require("./path/to/your/serviceAccountKey.json");

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     storageBucket: "your-project-id.appspot.com",
   });

   const bucket = admin.storage().bucket();

   console.log("Firebase Admin initialized with storage bucket:", bucket.name);

   module.exports = { bucket };
   ```

   **Note**: Replace `./path/to/your/serviceAccountKey.json` with the actual path to your service account file and `your-project-id.appspot.com` with your Firebase storage bucket URL.

### CUDA Toolkit 11.8 (you need to have a compatible Nvidia GPU)
[Download CUDA Toolkit 11.8](https://developer.nvidia.com/cuda-11-8-0-download-archive?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local)

## Anaconda setup
- Run Anaconda Prompt application

- Enter the following commands:

  ```bash
  conda create --name imors python=3.9
  conda activate imors
  pip install librosa==0.8.1 numpy==1.22.0 pandas==1.3.5 scikit-image==0.18.3 scipy==1.7.2 ninja==1.10.2.2 tqdm==4.59.0 ninja==1.10.2 moviepy pygit2 gdown mega.py click 
  conda install pytorch==2.3.1 torchvision==0.18.1 torchaudio==2.3.1 pytorch-cuda=11.8 -c pytorch -c nvidia
  ```

## App Setup Instructions

### Setting up the Frontend
```bash
cd frontend
npm install
npm run start
```
.env:
REACT_APP_MONGO=
REACT_APP_REACTURL=
REACT_APP_API_URL=
REACT_APP_OVERRIDE=

### Setting up the Backend
- ```bash
  cd backend
  npm install
  npm run start
  ```

- Clone the StyleGAN2 repository to backend/workers/ from https://github.com/NVlabs/stylegan2.git

### .envs:
   
   ```bash
   #backend/.env:
   NODE_ENV=
   PORT=
   MONGO=
   REACTURL=
   API_URL=
   OVERRIDE=
   BASE_VIDEO_DIRECTORY=
   ANACONDA_ENV_PYTHON_PATH=

   #frontend/.env:
   REACT_APP_MONGO=
   REACT_APP_REACTURL=
   REACT_APP_API_URL=
   REACT_APP_OVERRIDE=
   ```
## Workflow
- User uploads a song
- User chooses a style model and sends a generate request
- Generate request adds a job to BullMQ queue to be sent to the Redis instance
- Worker listens to the Redis instance and spawns the anaconda environment
- In the anaconda environment, the StyleGAN algorithm is ran to generate the video
- Generated video is then uploaded to Firebase and becomes available to the user and also mailed to the user

## Example
Please see backend/workers/output for generated video examples