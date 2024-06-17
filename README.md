# Tiktok Product Scanner

## Run frontend client

1. Go to `frontend` directory
2. Install libraries
   ```
   npm install
   ```
4. Run
   ```
   npm run dev
   ```

## Run MongoDB container

Under root directory

```
docker-compose build
docker-compose up
```

## Run backend server

npm install first

```
cd ./backend
npm run dev
```

## Run object detection using YOLOv5

Remember to use Python v3.8

1. Head over to `object-detection` directory:
   * ```
     cd ./object-detection
     ```

1. Create environment: 
   * ```
     python -m virtualenv venv
     ```

2. Activate environment:
   * ```
     . venv/bin/activate # macOS/Linux
     ./venv/scripts/activate # Windows
     ```

3. Install all dependencies:
   * ```
     pip install -r requirements.txt
     ```

4. Start detection script:
   * ```
     python detect.py --source 0    # Your default webcam should be 0, can try other values if 0 throws an error
     ```