Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};  


var d  = new Date("2018-11-12 14:56:40");
console.log(d.isValid());
