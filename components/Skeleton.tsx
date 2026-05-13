import React from 'react'
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  rows?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('skeleton', className)} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 mt-1" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg mt-1" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ rows = 4 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-brand-border">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </td>
          <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
          <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
          <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
          <td className="px-4 py-3"><Skeleton className="h-8 w-20 rounded-lg" /></td>
        </tr>
      ))}
    </>
  )
}
