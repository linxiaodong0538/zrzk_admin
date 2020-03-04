import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 部门
 */
export class DepartmentService extends SuperService {

    constructor() {
        super({ url: '/departments' });
    }
  
}
