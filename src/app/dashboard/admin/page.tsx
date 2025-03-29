"use client";

import { useEffect, useState } from "react";
import { Percent, TriangleAlert, Users, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

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

const chartData = [
  { month: "January", highest: 186, lowest: 80 },
  { month: "February", highest: 305, lowest: 200 },
  { month: "March", highest: 237, lowest: 120 },
  { month: "April", highest: 73, lowest: 190 },
  { month: "May", highest: 209, lowest: 130 },
  { month: "June", highest: 214, lowest: 140 },
];

const chartConfig = {
  highest: {
    label: "Highest",
    color: "hsl(var(--chart-1))",
  },
  lowest: {
    label: "Lowest",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface RecentAssessment {
  id: string;
  userName: string;
  userEmail: string;
  confidence: number;
}

export default function AdminDashboardOverviewPage() {
  const [recentAssessments, setRecentAssessments] = useState<
    RecentAssessment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [activeStudentsCount, setActiveStudentsCount] = useState(0);
  const [averageConfidence, setAverageConfidence] = useState({
    score: 0,
    change: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch active students count
        const usersRef = collection(db, "users");
        const activeStudentsQuery = query(
          usersRef,
          where("role", "==", "student"),
          where("status", "==", "active")
        );

        const activeStudentsSnapshot = await getDocs(activeStudentsQuery);
        setActiveStudentsCount(activeStudentsSnapshot.size);

        // Create a query to get assessments
        const assessmentsRef = collection(db, "assessments");
        const assessmentsQuery = query(assessmentsRef, limit(1000));
        const assessmentsSnapshot = await getDocs(assessmentsQuery);

        // Group assessments by userId
        const userAssessments: { [userId: string]: { stressLevel: string }[] } =
          {};

        // Process assessments
        assessmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;

          if (!userId) return;

          if (!userAssessments[userId]) {
            userAssessments[userId] = [];
          }

          userAssessments[userId].push({
            stressLevel: data.stressLevel,
          });
        });

        // Count high risk students (all assessments are severe)
        let highRiskStudents = 0;

        // For each student, check if they only have severe assessments
        for (const userId in userAssessments) {
          const assessments = userAssessments[userId];

          // Skip users with no assessments
          if (assessments.length === 0) continue;

          // Check if all assessments are severe
          const allSevere = assessments.every(
            (assessment) => assessment.stressLevel === "severe"
          );

          if (allSevere) {
            highRiskStudents++;
          }
        }

        setHighRiskCount(highRiskStudents);

        // Calculate average confidence score across all assessments
        let totalConfidence = 0;
        let assessmentCount = 0;

        // Get current date and one month ago for change calculation
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        let currentMonthTotal = 0;
        let currentMonthCount = 0;
        let prevMonthTotal = 0;
        let prevMonthCount = 0;

        // Process assessments
        assessmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.confidence) {
            totalConfidence += data.confidence;
            assessmentCount++;

            // Check if assessment is from current or previous month
            const assessmentDate = data.createdAt?.toDate?.();
            if (assessmentDate) {
              if (assessmentDate >= oneMonthAgo && assessmentDate <= now) {
                currentMonthTotal += data.confidence;
                currentMonthCount++;
              } else if (assessmentDate < oneMonthAgo) {
                prevMonthTotal += data.confidence;
                prevMonthCount++;
              }
            }
          }
        });

        // Calculate overall average - use Math.ceil to round up to whole number
        const avgScore =
          assessmentCount > 0
            ? Math.ceil(totalConfidence / assessmentCount)
            : 0;

        // Calculate month-over-month change
        const currentMonthAvg =
          currentMonthCount > 0
            ? Math.ceil(currentMonthTotal / currentMonthCount)
            : 0;
        const prevMonthAvg =
          prevMonthCount > 0 ? Math.ceil(prevMonthTotal / prevMonthCount) : 0;

        let percentChange = 0;
        if (prevMonthAvg > 0) {
          percentChange = Math.ceil(
            ((currentMonthAvg - prevMonthAvg) / prevMonthAvg) * 100
          );
        }

        setAverageConfidence({
          score: avgScore,
          change: percentChange,
        });

        // Also fetch recent assessments (existing code)
        // We can't combine complex queries with orderBy without an index,
        // so we'll fetch more records and filter after
        const q = query(
          collection(db, "assessments"),
          orderBy("createdAt", "desc"),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const assessmentsWithUserData: RecentAssessment[] = [];

        // Process each assessment and get user data
        for (const assessmentDoc of querySnapshot.docs) {
          const assessmentData = assessmentDoc.data();
          const userId = assessmentData.userId;

          // Skip assessments without user ID or non-student users
          if (!userId) continue;

          // Get user data
          try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Only include assessments from student users
              if (userData.role === "student") {
                assessmentsWithUserData.push({
                  id: assessmentDoc.id,
                  userName: userData.fullName || "Unknown User",
                  userEmail: userData.email || "no-email@example.com",
                  confidence: assessmentData.confidence || 0,
                });

                // Break once we have 3 student assessments
                if (assessmentsWithUserData.length === 3) break;
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        setRecentAssessments(assessmentsWithUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-xl font-semibold md:text-2xl">Overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{activeStudentsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Including new accounts
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {averageConfidence.score}
                </div>
                <p className="text-xs text-muted-foreground">
                  {averageConfidence.change > 0 ? "+" : ""}
                  {averageConfidence.change}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <TriangleAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-[52px] justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{highRiskCount}</div>
                <p className="text-xs text-muted-foreground">
                  Students in crisis
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
              Highest and lowest stress levels per month
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer
              config={chartConfig}
              className="w-full md:h-[200px]"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="highest" fill="var(--color-highest)" radius={4} />
                <Bar dataKey="lowest" fill="var(--color-lowest)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-semibold md:text-xl">
              Recent Attempts
            </CardTitle>
            <CardDescription>Latest assessment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md">
              <div className="grid grid-cols-2 p-4 text-sm font-medium">
                <div>Student</div>
                <div className="text-right">Confidence</div>
              </div>
              <div className="divide-y">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentAssessments.length > 0 ? (
                  recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="grid grid-cols-2 p-4">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {assessment.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.userEmail}
                        </p>
                      </div>
                      <div className="text-xl text-right font-medium">
                        {assessment.confidence}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No recent assessments found.
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
