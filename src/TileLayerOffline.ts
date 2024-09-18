import { TileLayerOptions } from "leaflet";
import { tileLayerOffline } from "leaflet.offline";

export function generateOfflineTilelayer(
  url: string,
  options: TileLayerOptions
) {
  return tileLayerOffline(url, options);
}
