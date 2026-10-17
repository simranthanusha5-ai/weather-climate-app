
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeatherChart = ({
  title,
  type = "line",
  data = [],
  dataKey,
  color = "#38bdf8",
  unit = "",
}) => {
  const validData = useMemo(
    () =>
      data
        .filter(
          (item) =>
            item.label &&
            item[dataKey] !== null &&
            item[dataKey] !== undefined &&
            Number.isFinite(Number(item[dataKey]))
        )
        .map((item) => ({
          ...item,
          [dataKey]: Number(item[dataKey]),
        }))
        .sort(
          (a, b) =>
            new Date(a.date || a.label).getTime() -
            new Date(b.date || b.label).getTime()
        ),
    [data, dataKey]
  );

  const isBar = type === "bar";
  const hasPositiveValue = validData.some(
    (item) => item[dataKey] > 0
  );

  const chartData = useMemo(() => {
    // Reduce clutter on long timelines while retaining the full dataset.
    const maxLabels = 7;
    const step = Math.max(
      1,
      Math.ceil(validData.length / maxLabels)
    );

    return validData.map((item, index) => ({
      ...item,
      displayLabel:
        index % step === 0 || index === validData.length - 1
          ? item.label
          : "",
    }));
  }, [validData]);

  const values = validData.map((item) => item[dataKey]);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 0;

  const yDomain = isBar
    ? [0, Math.max(maxValue * 1.2, 0.5)]
    : [
        (min) => Math.floor(min * 0.9),
        (max) => Math.ceil(max * 1.1),
      ];

  if (!validData.length) {
    return (
      <div className="chart-container">
        <div className="chart-heading-row">
          <div className="chart-accent" style={{ background: color }} />
          <h3>{title}</h3>
        </div>
        <div className="chart-empty">
          <span className="chart-empty-icon">📊</span>
          <p>No recorded data available for this chart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-heading-row">
        <div className="chart-accent" style={{ background: color }} />
        <h3>{title}</h3>
      </div>

      {isBar && !hasPositiveValue && (
        <p className="chart-note">
          No rainfall recorded during this period.
        </p>
      )}

      <div className="chart-plot">
        <ResponsiveContainer width="100%" height="100%">
          {isBar ? (
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 8, left: -12, bottom: 4 }}
              barCategoryGap="22%"
            >
              <CartesianGrid
                stroke="#294057"
                strokeDasharray="3 5"
                vertical={false}
              />

              <XAxis
                dataKey="displayLabel"
                tick={{ fill: "#91a7bd", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                interval={0}
              />

              <YAxis
                domain={yDomain}
                tick={{ fill: "#91a7bd", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `${Number(value).toFixed(isBar ? 1 : 0)}${unit}`
                }
                width={49}
                allowDecimals
              />

              <Tooltip
                cursor={{ fill: "rgba(56, 189, 248, 0.08)" }}
                contentStyle={{
                  background: "#0b1728",
                  border: "1px solid #294057",
                  borderRadius: 12,
                  color: "#f1f5f9",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#a9bfd4", marginBottom: 5 }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)}${unit}`,
                  title,
                ]}
              />

              <Bar
                dataKey={dataKey}
                name={title}
                fill={color}
                radius={[5, 5, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            </BarChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -12, bottom: 4 }}
            >
              <CartesianGrid
                stroke="#294057"
                strokeDasharray="3 5"
                vertical={false}
              />

              <XAxis
                dataKey="displayLabel"
                tick={{ fill: "#91a7bd", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                interval={0}
              />

              <YAxis
                domain={yDomain}
                tick={{ fill: "#91a7bd", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `${Number(value).toFixed(0)}${unit}`
                }
                width={49}
              />

              <Tooltip
                contentStyle={{
                  background: "#0b1728",
                  border: "1px solid #294057",
                  borderRadius: 12,
                  color: "#f1f5f9",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#a9bfd4", marginBottom: 5 }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)}${unit}`,
                  title,
                ]}
              />

              <Line
                type="monotone"
                dataKey={dataKey}
                name={title}
                stroke={color}
                strokeWidth={2.5}
                dot={validData.length > 24 ? false : {
                  r: 3,
                  fill: "#0f2035",
                  stroke: color,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <span>
          <span
            className="chart-legend-dot"
            style={{ background: color }}
          />
          {title}
        </span>
        <span>{validData.length} records</span>
      </div>
    </div>
  );
};

export default WeatherChart;
