export default async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        // Extract Base64 part from the data URL
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      
      reader.onerror = (error) => reject(error);
      
      reader.readAsDataURL(file);
    });

}