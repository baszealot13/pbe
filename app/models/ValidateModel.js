"use strict";

function ValidateModel () {
    var self = this;

    self.check = function (data, rules) {
        if (typeof rules.requires !== 'undefined') {
            for (var i = 0; i < rules.requires.length; i++) {
                if (typeof data[rules.requires[i].id] === 'undefined' || data[rules.requires[i].id] === null || data[rules.requires[i].id] === '') {
                    console.log(data[rules.requires[i].id]);
                    noty({ theme: 'relax', type: 'warning', text: rules.requires[i].text + ': cannot be blank!', timeout: 3000 });
                    return false;
                    break;
                }
            }
        }
        
        if (typeof rules.number !== 'undefined') {    
            for (var i = 0; i < rules.number.length; i++) {
                if (typeof data[rules.number[i].id] !== 'undefined' && data[rules.number[i].id] !== null && isNaN(data[rules.number[i].id]) === true) {
                    noty({ theme: 'relax', type: 'warning', text: rules.number[i].text + ': must be only number!', timeout: 3000 });
                    return false;
                    break;
                }
            } 
        }

        return true;
    };

    return self;
};