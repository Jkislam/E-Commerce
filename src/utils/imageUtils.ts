/**
 * Validates, processes, sanitizes, and compresses uploaded image files.
 * Re-renders image onto a canvas to strip any executable content, script injections, or metadata.
 * Limits file size and restricts MIME types to image/jpeg, image/png, image/webp.
 */
export interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeBytes?: number;
  quality?: number;
}

export function validateAndCompressImage(
  file: File,
  options: ImageProcessOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    maxSizeBytes = 3 * 1024 * 1024, // 3MB default
    quality = 0.8
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Strict File Type Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!file || !file.type || !allowedTypes.includes(file.type.toLowerCase())) {
      const err = new Error('শুধুমাত্র সঠিক ছবি ফরম্যাট (JPG, PNG, WEBP) আপলোড করা যাবে।');
      alert(err.message);
      return reject(err);
    }

    // 2. Strict File Size Validation
    if (file.size > maxSizeBytes) {
      const sizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      const err = new Error(`ফাইল সাইজ খুব বড়। সর্বোচ্চ ${sizeMB}MB সাইজের ছবি আপলোড করতে পারবেন।`);
      alert(err.message);
      return reject(err);
    }

    // 3. Read file and load into HTML Image element
    const reader = new FileReader();
    reader.onerror = () => {
      const err = new Error('ফাইল পড়তে সমস্যা হয়েছে।');
      alert(err.message);
      reject(err);
    };

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        const err = new Error('ফাইল খোলেনি।');
        alert(err.message);
        return reject(err);
      }

      const img = new Image();
      img.onerror = () => {
        const err = new Error('অবৈধ বা ক্ষতিগ্রস্ত ছবি ফাইল।');
        alert(err.message);
        reject(err);
      };

      img.onload = () => {
        // 4. Calculate canvas dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // 5. Draw on Canvas and compress to JPEG data URL
        // Canvas re-rendering guarantees removal of any non-image embedded malicious payloads
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const err = new Error('ক্যানভাস তৈরি করতে ব্যর্থ হয়েছে।');
          alert(err.message);
          return reject(err);
        }

        // Fill white background in case of transparent PNG being saved as JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas output to JPEG with optimal quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
