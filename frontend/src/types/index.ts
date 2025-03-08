export type IncidentReport<T = object> = {
  id: string;
  Longitude: number;
  Latitude: number;
  Location: string;
  TimeDateReported: string;
} & T;

export type IconsByCategory = Record<string, React.ReactElement>;

export type TooltipElement = {
  text: string;
  objectKey: string;
};
