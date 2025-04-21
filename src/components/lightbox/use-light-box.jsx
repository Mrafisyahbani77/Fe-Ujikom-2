import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function useLightBox(slides = []) {
  const [selected, setSelected] = useState(-1);

  const handleOpen = useCallback(
    (indexOrUrl) => {
      // If indexOrUrl is a number, use it directly
      if (typeof indexOrUrl === 'number') {
        setSelected(indexOrUrl);
        return;
      }

      // Otherwise, try to find the slide by URL
      const slideIndex = slides.findIndex(
        (slide) =>
          slide.src === indexOrUrl || (slide.sources && slide.sources[0]?.src === indexOrUrl)
      );

      setSelected(slideIndex >= 0 ? slideIndex : 0);
    },
    [slides]
  );

  const handleClose = useCallback(() => {
    setSelected(-1);
  }, []);

  return {
    selected,
    open: selected >= 0,
    onOpen: handleOpen,
    onClose: handleClose,
    setSelected,
  };
}
