"use client";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

interface PropsInterface {
  increased?: boolean;
  name: string;
  metric: string;
  difference: string;
  metricIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const MetricItem = (props: PropsInterface) => {
  const { increased = true, name, metric, metricIcon, difference } = props;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        <Icon MetricIcon={metricIcon} />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {name}
          </span>
          <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
            {metric}
          </h4>
        </div>
        {increased ? (
          <Badge color="success">
            <ArrowUpIcon />
            {difference}
          </Badge>
        ) : (
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            {difference}
          </Badge>
        )}
      </div>
    </div>
  );
};

type Props = {
  MetricIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function Icon({ MetricIcon }: Props) {
  return <MetricIcon className="size-6 text-gray-800 dark:text-white/90" />;
}
