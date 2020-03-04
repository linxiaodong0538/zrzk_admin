import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 小区
 */
export class CommunityService extends SuperService {

    constructor() {
        super({ url: '/basedata/community' });
    } 
}
