export class CameraAssignment {
    id: number;
    cameraId: number;
    vehicleId: number;
    dateCreated: Date;
    deleted: boolean;

    constructor(id: number, cameraId:number,vehicleId:number,dateCreated:Date,deleted:boolean) {
        this.id = id;
        this.cameraId = cameraId;
        this.vehicleId = vehicleId;
        this.dateCreated = dateCreated;
        this.deleted = deleted;
    }
}
