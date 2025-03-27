
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, TrendingUp, Users, Clock, PlaySquare } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const Analytics = () => {
  // Mock analytics data
  const viewsData = [
    { name: 'Mon', views: 240 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 280 },
    { name: 'Thu', views: 420 },
    { name: 'Fri', views: 380 },
    { name: 'Sat', views: 520 },
    { name: 'Sun', views: 480 },
  ];

  const categoryData = [
    { name: 'Technology', value: 35 },
    { name: 'Business', value: 25 },
    { name: 'Education', value: 20 },
    { name: 'Health', value: 15 },
    { name: 'Other', value: 5 },
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
          <h3 className="font-semibold mb-4">Weekly Plays</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
    </div>
  );
};

export default Analytics;
