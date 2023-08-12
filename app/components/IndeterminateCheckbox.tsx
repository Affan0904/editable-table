import { Checkbox } from "@mantine/core";
import { HTMLProps, useEffect, useRef } from "react";

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <Checkbox {...rest} ref={ref} />;
}

export default IndeterminateCheckbox;
