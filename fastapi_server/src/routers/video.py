import io
import traceback
from core.video import process_video_buffer
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/videos/process")
async def process_video(video: UploadFile = File(...)) -> JSONResponse:
    try:
        video_bytes = await video.read()
        video_buffer = io.BytesIO(video_bytes)

        res = process_video_buffer(video_buffer)
        filename = video.filename
        
        return JSONResponse(status_code=200, content={
            "filename": filename, 
            "keywords": res,
            "status": "Success" if len(res) > 0 else "Failed"
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error processing video: {e}")
