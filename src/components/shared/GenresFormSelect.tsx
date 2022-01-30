import React, { useCallback, useMemo } from "react";
import Select from "./Select";
import { GENRES } from "@/constants";
import TAGS from "@/tags.json";
import { Props } from "react-select";

const genres = GENRES.map((genre) => ({
  value: genre.value as string,
  label: genre.label,
}));

const tags = TAGS.map((tag) => ({
  value: tag,
  label: tag,
}));

const groups = [
  { label: "Thể loại", options: genres },
  { label: "Tags", options: tags },
] as const;

type OnChangeValue = {
  type: "TAGS" | "GENRES";
  value: string[];
};

interface GenresFormSelectProps {
  value?: string[];
  onChange?: (values: OnChangeValue[]) => void;
  selectProps?: Omit<Props, "onChange">;
}

const GenresFormSelect: React.FC<GenresFormSelectProps> = ({
  value = [],
  onChange = () => {},
  selectProps,
}) => {
  const selectValue = useMemo(
    () =>
      groups
        .map((group) => group.options)
        .flat()
        .filter((option) => value.includes(option.value)),
    [value]
  );

  const handleSelectChange = useCallback(
    (values: any) => {
      const tags = [];
      const genres = [];

      values.forEach(({ value }) => {
        const group = groups.find((group) =>
          group.options.find((option) => option.value === value)
        );

        if (group.label === "Tags") {
          tags.push(value);
        } else {
          genres.push(value);
        }
      });

      onChange([
        { type: "TAGS", value: tags },
        { type: "GENRES", value: genres },
      ]);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <p className="font-semibold">Thể loại</p>

      <Select
        value={selectValue}
        onChange={handleSelectChange}
        isMulti
        options={groups}
        placeholder="Thể loại"
        {...selectProps}
      />
    </div>
  );
};

export default React.memo(GenresFormSelect);
