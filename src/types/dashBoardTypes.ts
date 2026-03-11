export type DashboardSummaryData = {
  velocity: DashboardSummaryVelocity
  pulse: DashboardSummaryPulse
  activityFeed: DashboardSummaryActivityFeedItem[]
}

export type DashboardSummaryVelocity = {
  totalPosts: number
  pendingReviews: number
  avgRating: string
  publishedThisMonth: number
  weeklyGrowth: number
  totalViews: number
}

export type DashboardSummaryPulse = {
  recentComments: Comment[]
  recentReviews: DashboardSummaryReview[]
}

export type DashboardSummaryReview = {
  id: string
  rating: number
  review: string
  created_at: string
  users: {
    displayName: string
  }
}

export type DashboardSummaryComment = {
  id?: string
  comment?: string
  created_at?: string
  users?: {
    displayName?: string
  }
}

export type DashboardSummaryActivityFeedItem = {
  type: 'review' | 'comment'
  content: string
  user: string
  date: string
}

export type DashBoardBarChartData = {
  day: string
  postCount: number
  buzz: number
}

export type DashBoardRadarChartData = {
  subject: string
  value: number
}

export type DashBoardChartData = {
  barChart: DashBoardBarChartData[]
  radarChart: DashBoardRadarChartData[]
}