/**
 * compressPhoto — canvas-based client-side image compression
 * ─────────────────────────────────────────────────────────────────
 * Reads a File object, draws it onto an offscreen canvas at the
 * specified max dimension, and returns a base64 data-URL compressed
 * to the given JPEG quality.
 *
 * @param {File}   file       - Input image file (any format)
 * @param {number} maxDim     - Max width/height in px (default 300)
 * @param {number} quality    - JPEG quality 0-1 (default 0.82 ≈ ~40-80 KB)
 * @returns {Promise<string>} base64 data-URL (image/jpeg)
 */
export function compressPhoto(file, maxDim = 300, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.onload = (ev) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Image load failed'))
      img.onload = () => {
        try {
          // Compute scaled dimensions preserving aspect ratio
          const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
          const w = Math.round(img.width  * scale)
          const h = Math.round(img.height * scale)

          const canvas = document.createElement('canvas')
          canvas.width  = w
          canvas.height = h

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)

          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        } catch (err) {
          reject(err)
        }
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}
