
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, TrendingUp, Users, Clock, PlaySquare } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock analytics data based on time range
  const getViewsData = () => {
    switch(timeRange) {
      case 'week':
        return [
          { name: 'Mon', views: 240 },
          { name: 'Tue', views: 300 },
          { name: 'Wed', views: 280 },
          { name: 'Thu', views: 420 },
          { name: 'Fri', views: 380 },
          { name: 'Sat', views: 520 },
          { name: 'Sun', views: 480 },
        ];
      case 'month':
        return [
          { name: 'Week 1', views: 1800 },
          { name: 'Week 2', views: 2100 },
          { name: 'Week 3', views: 1950 },
          { name: 'Week 4', views: 2300 },
        ];
      case 'year':
        return [
          { name: 'Jan', views: 6500 },
          { name: 'Feb', views: 7200 },
          { name: 'Mar', views: 8100 },
          { name: 'Apr', views: 7800 },
          { name: 'May', views: 8300 },
          { name: 'Jun', views: 9100 },
          { name: 'Jul', views: 10200 },
          { name: 'Aug', views: 9800 },
          { name: 'Sep', views: 10500 },
          { name: 'Oct', views: 11200 },
          { name: 'Nov', views: 10800 },
          { name: 'Dec', views: 11800 },
        ];
      default:
        return [];
    }
  };

  const viewsData = getViewsData();

  const categoryData = [
    { name: 'Technology', value: 35 },
    { name: 'Business', value: 25 },
    { name: 'Education', value: 20 },
    { name: 'Health', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const audienceData = [
    { name: 'Day 1', users: 100 },
    { name: 'Day 2', users: 120 },
    { name: 'Day 3', users: 140 },
    { name: 'Day 4', users: 135 },
    { name: 'Day 5', users: 160 },
    { name: 'Day 6', users: 180 },
    { name: 'Day 7', users: 200 },
    { name: 'Day 8', users: 220 },
    { name: 'Day 9', users: 240 },
    { name: 'Day 10', users: 230 },
    { name: 'Day 11', users: 250 },
    { name: 'Day 12', users: 280 },
    { name: 'Day 13', users: 300 },
    { name: 'Day 14', users: 320 },
  ];

  const topPodcasts = [
    { title: 'The Future of AI in Business', plays: 1247, growth: '+8.5%' },
    { title: 'Mindfulness in the Digital Age', plays: 983, growth: '+12.3%' },
    { title: 'Financial Freedom After 40', plays: 876, growth: '+5.7%' },
    { title: 'Space Exploration: New Frontiers', plays: 743, growth: '+3.2%' },
    { title: 'Modern Architecture Trends', plays: 612, growth: '+6.9%' },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  // Card component for stats
  const StatCard = ({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend: string }) => (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        {icon}
      </div>
      <p className="text-xs mt-2 text-green-500">{trend}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <BarChartIcon className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Analytics</h1>
        </div>
        <p className="text-muted-foreground">Track your podcast performance and audience engagement</p>
      </motion.div>
      
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<PlaySquare className="h-6 w-6 text-sidebar-primary" />}
          title="Total Plays"
          value="2,547"
          trend="+12.5% from last week"
        />
        <StatCard 
          icon={<Users className="h-6 w-6 text-purple-500" />}
          title="Unique Listeners"
          value="1,893"
          trend="+7.2% from last week"
        />
        <StatCard 
          icon={<Clock className="h-6 w-6 text-blue-500" />}
          title="Avg. Listen Time"
          value="18:32"
          trend="+2.3% from last week"
        />
        <StatCard 
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          title="Completion Rate"
          value="76%"
          trend="+4.8% from last week"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-4 rounded-lg">
          <h3 className="font-semibold mb-4">{timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Plays</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Content Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Audience Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={audienceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Top Performing Podcasts</h3>
          <div className="space-y-4">
            {topPodcasts.map((podcast, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm line-clamp-1">{podcast.title}</p>
                  <p className="text-xs text-muted-foreground">{podcast.plays} plays</p>
                </div>
                <span className="text-xs text-green-500">{podcast.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
