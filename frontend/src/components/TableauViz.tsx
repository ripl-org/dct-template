import { Box, type SxProps, type Theme, useMediaQuery } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';

import useTrackVizViewed from '@/hooks/useTrackVizViewed';
import { sendEvent } from '@/lib/gtag';

function TableauViz(props: { src: string; sx?: SxProps<Theme>; vizId: string }) {
  const vizRef = useRef(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  useTrackVizViewed({ viz: props.vizId, vizRef });

  const handleFilterChanged = useCallback(() => {
    sendEvent('viz_mark_selection_changed', {
      target: props.vizId,
    });
  }, [props.vizId]);

  const handleMarkSelectionChanged = useCallback(() => {
    sendEvent('viz_filter_changed', {
      target: props.vizId,
    });
  }, [props.vizId]);

  const handleTabSwitched = useCallback(() => {
    sendEvent('viz_tab_switched', {
      target: props.vizId,
    });
  }, [props.vizId]);

  useEffect(() => {
    if (vizRef.current) {
      const vizEl = vizRef.current;
      // @ts-expect-error Tableau types
      vizEl.addEventListener('filterchanged', handleFilterChanged);
      // @ts-expect-error Tableau types
      vizEl.addEventListener('markselectionchanged', handleMarkSelectionChanged);
      // @ts-expect-error Tableau types
      vizEl.addEventListener('tabswitched', handleTabSwitched);
    }
  }, [vizRef, handleFilterChanged, handleMarkSelectionChanged, handleTabSwitched]);

  return (
    <Box
      sx={[
        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        // @ts-expect-error This is a Web Component
        component="tableau-viz"
        ref={vizRef}
        id="tableauViz"
        src={props.src}
        device={isMobile ? 'phone' : 'desktop'}
        hide-tabs
        toolbar="hidden"
        touch-optimize={isMobile ? true : undefined}
      />
    </Box>
  );
}

export default TableauViz;
