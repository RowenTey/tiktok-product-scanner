import io
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from core.video import process_video_buffer

router = APIRouter()


@router.post("/videos/process")
async def process_video(video: UploadFile = File(...)) -> JSONResponse:
    try:
        # Read the uploaded file into memory
        video_bytes = await video.read()
        video_buffer = io.BytesIO(video_bytes)

        res = process_video_buffer(video_buffer)

        filename = video.filename
        return JSONResponse(status_code=200, content={"filename": filename, "status": "Success" if res else "Failed"})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing video: {e}")
