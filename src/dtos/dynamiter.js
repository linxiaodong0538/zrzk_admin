/** 动态查询条件 */
export class Dynamiter {
    /** 条件名 */
    factor = 1;
    /** 算符 */
    operator = 0;
    /** 条件值 */
    value = 0;

    constructor({ factor = '', operator = '=', value = '' } = {}) {
        this.factor = factor;
        this.operator = operator;
        this.value = value;
    }
}
