function getFilter(allRecord, filterName) {
    if (filterName == "*") {
        return allRecord;
    } else {
        var record_return = [];
        allRecord.forEach((record) => {
            recordIndex = {
                date: 0,
                temp: 1,
                humi: 2,
                elec: 3,
                fan: 4,
            };

            record_return.push(record[recordIndex[filterName]]);
        });

        return record_return;
    }
}

module.exports = getFilter;
