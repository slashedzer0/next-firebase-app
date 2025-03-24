"use client";

import { useEffect, useState } from "react";
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
import { usePagination } from "@/stores/use-pagination";
import { useAuth } from "@/stores/use-auth";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Loader2 } from "lucide-react";

interface AssessmentResult {
  id: string;
  level: string;
  confidence: number;
  date: string;
}

function LevelBadge({ level }: { level: string }) {
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  switch (formattedLevel) {
    case "Mild":
      return (
        <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
          {formattedLevel}
        </Badge>
      );
    case "Moderate":
      return (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
          {formattedLevel}
        </Badge>
      );
    case "Severe":
      return (
        <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />
          {formattedLevel}
        </Badge>
      );
    default:
      return null;
  }
}

export default function UserDashboardResultsPage() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentPage, itemsPerPage, setCurrentPage } = usePagination();

  useEffect(() => {
    async function fetchUserAssessments() {
      if (!user?.uid) return;

      try {
        setLoading(true);

        // Query assessments for the current user
        const assessmentsRef = collection(db, "assessments");
        const q = query(assessmentsRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);

        // Process the results and sort in memory
        const unsortedResults: Array<{
          data: DocumentData;
          id: string;
        }> = [];

        querySnapshot.forEach((doc) => {
          unsortedResults.push({
            data: doc.data(),
            id: doc.id,
          });
        });

        // Sort by createdAt timestamp (oldest first)
        unsortedResults.sort((a, b) => {
          // First try to sort by createdAt timestamp
          const timestampA = a.data.createdAt?.toMillis?.();
          const timestampB = b.data.createdAt?.toMillis?.();

          if (timestampA && timestampB) {
            return timestampA - timestampB; // Ascending order (oldest first)
          }

          // Fallback to date string if createdAt is not available
          const dateA = a.data.date.split("-").reverse().join("-");
          const dateB = b.data.date.split("-").reverse().join("-");
          return dateA.localeCompare(dateB); // Ascending order (oldest first)
        });

        // Create the assessment data with correct numbering (oldest is #1)
        const assessmentData: AssessmentResult[] = unsortedResults.map(
          (item, index) => ({
            id: String(index + 1), // Sequential numbering (oldest is #1)
            level: item.data.stressLevel,
            confidence: item.data.confidence,
            date: item.data.date,
          })
        );

        // Reverse the array so newest (highest number) appears first in table
        setAssessments(assessmentData.reverse());
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAssessments();
  }, [user]);

  const totalPages = Math.ceil(assessments.length / itemsPerPage);

  const paginatedResults = assessments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Scan Results</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid w-full md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap [&>td]:py-4">
                      <TableHead className="pl-4 sticky left-0 bg-background min-w-[100px]">
                        Attempt
                      </TableHead>
                      <TableHead className="sticky left-[100px] bg-background">
                        Level
                      </TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.length > 0 ? (
                      paginatedResults.map((result) => (
                        <TableRow
                          key={result.id}
                          className="group [&>td]:whitespace-nowrap"
                        >
                          <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                            #{result.id}
                          </TableCell>
                          <TableCell className="sticky left-[100px] bg-background font-medium">
                            <LevelBadge level={result.level} />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {result.confidence}%
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {result.date}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No assessment results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        {assessments.length > 0 && (
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
