export default class Cookie {
    constructor(initParams: { [key:string]: string | number} = {
        focus: 1,
        min: 5,
        max: 5,
        random: 0,
        checked: 0,
        passed: 0,
        sort: 0,
        reset: 0,
    }) {
        const cookies = this.get();
        const expired = new Date();
        expired.setTime(expired.getTime() + 7 * 24 * 60 * 60 * 1000);
        for (let key in initParams) {
            if (key in cookies) continue;
            document.cookie = key + '=' + initParams[key] + ';expires=' + expired.toUTCString() + ';path=/' + this.get().path;
        }
    }

    get() {
        if (document.cookie) {
            return document.cookie.split(';') // ["key=value"]
            .map(v => v.split('=')) // [[key,value]]
            .reduce((acc: any, [key, value]) => { // {key: value}
                acc[key.trim()] = !/[^0-9]/.test(value) ? +value : value;
                return acc;
            }, {});
        }
        else return {}
    }

    set(params: { [key:string]: string | number}, cb?: Function) {
        const expired = new Date();
        expired.setTime(expired.getTime() + 7 * 24 * 60 * 60 * 1000);
        for (let key in params) {
            document.cookie = key + '=' + params[key] + ';expires=' + expired.toUTCString() + ';path=/' + params['path'];
        }
        if (cb) {
            cb();
        }
    }
}