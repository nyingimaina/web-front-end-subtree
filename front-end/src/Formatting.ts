export default class Formatting {
  private static formatDate(dateInput?: Date | string): Date {
    if (!dateInput) throw new Error("Invalid date input");

    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) throw new Error("Invalid date format");

    return date;
  }

  static toDDMMMYYYYHHMMSSAP(dateInput?: Date | string): string {
    const date = this.formatDate(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours24 >= 12 ? "PM" : "AM";

    return `${day}-${month}-${year} ${String(hours12).padStart(
      2,
      "0"
    )}:${minutes}:${seconds} ${ampm}`;
  }

  static toDDMMMYYYY(dateInput?: Date | string): string {
    const date = this.formatDate(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  static toMoney(args: {
    amount: number;
    decimalPlaces?: number;
    currency?: string;
  }) {
    return args.amount.toLocaleString("en-US", {
      style: args.currency ? "currency" : "decimal",
      currency: args.currency ?? undefined,
      minimumFractionDigits: args.decimalPlaces || 2,
    });
  }

  static formatPhoneNumber(args: { phoneNumber: string }): string {
    const { phoneNumber } = args;

    if (!phoneNumber) {
      return "";
    }

    // Remove all non-digit characters
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    // Extract the country code (if any) and the rest of the number
    let countryCode = "";
    let number = cleanedNumber;

    // Check for country code prefix (e.g., +1 for US, +44 for UK)
    if (cleanedNumber.startsWith("1") || cleanedNumber.startsWith("44")) {
      // Assuming we only want to handle certain country codes for this example
      countryCode = cleanedNumber.slice(0, 1); // Adjust depending on desired code length
      number = cleanedNumber.slice(1);
    }

    // Split the number into groups of three digits
    const groupedNumber = number.replace(/(\d{3})(?=\d)/g, "$1 ");

    // Return the formatted phone number with country code (if present)
    return countryCode ? `+${countryCode} ${groupedNumber}` : groupedNumber;
  }

  // static formatDateWithEAT = (
  //   date: Date | string | null | undefined
  // ): string => {
  //   if (!date) {
  //     return "";
  //   }

  //   const dateObj = this.formatDate(date);

  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   };

  //   const formattedDate = dateObj.toLocaleDateString(undefined, options);
  //   return `${formattedDate} EAT`;
  // };

  static adjustDateToTimezone(args: {
    date: Date | null | undefined;
    timezoneOffsetHours: number;
  }): Date {
    const { date, timezoneOffsetHours } = args;
    if (date) {
      const dateObj = this.formatDate(date);
      // Adjust to the specified timezone offset
      return new Date(dateObj.getTime() + timezoneOffsetHours * 60 * 60 * 1000);
    } else {
      // Current date in the specified timezone
      const currentDate = new Date();
      return new Date(
        currentDate.getTime() + timezoneOffsetHours * 60 * 60 * 1000
      );
    }
  }
}
