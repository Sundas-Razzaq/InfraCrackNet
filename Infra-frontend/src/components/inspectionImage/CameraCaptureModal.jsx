import { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faCamera,
    faVideo,
    faCircle,
    faStop,
    faRotate,
    faTrash,
    faCheck,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const MAX_VIDEO_SECONDS = 30;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);

    const [mode, setMode] = useState("photo");
    const [facingMode, setFacingMode] = useState("environment");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [capturedItems, setCapturedItems] = useState([]);
    const [error, setError] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);

    /*CLEANUP*/

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) =>
                track.stop()
            );
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const stopRecordingTimer = useCallback(() => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    }, []);

    /*START CAMERA*/

    const startCamera = useCallback(async () => {
        setIsInitializing(true);
        setError("");

        stopStream();

        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode },
                    audio: mode === "video",
                });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Camera error:", err);

            let message =
                "Camera access is unavailable. Please allow camera permissions.";

            if (err.name === "NotAllowedError") {
                message =
                    "Camera access was denied. Please allow camera access in your browser settings.";
            } else if (err.name === "NotFoundError") {
                message = "No camera found on this device.";
            } else if (
                err.name === "NotReadableError" ||
                err.name === "AbortError"
            ) {
                message =
                    "Camera is in use by another application. Please close other apps and try again.";
            } else if (!window.isSecureContext) {
                message =
                    "Camera requires a secure connection (HTTPS or localhost).";
            }

            setError(message);
        } finally {
            setIsInitializing(false);
        }
    }, [facingMode, mode, stopStream]);

    /* MOUNT / UNMOUNT / MODE / FACING CHANGE
       — single consolidated effect*/

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        // Defer startCamera to a microtask so React doesn't see
        // synchronous setState inside this effect.
        const timer = setTimeout(() => {
            if (!cancelled) {
                startCamera();
            }
        }, 0);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            stopStream();
            stopRecordingTimer();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, mode, facingMode]);

    /*PHOTO CAPTURE*/

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const width = video.videoWidth;
        const height = video.videoHeight;

        if (!width || !height) {
            setError(
                "Camera is still starting. Please wait a moment."
            );
            return;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;

                const file = new File(
                    [blob],
                    `capture-${Date.now()}.jpg`,
                    { type: "image/jpeg" }
                );

                if (file.size > MAX_FILE_SIZE_BYTES) {
                    setError("Photo exceeds the 50 MB limit.");
                    return;
                }

                setCapturedItems((prev) => [...prev, file]);
            },
            "image/jpeg",
            0.92
        );
    };

    /* VIDEO RECORDING */

    const pickSupportedMimeType = () => {
        const candidates = [
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm",
            "video/mp4",
        ];

        for (const type of candidates) {
            if (
                typeof MediaRecorder !== "undefined" &&
                MediaRecorder.isTypeSupported(type)
            ) {
                return type;
            }
        }

        return "";
    };

    const startRecording = () => {
        if (!streamRef.current) return;

        const mimeType = pickSupportedMimeType();

        try {
            const recorder = new MediaRecorder(
                streamRef.current,
                mimeType ? { mimeType } : undefined
            );

            recordedChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const chunks = recordedChunksRef.current;
                const blob = new Blob(chunks, {
                    type: mimeType || "video/webm",
                });

                const extension = (mimeType || "video/webm").includes(
                    "mp4"
                )
                    ? "mp4"
                    : "webm";

                const file = new File(
                    [blob],
                    `recording-${Date.now()}.${extension}`,
                    { type: mimeType || "video/webm" }
                );

                if (file.size > MAX_FILE_SIZE_BYTES) {
                    setError(
                        "Recording exceeds the 50 MB limit. Please record a shorter clip."
                    );
                } else {
                    setCapturedItems((prev) => [...prev, file]);
                }

                recordedChunksRef.current = [];
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setRecordingSeconds(0);

            recordingTimerRef.current = setInterval(() => {
                setRecordingSeconds((prev) => {
                    const next = prev + 1;
                    if (next >= MAX_VIDEO_SECONDS) {
                        stopRecording();
                        return MAX_VIDEO_SECONDS;
                    }
                    return next;
                });
            }, 1000);
        } catch (err) {
            console.error("Recording error:", err);
            setError("Failed to start recording.");
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
        }

        stopRecordingTimer();
        setIsRecording(false);
        setRecordingSeconds(0);
    };

    const handleCapture = () => {
        if (mode === "photo") {
            capturePhoto();
        } else {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    };

    const removeCaptured = (index) => {
        setCapturedItems((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleDone = () => {
        if (capturedItems.length > 0) {
            onCapture(capturedItems);
        }
        setCapturedItems([]);
        setError("");
        onClose();
    };

    const handleClose = () => {
        if (isRecording) {
            stopRecording();
        }
        setCapturedItems([]);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    const isVideoMode = mode === "video";

    return (
        <div className="camera-modal-overlay">
            <div className="camera-modal">

                <div className="camera-modal-header">
                    <h2>Capture Media</h2>
                    <button
                        type="button"
                        className="camera-close-btn"
                        onClick={handleClose}
                        aria-label="Close camera"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="camera-preview-wrapper">
                    {isInitializing && (
                        <div className="camera-overlay-message">
                            Starting camera…
                        </div>
                    )}

                    {error && (
                        <div className="camera-error">
                            <FontAwesomeIcon
                                icon={faTriangleExclamation}
                            />
                            <p>{error}</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`camera-preview ${error ? "hidden" : ""
                            }`}
                    />

                    {isRecording && (
                        <div className="camera-recording-indicator">
                            <span className="camera-recording-dot" />
                            REC {recordingSeconds}s /{" "}
                            {MAX_VIDEO_SECONDS}s
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="camera-mode-toggle">
                    <button
                        type="button"
                        className={`camera-mode-btn ${mode === "photo" ? "active" : ""
                            }`}
                        onClick={() => setMode("photo")}
                        disabled={isRecording}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                        Photo
                    </button>

                    <button
                        type="button"
                        className={`camera-mode-btn ${mode === "video" ? "active" : ""
                            }`}
                        onClick={() => setMode("video")}
                        disabled={isRecording}
                    >
                        <FontAwesomeIcon icon={faVideo} />
                        Video
                    </button>
                </div>

                <div className="camera-controls">
                    <button
                        type="button"
                        className="camera-flip-btn"
                        onClick={() =>
                            setFacingMode((prev) =>
                                prev === "environment"
                                    ? "user"
                                    : "environment"
                            )
                        }
                        disabled={isRecording}
                        aria-label="Flip camera"
                    >
                        <FontAwesomeIcon icon={faRotate} />
                    </button>

                    <button
                        type="button"
                        className={`camera-capture-btn ${isRecording ? "recording" : ""
                            }`}
                        onClick={handleCapture}
                        disabled={isInitializing || !!error}
                        aria-label={
                            isVideoMode
                                ? isRecording
                                    ? "Stop recording"
                                    : "Start recording"
                                : "Capture photo"
                        }
                    >
                        <FontAwesomeIcon
                            icon={
                                isVideoMode
                                    ? isRecording
                                        ? faStop
                                        : faCircle
                                    : faCamera
                            }
                        />
                    </button>

                    <div className="camera-controls-spacer" />
                </div>

                {capturedItems.length > 0 && (
                    <div className="camera-gallery">
                        <h3>
                            Captured ({capturedItems.length})
                        </h3>

                        <div className="camera-gallery-grid">
                            {capturedItems.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="camera-gallery-item"
                                >
                                    {file.type.startsWith(
                                        "image/"
                                    ) ? (
                                        <img
                                            src={URL.createObjectURL(
                                                file
                                            )}
                                            alt={file.name}
                                        />
                                    ) : (
                                        <video
                                            src={URL.createObjectURL(
                                                file
                                            )}
                                            muted
                                        />
                                    )}

                                    <button
                                        type="button"
                                        className="camera-gallery-remove"
                                        onClick={() =>
                                            removeCaptured(index)
                                        }
                                        aria-label="Remove"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="camera-modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleDone}
                        disabled={capturedItems.length === 0}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        Done ({capturedItems.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraCaptureModal;