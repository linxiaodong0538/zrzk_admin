import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 部门、分组
 */
export class OrganizationService extends SuperService {

    constructor() {
        super({ url: '/device/deviceGroups' });
    }

    /** 移出分组 */
    removeGroup({ deviceIds, groupIds }) {
        return this.invoke({
            url: `${this.url}/removeGroup`,
            method: 'post',
            data: { deviceIds, groupIds }
        });
    }

    updateGroups({ deviceIds, groupIds }) {
        return this.invoke({
            url: `${this.url}/updateGroups`,
            method: 'post',
            data: { deviceIds, groupIds }
        });

    }
}
