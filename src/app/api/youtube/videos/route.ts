import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/search'

type YouTubeVideoItem = {
    id?: { videoId?: string }
    snippet?: {
        title?: string
        description?: string
        publishedAt?: string
        thumbnails?: {
            medium?: { url?: string }
            default?: { url?: string }
        }
    }
    statistics?: {
        viewCount?: string
        likeCount?: string
        commentCount?: string
    }
}

type YouTubeSearchResponse = {
    items?: YouTubeVideoItem[]
}

export async function GET(request: NextRequest) {
    const apiKey = process.env.YOUTUBE_API_KEY
    const channelId = request.nextUrl.searchParams.get('channelId')

    if (!apiKey) {
        return NextResponse.json(
            { error: 'YouTube API is not configured on the server.' },
            { status: 500 },
        )
    }

    if (!channelId) {
        return NextResponse.json(
            { error: 'Channel ID is required.' },
            { status: 400 },
        )
    }

    try {
        // Search for recent videos from this channel
        const params = new URLSearchParams({
            part: 'snippet',
            type: 'video',
            channelId: channelId,
            maxResults: '6',
            order: 'date',
            key: apiKey,
        })

        const response = await fetch(
            `${YOUTUBE_VIDEOS_URL}?${params.toString()}`,
            {
                signal: AbortSignal.timeout(10_000),
                cache: 'no-store',
            },
        )

        if (!response.ok) {
            console.error('YouTube Videos API failed:', response.status)
            return NextResponse.json(
                { error: 'Failed to fetch videos.' },
                { status: 502 },
            )
        }

        const data = (await response.json()) as YouTubeSearchResponse
        const items = data.items ?? []

        // Extract video IDs to fetch statistics
        const videoIds = items
            .map((item) => item.id?.videoId)
            .filter(Boolean)
            .join(',')

        if (!videoIds) {
            return NextResponse.json({ videos: [] })
        }

        // Fetch video statistics
        const statsParams = new URLSearchParams({
            part: 'statistics',
            id: videoIds,
            key: apiKey,
        })

        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?${statsParams.toString()}`,
            {
                signal: AbortSignal.timeout(10_000),
                cache: 'no-store',
            },
        )

        let statsMap: Record<
            string,
            { views: number; likes: number; comments: number }
        > = {}

        if (statsResponse.ok) {
            const statsData = (await statsResponse.json()) as {
                items?: Array<{
                    id: string
                    statistics?: {
                        viewCount?: string
                        likeCount?: string
                        commentCount?: string
                    }
                }>
            }
            statsMap = (statsData.items ?? []).reduce(
                (acc, video) => {
                    acc[video.id] = {
                        views: Number(video.statistics?.viewCount ?? 0),
                        likes: Number(video.statistics?.likeCount ?? 0),
                        comments: Number(video.statistics?.commentCount ?? 0),
                    }
                    return acc
                },
                {} as Record<
                    string,
                    { views: number; likes: number; comments: number }
                >,
            )
        }

        // Map and return videos
        const videos = items.map((item: YouTubeVideoItem) => {
            const videoId = item.id?.videoId ?? ''
            const stats = statsMap[videoId] || {
                views: 0,
                likes: 0,
                comments: 0,
            }

            // Determine video type
            const title = item.snippet?.title ?? ''
            const type =
                title.toLowerCase().includes('short') ||
                title.toLowerCase().includes('shorts')
                    ? 'Reel'
                    : 'Video'

            return {
                id: videoId,
                title: title,
                description: item.snippet?.description ?? '',
                thumbnail:
                    item.snippet?.thumbnails?.medium?.url ??
                    item.snippet?.thumbnails?.default?.url ??
                    '',
                publishedAt: item.snippet?.publishedAt ?? '',
                type: type as 'Video' | 'Reel',
                views: stats.views,
                likes: stats.likes,
                comments: stats.comments,
            }
        })

        return NextResponse.json(
            { videos },
            { headers: { 'Cache-Control': 'private, no-store' } },
        )
    } catch (error) {
        console.error('YouTube Videos API fetch error:', error)
        return NextResponse.json(
            { error: 'Could not reach YouTube. Please try again.' },
            { status: 502 },
        )
    }
}
