let date_validator = new function () {
    let self = this;
    self.DateValidator = (startDate, endDate) => {
        if (new Date(startDate) < new Date(new Date().toDateString()) && new Date(endDate) < new Date(new Date().toDateString())) {
            return 1;
        }
        if (new Date(startDate) < new Date(new Date().toDateString())) {
            return 2;
        }
        if (new Date(endDate) < new Date(new Date().toDateString())) {
            return 3;
        }
        if (new Date(endDate) < new Date(startDate)) {
            return 4;
        }
        return 0;
    }
}