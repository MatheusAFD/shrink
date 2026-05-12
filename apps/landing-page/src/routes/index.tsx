import { createFileRoute } from '@tanstack/react-router'
import { HomeSections } from '@/components/sections'

export const Route = createFileRoute('/')({
  component: HomeSections
})
