export default class Util {
    pagination (limit, offset): string {
        if(limit < 0) {
            limit = 0
        }

        if(offset <= 0) {
            return '';
        }

        return ' LIMIT :limit,:offset';
    }
}