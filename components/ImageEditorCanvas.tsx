import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';

interface ImageEditorCanvasProps {
  imageUrl: string;
  brushSize: number;
  brushColor: string;
}

interface Point {
  x: number;
  y: number;
}

type Path = Point[];

const ImageEditorCanvas = forwardRef((props: ImageEditorCanvasProps, ref) => {
  const { imageUrl, brushSize, brushColor } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Path>([]);

  const getCanvasCoordinates = (event: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (window.TouchEvent && event instanceof TouchEvent && event.touches[0]) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else {
        return null;
    }
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    
    image.onload = () => {
      if (canvas && ctx) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

        // Draw saved paths
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        [...paths, currentPath].forEach(path => {
          if (path.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.stroke();
        });
      }
    };
  }, [imageUrl, brushColor, brushSize, paths, currentPath]);

  useEffect(() => {
    draw();
  }, [draw]);

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const point = getCanvasCoordinates(event.nativeEvent);
    if (point) {
      setIsDrawing(true);
      setCurrentPath([point]);
    }
  };

  const continueDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    const point = getCanvasCoordinates(event.nativeEvent);
    if (point) {
      setCurrentPath(prevPath => [...prevPath, point]);
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 0) {
      setPaths(prevPaths => [...prevPaths, currentPath]);
    }
    setCurrentPath([]);
  };

  useImperativeHandle(ref, () => ({
    getMaskedImageAsDataUrl: () => {
      const canvas = canvasRef.current;
      if (!canvas) return '';
      // The drawing is already on the canvas, so we just export it
      return canvas.toDataURL('image/png');
    },
    undo: () => {
      setPaths(prevPaths => prevPaths.slice(0, -1));
      setCurrentPath([]); // Also clear any in-progress path
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={continueDrawing}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={continueDrawing}
      onTouchEnd={endDrawing}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    />
  );
});

export default ImageEditorCanvas;
