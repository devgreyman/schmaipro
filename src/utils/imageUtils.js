/**
 * Compresses and resizes an uploaded image file into a lightweight base64 Data URL.
 * Supports PNG, JPG, JPEG, SVG, WebP, GIF.
 * Ensures images fit comfortably within localStorage limits while maintaining high clarity.
 */
export function resizeImageToBase64(file, maxWidth = 200, maxHeight = 200) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    // 1. If it's an SVG file, read raw vector Data URL directly
    if (file.type === 'image/svg+xml' || file.name?.toLowerCase().endsWith('.svg')) {
      const svgReader = new FileReader();
      svgReader.onload = (e) => resolve(e.target.result || '');
      svgReader.onerror = () => resolve('');
      svgReader.readAsDataURL(file);
      return;
    }

    // 2. For raster images (PNG, JPG, WebP), resize through HTML5 Canvas
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrlResult = e.target.result;
      if (!dataUrlResult) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrlResult);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // For transparency preservation: use PNG; fallback to JPEG if large
          const compressed = canvas.toDataURL('image/png');
          resolve(compressed);
        } catch (canvasErr) {
          // If canvas fails, fallback to direct data url
          resolve(dataUrlResult);
        }
      };

      img.onerror = () => {
        resolve(dataUrlResult);
      };

      img.src = dataUrlResult;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}
