import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 井盖智能设备
 */
export class PartsTypeService extends SuperService {

    constructor() {
        super({ url: '/partsType' });
    }

    /**
     * 根据部件类型查询自定义字段
     * @param {*} param0 
     */
    getFields({ id }){
        return this.invoke({
            url: `${this.url}/fieldListByTypeId/${id}`,
            method: 'get'
        });
    }

    /**
     * 根据父类查询子类列表
     * @param {*} param0 
     * @param {*} param0.id  父类ID 
     */
// 根据父类查询子类列表
// /partsType/partsTypeByParentId/{parentType}
// 根据父类查询子类列表
// /partsType/getPartsTypeListByDictDate/{parentType}
    getPartsTypeByParentId({ id }){        
        return this.invoke({
            url: `${this.url}/partsTypeByParentId/${id}`,
            method: 'get'
        });
    }
  
}
