export function isPhoneNumber(string) {
    if (!string) {
        return false;
    }
    console.log(string);
    var regex = new RegExp("(0[3|5|6|7|8|9])+([0-9]{8})");
    return regex.test(string);
}

export function convertToPhoneNumber(string) {
    var str = String(string);
    return str.replace(" ","").replace(".","").replace("-","");
}

export function convertPhoneNumberToTenDigits(string) {
    
}