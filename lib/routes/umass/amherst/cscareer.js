const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.cics.umass.edu/events?field_event_type_tid%5B%5D=30&field_event_type_tid%5B%5D=62',
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('.view-events .views-row');
    ctx.state.data = {
        title: 'UMAmherst-CSCareerFair',
        link: 'https://www.cics.umass.edu/events?field_event_type_tid%5B%5D=30&field_event_type_tid%5B%5D=62',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);

                    return {
                        title: item.find('.views-field-title a').first().text(),
                        description: item.find('.views-field-field-address').text() + '<br/>' + item.find('.views-field-field-date-2').text() + '<br/>' + item.find('.views-field-body').text() + '<br/>',
                        link: item.find('.views-field-body-1 a').attr('href'),
                    };
                })
                .get(),
    };
};
