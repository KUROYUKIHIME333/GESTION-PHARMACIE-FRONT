export class PersonnalDateFormatter {
  static toTimestamptz = (date: Date) => {
    return date.toISOString();
  };

  static actualTimestamptz = () => {
    return new Date().toISOString();
  };

  static fromTimestampTz = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp);
  };

  static toDate = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR");
  };

  static toDateTime = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  static toLongDate = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  static toLongDateTime = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  static toIsoDate = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toISOString().split("T")[0];
  };

  static toTime = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  static toTimeWithSecond = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  static toPreciseTime = (dateInTimestamp: string) => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "numeric",
    });
  };
}
