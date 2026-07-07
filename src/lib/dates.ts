export class PersonnalDateFormatter {
    static toTimestamptz = (date : Date)=> {
        return date.toISOString();
    }

    static actualTimestamptz = ()=> {
        return (new Date()).toISOString();
    }

    static timestampTzToDate = (dateInTimestamp: string) => {
        return new Date(dateInTimestamp)
    }
}