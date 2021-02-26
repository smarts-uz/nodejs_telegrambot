const { Markup } = require("telegraf");

exports.keyboards = {
    start: Markup.keyboard([
        'Uz', 'Ru', 'En'
    ]).oneTime().resize().extra()
}