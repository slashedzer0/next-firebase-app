"use client";

import { useEffect, useState } from "react";
import { Calendar, FolderDown, HeartPulse } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/stores/use-auth";
import { Loader2 } from "lucide-react";

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

const chartConfig = {
  you: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  average: {
    label: "Others",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

import type { Timestamp } from "firebase/firestore";

interface AssessmentData {
  createdAt: Timestamp;
  date: string;
  day: string;
  confidence: number;
}

interface ChartDataPoint {
  you: number | null;
  average: number | null;
}

export default function UserDashboardOverviewPage() {
  const { user } = useAuth();
  const [recentAssessments, setRecentAssessments] = useState<AssessmentData[]>(
    []
  );
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [unsavedCount, setUnsavedCount] = useState(0);

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const assessmentsRef = collection(db, "assessments");

        // Get all assessments for the current user
        const userQuery = query(
          assessmentsRef,
          where("userId", "==", user.uid),
          limit(100)
        );
        const userSnapshot = await getDocs(userQuery);

        const userAssessments: Array<{
          confidence: number;
          createdAt: Timestamp;
          date: string;
          day: string;
        }> = [];

        // Collect user assessment data
        userSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt && data.confidence) {
            userAssessments.push({
              confidence: data.confidence,
              createdAt: data.createdAt,
              date: data.date || "",
              day: data.day || "",
            });
          }
        });

        // Sort by timestamp (oldest first)
        userAssessments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeA - timeB;
        });

        // Take only the 3 most recent for Recent Attempts display
        setRecentAssessments(
          [...userAssessments]
            .sort((a, b) => {
              // Sort by createdAt (newest first) for Recent Attempts
              const timeA = a.createdAt?.toMillis?.() || 0;
              const timeB = b.createdAt?.toMillis?.() || 0;
              return timeB - timeA;
            })
            .slice(0, 3)
        );

        // Get all other users' assessments for comparison data
        const otherAssessmentsQuery = query(
          assessmentsRef,
          where("userId", "!=", user.uid),
          limit(100)
        );
        const otherAssessmentsSnapshot = await getDocs(otherAssessmentsQuery);

        const otherAssessments: Array<{
          confidence: number;
          createdAt: Timestamp;
        }> = [];

        // Collect other users' assessment data
        otherAssessmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt && data.confidence) {
            otherAssessments.push({
              confidence: data.confidence,
              createdAt: data.createdAt,
            });
          }
        });

        // Sort by timestamp (oldest first)
        otherAssessments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeA - timeB;
        });

        // Get last 7 assessments for both current user and others, sorted by createdAt
        const last7UserAssessments = userAssessments
          .slice(-7)
          .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        
        const last7OtherAssessments = otherAssessments
          .slice(-7)
          .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

        // Initialize array with 7 null data points
        const chartPoints: ChartDataPoint[] = Array.from({ length: 7 }, () => ({
          you: null,
          average: null
        }));

        // Fill in user's data points
        last7UserAssessments.forEach((assessment, index) => {
          chartPoints[index] = {
            ...chartPoints[index],
            you: assessment.confidence
          };
        });

        // Fill in others' data points
        last7OtherAssessments.forEach((assessment, index) => {
          chartPoints[index] = {
            ...chartPoints[index],
            average: assessment.confidence
          };
        });

        setChartData(chartPoints);

        // Set saved count and unsaved count
        const totalSaved = userSnapshot.size;
        setSavedCount(totalSaved);

        // Calculate unsaved assessments
        const totalAttempts = user.assessmentCount || 0;
        const notSaved = Math.max(0, totalAttempts - totalSaved);
        setUnsavedCount(notSaved);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  // Format date from DD-MM-YYYY to display format
  const formatLastAttemptDate = (dateStr: string) => {
    if (!dateStr) return { day: "--", month: "No data" };

    const [day, month, year] = dateStr.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert month string to number (subtract 1 as array is zero-indexed)
    const monthIndex = parseInt(month) - 1;
    const monthName = monthNames[monthIndex];

    return {
      day: parseInt(day).toString(), // Remove leading zero if present
      month: `${monthName} ${year}`,
    };
  };

  // Get last attempt date if available
  const lastAttempt =
    recentAssessments.length > 0
      ? formatLastAttemptDate(recentAssessments[0].date)
      : { day: "-", month: "No saved results" };

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
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {user?.assessmentCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Assessment attempts
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Results</CardTitle>
            <FolderDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{savedCount}</div>
                <p className="text-xs text-muted-foreground">
                  {unsavedCount > 0
                    ? `${unsavedCount} results not saved`
                    : "All results saved"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Attempt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{lastAttempt.day}</div>
                <p className="text-xs text-muted-foreground">
                  {lastAttempt.month}
                </p>
              </>
            )}
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
              Compared to other students by latest attempts
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="w-full md:h-[200px]"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis tickLine={false} axisLine={false} tick={false} />
                  <YAxis yAxisId="stress" domain={[0, 100]} hide={true} />
                  <Line
                    type="monotone"
                    dataKey="you"
                    strokeWidth={2}
                    stroke="var(--color-you)"
                    activeDot={{
                      r: 8,
                      style: { fill: "var(--color-you)" },
                    }}
                    // Allow null values (gaps in data)
                    connectNulls={false}
                    yAxisId="stress"
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
                    // Allow null values (gaps in data)
                    connectNulls={false}
                    yAxisId="stress"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-semibold md:text-xl">
              Recent Attempts
            </CardTitle>
            <CardDescription>
              Your latest assessments and confidence levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md">
              <div className="grid grid-cols-2 p-4 text-sm font-medium border-b text-muted-foreground">
                <div>Date</div>
                <div className="text-right">Confidence</div>
              </div>
              <div className="divide-y">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentAssessments.length > 0 ? (
                  recentAssessments.map((assessment) => (
                    <div
                      key={`${assessment.date}-${assessment.confidence}`}
                      className="grid grid-cols-2 p-4 text-sm"
                    >
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {assessment.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.day}
                        </p>
                      </div>
                      <div className="text-xl text-right font-medium">
                        {assessment.confidence}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No assessments found.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
