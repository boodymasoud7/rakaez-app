import { NextResponse } from 'next/server';
import { updateJson } from '@/lib/content/writer';
import type { AnalyticsData } from '@/lib/content/types';

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const updated = await updateJson<AnalyticsData>(
      'analytics.json',
      (current) => {
        const data: AnalyticsData = current || {
          totalVisits: 0,
          todayVisits: 0,
          todayDate: today,
          dailyStats: [],
          lastUpdated: new Date().toISOString(),
        };

        let newTodayVisits = data.todayVisits || 0;
        let newTotalVisits = (data.totalVisits || 0) + 1;

        if (data.todayDate !== today) {
          // New day! reset todayVisits
          newTodayVisits = 1;
        } else {
          newTodayVisits += 1;
        }

        // Update dailyStats array (keep max 30 days)
        const dailyStats = [...(data.dailyStats || [])];
        const todayStatIndex = dailyStats.findIndex((s) => s.date === today);
        if (todayStatIndex >= 0) {
          dailyStats[todayStatIndex] = { date: today, visits: dailyStats[todayStatIndex].visits + 1 };
        } else {
          dailyStats.push({ date: today, visits: 1 });
        }

        // Slice last 30 days
        const trimmedStats = dailyStats.slice(-30);

        return {
          totalVisits: newTotalVisits,
          todayVisits: newTodayVisits,
          todayDate: today,
          dailyStats: trimmedStats,
          lastUpdated: new Date().toISOString(),
        };
      },
      {
        totalVisits: 1,
        todayVisits: 1,
        todayDate: today,
        dailyStats: [{ date: today, visits: 1 }],
        lastUpdated: new Date().toISOString(),
      },
      'chore: update analytics visit count'
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to track visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
