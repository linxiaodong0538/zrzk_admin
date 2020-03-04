import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 部门
 */
export class ProductService extends SuperService {

    constructor() {
        super({ url: '/product' });
    }

    /**
     * 根据产品类型获取产品列表
     * @param {*} param0 
     * @param {*} param0.productTypeId  产品类型id
     * 
     */
    getProductsByTypeId({ productTypeId }) {
        return this.invoke({
            url: `/device/deviceRegister/getProductByProductTypeId/${productTypeId}`,
            method: 'get'
        })
    }

    getFields({ id }) {
        return this.invoke({
            url: `/device/deviceRegister/${id}/fields`,
            method: 'get'
        });
    }

    /**
     * 根据产品id获取所有传感器列表
     * @param {*} param0 
     * @param {*} param0.productId 
     */
    getSensors({ productId }) {
        return this.invoke({
            url: `/product/selectSensorByProductId/${productId}`,
            method: 'get'
        });
    }

    /**
     * 查询配置数据
     * @param {*} param0 
     * @param {*} param0.productId 产品ID 
     * @param {*} param0.type 参数类型 - 1:上传数据,2:下发数据,3:配置数据
     */
    getBuiltins({ productId, type }) {
        return this.invoke({
            url: `/product/selectProductField`,
            method: 'post',
            data: { productId, type }
        });
    }

    /**
     * 产品添加运维数据
     * @param {*} param0 
     * @param {*} param0.productId 产品ID 
     * @param {*} param0.type 参数类型 - 1:上传数据, 2:下发数据,3:配置数据
     */
    addBuiltin(parameters) { 
        return this.invoke({
            url: `/product/addProductField`,
            method: 'post',
            data: parameters
        });
    }
    /**
     * 产品移除运维数据
     * @param {*} param0 
     * @param {*} param0.productId 产品ID 
     * @param {*} param0.type 参数类型 - 1:上传数据,2:下发数据,3:配置数据
     */
    removeBuiltin(parameters) {
        return this.invoke({
            url: `/product/removeProductField`,
            method: 'delete',
            data: parameters
        });
    }

    /**
     * 产品添加传感器
     * @param {*} parameters 
     */
    addSensor(parameters) {
        return this.invoke({
            url: `${this.url}/addSensor`,
            method: 'post',
            data: parameters
        });
    }

    /**
     * 产品移除传感器
     * @param {*} parameters 
     * @param {*} parameters.type 参数类型 - 1:上传数据,2:下发数据,3:配置数据
     */
    removeSensor(parameters) {
        return this.invoke({
            url: `${this.url}/removeSensor`,
            method: 'delete',
            data: parameters
        });
    }

}
