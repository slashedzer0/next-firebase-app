"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Info, Trash2, Loader2 } from "lucide-react";
import { usePagination } from "@/stores/use-pagination";
import {
  collection,
  query,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";

// Define report data interface
interface ReportData {
  id: string;
  userId: string;
  userName: string;
  level: string;
  confidence: number;
  date: string;
}

function LevelBadge({ level }: { level: string }) {
  // Convert to capitalized format for badge display
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  switch (formattedLevel) {
    case "Mild":
      return (
        <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
          {formattedLevel}
        </Badge>
      );
    case "Moderate":
      return (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />{" "}
          {formattedLevel}
        </Badge>
      );
    case "Severe":
      return (
        <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
          {formattedLevel}
        </Badge>
      );
    default:
      return null;
  }
}

export default function AdminDashboardReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, itemsPerPage, setCurrentPage } = usePagination();

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        // Fetch assessments from Firestore
        const assessmentsRef = collection(db, "assessments");
        const assessmentsQuery = query(assessmentsRef, limit(100)); // Limit to avoid large queries
        const assessmentsSnapshot = await getDocs(assessmentsQuery);

        // Process assessments and fetch user data
        const reportPromises = assessmentsSnapshot.docs.map(
          async (assessmentDoc) => {
            const assessmentData = assessmentDoc.data();
            const userId = assessmentData.userId;

            // Get user data to display name
            let userName = "Unknown User";
            try {
              const userDoc = await getDoc(doc(db, "users", userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                // Extract first name from full name
                const fullName = userData.fullName || "";
                userName = fullName.split(" ")[0] || "Unknown";
              }
            } catch (error) {
              console.error(`Error fetching user data for ${userId}:`, error);
            }

            return {
              id: assessmentDoc.id,
              userId,
              userName,
              level: assessmentData.stressLevel,
              confidence: assessmentData.confidence,
              date: assessmentData.date || "",
            };
          }
        );

        const reportData = await Promise.all(reportPromises);

        // Sort by date (most recent first)
        reportData.sort((a, b) => {
          // Convert DD-MM-YYYY to sortable format
          const dateA = a.date.split("-").reverse().join("-");
          const dateB = b.date.split("-").reverse().join("-");
          return dateB.localeCompare(dateA);
        });

        setReports(reportData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Scan Reports</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid w-full md:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="[&>*]:whitespace-nowrap">
                        <TableHead className="pl-4 sticky left-0 bg-background min-w-[100px]">
                          Name
                        </TableHead>
                        <TableHead className="sticky left-[100px] bg-background">
                          Level
                        </TableHead>
                        <TableHead className="text-right">Confidence</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReports.length > 0 ? (
                        paginatedReports.map((report) => (
                          <TableRow
                            key={report.id}
                            className="group [&>td]:whitespace-nowrap"
                          >
                            <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                              {report.userName}
                            </TableCell>
                            <TableCell className="sticky left-[100px] bg-background font-medium">
                              <LevelBadge level={report.level} />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {report.confidence}%
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {report.date}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    console.log("Clicked info for " + report.id)
                                  }
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() =>
                                    console.log("Delete " + report.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No assessment reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        {reports.length > 0 && (
          <Pagination className="w-full max-w-xs mx-auto p-4">
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={`border ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={`border ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
