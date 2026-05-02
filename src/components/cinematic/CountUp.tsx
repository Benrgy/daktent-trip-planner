import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const CountUp = ({ end, suffix = "", prefix = "", duration = 1400, className }: Props) => {
  const { ref, value } = useCountUp(end, duration);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};

export default CountUp;
