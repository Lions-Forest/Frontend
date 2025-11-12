export interface UserLocation {
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "studying" | "eating" | "offline";
  shareLocation: boolean;
}
