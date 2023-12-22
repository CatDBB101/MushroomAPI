function getRecord(allRecord, minTime, maxTime) {
    if (minTime == "*") {
        // ? First date in record
        minDate = allRecord[0][0];
    } else {
        minDate = new Date(minTime);
    }

    if (maxTime == "*") {
        let recordsLength = allRecord.length;
        maxDate = allRecord[recordsLength - 1][0];
    } else {
        maxDate = new Date(maxTime);
    }

    // console.log(minDate, maxDate);
    // console.log(allRecord);

    var record_return = [];

    allRecord.forEach((record) => {
        // console.log(record);
        var recordDate = record[0];

        if (minDate <= recordDate && recordDate <= maxDate) {
            console.log("record :",recordDate);
            record_return.push(recordDate);
        }
    });

    return record_return;
}

module.exports = getRecord;
