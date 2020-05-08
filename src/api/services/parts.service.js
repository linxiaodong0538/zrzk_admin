import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 井盖智能设备
 */
export class PartsService extends SuperService {

    constructor() {
        super({ url: '/parts' });
    }


    /**
     * 获取地图上所有的部件
     */
    getMapList(){ 
        return this.invoke({
            url: `${this.url}/listAll`,
            method: 'get'
        })
    }

    /**
     * 获取日志
     * @param {*} param0 
     */
    getPartsLogList({ beginTime, endTime, partsId, oprName }) {
        return this.invoke({
            url: `${this.url}/partsLogList`,
            method: 'get',
            params: { beginTime, endTime, partsId, oprName }
        })
    }
    
    /**
     * 部件操作记录,复杂查询
     * @param {*} parameters 
     */
    searchPartsLogList(parameters) {
        return this.invoke({
            url: `${this.url}/partsLogList/query`,
            method: 'post',
            data: parameters
        })
    }

 
    /**
     * 根据部件ID查询绑定的设备
     * @param {*} param0 
     */
    getSelectDeviceByPartsId({ partsId }) {
        return this.invoke({
            url: `${this.url}/selectDeviceByPartsId/${partsId}`,
            method: 'get'
        })
    }

    /**
     * 根据部件ID查询部件日志列表
     * @param {*} param0 
     */
    getPartsLogListByPartsId({ partsId }) {
        return this.invoke({
            url: `${this.url}/partsLogListByPartsId/${partsId}`,
            method: 'get'
        })
    }

    /**
     * 获取操作员
     */
    getUserList() {
        return this.invoke({
            url: `${this.url}/userList`,
            method: 'get'
        })
    }

}
