import { supabase } from '../lib/supabase';
import { Meeting, Activity, SpiritualContent, MeetingTemplate } from '../types';

export const supabaseService = {
  // Meetings
  async getMeetings() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return data as Meeting[];
  },

  async saveMeeting(meeting: Meeting) {
    const { data, error } = await supabase
      .from('meetings')
      .upsert(meeting)
      .select();
    if (error) throw error;
    return data[0] as Meeting;
  },

  async deleteMeeting(id: string) {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Activities
  async getActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*');
    if (error) throw error;
    return data as Activity[];
  },

  async saveActivity(activity: Activity) {
    const { data, error } = await supabase
      .from('activities')
      .upsert(activity)
      .select();
    if (error) throw error;
    return data[0] as Activity;
  },

  async deleteActivity(id: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Spiritual Content
  async getSpiritualContent() {
    const { data, error } = await supabase
      .from('spiritual_content')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data as SpiritualContent[];
  },

  async saveSpiritualContent(content: SpiritualContent) {
    const { data, error } = await supabase
      .from('spiritual_content')
      .upsert(content)
      .select();
    if (error) throw error;
    return data[0] as SpiritualContent;
  },

  async deleteSpiritualContent(id: string) {
    const { error } = await supabase
      .from('spiritual_content')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Templates
  async getTemplates() {
    const { data, error } = await supabase
      .from('meeting_templates')
      .select('*');
    if (error) throw error;
    return data as MeetingTemplate[];
  },

  async saveTemplate(template: MeetingTemplate) {
    const { data, error } = await supabase
      .from('meeting_templates')
      .upsert(template)
      .select();
    if (error) throw error;
    return data[0] as MeetingTemplate;
  },

  async deleteTemplate(id: string) {
    const { error } = await supabase
      .from('meeting_templates')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
