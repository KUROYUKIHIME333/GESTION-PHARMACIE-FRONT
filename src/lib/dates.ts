export class PersonnalDateFormatter {
  /**
   * Convertit une date au format Date en une chaine timestampTz (format de dates dans POSTGRESQL)
   *
   * @param date Date au format Date
   * @returns La meme date en chaine timestampTz
   */
  static toTimestamptz = (date: Date): string => {
    return date.toISOString();
  };

  /**
   * Donne la date actuelle mais au format timestampTz
   *
   * @returns La date actuelle chaine timestampTz
   */
  static actualTimestamptz = (): string => {
    return new Date().toISOString();
  };

  /**
   * Convertit une chaine timestampTz (format de dates dans POSTGRESQL) en une date au format Date
   *
   * @param dateInTimestamp Date au format timestampTz (string)
   * @returns La même date au format Date de js
   */
  static fromTimestampTz = (dateInTimestamp: string): Date => {
    return new Date(dateInTimestamp);
  };

  static toDate = (dateInTimestamp: string): string => {
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
