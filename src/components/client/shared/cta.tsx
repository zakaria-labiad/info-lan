import { Button } from "@/components/client/shared/button";
import { cn } from "@/lib/shared/utils";
import { SectionHeading } from "@/components/client/shared/section-heading";

type CtaProps = {
  title: string;
  buttonLabel: string;
  href?: string;
  className?: string;
};

function Cta({ title, buttonLabel, href = "/contact", className }: CtaProps) {
  return (
    <SectionHeading
      title={title}
      className={cn(
        "max-md:flex-col max-md:justify-center max-md:text-center md:flex-nowrap items-center",
        className,
      )}
      controls={
        <Button className="w-full sm:w-fit sm:shrink-0 whitespace-nowrap" href={href}>
          {buttonLabel}
        </Button>
      }
      data-faq-reveal
    />
  );
}

export { Cta, type CtaProps };
