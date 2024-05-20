'use client';
import Link from 'next/link';
import * as React from 'react';
import { ColumnDef, type ColumnFiltersState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SortingState, VisibilityState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, RotateCw } from 'lucide-react';
import { deleteGlobalMessageReport, invalidateCache } from './actions';
import { GlobalMessageReportType } from '@/db';
import { Input } from '@/components/ui/input';

export const columns: ColumnDef<GlobalMessageReportType>[] = [
 {
  id: 'select',
  header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' />,
  cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />,
  enableSorting: false,
  enableHiding: false,
 },
 {
  accessorKey: 'id',
  header: 'ID',
 },
 {
  accessorKey: 'createdAt',
  accessorFn: row => new Date(row.createdAt).toLocaleString(),
  header: ({ column }) => {
   return (
    <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
     Created At
     <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
   );
  },
 },
 {
  accessorKey: 'authorId',
  header: 'Author ID',
  accessorFn: row => row.authorId,
 },
 {
  accessorKey: 'offenderId',
  header: 'Offender ID',
  accessorFn: row => row.offenderId,
 },
 {
  accessorKey: 'globalMessageId',
  header: 'Global Message ID',
  accessorFn: row => row.globalMessageId,
 },
 {
  id: 'Actions',
  cell: ({ row }) => {
   const report = row.original;
   return (
    <DropdownMenu>
     <DropdownMenuTrigger asChild>
      <Button variant='ghost' className='h-8 w-8 p-0'>
       <span className='sr-only'>Open menu</span>
       <MoreHorizontal className='h-4 w-4' />
      </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align='end'>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(report.id!)}>Copy Report ID</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
       onClick={async () => {
        if (confirm('Are you sure you want to delete this report?')) await deleteGlobalMessageReport(report.id);
       }}
      >
       Delete Report
      </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   );
  },
 },
];

interface DataTableProps<TData, TValue> {
 columns: ColumnDef<TData, TValue>[];
 data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = React.useState<SortingState>([]);
 const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
 const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
 const [rowSelection, setRowSelection] = React.useState({});

 const table = useReactTable({
  data,
  columns,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  state: {
   sorting,
   columnFilters,
   columnVisibility,
   rowSelection,
  },
 });

 return (
  <div>
   <div className='flex items-center py-4'>
    <Input placeholder='Search for Author ID...' value={(table.getColumn('authorId')?.getFilterValue() as string) ?? ''} onChange={event => table.getColumn('authorId')?.setFilterValue(event.target.value)} className='max-w-sm' />
    <Button
     size='icon'
     variant='outline'
     className='ml-auto mr-2'
     onClick={async () => {
      if (confirm('Are you sure you want to invalidate the cache?')) await invalidateCache();
     }}
    >
     <RotateCw />
    </Button>
    <DropdownMenu>
     <DropdownMenuTrigger asChild>
      <Button variant='outline'>
       Columns <ChevronDown className='ml-2 h-4 w-4' />
      </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align='end'>
      {table
       .getAllColumns()
       .filter(column => column.getCanHide())
       .map(column => {
        return (
         <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
          {column.id}
         </DropdownMenuCheckboxItem>
        );
       })}
     </DropdownMenuContent>
    </DropdownMenu>
   </div>
   <div className='rounded-md border'>
    <Table>
     <TableHeader>
      {table.getHeaderGroups().map(headerGroup => (
       <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(header => {
         return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
        })}
       </TableRow>
      ))}
     </TableHeader>
     <TableBody>
      {table.getRowModel().rows?.length ? (
       table.getRowModel().rows.map(row => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
         {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
         ))}
        </TableRow>
       ))
      ) : (
       <TableRow>
        <TableCell colSpan={columns.length} className='h-24 text-center'>
         No results.
        </TableCell>
       </TableRow>
      )}
     </TableBody>
    </Table>
   </div>
   <div className='flex items-center justify-end space-x-2 py-4'>
    <div className='flex-1 text-sm text-muted-foreground'>
     {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div className='space-x-2'>
     <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
      Previous
     </Button>
     <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
      Next
     </Button>
    </div>
   </div>
  </div>
 );
}
