import request from '@/utils/request';
import { SuperService } from './_.service';
/**
 * 
 */
export class SensorService extends SuperService {

    constructor() {
        super({ url: '/deviceSensor' });
    }

    /**
     * 根据传感器类型id获取传感器列表
     * @param {*} param0 
     */
    getSensorsByTypeId({ sensorTypeId }) {
        return this.invoke({
            url: `${this.url}/selectSensorByType/${sensorTypeId}`,
            method: 'get'
        });
    }

}
