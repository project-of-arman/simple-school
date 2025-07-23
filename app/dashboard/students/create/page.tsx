'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Save, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Class {
  id: string;
  name: string;
}

interface Section {
  id: string;
  section_name: string;
}

export default function CreateStudentPage() {
  const [formData, setFormData] = useState({
    name_bangla: '',
    name_english: '',
    birth_certificate_no: '',
    blood_group: '',
    class_id: '',
    section_id: '',
    admission_date: '',
    student_id: '',
    father_name: '',
    mother_name: '',
    address: '',
    phone: ''
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();

  // Fetch classes on component mount
  useState(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .order('numeric_value');
      
      if (!error && data) {
        setClasses(data);
      }
    };
    
    fetchClasses();
  });

  // Fetch sections when class is selected
  const handleClassChange = async (classId: string) => {
    setFormData(prev => ({ ...prev, class_id: classId, section_id: '' }));
    
    const { data, error } = await supabase
      .from('sections')
      .select('id, section_name')
      .eq('class_id', classId)
      .order('section_name');
    
    if (!error && data) {
      setSections(data);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STD${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create students');
      return;
    }

    // Validation
    const requiredFields = [
      'name_bangla', 'name_english', 'birth_certificate_no', 'blood_group',
      'class_id', 'section_id', 'admission_date', 'father_name', 'mother_name',
      'address', 'phone'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setError(`${field.replace('_', ' ')} is required`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Generate student ID if not provided
      const studentId = formData.student_id || generateStudentId();
      
      const studentData = {
        ...formData,
        student_id: studentId,
        admission_date: formData.admission_date
      };

      const { error: insertError } = await supabase
        .from('students')
        .insert([studentData]);

      if (insertError) {
        if (insertError.code === '23505') {
          if (insertError.message.includes('birth_certificate_no')) {
            setError('Birth certificate number already exists');
          } else if (insertError.message.includes('student_id')) {
            setError('Student ID already exists');
          } else {
            setError('A student with this information already exists');
          }
        } else {
          setError(`Failed to create student: ${insertError.message}`);
        }
        return;
      }

      setSuccess('Student created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/students');
      }, 2000);

    } catch (error) {
      console.error('Error creating student:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Please login to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/students">
                  {t('dashboard.students')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Student</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard/students">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-blue-600" />
            Create New Student
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new student to the school management system
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name_bangla">Name (Bengali) *</Label>
                    <Input
                      id="name_bangla"
                      type="text"
                      placeholder="বাংলায় নাম লিখুন"
                      value={formData.name_bangla}
                      onChange={(e) => handleInputChange('name_bangla', e.target.value)}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_english">Name (English) *</Label>
                    <Input
                      id="name_english"
                      type="text"
                      placeholder="Enter name in English"
                      value={formData.name_english}
                      onChange={(e) => handleInputChange('name_english', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="birth_certificate_no">Birth Certificate No. *</Label>
                    <Input
                      id="birth_certificate_no"
                      type="text"
                      placeholder="Enter birth certificate number"
                      value={formData.birth_certificate_no}
                      onChange={(e) => handleInputChange('birth_certificate_no', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blood_group">Blood Group *</Label>
                    <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="class_id">Class *</Label>
                    <Select value={formData.class_id} onValueChange={handleClassChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="section_id">Section *</Label>
                    <Select 
                      value={formData.section_id} 
                      onValueChange={(value) => handleInputChange('section_id', value)}
                      disabled={!formData.class_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.section_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="admission_date">Admission Date *</Label>
                    <Input
                      id="admission_date"
                      type="date"
                      value={formData.admission_date}
                      onChange={(e) => handleInputChange('admission_date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="student_id">Student ID (Optional)</Label>
                  <Input
                    id="student_id"
                    type="text"
                    placeholder="Leave empty to auto-generate"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If left empty, a unique student ID will be generated automatically
                  </p>
                </div>
              </div>

              {/* Family Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="father_name">Father's Name *</Label>
                    <Input
                      id="father_name"
                      type="text"
                      placeholder="Enter father's name"
                      value={formData.father_name}
                      onChange={(e) => handleInputChange('father_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">Mother's Name *</Label>
                    <Input
                      id="mother_name"
                      type="text"
                      placeholder="Enter mother's name"
                      value={formData.mother_name}
                      onChange={(e) => handleInputChange('mother_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter contact phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard/students">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}