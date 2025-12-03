import { supabase } from '../lib/supabase';

export async function saveAuditResult({ userId, answers, aiReadinessScore, exitReadinessScore, recommendedMissions }) {
  try {
    const { data, error } = await supabase
      .from('ai_audits')
      .insert([{
        user_id: userId,
        answers,
        ai_readiness_score: aiReadinessScore,
        exit_readiness_score: exitReadinessScore,
        recommended_missions: recommendedMissions
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving audit result:', error);
    return { data: null, error };
  }
}

export async function getLatestAuditForUser(userId) {
  try {
    const { data, error } = await supabase
      .from('ai_audits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching latest audit:', error);
    return { data: null, error };
  }
}

export async function getAllAuditsForUser(userId) {
  try {
    const { data, error } = await supabase
      .from('ai_audits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user audits:', error);
    return { data: null, error };
  }
}
