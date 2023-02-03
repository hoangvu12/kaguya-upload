import classNames from "classnames";
import React, { useEffect } from "react";
import { isMobileOnly } from "react-device-detect";
import { AiFillCheckCircle } from "react-icons/ai";
import ReactSelect, {
  components,
  GroupBase,
  MenuProps,
  OptionProps,
  Props,
} from "react-select";

const Menu: React.ComponentType<
  MenuProps<unknown, boolean, GroupBase<unknown>>
> = (props) => {
  if (isMobileOnly) return <div>I have no idea</div>;

  return <components.Menu {...props} />;
};

const MoreSelectedBadge = ({ items }) => {
  const title = items.join(", ");
  const length = items.length;
  const label = `+${length}`;

  return (
    <p title={title} className="p-1 text-sm bg-background-700 rounded-sm">
      {label}
    </p>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 1;
  const overflow = getValue()
    .slice(maxToShow)
    .map((x: any) => x.label);

  return index < maxToShow ? (
    // @ts-ignore
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

const Option: React.ComponentType<
  OptionProps<unknown, boolean, GroupBase<unknown>>
> = ({ innerRef, getValue, children, innerProps, ...props }) => {
  const { className, ...divProps } = innerProps;

  return (
    <div
      ref={innerRef}
      className={classNames(
        "cursor-pointer relative px-3 py-2 transition duration-300",
        props.isFocused && "bg-white/20 text-primary-300",
        className
      )}
      {...divProps}
    >
      {children}

      {props.isSelected && (
        <AiFillCheckCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 rounded-full bg-white" />
      )}
    </div>
  );
};

const Select = React.forwardRef<any, Props>(
  ({ components, styles, ...props }, ref) => {
    const [portalTarget, setPortalTarget] = React.useState<HTMLElement>();

    useEffect(() => {
      setPortalTarget(document.body);
    }, []);

    return (
      <ReactSelect
        ref={ref}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#ef4444",
            primary75: "#f87171",
            primary50: "#fca5a5",
            primary20: "#fecaca",
          },
        })}
        styles={{
          control: (provided) => {
            return {
              ...provided,
              backgroundColor: "#1a1a1a",
              minWidth: "12rem",
              maxWidth: "14rem",
            };
          },
          menu: (provided) => {
            return { ...provided, backgroundColor: "#1a1a1a" };
          },
          menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
          singleValue: (provided) => {
            return { ...provided, color: "#fff" };
          },
          multiValue: (provided) => {
            return {
              ...provided,
              backgroundColor: "#262626",
              maxWidth: "70%",
            };
          },
          multiValueLabel: (provided) => {
            return { ...provided, color: "white" };
          },
          multiValueRemove: (provided) => {
            return {
              ...provided,
              color: "gray",
              ":hover": {
                backgroundColor: "transparent",
                color: "white",
              },
              transition: "all 300ms",
            };
          },

          input: (provided) => {
            return { ...provided, color: "white" };
          },

          ...styles,
        }}
        hideSelectedOptions={false}
        noOptionsMessage={() => "Không còn lựa chọn"}
        components={{
          ...components,
          MultiValue,
          Option,
          Menu,
        }}
        isClearable
        menuPortalTarget={portalTarget}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export default React.memo(Select);
