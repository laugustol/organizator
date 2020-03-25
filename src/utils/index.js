export const randString = () => {
	let rand = '';
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    let i = 0
    for (i = 0; i < 7; i++){
        rand += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return rand;
}