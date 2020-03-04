import request from '@/utils/request';
import {SuperService} from './_.service';
/**
 * 
 */
export class SensorTypeService extends SuperService {

    constructor() {
        super({ url: '/deviceSensor/sensorType' });
    }
  
}
