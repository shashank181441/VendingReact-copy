// Add this in a main component (e.g., `App.jsx`) or a custom hook
import { useEffect } from 'react';

function usePreventSwipeNavigation() {
  useEffect(() => {
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      // Detect horizontal swipe
      if (Math.abs(deltaX) > 50) {
        e.preventDefault();
      }
    };

    // Attach listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // Clean up listeners on unmount
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
}

export default usePreventSwipeNavigation;
