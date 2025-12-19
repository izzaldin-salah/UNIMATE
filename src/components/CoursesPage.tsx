import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';

interface CoursesPageProps {
  onOpenQuestionnaire: (subject: string) => void;
  onSubjectClick?: (subjectName: string) => void;
}

export function CoursesPage({ onOpenQuestionnaire, onSubjectClick }: CoursesPageProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const getDepartments = (year: number) => {
    if (year <= 3) {
      return ['IT', 'General Departments'];
    }
    return ['IT', 'CS', 'Statistics', 'Math', 'CS & Statistics', 'CS & Math', 'Math & Statistics'];
  };

  const getSubjects = (department: string, year: number, semester: number) => {
    // Real subject data organized by department, year, and semester
    const subjectsByDept: Record<string, Record<number, Record<number, any[]>>> = {
      'IT': {
        1: {
          1: [
            { name: 'Principles of computing', progress: 75, chapters: 12 },
            { name: 'Descriptive statistics', progress: 60, chapters: 10 },
            { name: 'Information Technology Fundamentals', progress: 85, chapters: 15 },
            { name: 'Islamic culture', progress: 45, chapters: 8 },
            { name: 'Sudanese Studies', progress: 30, chapters: 6 },
            { name: 'Arabic', progress: 55, chapters: 8 },
          ],
          2: [
            { name: 'Matrix Algebra', progress: 40, chapters: 10 },
            { name: 'Fundamentals of programming', progress: 70, chapters: 14 },
            { name: 'Accounting principles', progress: 25, chapters: 12 },
            { name: 'Physics', progress: 50, chapters: 13 },
            { name: 'Computer architecture and equipments', progress: 65, chapters: 15 },
          ],
        },
        2: {
          1: [
            { name: 'Principles of programming', progress: 80, chapters: 12 },
            { name: 'Statistics and probability', progress: 55, chapters: 10 },
            { name: 'Data structures and algorithms', progress: 90, chapters: 15 },
            { name: 'Linear algebra', progress: 35, chapters: 9 },
            { name: 'Economic', progress: 20, chapters: 8 },
            { name: 'Discrete structure', progress: 45, chapters: 11 },
          ],
          2: [
            { name: 'Introduction of statistical inference', progress: 60, chapters: 10 },
            { name: 'Object Oriented Programming', progress: 85, chapters: 14 },
            { name: 'Software requirement engineering', progress: 40, chapters: 12 },
            { name: 'Communication skills', progress: 70, chapters: 6 },
            { name: 'File management', progress: 50, chapters: 8 },
          ],
        },
        3: {
          1: [
            { name: 'Advanced database', progress: 65, chapters: 12 },
            { name: 'Commercial programming', progress: 55, chapters: 10 },
            { name: 'Networks 2', progress: 75, chapters: 11 },
            { name: 'Software engineering', progress: 80, chapters: 13 },
            { name: 'Operating System', progress: 70, chapters: 14 },
          ],
          2: [
            { name: 'Compiler', progress: 30, chapters: 12 },
            { name: 'Assembly', progress: 45, chapters: 10 },
            { name: 'Commercial programming', progress: 60, chapters: 11 },
            { name: 'Computer architecture', progress: 50, chapters: 13 },
          ],
        },
      },
      'General Departments': {
        1: {
          1: [
            { name: 'Arabic', progress: 65, chapters: 8 },
            { name: 'Sudanese studies', progress: 50, chapters: 6 },
            { name: 'Islamic culture', progress: 70, chapters: 8 },
            { name: 'Calculus 1', progress: 80, chapters: 12 },
            { name: 'Algebra', progress: 55, chapters: 10 },
            { name: 'Basics of mathematics', progress: 75, chapters: 14 },
            { name: 'English', progress: 60, chapters: 8 },
          ],
          2: [
            { name: 'Object oriented programming', progress: 85, chapters: 14 },
            { name: 'Arithmetic', progress: 45, chapters: 10 },
            { name: 'Programming Fundamentals', progress: 90, chapters: 14 },
            { name: 'Calculus 2', progress: 70, chapters: 12 },
            { name: 'Statistics and Probability', progress: 55, chapters: 11 },
            { name: 'Analytic geometry', progress: 40, chapters: 9 },
          ],
        },
        2: {
          2: [
            { name: 'Real analysis 1', progress: 60, chapters: 12 },
            { name: 'File management', progress: 75, chapters: 8 },
            { name: 'Introduction to Inferential Statistics', progress: 50, chapters: 10 },
            { name: 'Differential equations 2', progress: 65, chapters: 11 },
            { name: 'Vectors analysis', progress: 55, chapters: 9 },
          ],
        },
        3: {
          1: [
            { name: 'Database', progress: 70, chapters: 12 },
            { name: 'Operating System', progress: 80, chapters: 13 },
            { name: 'Software engineering', progress: 65, chapters: 12 },
            { name: 'Computer networking', progress: 75, chapters: 11 },
          ],
          2: [
            { name: 'Compiler', progress: 35, chapters: 12 },
            { name: 'Assembly', progress: 50, chapters: 10 },
            { name: 'Commercial programming', progress: 60, chapters: 11 },
            { name: 'Computer architecture', progress: 45, chapters: 13 },
          ],
        },
      },
    };

    return subjectsByDept[department]?.[year]?.[semester] || [];
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
