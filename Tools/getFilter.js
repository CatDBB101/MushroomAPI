function getFilter(allRecord, filterName) {
    if (filterName == "*") {
        return allRecord;
    } else {
        var record_return = [];
        allRecord.forEach((record) => {
            recordIndex = {
                temp: 1,
                humi: 2,
                elec: 3,
                fan: 4,
            };

            record_return.push([record[0] ,record[recordIndex[filterName]]]);
        });

        return record_return;
    }
}

module.exports = getFilter;
