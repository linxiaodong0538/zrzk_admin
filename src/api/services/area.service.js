import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 区域
 */
export class AreaService extends SuperService {

    constructor() {
        super({ url: '/system/area' });
    }


}
