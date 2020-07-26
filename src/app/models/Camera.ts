export class Camera {
    id: number;
    deviceNo: string;
    constructor(id:number, deviceNo:string) {
        this.id = id;
        this.deviceNo = deviceNo;
    }

    getId(){
        return this.id;
    }

    getDeviceNo(){
        return this.deviceNo;
    }

}
