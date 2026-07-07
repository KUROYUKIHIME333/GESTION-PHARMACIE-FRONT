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

  /**
   * Convertit une chaine timestampTz (format de dates dans POSTGRESQL) en une date js mais comme une chaine string
   *
   * @param dateInTimestamp Date au format timestampTz (string)
   * @returns La même date au format Date de js mais comme une chaine string
   */
  static toDate = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR");
  };

  /**
   * Convertit une chaine timestampTz (format de dates dans POSTGRESQL) en une date js mais comme une chaine string, avec en plus l'heure (hh:mm)
   *
   * @param dateInTimestamp Date au format timestampTz (string)
   * @returns La même date au format Date de js mais comme une chaine string, mais avec en plus l'heure (hh:mm)
   */
  static toDateTime = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  /**
   * Convertit une chaine timestampTz (format de dates dans POSTGRESQL) en une date js mais comme une chaine string, avec en plus l'heure (hh:mm:ss)
   *
   * @param dateInTimestamp Date au format timestampTz (string)
   * @returns La même date au format Date de js mais comme une chaine string, mais avec en plus l'heure (hh:mm:ss)
   */
  static toDateTimeSecond = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      second: "2-digit",
    });
  };

  /**
   * Convertit une chaine timestampTz (format de dates dans POSTGRESQL) en une date js mais comme une chaine string, avec en plus l'heure (hh:mm:secondes décimales)
   *
   * @param dateInTimestamp Date au format timestampTz (string)
   * @returns La même date au format Date de js mais comme une chaine string, mais avec en plus l'heure (hh:mm:secondes décimales)
   */
  static toDatePreciseTime = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      second: "numeric",
    });
  };

  static toLongDate = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  static toLongDateTime = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  static toIsoDate = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toISOString().split("T")[0];
  };

  static toTime = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  static toTimeWithSecond = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  static toPreciseTime = (dateInTimestamp: string): string => {
    return new Date(dateInTimestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "numeric",
    });
  };
}
