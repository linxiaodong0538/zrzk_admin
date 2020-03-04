import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 用户
 */
export class UserService extends SuperService {

    constructor() {
        super({ url: '/system/users' });
    }

}
