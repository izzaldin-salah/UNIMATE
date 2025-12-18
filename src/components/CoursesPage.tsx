import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BookOpen, MessageSquare, FileText, GraduationCap } from 'lucide-react';

interface CoursesPageProps {
  onOpenQuestionnaire: (subject: string) => void;
  onOpenChat: (subject: string) => void;
  onSubjectClick?: (subjectName: string) => void;
}

export function CoursesPage({ onOpenQuestionnaire, onOpenChat, onSubjectClick }: CoursesPageProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const getDepartments = (year: number) => {
    if (year <= 3) {
      return ['IT', 'General Departments'];
    }
    return ['IT', 'CS', 'Statistics', 'Math', 'CS & Statistics', 'CS & Math', 'Math & Statistics'];
  };

  const getSubjects = (department: string, _year: number, semester: number) => {
    // Mock subject data with progress organized by semester
    const subjectsByDept: Record<string, Record<number, any[]>> = {
      'IT': {
        1: [
          { name: 'Programming Fundamentals', progress: 75, chapters: 12 },
          { name: 'Calculus I', progress: 60, chapters: 10 },
          { name: 'Introduction to IT', progress: 85, chapters: 8 },
          { name: 'Digital Logic', progress: 45, chapters: 15 },
        ],
        2: [
          { name: 'Programming Fundamentals', progress: 65, chapters: 14 },
          { name: 'Calculus II', progress: 60, chapters: 10 },
          { name: 'Vector Analysis', progress: 85, chapters: 8 },
          { name: 'Statistics and Probability', progress: 45, chapters: 15 },
          { name: 'Arithmetic', progress: 30, chapters: 14 },
        ],
      },
      'CS': {
        1: [
          { name: 'Computer Architecture', progress: 70, chapters: 10 },
          { name: 'Discrete Mathematics', progress: 55, chapters: 12 },
        ],
        2: [
          { name: 'Programming Languages', progress: 80, chapters: 9 },
          { name: 'Software Engineering', progress: 65, chapters: 11 },
        ],
      },
      'Math': {
        1: [
          { name: 'Linear Algebra', progress: 90, chapters: 8 },
          { name: 'Calculus I', progress: 85, chapters: 10 },
        ],
        2: [
          { name: 'Calculus II', progress: 75, chapters: 10 },
          { name: 'Differential Equations', progress: 50, chapters: 12 },
          { name: 'Abstract Algebra', progress: 40, chapters: 9 },
        ],
      },
      'Statistics': {
        1: [
          { name: 'Probability Theory', progress: 85, chapters: 10 },
          { name: 'Statistical Inference', progress: 70, chapters: 11 },
        ],
        2: [
          { name: 'Regression Analysis', progress: 60, chapters: 8 },
          { name: 'Time Series Analysis', progress: 45, chapters: 9 },
        ],
      },
    };

    return subjectsByDept[department]?.[semester] || subjectsByDept['IT']?.[1] || [];
  };

  const resetSelection = () => {
    setSelectedYear(null);
    setSelectedDepartment(null);
    setSelectedSemester(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={resetSelection} className="hover:text-foreground">
              Courses
            </button>
            {selectedYear && (
              <>
                <span>/</span>
                <button
                  onClick={() => {
                    setSelectedDepartment(null);
                    setSelectedSemester(null);
                  }}
                  className="hover:text-foreground"
                >
                  Year {selectedYear}
                </button>
              </>
            )}
            {selectedDepartment && (
              <>
                <span>/</span>
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="hover:text-foreground"
                >
                  {selectedDepartment}
                </button>
              </>
            )}
            {selectedSemester && (
              <>
                <span>/</span>
                <span className="text-foreground">Semester {selectedSemester}</span>
              </>
            )}
          </div>
        </div>

        {/* Year Selection */}
        {!selectedYear && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl mb-2">Select Your Year</h1>
              <p className="text-xl text-muted-foreground">
                Choose your current academic year to get started
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((year) => (
                <Card
                  key={year}
                  className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
                  onClick={() => setSelectedYear(year)}
                >
                  <CardHeader className="text-center py-8">
                    <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-6" />
                    <CardTitle className="text-2xl">Year {year}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Department Selection */}
        {selectedYear && !selectedDepartment && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl mb-2">Select Your Department</h1>
              <p className="text-xl text-muted-foreground">
                Choose your department for Year {selectedYear}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDepartments(selectedYear).map((dept) => (
                <Card
                  key={dept}
                  className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <CardHeader className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-6" />
                    <CardTitle className="text-xl">{dept}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Semester Selection */}
        {selectedYear && selectedDepartment && !selectedSemester && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl mb-2">Select Semester</h1>
              <p className="text-xl text-muted-foreground">
                {selectedDepartment} - Year {selectedYear}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              {[1, 2].map((semester) => (
                <Card
                  key={semester}
                  className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
                  onClick={() => setSelectedSemester(semester)}
                >
                  <CardHeader className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-blue-600 mb-6" />
                    <CardTitle className="text-2xl">Semester {semester}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subjects List */}
        {selectedYear && selectedDepartment && selectedSemester && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl mb-2">Your Subjects</h1>
              <p className="text-xl text-muted-foreground">
                {selectedDepartment} - Year {selectedYear} - Semester {selectedSemester}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {getSubjects(selectedDepartment, selectedYear, selectedSemester).map((subject, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-shadow ${
                    subject.name === 'Programming Fundamentals' && onSubjectClick 
                      ? 'cursor-pointer' 
                      : ''
                  }`}
                  onClick={() => {
                    if (subject.name === 'Programming Fundamentals' && onSubjectClick) {
                      onSubjectClick(subject.name);
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          {subject.name}
                        </CardTitle>
                      </div>
                      <Badge variant={subject.progress > 70 ? 'default' : 'secondary'}>
                        {subject.progress}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Learning Progress</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onOpenQuestionnaire(subject.name)}
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Questionnaire
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenChat(subject.name)}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with AI
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenQuestionnaire(subject.name)}
                      className="flex-1"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Model Test
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
