import { Component } from '@angular/core';
import { ManagerService } from './manager.service';
import { Camera } from './models/Camera';
import { Vehicle } from './models/Vehicle';
import { MatTableDataSource } from '@angular/material/table';
import { CameraAssignment } from './models/CameraAssignment';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'camera-manager';
  selectedCamera: number; selectedVehicle: number;
  rowSelection = new SelectionModel<CameraAssignment>(true, []);
  cameras:Camera[]; vehicles:Vehicle[];
  unpairedCameras; unpairedVehicles;
  dataSource;
  cameraAssignments;

  cameraAssignmentsColumns: string[] = ['select', 'id', 'cameraId', 'vehicleId', 'dateCreated', 'deleted'];

  constructor(public manager: ManagerService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let activeCa = this.manager.getCameraAssignment();
    let unpairedCamera = this.manager.getCameras();
    let unpairedVehicle = this.manager.getVehicle()
    // get latest assignments
    activeCa.subscribe(dataOptions => {
      // only show active assignments
      this.cameraAssignments = dataOptions.filter(ca => !ca.deleted);
      this.dataSource = new MatTableDataSource(this.cameraAssignments);

      // choose what items are available for new assignments 
      unpairedCamera.subscribe(cameras => {
        this.cameras = cameras;
        this.unpairedCameras = this.cameras.filter(camera => {
          return !this.cameraAssignments.some(ca => { return camera.id == ca.cameraId && !ca.deleted });
        });
      });
      unpairedVehicle.subscribe(vehicles => {
        this.vehicles = vehicles;
        this.unpairedVehicles = this.vehicles.filter(vehicle => {
          return !this.cameraAssignments.some(ca => { return vehicle.id == ca.vehicleId && !ca.deleted });
        });
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      let cameraDetails:Camera = this.cameras.find(camera => camera.id == data.cameraId) ?? null;
      let vehicleDetails:Vehicle = this.vehicles.find(vehicle => vehicle.id == data.vehicleId) ?? null;
      return cameraDetails.deviceNo.toString().indexOf(filter) != -1 ||
        vehicleDetails.name.indexOf(filter) != -1
    };
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addAssignment() {
    this.manager.getCameraAssignment().subscribe(r => {
      let newestID = Math.max.apply(Math, r.map(data => { return data.id; }));
      newestID = newestID > 0 ? ++newestID : 1;
      let newCA = new CameraAssignment(newestID, +this.selectedCamera, +this.selectedVehicle, new Date(), false);
      this.manager.addCameraAssignment(newCA).subscribe(res => {
        if (res) {
          this.loadData();
          this.selectedVehicle = null;
          this.selectedCamera = null;
        }
      });
    });
  }

  editAssignment() {
    let cameraDetails = this.cameras.find(camera => camera.id == this.rowSelection.selected[0].cameraId) ?? '';
    let vehicleDetails = this.vehicles.find(vehicle => vehicle.id == this.rowSelection.selected[0].vehicleId) ?? '';
    const dialogRef = this.dialog.open(EditAssignmentComponent, {
      data: {
        selected: this.rowSelection.selected[0],
        cameras: this.unpairedCameras,
        vehicles: this.unpairedVehicles,
        caDetails: { camera: cameraDetails, vehicle: vehicleDetails} 
      }
    });
    dialogRef.afterClosed().subscribe(closeResult => {
      this.rowSelection.deselect(this.rowSelection.selected[0])
      if (closeResult) {
        this.loadData();
      }
    })
  }


  deleteAssignments() {
    this.rowSelection.selected.forEach(row => {
      this.rowSelection.deselect(row);
      row.deleted = true;
      this.manager.updateCameraAssignment(row).subscribe(res => {
        if (res) {
          this.loadData();
        }
      });
    })
  }

  isAllSelected() {
    const numSelected = this.rowSelection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.rowSelection.clear() :
      this.dataSource.data.forEach(row => this.rowSelection.select(row));
  }

  checkboxLabel(row?: CameraAssignment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.rowSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
