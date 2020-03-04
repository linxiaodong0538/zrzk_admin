/** 分页 */
export class Paginator {
    /** 页码 */
    index = 1;
    /** 页数 */
    count = 0;
    /** 总条数 */
    all = 0;
    /** 每页大小 */
    size = 10;

    constructor({ index = 1, count = 0, all = 0, size = 10 } = {}) {
        this.index = index;
        this.count = count;
        this.all = all;
        this.size = size;
    }
}
