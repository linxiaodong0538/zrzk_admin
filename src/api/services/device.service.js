import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 部门
 */
export class DeviceService extends SuperService {

    constructor() {
        super({ url: '/device/deviceRegister' });
    }


    getParts() {
        return this.invoke({
            url: `${this.url}/getPartsList`,
            method: 'get'
        })
    }


}
