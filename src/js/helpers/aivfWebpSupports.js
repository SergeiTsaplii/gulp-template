const avifWebpSupports = () => {
  const supportsAvif = new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('error', () => resolve(false));
    image.addEventListener('load', () => resolve(image.width === 2));
    image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  }).catch(() => false);

  const supportsWebp = new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('error', () => resolve(false));
    image.addEventListener('load', () => resolve(image.width === 1));
    image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  }).catch(() => false);

  supportsAvif.then((supported) => {
    if (supported) {
      document.documentElement.classList.add('avif');
    } else {
      supportsWebp();
      document.documentElement.classList.add('webp');
    }
  });
};

export default avifWebpSupports;
