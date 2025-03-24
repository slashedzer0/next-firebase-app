"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/stores/use-pagination";

const scanResults = [
  {
    id: "SCAN001",
    level: "Severe",
    date: "2024-01-15",
    score: "4.8",
  },
  {
    id: "SCAN002",
    level: "Moderate",
    date: "2024-01-10",
    score: "3.2",
  },
  {
    id: "SCAN003",
    level: "Mild",
    date: "2024-01-05",
    score: "1.8",
  },
  {
    id: "SCAN004",
    level: "Severe",
    date: "2024-01-03",
    score: "4.5",
  },
  {
    id: "SCAN005",
    level: "Moderate",
    date: "2023-12-28",
    score: "3.4",
  },
  {
    id: "SCAN006",
    level: "Mild",
    date: "2023-12-25",
    score: "1.5",
  },
  {
    id: "SCAN007",
    level: "Severe",
    date: "2023-12-20",
    score: "4.7",
  },
  {
    id: "SCAN008",
    level: "Moderate",
    date: "2023-12-15",
    score: "3.1",
  },
  {
    id: "SCAN009",
    level: "Mild",
    date: "2023-12-10",
    score: "2.0",
  },
  {
    id: "SCAN010",
    level: "Severe",
    date: "2023-12-05",
    score: "4.9",
  },
  {
    id: "SCAN011",
    level: "Moderate",
    date: "2023-11-30",
    score: "3.6",
  },
  {
    id: "SCAN012",
    level: "Mild",
    date: "2023-11-25",
    score: "1.9",
  },
  {
    id: "SCAN013",
    level: "Severe",
    date: "2023-11-20",
    score: "4.6",
  },
  {
    id: "SCAN014",
    level: "Moderate",
    date: "2023-11-15",
    score: "3.3",
  },
  {
    id: "SCAN015",
    level: "Mild",
    date: "2023-11-10",
    score: "1.7",
  },
];

function LevelBadge({ level }: { level: string }) {
  switch (level) {
    case "Mild":
      return (
        <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
          {level}
        </Badge>
      );
    case "Moderate":
      return (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" /> {level}
        </Badge>
      );
    case "Severe":
      return (
        <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" /> {level}
        </Badge>
      );
  }
}

export default function UserDashboardResultsPage() {
  const { currentPage, itemsPerPage, setCurrentPage } = usePagination();
  const totalPages = Math.ceil(scanResults.length / itemsPerPage);

  const paginatedResults = scanResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                      <TableHead className="pl-4 sticky left-0 bg-background min-w-[100px]">Attempt</TableHead>
                      <TableHead className="sticky left-[100px] bg-background">Level</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.map((result) => (
                      <TableRow 
                        key={result.id}
                        className="group [&>td]:whitespace-nowrap"
                      >
                        <TableCell className="pl-4 sticky left-0 bg-background font-medium">
                          {result.id}
                        </TableCell>
                        <TableCell className="sticky left-[100px] bg-background font-medium">
                          <LevelBadge level={result.level} />
                        </TableCell>
                        <TableCell className="text-right font-medium">{result.score}</TableCell>
                        <TableCell className="text-right font-medium">{result.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Pagination className="w-full max-w-xs mx-auto p-4">
          <PaginationContent className="w-full justify-between">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={`border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className={`border ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}