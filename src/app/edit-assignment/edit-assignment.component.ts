import { Component, Inject,  OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ManagerService } from '../manager.service';
import { CameraAssignment } from '../models/CameraAssignment';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  selectedCamera; selectedVehicle;
  unpairedCameras;  unpairedVehicles;
  caDetails;
  constructor(public dialogRef: MatDialogRef<EditAssignmentComponent>, @Inject(MAT_DIALOG_DATA) public data, public manager: ManagerService) {
      this.unpairedCameras = data.cameras;
      this.unpairedVehicles = data.vehicles;
      this.caDetails = data.caDetails;
  }

  ngOnInit(): void {
  }
  editAssignment(){
    this.data.selected.cameraId = this.selectedCamera ?? this.data.selected.cameraId;
    this.data.selected.vehicleId = this.selectedVehicle ?? this.data.selected.vehicleId;
    this.manager.updateCameraAssignment(this.data.selected).subscribe(res=>{
      this.dialogRef.close(res);
    });
  }

}
