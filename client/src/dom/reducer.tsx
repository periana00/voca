import Cookie from '../utils';

const cookie = new Cookie();

let wordsNum = 0;

export function wordsReducer(state: { words:any[], focus:number }, action: { type: string, [key:string]: any}) {

    const { words, focus } = state;

    const result = { words, focus };

    switch(action.type) {
        case 'setWords':
            result.words = action.words;
            break;
        case 'checkWord':
            const id = action.word.id;
            const row = words.find((v:any) => v.id == id)
            row.checked = action.word.checked;
            row.passed = action.word.passed;
            break;
        case 'change':
            if (!action.value || action.value < 1) result.focus =  1;
            else if (action.value > words.length) result.focus = words.length;
            else result.focus = action.value;
            break;
        case 'up':
            if (state.focus == 1) return state;
            result.focus -= 1;
            break;
        case 'down':
            if (state.focus == words.length) return {words, focus};
            result.focus += 1;
            break;
    }

    cookie.set({focus:result.focus});
    return result;
}



// export function wordsReducer(state: any, action: { type: string, words?: any, word?: any }) {   
//     switch(action.type) {
//         case 'all':
//             wordsNum = action.words.length;
//             return action.words;
//         case 'check':
//             const id = action.word.id;
//             const row = state.find((v: any) => v.id == id);
//             row.checked = action.word.checked;
//             row.passed = action.word.passed;
//             return state.slice();
//     }
// }

export function focusReducer(state: any, action: { type: string, value?: any }) {
    switch(action.type) {
        case 'change':
            if (!action.value || action.value < 0) return 0;
            if (action.value > wordsNum) return wordsNum;
            return action.value;
        case 'up':
            break;
        case 'down':
            break;
    }
}