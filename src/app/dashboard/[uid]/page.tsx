"use client";

import { Calendar, FolderDown, HeartPulse} from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  {
    average: 400,
    you: 240,
  },
  {
    average: 300,
    you: 139,
  },
  {
    average: 200,
    you: 980,
  },
  {
    average: 278,
    you: 390,
  },
  {
    average: 189,
    you: 480,
  },
  {
    average: 239,
    you: 380,
  },
  {
    average: 268,
    you: 475,
  },
];

const chartConfig = {
  you: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function UserDashboardOverviewPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-xl font-semibold md:text-2xl">Overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">37</div>
            <p className="text-xs text-muted-foreground">+7% from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Results</CardTitle>
            <FolderDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">29</div>
            <p className="text-xs text-muted-foreground">8 results not saved</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Attempt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">November 2024</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-semibold md:text-xl">
              Stress Levels
            </CardTitle>
            <CardDescription>
              Your stress levels compared to the average
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer
              config={chartConfig}
              className="w-full md:h-[200px]"
            >
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="attempt"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="you"
                  strokeWidth={2}
                  stroke="var(--color-you)"
                  activeDot={{
                    r: 8,
                    style: { fill: "var(--color-you)" },
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="average"
                  stroke="var(--color-average)"
                  strokeOpacity={0.5}
                  activeDot={{
                    r: 6,
                    fill: "var(--color-average)",
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-semibold md:text-xl">
              Recent Attempts
            </CardTitle>
            <CardDescription>
              Your latest attempts and scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md">
              <div className="grid grid-cols-2 p-4 text-sm font-medium">
                <div>Date</div>
                <div className="text-right">Score</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-2 p-4 text-sm">
                  <div>30-11-2024</div>
                  <div className="text-right font-medium">4.9</div>
                </div>
                <div className="grid grid-cols-2 p-4 text-sm">
                  <div>29-11-2024</div>
                  <div className="text-right font-medium">4.2</div>
                </div>
                <div className="grid grid-cols-2 p-4 text-sm">
                  <div>28-11-2024</div>
                  <div className="text-right font-medium">4.7</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

