import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 部门
 */
export class ProductTypeService extends SuperService {

    constructor() {
        super({ url: '/productType' });
    }

    /** 查询产品类型列表 */
    getTypeList(){
        return this.invoke({
            url: `/device/deviceGroups/listForProductType`,
            method: 'get' 
        })
    }
  
}
