module.exports = function salt_generator(){
    let alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
    let num
    let salt = '';
    for(let i = 0; i < 8; i++){
        num = Math.floor((Math.random()*alphaNum.length))
        salt += alphaNum[num]
    }
    return salt
}
