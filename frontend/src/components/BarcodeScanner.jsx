import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

export default function BarcodeScanner({ onScan, onClose }) {
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scannerReady, setScannerReady] = useState(false);

  const mountedRef = useRef(true);
  const hasScannedRef = useRef(false);
  const scannerRef = useRef(null);
  const stoppedRef = useRef(false);
  const onScanRef = useRef(onScan);

  // Keep callback ref fresh without re-triggering effects
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper to safely stop the camera scanner
  const safeStopScanner = async () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        // state 2 = SCANNING, state 3 = PAUSED
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  };

  // Start camera on mount
  useEffect(() => {
    hasScannedRef.current = false;
    stoppedRef.current = false;

    const startCamera = async () => {
      try {
        // Explicitly request camera permission first
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        // Release test stream immediately
        stream.getTracks().forEach((t) => t.stop());

        if (!mountedRef.current) return;

        const scanner = new Html5Qrcode("barcode-reader", {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 130 }, aspectRatio: 1.5 },
          (decodedText) => {
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;
            console.log("Barcode from camera:", decodedText);
            // Stop first, then notify parent
            safeStopScanner().finally(() => {
              if (onScanRef.current) onScanRef.current(decodedText);
            });
          },
          () => {} // ignore per-frame misses
        );

        if (mountedRef.current) setScannerReady(true);
      } catch (err) {
        console.error("Camera init error:", err);
        if (!mountedRef.current) return;

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError(
            "Camera permission denied. Allow camera access in browser settings, or upload a barcode image below."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No camera found. Upload a barcode image below.");
        } else {
          setCameraError(`Camera error: ${err.message || err}. Upload a barcode image below.`);
        }
      }
    };

    startCamera();

    return () => {
      safeStopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsProcessing(true);

    // Stop camera first so there's no conflict
    await safeStopScanner();

    // Create a temporary element for the image decoder
    const decoderId = `img-decoder-${Date.now()}`;
    const tempDiv = document.createElement("div");
    tempDiv.id = decoderId;
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    let decoder = null;

    try {
      decoder = new Html5Qrcode(decoderId, { formatsToSupport: BARCODE_FORMATS });
      const decodedText = await decoder.scanFile(file, false);
      console.log("Barcode from image:", decodedText);
      hasScannedRef.current = true;

      // Clean up decoder BEFORE notifying parent (parent will unmount us)
      try { decoder.clear(); } catch {}
      decoder = null;
      if (tempDiv.parentNode) document.body.removeChild(tempDiv);

      // NOW notify parent — this may unmount this component
      if (onScanRef.current) onScanRef.current(decodedText);
      return; // Don't touch any state after this
    } catch (error) {
      console.error("Image scan error:", error);
      if (mountedRef.current) {
        alert(
          "Could not detect a barcode in this image.\n\nMake sure the barcode is clear, fully visible, and well lit."
        );
      }
    }

    // Cleanup only if we DIDN'T successfully scan (if we did, we already cleaned up above)
    try {
      if (decoder) decoder.clear();
    } catch {}
    if (tempDiv.parentNode) document.body.removeChild(tempDiv);
    if (mountedRef.current) setIsProcessing(false);
  };

  return (
    <div className="mt-6 rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#1f6f5b]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="8" x2="6" y2="16" />
            <line x1="9" y1="8" x2="9" y2="16" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="15" y1="8" x2="15" y2="16" />
            <line x1="18" y1="8" x2="18" y2="16" />
          </svg>
          Scan Barcode
        </h3>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Close Scanner
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Point your camera at a barcode or upload an image to auto-fill medicine
        details.
      </p>

      {/* Camera error */}
      {cameraError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          ⚠️ {cameraError}
        </div>
      )}

      {/* Loading state */}
      {!scannerReady && !cameraError && (
        <div className="mb-4 rounded-xl bg-[#fef6ec] px-4 py-3 text-sm font-medium text-[#c47a1a] flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Requesting camera permission...
        </div>
      )}

      {/* Camera feed */}
      <div className="flex justify-center">
        <div
          id="barcode-reader"
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
            overflow: "hidden",
            minHeight: cameraError ? "0" : "250px",
          }}
        />
      </div>

      {/* Divider */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#d7e8e1]" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
        <div className="h-px flex-1 bg-[#d7e8e1]" />
      </div>

      {/* Image upload */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isProcessing}
            className="hidden"
          />
          <span className="inline-block rounded-full border-2 border-[#f7b267] bg-[#fef6ec] px-5 py-2.5 text-sm font-semibold text-[#c47a1a] transition hover:bg-[#fdecd3]">
            {isProcessing ? "Processing..." : "📷 Upload Barcode Image"}
          </span>
        </label>
        {imageFile && !isProcessing && (
          <p className="text-xs text-[#1f6f5b] font-medium">
            ✓ File selected: {imageFile.name}
          </p>
        )}
      </div>
    </div>
  );
}
