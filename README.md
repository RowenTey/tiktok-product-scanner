# Tiktok Product Scanner

## Run frontend client

1. Go to `frontend` directory
2. Install libraries
   ```
   npm install
   ```
3. Run
   ```
   npm run dev
   ```

## Run MongoDB container

1. Go to `root` directory
2. Run
   ```
   docker-compose build
   docker-compose up
   ```

## Run backend (express) server

1. Go to `backend` directory
2. Install libraries
   ```
   npm install
   ```
3. Run
   ```
   npm run dev
   ```

## Run backend (fastapi) server

1. Go to `root` directory
2. Run
   ```
   docker-compose build
   docker-compose up
   ```
3. Server is at http://127.0.0.1:8000
4. Docs is at http://127.0.0.1:8000/docs

## Run object detection using YOLOv5

Remember to use Python v3.8

1. Head over to `object-detection` directory:

   - ```
     cd ./object-detection
     ```

1. Create environment:

   - ```
     python -m virtualenv venv
     ```

1. Activate environment:

   - ```
     . venv/bin/activate # macOS/Linux
     ./venv/scripts/activate # Windows
     ```

1. Install all dependencies:

   - ```
     pip install -r requirements.txt
     ```

1. Start detection script:
   - ```
     python detect.py --source 0    # Your default webcam should be 0, can try other values if 0 throws an error
     ```
