This component is used inside App.js
App passes a function called onScan
When a barcode is detected → this module calls that function
Scanner → detects barcode → calls onScan(barcode) → App.js handles it
When a barcode is found:

onScan(decodedText);
Flow:

User selects image
        ↓
FileReader converts it to usable format
        ↓
Library tries to scan it
        ↓
If success → barcode returned
        ↓
If fail → fallback method (canvas decoding)