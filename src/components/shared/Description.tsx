import React from "react";

export interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
}

const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
  ({ description, ...props }, ref) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        ref={ref}
        {...props}
      ></div>
    );
  }
);

Description.displayName = "Description";

export default Description;
