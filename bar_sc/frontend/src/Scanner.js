import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

function Scanner({ onScan }) {
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });

    scanner.render(
      (decodedText) => {
        console.log("QR Code detected from camera:", decodedText);
        onScan(decodedText);
      },
      () => {}
    );

    return () => scanner.clear().catch(() => {});
  }, [onScan]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imageDataUrl = event.target.result;
          
          // Create a unique ID for the decoder
          const decoderId = `qr-decoder-${Date.now()}`;
          
          // Create temporary container
          const tempDiv = document.createElement("div");
          tempDiv.id = decoderId;
          tempDiv.style.display = "none";
          document.body.appendChild(tempDiv);

          try {
            // Create decoder instance
            const html5QrCode = new Html5Qrcode(decoderId);
            
            console.log("Attempting to scan file...");
            
            // Try to scan the file
            const decodedResult = await html5QrCode.scanFile(imageDataUrl, true);
            
            console.log("Barcode detected:", decodedResult);
            alert("✓ Barcode detected: " + decodedResult);
            onScan(decodedResult);
            setIsProcessing(false);
            
            // Cleanup
            document.body.removeChild(tempDiv);
            
          } catch (scanError) {
            console.error("scanFile error:", scanError);
            
            // Fallback: Try decoding from canvas
            try {
              const img = new Image();
              img.crossOrigin = "anonymous";
              
              img.onload = async () => {
                try {
                  const canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0);
                  
                  const html5QrCode2 = new Html5Qrcode(decoderId);
                  const decodedResult2 = await html5QrCode2.decodeFromCanvas(canvas);
                  
                  console.log("Canvas barcode detected:", decodedResult2);
                  alert("✓ Barcode detected: " + decodedResult2);
                  onScan(decodedResult2);
                  
                } catch (canvasError) {
                  console.error("Canvas decode error:", canvasError);
                  alert("Could not detect a barcode in this image.\n\nMake sure:\n• The barcode is clear and visible\n• Good lighting\n• Proper barcode format\n\nTry using the camera scanner instead.");
                } finally {
                  setIsProcessing(false);
                  if (tempDiv.parentNode) {
                    document.body.removeChild(tempDiv);
                  }
                }
              };
              
              img.onerror = () => {
                alert("Error loading image file");
                setIsProcessing(false);
                if (tempDiv.parentNode) {
                  document.body.removeChild(tempDiv);
                }
              };
              
              img.src = imageDataUrl;
              
            } catch (fallbackError) {
              console.error("Fallback method error:", fallbackError);
              alert("Error: " + fallbackError.message);
              setIsProcessing(false);
              if (tempDiv.parentNode) {
                document.body.removeChild(tempDiv);
              }
            }
          }
          
        } catch (error) {
          console.error("Error processing image:", error);
          alert("Error processing image: " + error.message);
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        alert("Error reading file");
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div style={container}>
      <h2>Scan Medicine</h2>
      <div id="reader" style={scannerBox}></div>
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <p style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}>
          <strong> Or upload a barcode image:</strong>
        </p>
        <label style={fileInputLabel}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isProcessing}
            style={{ display: "none" }}
          />
          <span style={fileInputButton}>
            {isProcessing ? " Processing..." : " Choose Barcode Image"}
          </span>
        </label>
        {imageFile && !isProcessing && (
          <p style={{ marginTop: "10px", color: "green", fontSize: "12px" }}>
             File selected: {imageFile.name}
          </p>
        )}
      </div>
    </div>
  );
}

const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px"
};

const scannerBox = {
  width: "300px",
  marginTop: "20px",
  borderRadius: "8px",
  overflow: "hidden"
};

const fileInputLabel = {
  cursor: "pointer",
  display: "inline-block"
};

const fileInputButton = {
  padding: "12px 24px",
  backgroundColor: "#FF9800",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  display: "inline-block",
  border: "2px solid #F57C00",
  transition: "all 0.3s ease",
  userSelect: "none"
};

export default Scanner;