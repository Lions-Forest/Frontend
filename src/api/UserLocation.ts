export interface UserLocation {
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  status:
    | "nothing"
    | "studying"
    | "working"
    | "relaxing"
    | "eating"
    | "playing"
    | "boring"
    | "hungry";
  shareLocation: boolean;
}
