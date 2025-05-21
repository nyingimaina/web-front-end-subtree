import { PureComponent } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import debounce from "lodash/debounce"; // Import debounce
import styles from "../Styles/SelectWrapper.module.css";
import { IconAdd } from "@/IconsLibrary/Icons";

interface IProps<TData> {
  data: TData[];
  selectedResolver: (candidate: TData) => boolean;
  valueResolver: (item: TData) => string;
  labelResolver: (item: TData) => string;
  onChange: (item: TData[]) => void;
  menuPortalTarget?: HTMLElement;
  isMulti?: boolean;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  onCreateNew?: (value: string) => void | Promise<void>;
  disabled?: boolean;
  onSearch?: (value: string) => void | Promise<void>;
}

interface IState {
  disabled?: boolean;
}
export default class SelectWrapper<TData> extends PureComponent<
  IProps<TData>,
  IState
> {
  state = {} as IState;

  private get disabled(): boolean {
    return this.state.disabled === true || this.props.disabled === true;
  }

  // Arrow function for handling both single and multi value change
  private onValueChange = (
    selectedOptions: SingleValue<TData> | MultiValue<TData>
  ) => {
    if (Array.isArray(selectedOptions)) {
      // Handle multi-value selection
      this.props.onChange(selectedOptions);
    } else {
      // Handle single value selection
      if (!selectedOptions) {
        this.props.onChange([]); // Empty array if null
        return;
      }
      this.props.onChange([selectedOptions as TData]); // Wrap single value in an array
    }
  };

  // Debounced onSearch function
  private debouncedOnSearch = debounce((inputValue: string) => {
    if (this.props.onSearch) {
      console.log("Searching for:", inputValue);
      this.props.onSearch(inputValue);
    }
  }, 300); // Adjust debounce delay as needed

  render() {
    const { data, isMulti } = this.props;

    return (
      <Select
        options={data}
        value={data.filter(this.props.selectedResolver)}
        isMulti={isMulti}
        getOptionLabel={this.props.labelResolver}
        getOptionValue={this.props.valueResolver}
        classNamePrefix="react-select"
        menuPortalTarget={this.props.menuPortalTarget}
        onChange={this.onValueChange} // Use the unified handler
        isClearable={this.props.isClearable}
        required={this.props.required}
        autoFocus={this.props.autoFocus}
        isSearchable={this.props.isSearchable}
        placeholder={this.props.placeholder}
        menuShouldScrollIntoView
        isDisabled={this.disabled}
        noOptionsMessage={
          this.props.isSearchable
            ? ({ inputValue }) => {
                if (inputValue && inputValue.length > 2) {
                  this.debouncedOnSearch(inputValue); // Use debounced function
                }
                return (
                  <div
                    className={styles.createPrompt}
                    onClick={async () => {
                      if (inputValue && this.props.onCreateNew)
                        try {
                          this.setState({ disabled: true }, async () => {
                            await this.props.onCreateNew!(inputValue);
                          });
                        } finally {
                          this.setState({ disabled: false });
                        }
                    }}
                  >
                    {inputValue && (
                      <>
                        <IconAdd />
                        {`Create '${inputValue}'`}
                      </>
                    )}
                  </div>
                );
              }
            : undefined
        }
      />
    );
  }
}
