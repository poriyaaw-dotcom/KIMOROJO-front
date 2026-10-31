   export const getSafeFirstImage = (images: any): string => {
     if (!images) return '';
     
     // If it's already an array, get the first item
     if (Array.isArray(images)) {
       return images[0] ? `https://admin.kimorojo.ir/storage/${images[0]}` : '';
     }
     
     // If it's a string (Laravel JSON string), parse it safely
     if (typeof images === 'string') {
       try {
         const parsed = JSON.parse(images);
         const firstImage = Array.isArray(parsed) ? parsed[0] : parsed;
         return firstImage ? `https://admin.kimorojo.ir/storage/${firstImage}` : '';
       } catch (e) {
         // If it's just a plain filename string without brackets
         return images.startsWith('http') ? images : `https://admin.kimorojo.ir/storage/${images}`;
       }
     }
     
     return '';
   };