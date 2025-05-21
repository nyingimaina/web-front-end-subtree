import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../Styles/DateRangePicker.module.css";
import { motion } from "framer-motion";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  dateFormat?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  dateFormat = "dd/MMM/yyyy",
}) => {
  return (
    <motion.div
      className={styles.dateRangePickerContainer}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={styles.dateRangePickerLabel}>Select Date Range:</div>
      <div className={styles.dateRangePickerInputs}>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className={styles.datePickerInput}
          popperPlacement="bottom-start"
          dateFormat={dateFormat}
          showYearDropdown={true}
          showMonthDropdown={true}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => {
            if (date && startDate && date < startDate) {
              setEndDate(startDate);
            } else {
              setEndDate(date);
            }
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || undefined}
          placeholderText="End Date"
          className={styles.datePickerInput}
          popperPlacement="bottom-start"
          dateFormat={dateFormat}
          showYearDropdown={true}
          showMonthDropdown={true}
        />
      </div>
    </motion.div>
  );
};

export default DateRangePicker;
