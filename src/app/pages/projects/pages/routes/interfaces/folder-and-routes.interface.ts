import { FolderInterface, RouteInterface } from "src/app/interfaces/route.interface";

export interface FolderAndRoutesInterface {
    folder: FolderInterface,
    routes: RouteInterface[],
    is_folder: true;
}