// utils.js
const replaceVariables = (template, data) => {
    return template.replace(/{{(.*?)}}/g, (match, key) => {
        return data[key.trim()] || match;
    });
};

module.exports = replaceVariables;



