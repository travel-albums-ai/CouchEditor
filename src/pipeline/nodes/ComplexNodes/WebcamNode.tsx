import AdjustmentSlider from '@/pipeline/components/AdjustmentSlider';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import { Box, Button } from '@mui/material';
import { Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { Camera, CircleStop } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MIN_CAPTURE_INTERVAL_MS = 16;
const MAX_CAPTURE_INTERVAL_MS = 1000;
const MIN_CAPTURE_QUALITY = 0.1;
const MAX_CAPTURE_QUALITY = 1;
const MIN_CAPTURE_SIZE = 25;
const MAX_CAPTURE_SIZE = 100;
const DEFAULT_CAPTURE_QUALITY = 0.8;
const DEFAULT_CAPTURE_SIZE = 75;

type WebcamNodeData = {
  files?: File[];
};

function WebcamNode({ id }: NodeProps<Node<WebcamNodeData>>) {
  const { setNodes } = useReactFlow();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const captureInFlightRef = useRef(false);
  const captureQualityRef = useRef(DEFAULT_CAPTURE_QUALITY);
  const captureSizeRef = useRef(DEFAULT_CAPTURE_SIZE);
  const previewUrlRef = useRef<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  // const [status, setStatus] = useState('Camera is stopped');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [captureIntervalMs, setCaptureIntervalMs] = useState(MAX_CAPTURE_INTERVAL_MS);
  const [captureQuality, setCaptureQuality] = useState(DEFAULT_CAPTURE_QUALITY);
  const [captureSize, setCaptureSize] = useState(DEFAULT_CAPTURE_SIZE);

  const scheduleCapture = (intervalMs: number) => {
    if (captureTimerRef.current !== null) {
      window.clearInterval(captureTimerRef.current);
    }

    if (streamRef.current) {
      captureTimerRef.current = window.setInterval(() => void captureFrame(), intervalMs);
    }
  };

  const stopCamera = () => {
    if (captureTimerRef.current !== null) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsRunning(false);
    // setStatus('Camera is stopped');
  };

  const captureFrame = async () => {
    if (captureInFlightRef.current) return;

    const video = videoRef.current;
    if (!streamRef.current || !video || video.videoWidth === 0 || video.videoHeight === 0) return;

    captureInFlightRef.current = true;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(video.videoWidth * captureSizeRef.current / 100));
      canvas.height = Math.max(1, Math.round(video.videoHeight * captureSizeRef.current / 100));
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', captureQualityRef.current));
      if (!blob || !streamRef.current) return;

      // const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const file = new File([blob], `webcam.jpg`, { type: 'image/jpeg' });
      setNodes((current) => current.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, files: [file] } } : node
      ));
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        const next = URL.createObjectURL(file);
        previewUrlRef.current = next;
        return next;
      });
      // setStatus('Latest photo ready');
      window.dispatchEvent(new CustomEvent('pipeline:changed'));
    } finally {
      captureInFlightRef.current = false;
    }
  };

  const startCamera = async () => {
    if (streamRef.current) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      // setStatus('Webcam access is unavailable');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsRunning(true);
      // setStatus('Capturing latest photo');
      await captureFrame();
      scheduleCapture(captureIntervalMs);
    } catch (error: unknown) {
      console.error('Failed to start webcam:', error);
      stopCamera();
      // setStatus('Webcam permission was denied');
    }
  };

  useEffect(() => () => {
    if (captureTimerRef.current !== null) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  return (
    <>
      <NodeWrapper type="webcam" tools={<>
        <Button
          variant={isRunning ? 'outlined' : 'contained'}
          color={isRunning ? 'error' : 'primary'}
          startIcon={isRunning ? <CircleStop size={16} /> : <Camera size={16} />}
          onClick={() => (isRunning ? stopCamera() : void startCamera())}
        >
          {isRunning ? 'Stop' : 'Start'}
        </Button>
      </>}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ borderRadius: 8, overflow: 'hidden' }}>
            <video
              ref={videoRef}
              muted
              autoPlay
              playsInline
              style={{ width: '500px', aspectRatio: '4 / 3', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {previewUrl && (
              <img src={previewUrl} alt="Latest webcam capture" style={{ width: '80px', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '8px' }} />
            )}
            <Box sx={{ px: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <AdjustmentSlider
                description={'Interval (ms)'}
                min={MIN_CAPTURE_INTERVAL_MS}
                max={MAX_CAPTURE_INTERVAL_MS}
                step={1}
                debounceMs={250}
                value={captureIntervalMs}
                onChange={(value) => {
                  const nextIntervalMs = Array.isArray(value) ? value[0] : value;
                  setCaptureIntervalMs(nextIntervalMs);
                  if (streamRef.current) scheduleCapture(nextIntervalMs);
                }}
              />
              <AdjustmentSlider
                description={'Quality'}
                min={MIN_CAPTURE_QUALITY}
                max={MAX_CAPTURE_QUALITY}
                step={0.05}
                debounceMs={250}
                value={captureQuality}
                onChange={(value) => {
                  const nextQuality = Array.isArray(value) ? value[0] : value;
                  captureQualityRef.current = nextQuality;
                  setCaptureQuality(nextQuality);
                }}
              />
              <AdjustmentSlider
                description={'Size'}
                min={MIN_CAPTURE_SIZE}
                max={MAX_CAPTURE_SIZE}
                step={5}
                debounceMs={250}
                value={captureSize}
                onChange={(value) => {
                  const nextSize = Array.isArray(value) ? value[0] : value;
                  captureSizeRef.current = nextSize;
                  setCaptureSize(nextSize);
                }}
              />
            </Box>
          </Box>
        </Box>
      </NodeWrapper>
      <OutputHandle id="image" position={Position.Right} />
    </>
  );
}

export default WebcamNode;
