export const checkHeading = (dataString) => {
    return /^(\*)(\*)(.*)\*$/.test(dataString);
}


export const replaceHeadingStar = (dataString) => {
    return dataString.replace(/^(\*)(\*)|(\*$)$/g,'');
}