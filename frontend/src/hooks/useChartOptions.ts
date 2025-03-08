import { useTheme } from '@mui/material';
import { type ApexOptions } from 'apexcharts';
import merge from 'lodash/merge';

function useChartOptions(options: ApexOptions) {
  const theme = useTheme();
  const baseOptions: ApexOptions = {
    // Colors
    colors: [
      '#2D846C',
      '#0067A2',
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.dark,
      theme.palette.success.dark,
      theme.palette.info.dark,
      theme.palette.info.dark,
    ],

    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: theme.typography.fontFamily,
    },

    // States
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.88,
        },
      },
    },
    noData: {
      text: 'No data available',
    },

    // Fill
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    // Grid
    yaxis: {
      axisBorder: {
        show: true,
      },
      title: {
        style: {
          fontWeight: 'regular',
          fontSize: '14px',
          color: '#666666',
        },
      },
    },

    // Xaxis
    xaxis: {
      labels: {
        style: {
          fontSize: '14px',
          colors: '#666666',
        },
      },
    },

    // Markers
    markers: {
      size: 0,
      strokeColors: theme.palette.background.paper,
    },

    // Legend
    legend: {
      show: true,
      fontSize: '14px',
      position: 'bottom',
      horizontalAlign: 'left',
      markers: {
        radius: 0,
      },
      fontWeight: 400,
      labels: {
        colors: '#666666',
      },
    },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        columnWidth: '60%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },

      // Radar
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider,
        },
      },

      // polarArea
      polarArea: {
        rings: {
          strokeColor: theme.palette.divider,
        },
        spokes: {
          connectorColors: theme.palette.divider,
        },
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '60%' } },
        },
      },
    ],

    dataLabels: {
      style: {
        fontSize: '16px',
        fontWeight: 'normal',
      },
      offsetY: 4,
    },
  };

  return merge(baseOptions, options);
}

export default useChartOptions;
