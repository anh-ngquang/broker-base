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
    return str.replace(/ /g, '').replace(/\./g, '').replace(/,/g, '').replace(/-/g, '');
}

export function convertPhoneNumberToTenDigits(string) {
    var str = String(string);
    if (!str.startsWith("01")) {
        return str;
    }

    var regexVina = new RegExp("^012(3|4|5|7|9)");
    var regexMobi = new RegExp("^012(0|1|2|6|8)");

    if (str.startsWith("016")) {
        var tailStr = str.substring(3);
        return "03" + tailStr;
    } else if (regexVina.test(str)) {
        var tailStr = str.substring(4);

        if (str.startsWith("0123")) {
            return "083" + tailStr;
        } else if (str.startsWith("0124")) {
            return "084" + tailStr;
        } else if (str.startsWith("0125")) {
            return "085" + tailStr;
        } else if (str.startsWith("0127")) {
            return "081" + tailStr;
        } else if (str.startsWith("0129")) {
            return "082" + tailStr;
        }
    } else if (regexMobi.test(str)) {
        var tailStr = str.substring(4);

        if (str.startsWith("0120")) {
            return "070" + tailStr;
        } else if (str.startsWith("0121")) {
            return "079" + tailStr;
        } else if (str.startsWith("0122")) {
            return "077" + tailStr;
        } else if (str.startsWith("0126")) {
            return "076" + tailStr;
        } else if (str.startsWith("0128")) {
            return "078" + tailStr;
        }
    }
}