'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/ui/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Send, FileText, User, Phone, Mail } from 'lucide-react';

interface Class {
  id: string;
  name: string;
}

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    student_name_bangla: '',
    student_name_english: '',
    birth_certificate_no: '',
    blood_group: '',
    class_applying: '',
    father_name: '',
    mother_name: '',
    guardian_phone: '',
    guardian_email: '',
    address: '',
    previous_school: '',
    reason_for_admission: '',
    additional_info: ''
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { language, t } = useLanguage();
  const router = useRouter();

  // Fetch classes on component mount
  useEffect(() => {
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
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      'student_name_bangla', 'student_name_english', 'birth_certificate_no', 
      'blood_group', 'class_applying', 'father_name', 'mother_name',
      'guardian_phone', 'address'
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
      // Create admission application record
      const applicationData = {
        form_type: 'Admission Application',
        form_data: formData,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };

      // For now, we'll store this in a simple way
      // In a real application, you'd have a proper form_submissions table
      const { error: insertError } = await supabase
        .from('notices')
        .insert([{
          title: `Admission Application - ${formData.student_name_english}`,
          content: `New admission application submitted for ${formData.student_name_english} (${formData.student_name_bangla}) for ${classes.find(c => c.id === formData.class_applying)?.name}. Contact: ${formData.guardian_phone}`,
          priority: 'normal',
          target_audience: 'teachers',
          published_by: '00000000-0000-0000-0000-000000000001', // System user
          is_marquee: false,
          published_at: new Date().toISOString()
        }]);

      if (insertError) {
        setError(`Failed to submit application: ${insertError.message}`);
        return;
      }

      setSuccess('Admission application submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        student_name_bangla: '',
        student_name_english: '',
        birth_certificate_no: '',
        blood_group: '',
        class_applying: '',
        father_name: '',
        mother_name: '',
        guardian_phone: '',
        guardian_email: '',
        address: '',
        previous_school: '',
        reason_for_admission: '',
        additional_info: ''
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 mr-3 text-blue-600" />
            {language === 'bn' ? 'ভর্তির আবেদন' : 'Admission Application'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমাদের স্কুলে ভর্তির জন্য নিচের ফর্মটি পূরণ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
              : 'Fill out the form below to apply for admission to our school. We will contact you soon.'
            }
          </p>
        </div>

        {/* Application Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              {language === 'bn' ? 'আবেদনের তথ্য' : 'Application Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
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

              {/* Student Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  {language === 'bn' ? 'শিক্ষার্থীর তথ্য' : 'Student Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="student_name_bangla">
                      {language === 'bn' ? 'নাম (বাংলায়) *' : 'Name (Bengali) *'}
                    </Label>
                    <Input
                      id="student_name_bangla"
                      type="text"
                      placeholder={language === 'bn' ? 'বাংলায় নাম লিখুন' : 'Enter name in Bengali'}
                      value={formData.student_name_bangla}
                      onChange={(e) => handleInputChange('student_name_bangla', e.target.value)}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_name_english">
                      {language === 'bn' ? 'নাম (ইংরেজিতে) *' : 'Name (English) *'}
                    </Label>
                    <Input
                      id="student_name_english"
                      type="text"
                      placeholder={language === 'bn' ? 'ইংরেজিতে নাম লিখুন' : 'Enter name in English'}
                      value={formData.student_name_english}
                      onChange={(e) => handleInputChange('student_name_english', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="birth_certificate_no">
                      {language === 'bn' ? 'জন্ম নিবন্ধন নম্বর *' : 'Birth Certificate No. *'}
                    </Label>
                    <Input
                      id="birth_certificate_no"
                      type="text"
                      placeholder={language === 'bn' ? 'জন্ম নিবন্ধন নম্বর লিখুন' : 'Enter birth certificate number'}
                      value={formData.birth_certificate_no}
                      onChange={(e) => handleInputChange('birth_certificate_no', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blood_group">
                      {language === 'bn' ? 'রক্তের গ্রুপ *' : 'Blood Group *'}
                    </Label>
                    <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Select blood group'} />
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

                <div>
                  <Label htmlFor="class_applying">
                    {language === 'bn' ? 'যে শ্রেণীতে ভর্তি হতে চান *' : 'Class Applying For *'}
                  </Label>
                  <Select value={formData.class_applying} onValueChange={(value) => handleInputChange('class_applying', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'bn' ? 'শ্রেণী নির্বাচন করুন' : 'Select class'} />
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
              </div>

              {/* Family Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  {language === 'bn' ? 'পারিবারিক তথ্য' : 'Family Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="father_name">
                      {language === 'bn' ? 'পিতার নাম *' : "Father's Name *"}
                    </Label>
                    <Input
                      id="father_name"
                      type="text"
                      placeholder={language === 'bn' ? 'পিতার নাম লিখুন' : "Enter father's name"}
                      value={formData.father_name}
                      onChange={(e) => handleInputChange('father_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">
                      {language === 'bn' ? 'মাতার নাম *' : "Mother's Name *"}
                    </Label>
                    <Input
                      id="mother_name"
                      type="text"
                      placeholder={language === 'bn' ? 'মাতার নাম লিখুন' : "Enter mother's name"}
                      value={formData.mother_name}
                      onChange={(e) => handleInputChange('mother_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="guardian_phone">
                      {language === 'bn' ? 'অভিভাবকের ফোন *' : 'Guardian Phone *'}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="guardian_phone"
                        type="tel"
                        placeholder={language === 'bn' ? 'ফোন নম্বর লিখুন' : 'Enter phone number'}
                        value={formData.guardian_phone}
                        onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="guardian_email">
                      {language === 'bn' ? 'অভিভাবকের ইমেইল' : 'Guardian Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="guardian_email"
                        type="email"
                        placeholder={language === 'bn' ? 'ইমেইল ঠিকানা লিখুন' : 'Enter email address'}
                        value={formData.guardian_email}
                        onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">
                    {language === 'bn' ? 'ঠিকানা *' : 'Address *'}
                  </Label>
                  <Textarea
                    id="address"
                    placeholder={language === 'bn' ? 'সম্পূর্ণ ঠিকানা লিখুন' : 'Enter complete address'}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  {language === 'bn' ? 'অতিরিক্ত তথ্য' : 'Additional Information'}
                </h3>
                
                <div>
                  <Label htmlFor="previous_school">
                    {language === 'bn' ? 'পূর্বের স্কুল' : 'Previous School'}
                  </Label>
                  <Input
                    id="previous_school"
                    type="text"
                    placeholder={language === 'bn' ? 'পূর্বের স্কুলের নাম লিখুন' : 'Enter previous school name'}
                    value={formData.previous_school}
                    onChange={(e) => handleInputChange('previous_school', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="reason_for_admission">
                    {language === 'bn' ? 'ভর্তির কারণ' : 'Reason for Admission'}
                  </Label>
                  <Textarea
                    id="reason_for_admission"
                    placeholder={language === 'bn' ? 'কেন এই স্কুলে ভর্তি হতে চান?' : 'Why do you want to admit to this school?'}
                    value={formData.reason_for_admission}
                    onChange={(e) => handleInputChange('reason_for_admission', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additional_info">
                    {language === 'bn' ? 'অন্যান্য তথ্য' : 'Additional Information'}
                  </Label>
                  <Textarea
                    id="additional_info"
                    placeholder={language === 'bn' ? 'অন্য কোন তথ্য থাকলে লিখুন' : 'Any other information you want to share'}
                    value={formData.additional_info}
                    onChange={(e) => handleInputChange('additional_info', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button type="submit" disabled={loading} size="lg" className="px-8">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'bn' ? 'জমা দিচ্ছি...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {language === 'bn' ? 'আবেদন জমা দিন' : 'Submit Application'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'bn' ? 'গুরুত্বপূর্ণ তথ্য' : 'Important Information'}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                {language === 'bn' 
                  ? '• আবেদন জমা দেওয়ার পর আমরা ৩-৫ কার্যদিবসের মধ্যে আপনার সাথে যোগাযোগ করব।'
                  : '• We will contact you within 3-5 working days after submitting your application.'
                }
              </p>
              <p>
                {language === 'bn'
                  ? '• সকল তথ্য সঠিক এবং সম্পূর্ণ হওয়া নিশ্চিত করুন।'
                  : '• Please ensure all information is accurate and complete.'
                }
              </p>
              <p>
                {language === 'bn'
                  ? '• প্রয়োজনীয় কাগজপত্র সাক্ষাৎকারের সময় নিয়ে আসুন।'
                  : '• Please bring required documents during the interview.'
                }
              </p>
              <p>
                {language === 'bn'
                  ? '• যোগাযোগ: +880-2-123456789 বা info@schoolname.edu.bd'
                  : '• Contact: +880-2-123456789 or info@schoolname.edu.bd'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}