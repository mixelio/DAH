export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;

          // Успешная загрузка
          img.onload = () => {
            console.log('is loaded');
            resolve();
          };

          // Ошибка загрузки
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        })
    )
  );
};
