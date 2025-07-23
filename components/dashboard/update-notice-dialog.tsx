'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Notice } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, Upload, Edit } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent',
  'align', 'link', 'image'
];

interface UpdateNoticeDialogProps {
  notice: Notice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoticeUpdated?: () => void;
}

export default function UpdateNoticeDialog({ 
  notice, 
  open, 
  onOpenChange, 
  onNoticeUpdated 
}: UpdateNoticeDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target_audience: 'all',
    is_marquee: false
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [existingAttachment, setExistingAttachment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const { language, t } = useLanguage();

  // Initialize form data when notice changes
  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
        target_audience: notice.target_audience,
        is_marquee: notice.is_marquee
      });
      setExistingAttachment((notice as any).attachment_url || null);
    }
  }, [notice]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setAttachedFile(null);
      setError('');
      setSuccess('');
    }
  }, [open]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setAttachedFile(file);
      setError('');
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `notices/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to update notices');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let attachmentUrl = existingAttachment;
      
      // Upload new file if attached
      if (attachedFile) {
        const newAttachmentUrl = await uploadFile(attachedFile);
        if (!newAttachmentUrl) {
          setError('Failed to upload attachment');
          setLoading(false);
          return;
        }
        attachmentUrl = newAttachmentUrl;
      }

      // Update notice in database
      const updateData: any = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        priority: formData.priority,
        target_audience: formData.target_audience,
        is_marquee: formData.is_marquee,
      };

      // Only update attachment_url if there's a new file or existing attachment
      if (attachmentUrl) {
        updateData.attachment_url = attachmentUrl;
      }

      const { error: updateError } = await supabase
        .from('notices')
        .update(updateData)
        .eq('id', notice.id)
        .eq('published_by', user.id); // Ensure user can only update their own notices

      if (updateError) {
        console.error('Database update error:', updateError);
        setError(`Failed to update notice: ${updateError.message}`);
        return;
      }

      setSuccess('Notice updated successfully!');
      
      // Call callback if provided
      if (onNoticeUpdated) {
        onNoticeUpdated();
      }

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Error updating notice:', error);
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const removeExistingAttachment = () => {
    setExistingAttachment(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Update Notice
          </DialogTitle>
          <DialogDescription>
            Edit the notice details and content
          </DialogDescription>
        </DialogHeader>

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

          {/* Title */}
          <div>
            <Label htmlFor="title">Notice Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter notice title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Notice Content *</Label>
            <div className="mt-1 border rounded-md">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your notice content here..."
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          {/* Priority and Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={formData.target_audience} onValueChange={(value) => handleInputChange('target_audience', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Existing Attachment */}
          {existingAttachment && (
            <div>
              <Label>Current Attachment</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Current attachment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(existingAttachment, '_blank')}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeExistingAttachment}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <Label htmlFor="attachment">
              {existingAttachment ? 'Replace Attachment (Optional)' : 'Attachment (Optional)'}
            </Label>
            <div className="mt-1">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
              </p>
              {attachedFile && (
                <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{attachedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAttachedFile(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Marquee Option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="marquee"
              checked={formData.is_marquee}
              onCheckedChange={(checked) => handleInputChange('is_marquee', checked)}
            />
            <Label htmlFor="marquee">Show as marquee (scrolling text)</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Notice
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}