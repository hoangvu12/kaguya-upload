import classNames from "classnames";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import ClientOnly from "./ClientOnly";
import Link from "./Link";

export interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  hasPadding?: boolean;
  clientOnly?: boolean;
  href?: string;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    { children, title, className, hasPadding = true, clientOnly, href },
    ref
  ) => {
    const element = (
      <div
        ref={ref}
        className={classNames(
          "group",
          hasPadding && "px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36",
          className
        )}
      >
        {title && (
          <React.Fragment>
            <div className="flex items-center gap-2 mb-4">
              {href ? (
                <Link href={href}>
                  <a className="flex items-center gap-2">
                    <h1 className="uppercase text-2xl font-semibold">
                      {title}
                    </h1>

                    <p className="transform -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition duration-300 text-2xl font-semibold">
                      <HiOutlineArrowNarrowRight />
                    </p>
                  </a>
                </Link>
              ) : (
                <h1 className="uppercase text-2xl font-semibold">{title}</h1>
              )}
            </div>
          </React.Fragment>
        )}

        {children}
      </div>
    );

    return clientOnly ? <ClientOnly>{element}</ClientOnly> : element;
  }
);

Section.displayName = "Section";

export default Section;
