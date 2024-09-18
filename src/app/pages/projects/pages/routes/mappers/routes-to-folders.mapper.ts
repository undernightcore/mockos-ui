import {
  FolderInterface,
  RouteInterface,
} from 'src/app/interfaces/route.interface';
import { FolderAndRoutesInterface } from '../interfaces/folder-and-routes.interface';

export const mapRoutesToFolders = (
  routes: Array<RouteInterface | FolderInterface>
): Array<RouteInterface | FolderAndRoutesInterface> => {
  const folders = new Map<number, RouteInterface | FolderAndRoutesInterface>();

  for (const route of routes) {
    if (route.is_folder) {
      folders.set(route.id, { folder: route, routes: [], is_folder: true });
    } else if (route.parentFolderId) {
      const folder = folders.get(route.parentFolderId);
      if (!folder?.is_folder) continue;
      
      folder.routes.push(route);
    } else {
      folders.set(route.id, route);
    }
  }

  return [...folders.values()];
};
