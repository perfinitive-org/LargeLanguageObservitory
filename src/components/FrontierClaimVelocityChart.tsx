import {
  isSourceDecayed,
  type FrontierClaimVelocityRecord
} from "@/lib/frontierClaimVelocity";

type ChartPanel = {
  title: string;
  yLabel: string;
  records: FrontierClaimVelocityRecord[];
};

type ChartProps = {
  modelClaims: FrontierClaimVelocityRecord[];
  infrastructureClaims: FrontierClaimVelocityRecord[];
};

const width = 920;
const height = 330;
const margin = {
  top: 32,
  right: 36,
  bottom: 64,
  left: 88
};

export function FrontierClaimVelocityChart({
  modelClaims,
  infrastructureClaims
}: ChartProps) {
  const panels: ChartPanel[] = [
    {
      title: "Model scale claims",
      yLabel: "Parameters, log scale",
      records: modelClaims
    },
    {
      title: "Infrastructure scale claims",
      yLabel: "Accelerators, log scale",
      records: infrastructureClaims
    }
  ];

  return (
    <div className="grid gap-5">
      {panels.map((panel) => (
        <ChartPanel key={panel.title} panel={panel} />
      ))}
    </div>
  );
}

function ChartPanel({ panel }: { panel: ChartPanel }) {
  const records = panel.records;

  if (records.length === 0) {
    return (
      <section className="rounded-lg border border-black/10 bg-white p-5 text-black">
        <h3 className="text-lg font-semibold">{panel.title}</h3>
        <p className="mt-3 text-sm text-neutral-600">
          No source-backed or reported public claims are currently plotted for
          this unit family.
        </p>
      </section>
    );
  }

  const dates = records.map((record) => Date.parse(record.date));
  const values = records.map((record) => record.value).filter((value) => value > 0);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const rawMinValue = Math.min(...values);
  const rawMaxValue = Math.max(...values);
  const minValue = rawMinValue === rawMaxValue ? rawMinValue / 10 : rawMinValue;
  const maxValue = rawMinValue === rawMaxValue ? rawMaxValue * 10 : rawMaxValue;
  const yTicks = getLogTicks(minValue, maxValue);
  const xTicks = getYearTicks(minDate, maxDate);

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  function xForDate(date: string) {
    const timestamp = Date.parse(date);

    if (minDate === maxDate) {
      return margin.left + plotWidth / 2;
    }

    return margin.left + ((timestamp - minDate) / (maxDate - minDate)) * plotWidth;
  }

  function yForValue(value: number) {
    const minLog = Math.log10(minValue);
    const maxLog = Math.log10(maxValue);

    if (minLog === maxLog) {
      return margin.top + plotHeight / 2;
    }

    const ratio = (Math.log10(value) - minLog) / (maxLog - minLog);
    return margin.top + plotHeight - ratio * plotHeight;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-black/10 bg-white text-black">
      <div className="border-b border-black/10 px-5 py-4">
        <h3 className="text-lg font-semibold">{panel.title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{panel.yLabel}</p>
      </div>

      <div className="overflow-x-auto p-3">
        <svg
          role="img"
          aria-label={`${panel.title} timeline chart`}
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[760px]"
        >
          <rect width={width} height={height} fill="white" />

          {yTicks.map((tick) => {
            const y = yForValue(tick);
            return (
              <g key={tick}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={y}
                  y2={y}
                  stroke="#e5e5e5"
                />
                <text
                  x={margin.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#525252"
                >
                  {formatCompactValue(tick)}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick) => {
            const x =
              minDate === maxDate
                ? margin.left + plotWidth / 2
                : margin.left + ((tick - minDate) / (maxDate - minDate)) * plotWidth;
            return (
              <g key={tick}>
                <line
                  x1={x}
                  x2={x}
                  y1={margin.top}
                  y2={height - margin.bottom}
                  stroke="#f0f0f0"
                />
                <text
                  x={x}
                  y={height - margin.bottom + 28}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#525252"
                >
                  {new Date(tick).getUTCFullYear()}
                </text>
              </g>
            );
          })}

          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={height - margin.bottom}
            y2={height - margin.bottom}
            stroke="black"
            strokeWidth="1.5"
          />
          <line
            x1={margin.left}
            x2={margin.left}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="black"
            strokeWidth="1.5"
          />

          {records.map((record) => {
            const x = xForDate(record.date);
            const y = yForValue(record.value);
            const labelY = y < margin.top + 24 ? y + 26 : y - 14;

            return (
              <g key={record.id}>
                <line
                  x1={x}
                  x2={x}
                  y1={y}
                  y2={height - margin.bottom}
                  stroke="black"
                  strokeWidth="1"
                />
                <circle cx={x} cy={y} r="5.5" fill="black" />
                <text
                  x={x + 10}
                  y={labelY}
                  fontSize="12"
                  fontWeight="600"
                  fill="black"
                >
                  {record.label}
                  {isSourceDecayed(record) ? " †" : ""}
                </text>
                <text
                  x={x + 10}
                  y={labelY + 16}
                  fontSize="12"
                  fill="#525252"
                >
                  {record.display_value}
                </text>
              </g>
            );
          })}

          <text
            x={margin.left + plotWidth / 2}
            y={height - 16}
            textAnchor="middle"
            fontSize="12"
            fill="#404040"
          >
            Date of public claim or source record
          </text>
          <text
            transform={`translate(22 ${margin.top + plotHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize="12"
            fill="#404040"
          >
            {panel.yLabel}
          </text>
        </svg>
      </div>
    </section>
  );
}

function getLogTicks(minValue: number, maxValue: number) {
  const minPower = Math.floor(Math.log10(minValue));
  const maxPower = Math.ceil(Math.log10(maxValue));
  const ticks: number[] = [];

  for (let power = minPower; power <= maxPower; power += 1) {
    ticks.push(10 ** power);
  }

  if (ticks.length < 2) {
    return [minValue, maxValue];
  }

  return ticks;
}

function getYearTicks(minDate: number, maxDate: number) {
  const minYear = new Date(minDate).getUTCFullYear();
  const maxYear = new Date(maxDate).getUTCFullYear();
  const ticks: number[] = [];

  for (let year = minYear; year <= maxYear; year += 1) {
    ticks.push(Date.UTC(year, 0, 1));
  }

  if (ticks.length === 1) {
    ticks.push(Date.UTC(minYear + 1, 0, 1));
  }

  return ticks;
}

function formatCompactValue(value: number) {
  if (value >= 1_000_000_000_000) {
    return `${trimNumber(value / 1_000_000_000_000)}T`;
  }
  if (value >= 1_000_000_000) {
    return `${trimNumber(value / 1_000_000_000)}B`;
  }
  if (value >= 1_000_000) {
    return `${trimNumber(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return `${trimNumber(value / 1_000)}K`;
  }
  return String(value);
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
