
interface Word {
    id: number,
    word: string,
    mean: string,
    bundle: string | null,
    papago: string,
    checked: number,
    passed: number,
}


interface Cookies {
    [key: string]: string | number,
}

export {
    Word,
    Cookies,
}