import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 项目
 */
export class ProjectService extends SuperService {

    constructor() {
        super({ url: '/device/bcProject' });
    }
}
  