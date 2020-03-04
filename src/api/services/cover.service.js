import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 井盖智能设备
 */
export class CoverService extends SuperService {

    constructor() {
        super({ url: '/covers' });
    }
  
}
