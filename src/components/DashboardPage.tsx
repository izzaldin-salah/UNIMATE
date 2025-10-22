import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, BookOpen, MessageSquare, Target, Award, Clock } from 'lucide-react';

export function DashboardPage() {
  // Mock data for charts
  const performanceData = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 72 },
    { name: 'Week 3', score: 68 },
    { name: 'Week 4', score: 78 },
    { name: 'Week 5', score: 85 },
    { name: 'Week 6', score: 88 },
  ];

  const subjectScores = [
    { subject: 'Data Structures', score: 85 },
    { subject: 'Algorithms', score: 78 },
    { subject: 'Databases', score: 92 },
    { subject: 'Web Dev', score: 88 },
    { subject: 'OS', score: 75 },
  ];

  const recentTests = [
    { subject: 'Data Structures', score: 88, date: 'Oct 20, 2025', questions: 15 },
    { subject: 'Algorithms', score: 75, date: 'Oct 18, 2025', questions: 20 },
    { subject: 'Databases', score: 92, date: 'Oct 15, 2025', questions: 12 },
  ];

  const aiChatHistory = [
    { subject: 'Data Structures', topic: 'Binary Trees', time: '2 hours ago' },
    { subject: 'Algorithms', topic: 'Dynamic Programming', time: '5 hours ago' },
    { subject: 'Databases', topic: 'SQL Joins', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Track your learning progress and performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Average Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">85%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Tests Completed</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">24</div>
              <p className="text-xs text-muted-foreground">Across 5 subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">AI Conversations</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">47</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Study Hours</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">32h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Your test scores over the past 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Recent Tests
              </CardTitle>
              <CardDescription>Your latest test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{test.subject}</span>
                        <Badge variant={test.score >= 80 ? 'default' : 'secondary'}>
                          {test.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {test.questions} questions · {test.date}
                      </p>
                    </div>
                    {test.score >= 80 && <Award className="w-5 h-5 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                AI Chat History
              </CardTitle>
              <CardDescription>Recent conversations with AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiChatHistory.map((chat, index) => (
                  <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                    <div className="mb-1">{chat.subject}</div>
                    <p className="text-sm text-muted-foreground mb-1">{chat.topic}</p>
                    <p className="text-xs text-muted-foreground">{chat.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your learning progress across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectScores.map((subject, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span>{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">{subject.score}%</span>
                  </div>
                  <Progress value={subject.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
