'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Star, Clock, BookOpen, Users, Play, Lock } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { CourseCardSkeleton } from '@/components/Skeleton'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/components/Toast'
import clsx from 'clsx'

type Filter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Enrolled'

const filters: Filter[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Enrolled']

const levelBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  price_pkr: number
  duration_weeks: number
  total_modules: number
  thumbnail_url: string | null
  rating: number
  skills: string[]
  enrolled_count: number
  instructor_name: string
  instructor_avatar: string | null
  is_enrolled: boolean
  progress: number
}

export default function CoursesPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    apiFetch<{ courses: Course[] }>('/api/courses')
      .then((data) => setCourses(data.courses ?? []))
      .catch(() => showToast('Failed to load courses', 'error'))
      .finally(() => setLoading(false))
  }, [])

  async function handleEnroll(courseId: string, courseTitle: string) {
    setEnrolling(courseId)
    try {
      await apiFetch('/api/courses', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId }),
      })
      setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, is_enrolled: true, enrolled_count: c.enrolled_count + 1 } : c))
      showToast(`Enrolled in "${courseTitle}"! 🎉`, 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Enrollment failed'
      showToast(message, 'error')
    } finally {
      setEnrolling(null)
    }
  }

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Enrolled' ? c.is_enrolled : c.level.toLowerCase() === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <h1 className="font-sora text-2xl font-bold text-brand-navy">Course Catalog</h1>
          <p className="text-brand-muted text-sm font-dm-sans mt-1">
            {loading ? 'Loading courses…' : `${courses.length} courses in Data Science, AI & Automation`}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/40 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={clsx('px-4 py-2 rounded-full text-sm font-medium font-dm-sans border transition-all',
                  filter === f ? 'bg-brand-orange text-white border-brand-orange shadow-sm' : 'bg-white text-gray-600 border-brand-border hover:border-brand-orange/40 hover:text-brand-orange',
                )}
              >{f}</button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : filtered.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-md transition-all group overflow-hidden"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.thumbnail_url ?? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={clsx('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full', levelBadge[course.level] ?? 'bg-gray-100 text-gray-700')}>{course.level}</span>
                      {course.is_enrolled && <span className="text-[10px] font-bold bg-brand-orange text-white px-2.5 py-1 rounded-full">Enrolled</span>}
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[11px] font-semibold">{course.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-sora text-[15px] font-bold text-brand-navy group-hover:text-brand-orange transition leading-snug mb-1">{course.title}</h3>
                    <p className="text-xs text-brand-muted font-dm-sans line-clamp-2 leading-relaxed mb-3">{course.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      {course.instructor_avatar ? (
                        <img src={course.instructor_avatar} alt={course.instructor_name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-[10px] font-bold text-brand-orange">
                          {course.instructor_name[0]}
                        </div>
                      )}
                      <span className="text-xs text-brand-muted font-dm-sans">{course.instructor_name}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-dm-sans mb-4">
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.duration_weeks}w</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {course.total_modules} modules</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {course.enrolled_count.toLocaleString()}</span>
                    </div>

                    {course.is_enrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-brand-muted font-dm-sans mb-1">
                          <span>Progress</span><span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-brand-orange h-full rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(course.skills ?? []).slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-brand-bg text-brand-muted rounded-md font-dm-sans border border-brand-border">{s}</span>
                      ))}
                      {(course.skills ?? []).length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-brand-bg text-brand-muted rounded-md font-dm-sans border border-brand-border">+{course.skills.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                      <span className="font-sora text-base font-bold text-brand-navy">PKR {course.price_pkr.toLocaleString()}</span>
                      {course.is_enrolled ? (
                        <Link href={`/courses/${course.id}`} className="flex items-center gap-1.5 bg-brand-orange text-white px-4 py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-orange-dark transition">
                          <Play size={12} className="fill-white" /> Continue
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id, course.title)}
                          disabled={enrolling === course.id}
                          className="flex items-center gap-1.5 bg-brand-navy text-white px-4 py-2 rounded-xl text-xs font-semibold font-dm-sans hover:bg-brand-orange transition disabled:opacity-60"
                        >
                          {enrolling === course.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Lock size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-sora text-lg font-bold text-gray-400">No courses found</h3>
            <p className="text-brand-muted text-sm mt-1 font-dm-sans">Try a different filter or search term.</p>
            <button onClick={() => { setFilter('All'); setSearch('') }} className="mt-4 text-brand-orange text-sm font-semibold hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
