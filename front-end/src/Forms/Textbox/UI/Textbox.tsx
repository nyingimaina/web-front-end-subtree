import React, { CSSProperties, HTMLInputTypeAttribute, ReactNode } from "react";
import formStyles from "@/Forms/Form/Styles/Forms.module.css";

export interface ITextboxProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  className?: string;
  required?: boolean;
  suffixElement?: ReactNode;
  prefixElement?: ReactNode;
}

const Textbox = (props: ITextboxProps) => {
  const { placeholder, value, width, onChange, type, id } = props;
  // const handleClear = () => {
  //   if (onChange) {
  //     const event = {
  //       target: { value: "" },
  //     } as React.ChangeEvent<HTMLInputElement>;
  //     onChange(event);
  //   }
  // };

  const style = {
    width: width,
  } as CSSProperties;
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: "0",
          top: "13px", // Adjust to control the vertical alignment
          padding: props.prefixElement ? "0 0.5rem" : "", // Optional for aesthetics
        }}
      >
        {props.prefixElement}
      </span>
      <input
        id={id}
        type={type ?? "text"}
        className={formStyles.formControl}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          ...style,
          paddingRight: "2rem", // Add some padding to avoid overlap
          paddingLeft: "2rem",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: "0",
          top: "10px", // Adjust to control the vertical alignment
          padding: props.suffixElement ? "0 0.5rem" : "", // Optional for aesthetics
        }}
      >
        {props.suffixElement}
      </span>
    </div>
  );
};

export default Textbox;
