import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 部门
 */
export class LampService extends SuperService {

    constructor() {
        super({ url: '/lightPole/deviceLight' });
    }


    getParts() {
        return this.invoke({
            url: `${this.url}/getPartsList`,
            method: 'get'
        })
    }

    /**
     * 根据设备id获取上传的参数
     * @param {*} param0 
     */
    getFields({ productId, type = 1 }) {
        return this.invoke({
            url: `${this.url}/productFieldList`,
            method: 'post',
            data: { productId, type }
        });
    }

    /**
     * 获取产品列表
     * @param {*} param0 
     */
    getProducts({ productTypeId = 3 }) {

        return this.invoke({
            url: `${this.url}/listForProduct/${productTypeId}`,
            method: 'get'
        });
    }

    /**
     * 获取产品列表
     * @param {*} param0 
     */
    searchHistory(parameters) {
        return this.invoke({
            url: `${this.url}/queryForHistory`,
            method: 'post',
            data: parameters
        });
    }
    
    /**
     * 获取设备实时详细上传数据
     * @param {*} parameters 
     */
    getUploadFieldByDeviceIdForList({ deviceId, pageNum = 1, pageSize = 10 }) {
        return this.invoke({
            url: `${this.url}/getUploadFieldByDeviceIdForList`,
            method: 'post',
            data: { deviceId, pageNum, pageSize }
        })

    }

}
