import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Camera } from './models/Camera';
import { CameraAssignment } from './models/CameraAssignment';
import {Vehicle} from './models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(public httpClient:HttpClient) { }

  getCameras():Observable<Camera[]> {
    return this.httpClient.get<Camera[]>(environment.serverUrl+"/camera");
  }
  updateCameras(camera:Camera):Observable<Camera> {
    return this.httpClient.post<Camera>(environment.serverUrl+"/camera/",  camera);
  }
  deleteCameras(cameraId):Observable<Object> {
    return this.httpClient.delete(environment.serverUrl+"/camera/"+cameraId);
  }

  getCameraAssignment():Observable<CameraAssignment[]> {
    return this.httpClient.get<CameraAssignment[]>(environment.serverUrl+"/cameraAssignment");
  }
  updateCameraAssignment(cameraAssignment:CameraAssignment):Observable<CameraAssignment> {
    return this.httpClient.put<CameraAssignment>(environment.serverUrl+"/cameraAssignment/"+cameraAssignment.id,  cameraAssignment);
  }
  addCameraAssignment(cameraAssignment){
    return this.httpClient.post<CameraAssignment>(environment.serverUrl+"/cameraAssignment/",  cameraAssignment);
  }
  deleteCameraAssignment(cameraAssignmentId):Observable<Object> {
    return this.httpClient.delete(environment.serverUrl+"/cameraAssignment/"+cameraAssignmentId);
  }

  getVehicle():Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(environment.serverUrl+"/vehicle");
  }
  updateVehicle(vehicle:Vehicle):Observable<Vehicle> {
    return this.httpClient.post<Vehicle>(environment.serverUrl+"/vehicle/",  Vehicle);
  }
  deleteVehicle(vehicleId):Observable<Object> {
    return this.httpClient.delete(environment.serverUrl+"/vehicle/"+vehicleId);
  }

}
