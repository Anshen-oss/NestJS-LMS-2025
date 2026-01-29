import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ArchiveIcon, Badge, CheckCircle2, DollarSign, Edit, Eye, MoreVertical, RatIcon, Trash2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export interface CourseRowData {
  id: string;
  title: string;
  slug: string;
  smallDescription: string;
  imageUrl: string | null;
  price: number;
  status: "Draft" | "Published" | "Archived";
  category: string;

  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  enrollmentsCount: number;
  totalRevenue: number;
  chaptersCount: number;
}

interface CourseTableRowProps {
  course: CourseRowData;
  onDelete: () => void;
}

export function CourseTableRow({ course, onDelete }: CourseTableRowProps) {
  return (
    <TableRow>
      {/* TITRE */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium line-clamp-1">{course.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {course.smallDescription}
            </div>
          </div>
        </div>
      </TableCell>

      {/* INSTRUCTEUR */}
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{course.createdBy.name}</div>
          <div className="text-xs text-muted-foreground">
            {course.createdBy.email}
          </div>
        </div>
      </TableCell>

      {/* ÉTUDIANTS */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{course.enrollmentsCount}</span>
        </div>
      </TableCell>

      {/* REVENUS */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="font-medium text-green-600">
            €{course.totalRevenue.toFixed(2)}
          </span>
        </div>
      </TableCell>


{/* STATUT AVEC ICÔNES */}
      <TableCell>
        {course.status === "Published" ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <Badge variant="default" className="bg-green-600">
              Publié
            </Badge>
          </div>
        ) : course.status === "Archived" ? (
          <div className="flex items-center gap-2">
            <ArchiveIcon className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary" className="bg-gray-600">
              Archivé
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <RatIcon className="h-4 w-4 text-yellow-500" />
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Brouillon
            </Badge>
          </div>
        )}
      </TableCell>

      {/* CATÉGORIE */}
      <TableCell className="text-sm text-muted-foreground">
        {course.category}
      </TableCell>

      {/* ACTIONS */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/analytics`}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
