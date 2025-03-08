import { sendEvent } from '@/lib/gtag';
import { useEffect } from 'react';

interface Props {
  viz: string;
  vizRef: React.RefObject<Element>;
}
function useTrackVizViewed(props: Props) {
  useEffect(() => {
    const currentRef = props.vizRef.current;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        sendEvent('viz_viewed', {
          target: props.viz,
        });
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      }
    });
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [props.viz, props.vizRef]);
}

export default useTrackVizViewed;
