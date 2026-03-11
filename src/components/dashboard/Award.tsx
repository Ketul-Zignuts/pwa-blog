'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { useQuery } from '@tanstack/react-query'
import { topContentAction } from '@/constants/api/admin/dashboard'
import { useRouter } from 'next/navigation'

const Award = () => {
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ['hero-text'],
    queryFn: () => topContentAction(),
  })

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 relative items-start">
        {/* Title Section */}
        <div>
          {isLoading ? (
            <>
              <Skeleton variant="text" width={220} height={32} />
              <Skeleton variant="text" width={180} height={24} />
            </>
          ) : (
            <>
              <Typography variant="h5">
                {data?.title || 'Top Performing Content'}
              </Typography>
              <Typography>
                {data?.message || 'Showing your top performing content'}
              </Typography>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={120} height={20} />
            </>
          ) : (
            <>
              {/* Engagement Score Label */}
              <Typography variant="subtitle2" color="textSecondary">
                Engagement Score
              </Typography>
              <Typography
                variant="h4"
                color="primary"
                className="flex items-center gap-1"
              >
                <i className="ri-bar-chart-line text-[22px]" />
                {data?.engagementScore ?? 0}
              </Typography>
              <Typography variant="body2">
                {data?.likes ?? 0} Likes • {data?.comments ?? 0} Comments
              </Typography>
            </>
          )}
        </div>

        {/* Action Button */}
        {isLoading ? (
          <Skeleton variant="rectangular" width={140} height={36} />
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => router.push(`/admin/posts/view/${data?.slug}`)}
          >
            View Post
          </Button>
        )}

        {/* Trophy Image */}
        <img
          src="/images/pages/trophy.png"
          alt="trophy image"
          height={102}
          className="absolute inline-end-7 bottom-6"
        />
      </CardContent>
    </Card>
  )
}

export default Award