export const toTime = (x)=> {
    let secondi = x % 60;
    let minuti = x - secondi;
    minuti = minuti / 60 >= 10 ? minuti / 60 : "0" + minuti / 60;
    secondi = secondi >= 10 ? secondi : "0" + secondi;
    return minuti + ":" + secondi;
}


export const calcolaTempo = (cursor) => { // calcola il tempo corrente
    if (cursor.curr != null && cursor.max != null) {
        return cursor.curr / cursor.max;
    } else {
        return 0;
    }
}


export const renderCurrentTime =(cursor)=> {
    let t = cursor.curr / 1000;
    return toTime(t.toFixed());
};